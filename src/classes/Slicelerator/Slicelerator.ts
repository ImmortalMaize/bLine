type TempoIO = readonly [[number, number][], [number, number][]];

interface Evaluation {
  beatsPerMinute: number,
  framesPerMinute: number,
  framesPerBeat: number,
  framesPerBar: number,
  barsPerFrame: number,
  framesPerTick: number
}

export default class {
  public static flay() {

  }

  private extrapolate = (
    input: Array<[number, number]>,
    output: Array<[number, number]>,
    ticks: number,
    bpm: number,
  ): TempoIO => {
    if (input.length !== output.length)
    throw new Error("Inequal lengths.");

    if (input.length === 0 && output.length === 0)
      return [[[0, ticks]], [[bpm, bpm]]];

    if (!input.every((i, n) => (input[n - 1] ? input[n - 1][1] < i[0] : true)))
      throw new Error("Not non-decreasing.");

    if (Math.max(...input.flat()) > ticks) throw new Error("Max too high.");

    const io: Map<[number, number], [number, number]> = new Map()

    for (let i = 0; input[i]; i++) {
      const former = input[i][1];
      const latter = input[i + 1]?.[0];

      if (former + 1 !== latter && latter - 1 !== former && former !== ticks) {
        io.set(
          [
            former + 1,
            isNaN(latter - 1) ? ticks : latter - 1
          ], [
            output[i][1],
            output[i][1]
          ]
        );
      }
    }

    if (input[0][0] !== 0) {
      io.set([0, input[0][0] - 1], [bpm, bpm])
    }

    const newIo: TempoIO = [[], []]
    Array.from(io.entries()).sort((a, b) => b[0][0] - a[0][0]).forEach(
      pair => {
        newIo[0].push(pair[0])
        newIo[1].push(pair[1])
      }
    )

    return Object.freeze(newIo) as TempoIO;
  };

  private slice = (
    input: [number, number],
    output: [number, number]
  ): Array<number> => {
    const inputRange = input[1] + 1 - input[0];
    const sliceleration = [];
    if (output[0] === output[1]) {
      return [...Array(inputRange)].fill(output[0]);
    }

    const outputRange = output[1] - output[0];
    const quotient = outputRange / inputRange;

    for (
      let o: number = output[0] + quotient;
      output[0] < output[1]
        ? o < output[1] + quotient
        : o > output[1] + quotient;
      o += quotient
    ) {
      sliceleration.push(o);
    }
    return sliceleration.slice(0, inputRange);
  };

  public readonly slices: Array<number>;
  public readonly sliceleration: [Array<number>, Array<number>]

  constructor(
    public readonly input: [number, number][],
    public readonly output: [number, number][],
    public readonly bpm: number,
    public readonly ticks: number,
    public readonly framesPerSecond: number,
    public readonly beatsPerBar: number,
    public readonly ticksPerBeats: number,
    public readonly tickWidth: number
  ) {
    const extrapolation = this.extrapolate(input, output, ticks, bpm);
    const slices = [];

    for (let i = 0; extrapolation[0][i]; i++)
      slices.push(this.slice(extrapolation[0][i], extrapolation[1][i]));

    this.slices = slices.flat();

    this.sliceleration = [
      this.slices.map((slice, index) => this.slicelerate(index, "framesPerTick")),
      this.slices.map((slice, index) => index * tickWidth)
    ]

  }

  public evaluate(tick: number): Evaluation {
    const bpm = this.slices[tick];
    const framesPerMinute = this.framesPerSecond * 60;
    const framesPerBeat = framesPerMinute / bpm;
    const framesPerBar = framesPerBeat * this.beatsPerBar;
    const barsPerFrame = 1 / framesPerBar;
    const framesPerTick = framesPerBeat / this.ticksPerBeats;
    return {
      beatsPerMinute: bpm,
      framesPerMinute,
      framesPerBeat,
      framesPerBar,
      barsPerFrame,
      framesPerTick
    };
  }

  public slicelerate(tick: number, prop: keyof Evaluation) {
    const slice = this.slices.slice(0, tick + 1).map((bpm, index) => this.evaluate(index)[prop])
    return slice.reduce((previous, current) => previous + current)
  }
}

// const input = [10, 100];
// const output = [100, 150];

const testInput = [[0, 33]];
const testOutput = [[100, 250]];
const testTicks = 33;
const testBpm = 100;
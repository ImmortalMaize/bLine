module Song {
  export interface Data {
    introBars: number,
	  loopBars: number,
	  beatsPerBar: number,
	  ticksPerBeat: number,
	  beatsPerMinute: number,
    channels: Array<Channel>
  }
  interface Channel {
    type: string,
    sequence: Array<number>,
    patterns: Array<Pattern>,
  }
  export interface Pattern {
    notes: Array<Note>
  }
  export interface PitchChannel extends Channel {
    type: "pitch"
  }
  export interface DrumChannel extends Channel {
    type: "drum"
  }
  export interface Note {
    pitches: Array<number>,
    points: Point[]
  }
  export interface Point {
    tick: number,
    pitchBend: number,
    volume: number
  }
}

export default Song
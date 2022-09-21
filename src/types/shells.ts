import { Scale } from "chroma-js";

export namespace Shells {
  export interface Settings {
    beep: any,
    width: number,
    height: number,
    duration: number,
    frame: number,
    gradient: Array<string>,
    mode: string,
    colors: Scale
  }
  export interface Pitch {
    pitchChannels: Array<any>,
    pitches: Array<number>,
    octaves: number,
    octaveHeight: number,
    keyHeight: number,
    min: number
  }

  export interface Distance {
    bars: number
    barsOnFrame: number,
    barWidth: number,
    beatWidth: number
    tickWidth: number,
    weight: number
  }

  export interface Time {
    beatsPerBar: number,
    beatsPerMinute: number,
    framesPerMinute: number,
    framesPerBar: number,
    framesPerTick: number,
  }
}
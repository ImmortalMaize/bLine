import { Scale } from "chroma-js";
import Song from "./Song";

module Shells {
  export interface Settings {
    beep: Song.Data,
    width: number,
    duration: number,
    frame: number,
    gradient: Array<string>,
    mode: string,
    colors: Scale
  }
  export interface Pitch {
    pitchChannels: Array<Song.PitchChannel>,
    pitchVizHeight: number,
    pitches: Array<number>,
    octaves: number,
    octaveHeight: number,
    keyHeight: number,
    min: number,
    matrixPitches: [number, number][],
    layeredChannels: Array<Song.PitchChannel>
  }
  export interface Drums {
    drumVizHeight: number,
    drumChannels: Array<Song.DrumChannel>,
    layeredChannels: Array<Song.DrumChannel>
  }
  export interface Distance {
    bars: number
    barsOnFrame: number,
    barWidth: number,
    beatWidth: number
    tickWidth: number,
    ticksPerBar: number,
    weight: number
  }

  export interface Time {
    beatsPerBar: number,
    beatsPerMinute: number,
    framesPerMinute: number,
    framesPerBar: number,
    framesPerBeat: number,
    barsPerFrame: number,
    framesPerTick: number,
  }
}

export default Shells
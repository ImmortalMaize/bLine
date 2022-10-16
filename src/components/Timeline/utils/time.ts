import Shells from "../../../types/Shells"

export default (fps: number, beatsPerMinute: number, beatsPerBar: number, ticksPerBeat: number): Shells.Time => {
  

  const framesPerMinute = fps * 60
  const framesPerBeat = framesPerMinute / beatsPerMinute
  const framesPerBar = framesPerBeat * beatsPerBar
  const barsPerFrame = 1/framesPerBar
  const framesPerTick = framesPerBeat / ticksPerBeat

  return {
    beatsPerBar,
    beatsPerMinute,
    framesPerMinute,
    framesPerBeat,
    framesPerBar,
    barsPerFrame,
    framesPerTick
  }
}
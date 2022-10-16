import Shells from "../../../types/Shells"

export default (width: number, beep: any, barsOnFrame: number): Shells.Distance => {
  const bars: number = beep.channels[0].sequence.length
  const barWidth: number = width / barsOnFrame
  const beatWidth: number = barWidth / beep.beatsPerBar
  const tickWidth: number = beatWidth / beep.ticksPerBeat
  const weight = barWidth * 2
  const ticksPerBar = beep.beatsPerBar * beep.ticksPerBeat
  return {
    bars,
    barsOnFrame,
    barWidth,
    beatWidth,
    tickWidth,
    ticksPerBar,
    weight
  }
}
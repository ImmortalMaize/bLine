import PitchPattern from "../PitchPattern"
import { Color, distance } from "chroma-js"
import { useCurrentFrame } from 'remotion';
import Shells from "../../types/Shells";
import Slicelerator from "../../classes/Slicelerator/Slicelerator";
import Song from "../../types/Song";

export default (props: {
  settings: Shells.Settings,
  distanceShell: Shells.Distance,
  pitchShell: Shells.Pitch,
  timeShell: Shells.Time,
  slicelerator: Slicelerator,
  channel: Song.Channel,
  stroke: Color,
  id: string,
}) => {
  const frame = useCurrentFrame()

  const { channel, settings, stroke, id, timeShell, distanceShell, pitchShell, slicelerator } = props
  const { sequence, patterns } = channel

  const { framesPerBar} = timeShell
  const { barWidth, weight, ticksPerBar } = distanceShell

  return <g id={id}>
  {sequence.map((pattern, index) => {
    const num = pattern-1
    if (num < 0) { return }
    else {      
      const time = index * ticksPerBar
      const aheadTime = slicelerator.slicelerate(index * ticksPerBar, "framesPerTick") + (slicelerator.evaluate(index * ticksPerBar)["framesPerBar"] * 3)
      const behindTime = slicelerator.slicelerate(index * ticksPerBar, "framesPerTick") - (slicelerator.evaluate(index * ticksPerBar)["framesPerBar"] * 2)
      if (frame >= behindTime && frame <= aheadTime) return <PitchPattern
        stroke={stroke}
        slicelerator={slicelerator}
        settings={settings} distanceShell={distanceShell} timeShell={timeShell} pitchShell={pitchShell}
        distance={(index * barWidth) + weight} time={time} pattern={patterns[num]} name={"bar-" + index}
      />}
  })}
  </g>
}
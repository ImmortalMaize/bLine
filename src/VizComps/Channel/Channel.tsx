import Pattern from "../Pattern"
import { Color, distance } from "chroma-js"
import { useCurrentFrame } from 'remotion';
import { Shells } from "../../types/shells";

export default (props: {
  settings: Shells.Settings,
  distanceShell: Shells.Distance,
  pitchShell: Shells.Pitch,
  timeShell: Shells.Time,
  channel: {
    sequence: Array<number>,
    patterns: Array<any>
  },
  stroke: Color,
  id: string,
}) => {
  const frame = useCurrentFrame()
  const { channel, settings, stroke, id, timeShell, distanceShell, pitchShell } = props
  const { sequence, patterns } = channel

  const { framesPerBar} = timeShell
  const { barWidth, weight } = distanceShell

  return <g id={id}>
  {sequence.map((pattern, index) => {
    const num = pattern-1
    if (num < 0) { return }
    else {
      const time = index * framesPerBar
      const aheadTime = (index+3) * framesPerBar
      const behindTime = (index-2) * framesPerBar
      if (frame >= behindTime && frame <= aheadTime) return <Pattern
        stroke={stroke}
        settings={settings} distanceShell={distanceShell} timeShell={timeShell} pitchShell={pitchShell}
        distance={(index * barWidth) + weight} time={time} pattern={patterns[num]} name={"bar-" + index}
      />}
  })}
  </g>
}
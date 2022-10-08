import { useMemo } from "react"
import { Color } from "chroma-js"
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { Shells } from "../../types/shells";
import '../../fonts/Fonts.css'

export default (props: {
  distance: number,
  time: number,
  pattern: any,
  settings: Shells.Settings,
  distanceShell: Shells.Distance,
  timeShell: Shells.Time,
  stroke: Color,
  height: number,
  name: string
}) => {
  const { settings, distanceShell, timeShell } = props
  const { tickWidth } = distanceShell
  const { framesPerBar } = timeShell

  const { pattern, distance, stroke, name, time, height } = props

  const notes: Array<number> = useMemo(() => pattern.notes.map((note: any) => note.points[0].tick), [])
  const frame = useCurrentFrame()

  const interpolateR = interpolate(frame, [time - framesPerBar*2, time - framesPerBar, time, time + framesPerBar*2], [0, 3, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return <g name={name}>
    {
      notes.map(note => <circle cy={height} fill={stroke} cx={distance + (note * tickWidth)} r={interpolateR}></circle>)
    }
  </g>
}
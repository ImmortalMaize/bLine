import { useMemo } from "react"
import { Color } from "chroma-js"
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import Shells from "../../types/Shells";
import '../../fonts/Fonts.css'
import Slicelerator from "../../classes/Slicelerator/Slicelerator";
import Song from "../../types/Song";

export default (props: {
  distance: number,
  time: number,
  slicelerator: Slicelerator,
  pattern: Song.Pattern,
  settings: Shells.Settings,
  distanceShell: Shells.Distance,
  timeShell: Shells.Time,
  stroke: Color,
  height: number,
  name: string
}) => {
  const { settings, distanceShell, timeShell } = props
  const { tickWidth } = distanceShell

  const { pattern, distance, stroke, name, time, height, slicelerator } = props

  const notes: Array<number> = useMemo(() => pattern.notes.map((note: any) => note.points[0].tick), [])
  const frame = useCurrentFrame()
  const convertedTime = slicelerator.slicelerate(time, "framesPerTick")
  const fpb1 = convertedTime - slicelerator.evaluate(time)["framesPerTick"] * distanceShell.ticksPerBar * 2
  const fpb2 = convertedTime - slicelerator.evaluate(time)["framesPerTick"]  * distanceShell.ticksPerBar
  const fpb3 = convertedTime + slicelerator.evaluate(time)["framesPerTick"] * distanceShell.ticksPerBar * 2

  const interpolateR = interpolate(frame, [fpb1, fpb2, convertedTime, fpb3], [0, 3, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return <g name={name}>
    {
      notes.map(note => <circle cy={height} fill={stroke.hex()} cx={distance + (note * tickWidth)} r={interpolateR}></circle>)
    }
  </g>
}
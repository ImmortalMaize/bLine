import { useMemo } from "react"
import Note from "../Note"
import { Color } from "chroma-js"
import { interpolate, useCurrentFrame } from 'remotion';
import { Shells } from "../../types/shells";

export default (props: {
  distance: number,
  time: number
  pattern: any,
  settings: Shells.Settings,
  pitchShell: Shells.Pitch,
  distanceShell: Shells.Distance,
  timeShell: Shells.Time,
  stroke: Color,
  name: string
}) => {
  const { settings, pitchShell, distanceShell } = props
  const { height } = settings
  const { min, keyHeight } = pitchShell
  const { tickWidth } = distanceShell

  const { pattern, distance, stroke, name, time } = props

  const notes: Array<[number, Array<number>, any]> = useMemo(() => pattern.notes.map((note: any) => [note.points[0].tick, note.pitches, note.points]), [])
  const frame = useCurrentFrame()

  return <g name={name} opacity={1}>
    {notes.map((note, index) => <><text x={distance+10} y={"20"} fill={"white"}>{Math.round(time)}</text>
    <Note index={index} keyHeight={keyHeight} stroke={stroke} distance={distance + (note[0] * tickWidth)} pitch={note[1].map((pitch: any) => height - ((pitch - min) * keyHeight))
    } points={note[2]} tickWidth={tickWidth} time={time} /></>)}
  </g>
}
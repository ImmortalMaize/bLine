import { useMemo } from "react"
import Note from "../Note"
import { Color } from "chroma-js"
import { interpolate, useCurrentFrame } from 'remotion';
import { Shells } from "../../types/shells";
import '../../fonts/Fonts.css'

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
  const { settings, pitchShell, distanceShell, timeShell } = props
  const { height } = settings
  const { min, keyHeight } = pitchShell
  const { tickWidth } = distanceShell
  const { framesPerTick } = timeShell

  const { pattern, distance, stroke, name, time } = props

  const notes: Array<[number, Array<number>, any]> = useMemo(() => pattern.notes.map((note: any) => [note.points[0].tick, note.pitches, note.points]), [])
  const frame = useCurrentFrame()

  return <g name={name}>
    <text x={distance+10} y={"20"} fill={"white"} opacity={0.1} style={{
      fontFamily: "DM Sans Medium"
    }}>{Math.round(time)}</text>
    {notes.map((note, index) =>
      <Note stroke={stroke} index={index}
        settings={settings} pitchShell={pitchShell} distanceShell={distanceShell} timeShell={timeShell}
        distance={distance + (note[0] * tickWidth)} pitch={note[1].map((pitch: any) => height - ((pitch - min) * keyHeight))} points={note[2]} time={time + (note[0] * framesPerTick)} />
    )}
  </g>
}
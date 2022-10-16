import { useMemo } from "react"
import Note from "../Note"
import { Color } from "chroma-js"
import { interpolate, useCurrentFrame } from 'remotion';
import Shells from "../../types/Shells";
import '../../fonts/Fonts.css'
import Slicelerator from "../../classes/Slicelerator/Slicelerator";

export default (props: {
  distance: number,
  time: number,
  pattern: any,
  settings: Shells.Settings,
  pitchShell: Shells.Pitch,
  distanceShell: Shells.Distance,
  timeShell: Shells.Time,
  slicelerator: Slicelerator,
  stroke: Color,
  name: string
}) => {
  const { settings, pitchShell, distanceShell, timeShell } = props
  const { min, keyHeight, pitchVizHeight } = pitchShell
  const { tickWidth } = distanceShell
  const { framesPerTick } = timeShell

  const { pattern, distance, stroke, name, time, slicelerator } = props

  const notes: Array<[number, Array<number>, any]> = useMemo(() => pattern.notes.map((note: any) => [note.points[0].tick, note.pitches, note.points]), [])

  return <g name={name}>
    <text x={distance+10} y={"20"} fill={"white"} opacity={0.1} style={{
      fontFamily: "DM Sans Medium"
    }}>{Math.round(time)}</text>
    {notes.map((note, index) =>
      <Note stroke={stroke} index={index}
        settings={settings} pitchShell={pitchShell} distanceShell={distanceShell} timeShell={timeShell} slicelerator={slicelerator}
        distance={distance + (note[0] * tickWidth)} pitch={note[1].map((pitch: any) => pitchVizHeight - ((pitch - min) * keyHeight))} points={note[2]} time={time + (note[0])} />
    )}
  </g>
}
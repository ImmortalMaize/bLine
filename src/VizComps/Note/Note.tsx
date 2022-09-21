import { Color } from "chroma-js"
import { interpolate } from 'remotion';
import { useCurrentFrame } from 'remotion';

export default (props: {
  distance: number,
  time: number,
  pitch: Array<number>,
  tickWidth: number,
  keyHeight: number,
  points: any,
  stroke: Color,
  index: number,
}) => {
  const { distance, pitch, points, tickWidth, keyHeight, stroke, index } = props
  const flood = stroke.hex()
  const frame = useCurrentFrame()
  const color = stroke.brighten(1).hex()

  return <>
  {
  //maps chords
  pitch.map((p: number, ind: number) => {

    //if there's no pitch bends, use a line
    if (points.length <= 2) {
      const endpoint = distance + (points[1].tick - points[0].tick) * tickWidth
      return <g name={"note-" + index + "-pitch-" + ind}>
        <line x1={distance} y1={p} x2={endpoint} y2={p} stroke={color} strokeWidth={keyHeight} style={{strokeLinecap: "round"}} />
      <circle cx={distance} cy={p} r={keyHeight/4} fill="white" />
      </g>
    }

    //if pitch bends, go CRAZEHH!!
    else {
      let path = `M ${distance} ${p} `
      for (let i = 1; points[i]; i++) {
        if (points[i].pitchBend === points[i - 1].pitchBend) path += `L ${distance + ((points[i].tick - points[0].tick) * tickWidth)} ${p - (points[i].pitchBend * keyHeight)}`
        else {
          if (i === 1) {
            path += `C ${Math.min(distance + ((points[i].tick - points[0].tick) * tickWidth), distance + ((points[i - 1].tick - points[0].tick) * tickWidth))} ${p - (points[i - 1].pitchBend * keyHeight)}, ${Math.min(distance + ((points[i].tick - points[0].tick) * tickWidth), distance + ((points[i - 1].tick - points[0].tick) * tickWidth))} ${p - (points[i].pitchBend * keyHeight)}, ${distance + ((points[i].tick - points[0].tick) * tickWidth)} ${p - (points[i].pitchBend * keyHeight)} `
          }
          else if (i === points.length-1) {
            path += `C ${Math.max(distance + ((points[i].tick - points[0].tick) * tickWidth), distance + ((points[i - 1].tick - points[0].tick) * tickWidth))} ${p - (points[i - 1].pitchBend * keyHeight)}, ${Math.max(distance + ((points[i].tick - points[0].tick) * tickWidth), distance + ((points[i - 1].tick - points[0].tick) * tickWidth))} ${p - (points[i].pitchBend * keyHeight)}, ${distance + ((points[i].tick - points[0].tick) * tickWidth)} ${p - (points[i].pitchBend * keyHeight)} `
          }
          else {
            const midpoint = ((distance + (points[i].tick - points[0].tick) * tickWidth) + (distance + (points[i - 1].tick - points[0].tick) * tickWidth)) / 2
            path += `C ${midpoint} ${p - (points[i - 1].pitchBend * keyHeight)}, ${midpoint} ${p - (points[i].pitchBend * keyHeight)}, ${distance + ((points[i].tick - points[0].tick) * tickWidth)} ${p - (points[i].pitchBend * keyHeight)} `
          }
        }
      }

      return <g name={"note-" + index + "-pitch-" + ind}>
        <path d={path} stroke={color} strokeWidth={keyHeight} style={{strokeLinecap: "round", strokeLinejoin: "round", overflow: "visible", fill: "none"}} />
        <circle cx={distance} cy={p} r={keyHeight/4} fill="white" />
      </g>
    }
  })
  }</>
}
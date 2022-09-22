import { useMemo } from "react"
import { Shells } from './types/shells';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

export const Longitude = (props: {
  height: number,
  width: number,
  distances: number,
  timeShell: Shells.Time,
  keyHeight: number,
  ranges: Array<[number, number]>,
  min: number
}) => {
  const {height, width, distances, ranges, keyHeight, min, timeShell} = props
  const { framesPerBar } = timeShell

  const padding: number = 1*keyHeight
  const fixedRanges = [[0, 0], [0, 0], ...ranges]
  const frame = useCurrentFrame()
  return <g id="longitude">
  {Array.from(Array(distances), (line, index) => {
    const x = width * index
    const time = index * framesPerBar
      const aheadTime = (index+5) * framesPerBar
      const behindTime = (index-5) * framesPerBar
      if (frame >= behindTime && frame <= aheadTime)
    return <line key={index} x1={x} x2={x} y1={height - (fixedRanges[index][0] - min) * keyHeight} y2={height - (fixedRanges[index][1] - min) * keyHeight} style={{
      strokeWidth: "2px",
      strokeLinecap: "round",
      stroke: "white",
      strokeOpacity: interpolate(frame, [time-framesPerBar, time], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      }),
      strokeDasharray: "100% 200%",
      strokeDashoffset: interpolate(frame, [time - framesPerBar*3, time - framesPerBar], [100, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(1,0,0,1)
      }) + "%"
    }}>

    </line>
  })}
  </g>
}
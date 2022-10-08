import { Shells } from "../../types/shells"
import DrumPattern from "../DrumPattern"
import { useCurrentFrame } from 'remotion';
import "./Drumline.css"
import { useMemo } from 'react';
import { interpolate, interpolateColors } from 'remotion';
import chroma from "chroma-js"

export default (props: {
  width: number,
  height: number,
  drums: number,
  settings: Shells.Settings
  timeShell: Shells.Time
  distanceShell: Shells.Distance
  drum: any,
  index: number
  stroke: string
}) => {
  const frame = useCurrentFrame()

  const { timeShell, distanceShell, settings } = props
  const { duration } = settings
  const { framesPerBar, framesPerTick } = timeShell
  const { barWidth, weight, ticksPerBar, bars } = distanceShell

  const { width, height, drum, drums, index, stroke } = props
  const paddingTop: number = height * .1
  const paddingBottom: number = height * .9
  const range = paddingBottom - paddingTop
  const drumHeight = (range / drums) * (index + 1)

  const { sequence, patterns } = drum
  const scale = useMemo(() => chroma.scale(["#ffffff", stroke]), [])

  const ticks = useMemo(() => sequence
    .map(pattern => patterns[pattern - 1] ?? undefined)
    .map((pattern, index) => pattern?.notes.flatMap(
      note => note?.points.flatMap(
        point => (point.tick + (ticksPerBar * index)) * framesPerTick)
    )
    ).map((pattern, index) => {
      if (pattern === undefined) { return (ticksPerBar * index * framesPerTick) }
      else { return pattern }
    }).flat(), [])
  const volumes = useMemo(() => sequence
    .map(pattern => patterns[pattern - 1] ?? null)
    .map((pattern) => pattern?.notes.flatMap(
      note => note?.points.flatMap(
        point => point.volume / 100
      )
    )
    ).map((pattern) => {
      if (!pattern) { return 0 }
      else { return pattern }
    }).flat()
    , [])
    const colors = useMemo(() => sequence
    .map(pattern => patterns[pattern - 1] ?? null)
    .map((pattern) => pattern?.notes.flatMap(
      note => note?.points.flatMap(
        point => scale(point.volume / 100).hex()
      )
    )
    ).map((pattern) => {
      if (!pattern) { return "#ffffff" }
      else { return pattern }
    }).flat()
    , [])

  return <>
    <line className="drumline" x1={0} x2={width} y1={drumHeight} y2={drumHeight} style={{
      stroke
    }}></line>
    <g>
      {sequence.map((pattern, index) => {
        const num = pattern - 1
        if (num < 0) { return }
        else {
          const time = index * framesPerBar
          const aheadTime = (index + 3) * framesPerBar
          const behindTime = (index - 2) * framesPerBar
          if (frame >= behindTime && frame <= aheadTime) return <DrumPattern
            stroke={stroke}
            settings={settings} distanceShell={distanceShell} timeShell={timeShell} height={drumHeight}
            distance={(index * barWidth) + weight} time={time} pattern={patterns[num]} name={"bar-" + index}
          />
        }
      })}
    </g>
    <circle strokeWidth={interpolate(frame, [...ticks], [...volumes.map(volume => 3 - ((3 * volume)))], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    })}
    stroke={stroke}
    opacity={interpolate(frame, [...ticks], [...volumes.map(volume => 1 - ((0.5 * volume)))], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    })}
    fill={interpolateColors(frame, [...ticks], [...colors] )} cx={interpolate(frame, [0, duration], [weight, (bars * barWidth) + weight], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    })}
    cy={drumHeight}
    r={interpolate(frame, [...ticks], [...volumes.map(volume => (10 * volume) + 5)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    })} ></circle>
  </>
}
import { Color } from "chroma-js"
import { Easing, interpolate } from 'remotion';
import { useCurrentFrame } from 'remotion';
import { Shells } from "../../types/shells";
import { Distance, Time } from "../../types/units";
import easePath from './easePath';

export default (props: {
  distance: Distance,
  time: Time,
  pitch: Array<number>,
  distanceShell: Shells.Distance
  pitchShell: Shells.Pitch,
  timeShell: Shells.Time,
  settings: Shells.Settings,
  points: any,
  stroke: Color,
  index: number,
}) => {
  const { pitchShell, distanceShell, timeShell, settings } = props
  const { framesPerTick, framesPerBar } = timeShell
  const { tickWidth } = distanceShell
  const { keyHeight } = pitchShell
  const { beep } = settings

  const { ticksPerBeat, beatsPerBar } = beep
  const ticksPerBar = ticksPerBeat * beatsPerBar

  const { distance, pitch, points, stroke, index, time } = props
  const flood = stroke.hex()
  const frame = useCurrentFrame()
  const color =
    stroke
      .brighten(interpolate(frame, [
        time - 5, ...points.map((point: any) => time + (point.tick - points[0].tick) * framesPerTick), time + ((points[points.length - 1].tick - points[0].tick) * framesPerTick) + 10
      ], [
        0, ...points.map((point: any) => (point.volume / 100) * 3), 0
      ],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        }))
        .desaturate(interpolate(
          frame, [
              time + framesPerBar,
              time + framesPerBar*2
          ],
          [0, 3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
          }
        ))
        .hex()

    const interpolateOpacity = interpolate(frame, [time - framesPerBar*2, time, time + framesPerBar, time + framesPerBar * 2.5], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(.48,.69,.5,1)
    })
    const interpolateOffset = interpolate(frame, [time - framesPerBar*1.5, time], [100, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(.5,0,.5,1)
    })
    const interpolateR = interpolate(frame, [time - framesPerBar*2, time - framesPerBar], [0, keyHeight / 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(1,0,0,1)
    })

  return <>
    {
      //maps chords
      pitch.map((p: number, ind: number) => {

        //if pitch doesn't bend, be boring
        if (points.length <= 2 && points[1].pitchBend === points[0].pitchBend) {
          const endpoint: Distance = distance + (points[1].tick - points[0].tick) * tickWidth
          const deadline: Time = time + (points[1].tick - points[0].tick) * framesPerTick

          const easing = points[1].tick - points[0].tick >= ticksPerBar / 4 ? Easing.linear : Easing.bezier(1, 0, 0, 1)
          return <g name={"note-" + index + "-pitch-" + ind} opacity={interpolateOpacity}>
            <line x1={distance} y1={p} x2={endpoint} y2={p} stroke={color} strokeWidth={keyHeight} style={{ strokeLinecap: "round", strokeDasharray: "100% 200%", strokeDashoffset: interpolateOffset + "%"}} />
            <circle cx={
              interpolate(frame, [time, deadline], [distance, endpoint], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing
              })
            } cy={p} r={interpolateR} fill="white" stroke={color} strokeWidth={keyHeight / 4} />
          </g>
        }

        //if pitch bends, go CRAZEHH!!
        else {
          let path = `M ${distance} ${p}`
          for (let i = 1; points[i]; i++) {
            const previousPitch = points[i - 1].pitchBend
            const previousTick = points[i - 1].tick

            const currentPitch = points[i].pitchBend
            const currentTick = points[i].tick

            if (currentPitch === previousPitch) path += `L ${distance + ((currentTick - points[0].tick) * tickWidth)} ${p - (currentPitch * keyHeight)}`
            else {
              if (i === 1) {
                if (currentPitch < previousPitch) {
                  path += `C
            ${Math.max(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (previousPitch * keyHeight)},
            ${Math.max(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (currentPitch * keyHeight)},
            ${distance + ((currentTick - points[0].tick) * tickWidth)} ${p - (currentPitch * keyHeight)} `
                } else {
                  path += `C
            ${Math.min(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (previousPitch * keyHeight)},
            ${Math.min(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (currentPitch * keyHeight)},
            ${distance + ((currentTick - points[0].tick) * tickWidth)} ${p - (currentPitch * keyHeight)} `
                }
              }
              else if (i === points.length - 1) {
                if (currentPitch < previousPitch) {
                  path += `C
            ${Math.max(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (previousPitch * keyHeight)},
            ${Math.max(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (currentPitch * keyHeight)},
            ${distance + ((currentTick - points[0].tick) * tickWidth)} ${p - (currentPitch * keyHeight)} `
                } else {
                  path += `C
            ${Math.min(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (previousPitch * keyHeight)},
            ${Math.min(distance + ((currentTick - points[0].tick) * tickWidth), distance + ((previousTick - points[0].tick) * tickWidth))} ${p - (currentPitch * keyHeight)},
            ${distance + ((currentTick - points[0].tick) * tickWidth)} ${p - (currentPitch * keyHeight)} `
                }
              }
              else {
                const midpoint = ((distance + (currentTick - points[0].tick) * tickWidth) + (distance + (previousTick - points[0].tick) * tickWidth)) / 2
                path += `C ${midpoint} ${p - (previousPitch * keyHeight)},
            ${midpoint} ${p - (currentPitch * keyHeight)},
            ${distance + ((currentTick - points[0].tick) * tickWidth)} ${p - (currentPitch * keyHeight)} `
              }
            }
          }

          const timeTicks: Array<number> = points.map((point: any, index: number) => time + (point.tick - points[0].tick) * framesPerTick)
          const distanceTicks: Array<number> = points.map((point: any, index: number) => distance + (point.tick - points[0].tick) * tickWidth)
          const pitchBends: Array<number> = points.map((point: any, index: number) => p - (point.pitchBend * keyHeight))

          return <g name={"note-" + index + "-pitch-" + ind} opacity={interpolateOpacity}>
            <path d={path} stroke={color} strokeWidth={keyHeight} style={{ strokeLinecap: "round", strokeLinejoin: "round", overflow: "visible", fill: "none", strokeDasharray: "100% 200%", strokeDashoffset: interpolateOffset + "%" }} />
            <circle cx={interpolate(frame, timeTicks, distanceTicks, {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            })} cy={interpolate(frame, timeTicks, pitchBends, {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easePath(frame, timeTicks, pitchBends)
            })} r={interpolateR} fill="white" stroke={color} strokeWidth={keyHeight / 4} />
          </g>
        }
      })
    }</>
}
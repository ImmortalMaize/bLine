import { interpolate, useVideoConfig, Easing, delayRender, continueRender } from "remotion"
import Longitude from "../Longitude"
import Latitude from "../Latitude"
import Channel from "../Channel"
import { useCallback, useEffect, useMemo, useState } from "react"
import Shells from "../../types/Shells"
import chroma from "chroma-js"
import "./Timeline.css"
import Drumline from "../Drumline"
import utils from "./utils"
import Slicelerator from "../../classes/Slicelerator/Slicelerator"
import Song from "../../types/Song"

export default (props: {
  beep: Song.Data,
  width: number,
  height: number,
  duration: number,
  frame: number,
  gradient: Array<string>,
  mode: "bezier" | "linear"
}) => {
  const { beep, width, height, duration, frame, gradient, mode } = props
  const { fps } = useVideoConfig()
  const colors: chroma.Scale = mode === "bezier" ? chroma.bezier(gradient).scale() : chroma.scale(gradient)

  const [delay] = useState(() => delayRender())


  const settings: Shells.Settings = {
    beep,
    width,
    duration,
    frame,
    gradient,
    mode,
    colors
  }
  const {beatsPerBar, beatsPerMinute, ticksPerBeat} = beep

  const distance: Shells.Distance = useMemo(() => utils.distance(width, beep, 4), [])
  const pitch: Shells.Pitch = useMemo(() => utils.pitch(height, beep.channels, distance.bars, [3, 0, 1, 4, 2, 5]), [])
  const time: Shells.Time = useMemo(() => utils.time(fps, beatsPerMinute, beatsPerBar, ticksPerBeat), [])
  const drums: Shells.Drums = useMemo(() => utils.drums(height, beep.channels), [])

  const ticks = beep.ticksPerBeat * beep.beatsPerBar * distance.bars
  const slicelerator = useMemo(() => new Slicelerator([], [], beatsPerMinute, ticks, fps, beatsPerBar, ticksPerBeat, distance.tickWidth), [])

  const { bars, barWidth } = distance

  const {
    pitchVizHeight,
    keyHeight,
    matrixPitches,
    pitchChannels,
    layeredChannels,
    octaves,
    min
  } = pitch

  // const beepLength: number = barWidth * bars
  const timelineLength: number = barWidth * (bars + 2)
  const position: number = 0 - interpolate(frame, slicelerator.sliceleration[0], slicelerator.sliceleration[1])
  return <div id="timeline" style={{
    width: "100%",
    height: "100%",
    zIndex: 5
  }}>
    <svg id="pitch-visualization" style={{
      "position": "absolute",
      "height": pitchVizHeight,
      "width": timelineLength,
      "left": position,
    }}>
      <defs>
        <filter id="flood" x="-200%" y="-200%" width="400%" height="400%">
          <feGaussianBlur stdDeviation={2}></feGaussianBlur>
        </filter>
        <filter>
          <filter id="flood2" x="0" y="0" height="100%" width="100%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation={5}></feGaussianBlur>
          </filter>
        </filter>
      </defs>
      {useMemo(() => {
        return <Longitude
          keyHeight={keyHeight}
          width={barWidth}
          height={pitchVizHeight}
          distances={bars + 2}
          ranges={matrixPitches}
          min={min}
          timeShell={time} />
      }, [])}
      <Latitude width={timelineLength} height={pitchVizHeight} octaves={octaves} />
      {layeredChannels.map((channel: any, index: number) => <Channel
        settings={settings}
        timeShell={time}
        slicelerator={slicelerator}
        distanceShell={distance}
        channel={channel}
        pitchShell={pitch} stroke={colors(
          index % 2 === 0 ?
            index / (pitchChannels.length - 1) :
            1 - (index / pitchChannels.length)
        )} id={"channel-" + index}
      />)}
    </svg>
    <svg id="drum-visualization" style={{
      "position": "absolute",
      "height": drums.drumVizHeight,
      "width": timelineLength,
      "left": position
    }}>
      {
        drums.drumChannels.map((channel: any, index: number) =>
        (<Drumline
          slicelerator={slicelerator}
          timeShell={time}
          drum={channel}
          distanceShell={distance}
          settings={settings}
          width={timelineLength}
          height={drums.drumVizHeight}
          drums={drums.drumChannels.length}
          index={index}
          stroke={colors(
            index % 2 === 0 ?
              index / (drums.drumChannels.length - 1) :
              1 - (index / drums.drumChannels.length)
          ).hex()}
        />)
        )
      }
    </svg>
  </div>
}
import { interpolate, useVideoConfig } from "remotion"
import { Longitude } from "./Longitude"
import { Latitude } from "./Latitude"
import Channel from "./VizComps/Channel"
import { useMemo } from "react"
import { Shells } from "./types/shells"
import chroma from "chroma-js"
import layerChannels from "./layerChannels"

export const Timeline = (props: {
  beep: any,
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

  const settings: Shells.Settings = {
    beep,
    width,
    height,
    duration,
    frame,
    gradient,
    mode,
    colors
  }

  const bars: number = beep.channels[0].sequence.length
  const barsOnFrame: number = 4
  const barWidth: number = width / barsOnFrame
  const beatWidth: number = barWidth / beep.beatsPerBar
  const tickWidth: number = beatWidth / beep.ticksPerBeat
  const weight = barWidth * 2

  const distanceShell: Shells.Distance = {
    bars,
    barsOnFrame,
    barWidth,
    beatWidth,
    tickWidth,
    weight
  }

  const pitchChannels: Array<any> = useMemo(() => beep.channels.filter((channel: any) => channel.type === "pitch"), [])
  const pitches: Array<number> = useMemo(() => pitchChannels.flatMap((channel: any) => channel.patterns.flatMap((pattern: any) => pattern.notes.flatMap((note: any) => note.pitches))), [])
  const octaves = useMemo(() => Math.ceil((Math.max(...pitches) - Math.min(...pitches)) / 12), [])
  const octaveHeight: number = height / octaves
  const keyHeight: number = octaveHeight / 12
  const min = Math.min(...pitches)

  const matrix = useMemo(() => pitchChannels.map(channel => channel.sequence), [])
  const matrixPitches = useMemo(() => {
    const substantiatedChannels = pitchChannels.map((channel: any) => channel.patterns.map((pattern: any) => pattern.notes.flatMap((note: any) => note.pitches)))
    const sequenced = matrix.map((sequence, index) => {
      const channel = substantiatedChannels[index]
      return sequence.map((cell: any) => channel[cell-1])
    })
    console.log(sequenced)
    const minNMax: Array<[number, number]> = []

    for (let i = 0; i < bars; i++) {
      const column: Array<number> = []
      sequenced.forEach(sequence => {
        column.push(sequence[i])
      })
      const processedColumn = column.filter(ting => ting).flat()
      minNMax.push([Math.min(...processedColumn), Math.max(...processedColumn)])
    }
    return minNMax
  }, [])

  const pitchShell: Shells.Pitch = {
    pitchChannels,
    pitches,
    octaves,
    octaveHeight,
    keyHeight,
    min
  }

  const layeredChannels = useMemo(() => layerChannels(pitchChannels, [3, 2, 4, 1, 0]), [])

  const framesPerMinute = fps * 60
  const { beatsPerMinute, beatsPerBar } = beep
  const framesPerBeat = framesPerMinute / beatsPerMinute
  const framesPerBar = framesPerBeat * beatsPerBar
  const framesPerTick = framesPerBeat / beep.ticksPerBeat

  const timeShell: Shells.Time = {
    beatsPerBar,
    beatsPerMinute,
    framesPerMinute,
    framesPerBar,
    framesPerTick,
  }

  const beepLength: number = barWidth * bars
  const timelineLength: number = barWidth * (bars + 2)
  const position: number = interpolate(frame, [0, duration], [0, -beepLength])

  return <div id="distanceline-container" style={{
    width: "100%",
    height: "100%",
    zIndex: 5
  }}>
    <svg id="timeline" style={{
      "position": "absolute",
      "height": height,
      "width": timelineLength,
      "left": position,
      "bottom": 0
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
      return <Longitude keyHeight={keyHeight} width={barWidth} height={height} distances={bars + 2} ranges={matrixPitches} min={min} timeShell={timeShell}/>
      } , [])}
      <Latitude width={timelineLength} height={height} octaves={octaves} />
      {layeredChannels.map((channel: any, index: number) => <Channel
        settings={settings}
        timeShell={timeShell}
        distanceShell={distanceShell}
        channel={channel}
        pitchShell={pitchShell} stroke={colors(
          index % 2 === 0 ?
          index / (pitchChannels.length - 1) :
          1 - (index/pitchChannels.length)
        )} id={"channel-" + index}
      />)}
    </svg>
  </div>
}
import { Black } from "./Background";
import { Timeline } from "./Timeline";
import json from "./beepbox/KUEBIKO.json"
import wav from "./beepbox/KUEBIKO.wav"
import { useCurrentFrame, useVideoConfig, Audio } from "remotion";

export const MyComposition = () => {
  const { width, height, durationInFrames, fps } = useVideoConfig()
  const frame = useCurrentFrame()
  
  const framesPerMinute = fps * 60
  const { beatsPerMinute, beatsPerBar } = json
  const framesPerBeat = framesPerMinute/beatsPerMinute
  const length = json.channels[0].sequence.length
  const duration = framesPerBeat * beatsPerBar * length

  return <><Black />
    <Audio src={wav} startFrom={0}></Audio>
    <Timeline beep={json} width={width} height={height} frame={frame} duration={duration} gradient={["#0000ff","#ff00ff","#ff0000"]} mode={"linear"}/>
  </>
};

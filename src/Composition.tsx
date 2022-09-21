import { Black } from "./Background";
import { Timeline } from "./Timeline";
import KUEBIKO from "./beepbox/KUEBIKO.json"
import KUEBIKOwav from "./beepbox/KUEBIKO.wav"
import { useCurrentFrame, useVideoConfig, Audio } from "remotion";

export const MyComposition = () => {
  const { width, height, durationInFrames, fps } = useVideoConfig()
  const frame = useCurrentFrame()
  
  const framesPerMinute = fps * 60
  const { beatsPerMinute, beatsPerBar } = KUEBIKO
  const framesPerBeat = framesPerMinute/beatsPerMinute
  const length = KUEBIKO.channels[0].sequence.length
  const duration = framesPerBeat * beatsPerBar * length

  return <><Black />
    <Audio src={KUEBIKOwav} startFrom={0}></Audio>
    <Timeline beep={KUEBIKO} width={width} height={height} frame={frame} duration={duration} gradient={["#ffff00","#00ffff", "#ff00ff"]} mode={"linear"}/>
  </>
};

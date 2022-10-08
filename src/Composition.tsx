import { Black } from "./Background";
import Timeline from "./VizComps/Timeline";
import json from "./beepbox/Ive hit rock bottom and Im at the lowest point in my life but Im trying to be optimistic..json"
import wav from "./beepbox/Ive hit rock bottom and Im at the lowest point in my life but Im trying to be optimistic..wav"
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
    <Timeline beep={json} width={width} height={height} frame={frame} duration={duration} gradient={["#03fce3","#fcbe03"]} mode={"linear"}/>
  </>
};

import Black from "../Background/Background";
import Timeline from "../Timeline";
import json from "../../imports/Ive hit rock bottom and Im at the lowest point in my life but Im trying to be optimistic..json"
import wav from "../../imports/Ive hit rock bottom and Im at the lowest point in my life but Im trying to be optimistic..wav"
import { useCurrentFrame, useVideoConfig, Audio } from "remotion";

export default () => {
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

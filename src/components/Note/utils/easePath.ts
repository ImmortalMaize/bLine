import { Easing } from "remotion";
import { Time } from "../../../types/units";

export default (frame: Time, times: Array<Time>, pitches: Array<number>) => {
  return pitches.every(pitch => pitch === pitches[0]) ? Easing.linear
  : frame <= times[1] ? 
    pitches[0] < pitches[1] ? Easing.bezier(.5, 0, 1, .5) : Easing.bezier(0, .5, .5, 1)
  : frame >= times[times.length - 2] ?
    pitches[times.length - 2] < pitches[times.length - 1] ? Easing.bezier(.5, 0, 1, .5) : Easing.bezier(0, .5, .5, 1)
  : Easing.bezier(.5, 0, .5, 1)
}
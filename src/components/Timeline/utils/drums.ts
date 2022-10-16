import Shells from "../../../types/Shells"
import layerChannels from "./layerChannels"

export default (height: number, channels: any[], order: number[] = []): Shells.Drums => {
  const drumVizHeight = height * .25
  const drumChannels = channels.filter((channel: any) => channel.type === "drum")
  const layeredChannels = layerChannels(drumChannels, order)
  return {
    drumVizHeight,
    drumChannels,
    layeredChannels
  }
}
import Shells from "../../../types/Shells"
import layerChannels from "./layerChannels"

export default (height: number, channels: any[], bars: number, order: number[] = []): Shells.Pitch => {
  const pitchVizHeight: number = height * .75

  const pitchChannels: Array<any> = channels.filter((channel: any) => channel.type === "pitch")
  const pitches: Array<number> = pitchChannels.flatMap((channel: any) => channel.patterns.flatMap((pattern: any) => pattern.notes.flatMap((note: any) => {
    return note.pitches.flatMap((pitch: any) => note.points.flatMap((point: any) => pitch + point.pitchBend))
  })))
  const octaves = Math.ceil((Math.max(...pitches) - Math.min(...pitches)) / 12)
  const octaveHeight: number = pitchVizHeight / octaves
  const keyHeight: number = octaveHeight / 12
  const min = Math.min(...pitches)

  const matrix = pitchChannels.map(channel => channel.sequence)
  const matrixPitches = (() => {
    const substantiatedChannels = pitchChannels.map((channel: any) => channel.patterns.map((pattern: any) => pattern.notes.flatMap((note: any) => note.pitches)))
    const sequenced = matrix.map((sequence, index) => {
      const channel = substantiatedChannels[index]
      return sequence.map((cell: any) => channel[cell-1])
    })
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
  })()
  
  const layeredChannels = layerChannels(pitchChannels, order)
  return {
    pitchChannels,
    pitchVizHeight,
    pitches,
    octaveHeight,
    octaves,
    keyHeight,
    layeredChannels,
    matrixPitches,
    min
  }

}
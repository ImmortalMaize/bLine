export default (channels: Array<any>, order: Array<number>) => {
  if (order.length === channels.length) {
    return channels.map((_channel, index) => channels[order[index]])
  } else return channels.reverse()
}
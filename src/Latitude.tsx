export const Latitude = (props: {
  height: number,
  width: number,
  octaves: number
}) => {
  const { height, width, octaves } = props
  const padding = 10
  return <g id="latitude">
    {Array.from(Array(octaves), (line, index) => {
      const y = (height/octaves)*index
      return <line x1={padding} x2={width-padding} y1={y} y2={y} stroke="white" style={{
        strokeWidth: "2px",
        strokeLinecap: "round",
        stroke: "white",
        strokeOpacity: (index/octaves) * 0.4
      }}></line>
    })}
  </g>
}
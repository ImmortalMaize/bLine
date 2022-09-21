export const Longitude = (props: {
  height: number,
  width: number,
  distances: number
}) => {
  const {height, width, distances} = props
  const padding: number = 10
  return <g id="longitude">
  {Array.from(Array(distances), (line, index) => {
    const x = width * index
    return <line key={index} x1={x} x2={x} y1={Math.max(padding)} y2={Math.min(height-padding)} style={{
      strokeWidth: "2px",
      strokeLinecap: "round",
      stroke: "white",
      strokeOpacity: 1
    }}>

    </line>
  })}
  </g>
}
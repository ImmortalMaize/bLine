import { AbsoluteFill } from "remotion"

export const Black = (props: any) => {
  const { opacity, zIndex } = props
  return <AbsoluteFill style={
    {
      opacity: opacity ?? 1,
      background: "#121716",
      zIndex: zIndex
    }
  }>
    {props.children}
  </AbsoluteFill>
}
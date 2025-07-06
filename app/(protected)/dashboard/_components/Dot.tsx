import { RFC } from "@/types"

const Dot: RFC<DotProps> = ({color = '#17B26A', size = 8}) => {
  const styles = {
    background: color,
    height: size,
    width: size
  }

  return (
    <span style={styles} className="rounded-full m-0.5"></span>
  )
}

export default Dot

type DotProps = {
  color?: string,
  size?: number
}
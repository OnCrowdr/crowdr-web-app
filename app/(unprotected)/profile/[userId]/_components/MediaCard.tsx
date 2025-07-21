import { Image } from "@/api/_profile/models/GetProfile"
import { RFC } from "@/types"

const MediaCard: RFC<Props> = ({ engagement }) => {
  return (
    <div className="bg-gray-200 rounded aspect-square h-auto">
      <img
        src={engagement.url}
        alt=""
        className="w-full h-full rounded object-cover"
      />
    </div>
  )
}

export default MediaCard

interface Props {
  engagement: Image
}

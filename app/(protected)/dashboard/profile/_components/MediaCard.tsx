"use client"
import { Image } from "@/api/_profile/models/GetProfile"
import { RFC } from "@/types"
import { cn } from "@/utils/style"
import { Trash2, Undo2 } from "lucide-react"

const MediaCard: RFC<Props> = ({ engagement, removed, toggleRemoval }) => {
  const isEdit = toggleRemoval !== undefined

  return (
    <div className={cn("relative bg-gray-200 rounded aspect-square h-auto")}>
      <img
        src={engagement.url}
        alt=""
        className={cn(
          "w-full h-full rounded object-cover transition-opacity",
          removed && "opacity-50"
        )}
      />

      {isEdit && (
        <button
          className={cn(
            "absolute top-2 right-2 bg-white rounded-full p-2",
            removed ? "bg-gray-200" : "bg-red-600"
          )}
          onClick={() => toggleRemoval(engagement._id)}
          title={removed ? "Undo removal" : "Remove media"}
        >
          {removed ? <Undo2 /> : <Trash2 color="#FFF" />}
        </button>
      )}
    </div>
  )
}

export default MediaCard

interface Props {
  engagement: Image
  removed?: boolean
  toggleRemoval?: (id: string) => void
}

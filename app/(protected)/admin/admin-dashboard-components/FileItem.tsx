import { useEffect, useState } from "react"
import NextImage from "next/image"

import { RFC } from "@/types"
import FileIcon from "@/public/svg/file-icon.svg"

const FileItem: RFC<FileItemProps> = ({ fileName, url }) => {
  const [fileSize, setFileSize] = useState("")

  useEffect(() => {
    if (url) {
      getImageSize(url).then((fileSize) => setFileSize(fileSize))
    } else {
      setFileSize('NOT FOUND')
    }
  }, [])

  const viewFile = () => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <div
      className="flex gap-3 hover:cursor-pointer rounded-xl border border-[#EAECF0] p-4"
      onClick={viewFile}
    >
      <NextImage src={FileIcon} alt="file icon" />
      <div className="text-sm">
        <p className="font-medium text-[#344054]">{fileName}</p>
        <p className="text-[#344054]">{fileSize}</p>
      </div>
    </div>
  )
}

export default FileItem

type FileItemProps = {
  fileName: string
  url: string
}

async function getImageSize(url: string) {
  const res = await fetch(url, { method: "HEAD" })
  const contentLength = res.headers.get("Content-Length")

  if (contentLength) {
    const imageSizeInBytes = parseInt(contentLength)
    const imageSizeInKb = bytesToKB(imageSizeInBytes)

    return imageSizeInKb < 1000
      ? `${imageSizeInKb} KB`
      : `${bytesToMB(imageSizeInBytes)} MB`
  } else {
    throw new Error("Content-Length header not found")
  }
}

function bytesToKB(bytes: number) {
  return Math.ceil(bytes / 1024)
}

function bytesToMB(bytes: number) {
  return Math.ceil(bytes / (1024 * 1024))
}

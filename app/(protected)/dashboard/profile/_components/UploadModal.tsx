"use client"
import OldModal from "@/components/OldModal"
import { RFC } from "@/types"
import { toMB } from "@/utils/file"
import { Upload } from "lucide-react"
import { useEffect, useState } from "react"

const UploadModal: RFC<Props> = ({ file, opened, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(65)
  const isComplete = !opened && isVisible

  useEffect(() => {
    if (opened) {
      setIsVisible(true)
    } else {
      setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 2000)
    }
  }, [opened])

  // Simulate upload progress
  // useEffect(() => {
  //   if (!isVisible || isComplete) return

  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         setIsComplete(true)
  //         clearInterval(interval)
  //         return 100
  //       }
  //       return prev + Math.random() * 15
  //     })
  //   }, 500)

  //   return () => clearInterval(interval)
  // }, [isVisible, isComplete])

  // if (!isVisible) {
  //   return (
  //     <div className="p-8 flex justify-center">
  //       <button
  //         onClick={() => {
  //           setIsVisible(true)
  //           setProgress(0)
  //           setIsComplete(false)
  //         }}
  //         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
  //       >
  //         Show Upload Modal
  //       </button>
  //     </div>
  //   )
  // }

  return (
    <OldModal
      isOpen={isVisible}
      onClose={onClose}
      shouldCloseOnOverlayClick={false}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-[342px] mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        {/* <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isComplete ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              {isComplete ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Upload className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isComplete ? "Upload Complete!" : "Uploading Image"}
              </h3>
              <p className="text-sm text-gray-500">
                {isComplete
                  ? "Your image has been uploaded successfully"
                  : "Please wait while we process your image"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div> */}

        {/* Content */}
        <div className="p-6">
          {/* File Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap">
                {file?.name || "No file selected"}
              </p>
              {file?.size && (
                <p className="text-xs text-gray-500">{toMB(file.size)}</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {/* <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isComplete ? "Complete" : "Uploading..."}
              </span>
              <span className="text-sm text-gray-500">
                  {Math.round(progress)}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out rounded-full ${
                    isComplete ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
          </div> */}

          {/* Status Message */}
          <div
            className={`text-center py-4 px-4 rounded-lg ${
              isComplete
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <p className="text-sm font-medium">
              {isComplete
                ? "✨ Your photo is uploaded!"
                : "🚀 Uploading photo..."}
            </p>
          </div>
        </div>

        {/* Footer */}
        {/* {isComplete && (
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsVisible(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          )} */}
      </div>
    </OldModal>
  )
}

export default UploadModal

interface Props {
  file: File | undefined
  opened: boolean
  onClose: () => void
}

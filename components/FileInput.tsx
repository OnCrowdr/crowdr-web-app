import {
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  cloneElement,
} from "react"
import { Merge, useFormContext } from "react-hook-form"
import NextImage from "next/image"
import imageCompression from "browser-image-compression"

import { RFC } from "@/types"
import {
  FieldError,
  UseFormRegisterReturn,
  RegisterOptions,
} from "react-hook-form"
import { HiMiniXCircle } from "react-icons/hi2"
import UploadIcon from "@/public/svg/upload-cloud.svg"
import AttentionIcon from "@/public/assets/warning-circle.png"
import LoadingCircle from "@/public/svg/loading-circle.svg"
import { atom, useAtomValue, useSetAtom } from "jotai"
import _ from "lodash"

// const previewImageAtom = atom<string | null>(null)

const FileInput: RFC<FileInputProps> = ({
  config,
  label,
  error,
  placeholder,
  optional,
  multiple,
  showFileList,
  maxFileSizeInMb,
  name,
  onChange,
  value,
  controlled,
  rules,
  children,
  styles,
  disabled,
}) => {
  // const setPreviewImage = useSetAtom(previewImageAtom)
  const [previewProps, setPreviewProps] = useState<FileInputContentProps>()

  if (!controlled && !config && name) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      register,
      formState: { errors },
      /*eslint-disable*/
    } = useFormContext()
    config = register(name, rules)
    error = _.get(errors, name) as FieldError
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  let files: File[] | undefined
  if (config) {
    var {
      register,
      control,
      setValue,
      setError,
      clearErrors,
      watch,
      trigger,
      formState: { errors, isValid, isSubmitting },
      // eslint-disable-next-line react-hooks/rules-of-hooks
      /*eslint-disable*/
    } = useFormContext()
    files = watch(config.name)
  }
  if (value) {
    files = value
  }
  const imageUploaded = files?.length && !error

  const [dragActive, setDragActive] = useState(false)

  // IF CHILDREN PROP IS FileInputContent COMPONENT AND IT HAS showPreview PROP,
  // AUTOMATICALLY THE URL FOR THE SELECTED FILE FOR PREVIEW
  useEffect(() => {
    if (isValidElement<FileInputContentProps>(children)) {
      if (children.props.showPreview && files) {
        const reader = new FileReader()

        reader.onload = (e) => {
          // setPreviewImage(e.target?.result as string)
          setPreviewProps({
            ...children.props,
            previewImage: e.target?.result as string,
          })
        }

        reader.readAsDataURL(files[0])
      }
    }
  }, [files])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    processFileSelection(e)
  }

  const _validateImage = async (fileList: FileList) => {
    const image = fileList[0]
    if (!image) return "Please select an image"

    const maxSize = maxFileSizeInMb! * 1024 * 1024 // maxFileSize in bytes
    if (image.size > maxSize) {
      const imageStatus = await new Promise<string | boolean>(
        async (resolve) => {
          const compressedBlob = await imageCompression(image, {
            maxSizeMB: 2,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          })

          if (compressedBlob.size > maxSize) {
            resolve(`Image size exceeds ${maxFileSizeInMb}MB`)
          } else {
            if (config) setValue(config.name, blobToFile(compressedBlob))
            if (onChange) onChange({ value: blobToFile(compressedBlob) as any })
            resolve(true)
          }
        }
      )
      return imageStatus
    } else {
      return true
    }
  }

  const MAX_FILE_COUNT = 5
  const validateFiles = async (files: File[]) => {
    if (files.length > MAX_FILE_COUNT) {
      throw new Error(`Selected files cannot be more than ${MAX_FILE_COUNT}`)
    }

    const maxSize = maxFileSizeInMb! * 1024 * 1024 // maxFileSize in bytes
    const validatedFiles: File[] = []

    for (let image of files) {
      if (image.size > maxSize) {
        const compressedBlob = await imageCompression(image, {
          maxSizeMB: 2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        })

        if (compressedBlob.size > maxSize) {
          throw new Error(`Image size exceeds ${maxFileSizeInMb}MB`)
        } else {
          validatedFiles.push(compressedBlob)
        }
      } else {
        validatedFiles.push(image)
      }
    }

    return validatedFiles
  }

  // BUG: DRAG & DROP IS ABLE TO BY-PASS FILE TYPE SPECIFIED
  const processFileSelection = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ) => {
    const selectedFiles = isChangeEvent(e)
      ? Array.from(e?.target?.files!)
      : Array.from(e.dataTransfer.files)

    if (showFileList && multiple) {
      if (!files && selectedFiles?.length === 0) {
        if (config) setError(config.name, { type: "required" })
      } else {
        if (!files) {
          validateFiles(selectedFiles)
            .then(setFiles)
            .catch((err) => {
              if (config)
                setError(config.name, { type: "custom", message: err.message })
            })
        } else {
          let fileListArray = Array.from(files)

          for (let selectedFile of selectedFiles) {
            const fileIndex = fileListArray.findIndex(
              (f) => selectedFile.name == f.name
            )
            const isAlreadyPicked = fileIndex > -1
            if (isAlreadyPicked) {
              files![fileIndex] = selectedFile
            } else {
              files!.push(selectedFile)
            }
          }

          validateFiles(files)
            .then(setFiles)
            .catch((err) => {
              if (config)
                setError(config.name, { type: "custom", message: err.message })
            })
        }
      }
    } else {
      if (selectedFiles.length != 0) {
        validateFiles(selectedFiles)
          .then(setFiles)
          .catch((err) => {
            if (config)
              setError(config.name, { type: "custom", message: err.message })
          })
      } else {
        fileInputRef.current!.value = ""
        if (config) setValue(config.name, null)
        if (onChange) onChange({ value: null })
      }
    }
    if (config) trigger(config.name)
  }

  const removeFile = (name: string) => {
    const remainingFiles = files!.filter((file) => file.name != name)
    if (remainingFiles.length > 0) {
      setFiles(remainingFiles)

      if (config && remainingFiles.length <= MAX_FILE_COUNT) {
        clearErrors(config.name)
      }
    } else {
      fileInputRef.current!.value = ""
      if (config) {
        setValue(config.name, null)
        trigger(config.name)
      }
      if (onChange) onChange({ value: null })
    }
  }

  const setFiles = (files: File[]) => {
    if (config) setValue(config.name, files, { shouldValidate: true })
    if (onChange) onChange({ value: files })
    // clearErrors()
  }

  const isChangeEvent = (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ): event is React.ChangeEvent<HTMLInputElement> => {
    return "files" in event.target
  }

  return (
    <span className={styles?.wrapper}>
      <label
        htmlFor={config?.name || name}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
        className={`${
          dragActive ? "border-green-200" : "border-[#e4e7ec]"
        } flex flex-col items-center cursor-pointer rounded-lg border py-4 px-6 mb-1 ${
          disabled && "pointer-events-none"
        }`}
      >
        {children ? (
          <FileInputContent {...(previewProps || (children as any).props)} />
        ) : (
          <>
            <div
              className={`${
                imageUploaded
                  ? "bg-green-100 border-green-50"
                  : "bg-[#F2F4F7] border-[#F9FAFB]"
              } rounded-full border-[6px] p-[10px] mb-3`}
            >
              <NextImage src={UploadIcon} alt="upload icon" width={24} />
            </div>
            <div className="text-center">
              <p className="text-primary text-sm mb-1">
                {/* text-[#FF5200] */}
                <span className="text-inherit">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-[#667085]">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </>
        )}
        <input
          {...config}
          type="file"
          ref={fileInputRef}
          id={config?.name || name}
          accept=".svg, .png, .jpg, .jpeg," // TODO: POSSIBLY ADD .gif
          multiple={multiple}
          onChange={processFileSelection}
          hidden
        />
      </label>
      {error && (
        <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
          {error.message}
        </span>
      )}

      {showFileList &&
        files?.map((file) => (
          <FileDetail
            key={file.name}
            name={file.name}
            size={file.size}
            removeFile={() => removeFile(file.name)}
          />
        ))}
    </span>
  )
}

export default FileInput

type FileInputProps = {
  config?: UseFormRegisterReturn
  label?: string
  error?: Merge<FieldError, (FieldError | undefined)[]>
  placeholder?: string
  optional?: boolean
  maxFileSizeInMb?: number
  compressImage?: boolean
  multiple?: boolean
  showFileList?: boolean
  name?: string
  onChange?: (e: { value: File[] | null }) => void
  value?: File[]
  rules?: RegisterOptions
  controlled?: boolean
  children?: React.ReactNode
  styles?: {
    wrapper?: string
  }
  disabled?: boolean
}

function blobToFile(blob: Blob): FileList {
  const file = new File([blob], blob.name, { type: blob.type })
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)
  return dataTransfer.files
}

function toMB(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2)
}

const FileDetail: RFC<FileDetailProps> = ({ name, size, removeFile }) => {
  return (
    <div className="flex rounded-lg border border-[#D0D5DD] w-full mt-4">
      <div className="text-sm bg-[#F9FAFB] w-8/12 rounded-l-lg p-4 pl-[18px]">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </p>
        <p className="text-[#667085]">{toMB(size)} MB</p>
      </div>
      <div className="grow bg-white rounded-r-lg p-4">
        {/* <Image src={LoadingCircle} alt="spinner icon" className="block ml-auto" /> */}
        <HiMiniXCircle size={32} className="cursor-pointer ml-auto" onClick={removeFile} />
      </div>
    </div>
  )
}

type FileDetailProps = {
  name: string
  size: number
  removeFile: () => void
}

export const FileInputContent: RFC<FileInputContentProps> = ({
  previewImage,
  subtext,
  showPreview,
}) => {
  // const previewImage = useAtomValue(previewImageAtom)

  return (
    <div className="flex flex-col items-center gap-3">
      <NextImage
        src={showPreview && previewImage ? previewImage : AttentionIcon}
        width={41.27}
        height={40}
        alt=""
        className="object-cover rounded-full w-[41.27px] h-[40px]"
      />

      <div className="text-sm text-[#667085] text-center">
        <p>
          <span className="text-[#FF5200]">Click to upload</span> {subtext}
        </p>
        <p>SVG, PNG, JPG or GIF (max. 800x400px)</p>
      </div>
    </div>
  )
}

type FileInputContentProps = {
  previewImage?: string
  subtext?: string
  showPreview?: boolean
}

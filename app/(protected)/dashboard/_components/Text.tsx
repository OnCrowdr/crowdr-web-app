"use client"
import { useMemo, useState } from "react"
import { RFC } from "@/types"
import { regex } from "regex"

const Text: RFC<TextProps> = ({
  children,
  className,
  characterLimit = Infinity,
  expandText = "See more",
  collaspseText = "See less",
  expandTextClassName = "text-primary",
  collaspseTextClassName = "text-primary",
  toggle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const isBeyondLimit = children.length > characterLimit

  const text = useMemo(() => {
    if (characterLimit && isBeyondLimit && isCollapsed) {
      const shortenedText = shortenText(children, characterLimit)
      return (
        <>
          {shortenedText}{" "}
          <span className={`${expandTextClassName} cursor-pointer`}>
            {expandText}
          </span>
        </>
      )
    } else {
      return children
    }
  }, [isCollapsed])

  const props: any = { className }

  if (characterLimit) {
    props.onClick = () =>
      toggle ? setIsCollapsed((prev) => !prev) : setIsCollapsed(false)
  }

  return (
    <p {...props}>
      {text}{" "}
      {isBeyondLimit && toggle && !isCollapsed && (
        <span className={`${collaspseTextClassName} cursor-pointer`}>
          {collaspseText}
        </span>
      )}
    </p>
  )
}

export default Text

type TextProps = {
  children: string
  className?: string
  characterLimit?: number
  expandText?: string
  collaspseText?: string
  expandTextClassName?: string
  collaspseTextClassName?: string
  toggle?: boolean
}

const shortenText = (string: string, characterLimit: number) => {
  const stringArray = string.split(" ")

  let buffer = ""
  let wordCount = 0

  for (let stringItem of stringArray) {
    buffer = [buffer, stringItem].filter((string) => string).join(" ")
    if (buffer.length > characterLimit) break
    wordCount++
  }

  let text = stringArray.slice(0, wordCount).join(" ")
  if (text.length > characterLimit) {
    text = text.slice(0, characterLimit)
  }

  // replace any trailing non-word character at end of string
  const trailingNonWord = regex`[^\w]$`
  text = text.replace(trailingNonWord, "")
  // text = text.replace(/[^\w]$/, "")

  return text + "... "
}

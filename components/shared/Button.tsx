"use client"
import { useRef } from "react"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import Link from "next/link"
import Color from "color"

import { RFC } from "@/types"
import { IconType } from "react-icons/lib"

import { CgSpinner } from "react-icons/cg"

export const Button: RFC<ButtonProps> = ({
  text,
  href,
  onClick,
  iconUrl,
  icon,
  bgColor = "#00B964",
  textColor = "#FFF",
  outlineColor,
  shadow,
  buttonType = "button",
  loading,
  disabled,
  className,
  iconPosition = "left",
}) => {
  const props = {
    text,
    bgColor,
    textColor,
    outlineColor,
    iconUrl,
    icon,
    shadow,
    loading,
  }

  const buttonRef = useRef<any>(null)
  const flexDirection =
    iconPosition == "right" ? "flex-row-reverse" : "flex-row"
  const cursorStyle = disabled || loading ? "cursor-default" : "cursor-pointer"
  const buttonClasses = twMerge(
    `inline-flex justify-between items-center gap-2 rounded-lg text-sm transition h-[44px] px-[16px] py-[10px]`,
    cursorStyle,
    flexDirection,
    className
  )
  const darkerBgColor = darken(bgColor!)

  const buttonStyle: React.CSSProperties = {
    color: textColor,
    background: !disabled ? bgColor : whiten(bgColor), // TODO: FINISHED UP MAKING BUTTON LIGHTER WHEN DISABLED
    opacity: disabled ? 0.7 : 1, // FIXME: TEMPORARY FIX, REMOVE
  }
  if (outlineColor) buttonStyle.border = `1px solid ${outlineColor}`
  if (shadow) {
    buttonStyle.boxShadow = `0px 1px 2px 0px rgba(16, 24, 40, 0.05)`
    buttonStyle.border = `0.4px solid #D0D5DD`
  }

  const onMouseEnter = !disabled
    ? () => {
        if (buttonRef.current)
          buttonRef.current.style.background = darkerBgColor
      }
    : nothing

  const onMouseLeave = !disabled
    ? () => {
        if (buttonRef.current) {
          buttonRef.current.style.background = bgColor!
        }
      }
    : nothing

  return href ? (
    <Link
      ref={buttonRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      href={href}
      style={buttonStyle}
      className={buttonClasses}
    >
      <ButtonContent {...props} />
    </Link>
  ) : (
    <button
      ref={buttonRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      type={buttonType}
      aria-label={text}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      className={buttonClasses}
    >
      <ButtonContent {...props} />
    </button>
  )
}

const ButtonContent: RFC<ButtonContentProps> = ({
  text,
  textColor,
  iconUrl,
  loading,
  ...props
}) => {
  const textStyle: React.CSSProperties = {
    color: textColor || "inherit",
  }

  let icon = null
  if (props.icon) {
    icon = <props.icon width={24} height={24} />
  } else if (iconUrl) {
    icon = <Image src={iconUrl} height={24} width={24} alt="button icon" />
  }

  return (
    <>
      {icon}
      {text}
      {loading && (
        <CgSpinner size="20px" className="animate-spin icon opacity-100" />
      )}
    </>
  )
}

export const GrayButton: RFC<ButtonProps> = ({ ...props }) => {
  return (
    <Button
      bgColor="#F8F8F8"
      textColor="#292A2E"
      outlineColor="rgba(230, 230, 230, 0.30)"
      {...props}
    />
  )
}

export const WhiteButton: RFC<ButtonProps> = ({ ...props }) => {
  return (
    <Button
      bgColor="#FFF"
      textColor="#292A2E"
      outlineColor="rgba(230, 230, 230, 0.30)"
      {...props}
    />
  )
}

type ButtonProps = ButtonContentProps & {
  href?: string
  onClick?: (e: any) => void
  buttonType?: "button" | "submit" | "reset"
  bgColor?: string
  outlineColor?: string
  shadow?: boolean
  disabled?: boolean
  className?: string
  iconPosition?: "left" | "right"
}

type ButtonContentProps = {
  text?: string
  textColor?: string
  icon?: IconType
  iconUrl?: string
  loading?: boolean
}

function whiten(color: string) {
  const colorObj = Color(color)
  // const brightness = colorObj.luminosity()
  // const whitenedColor =
  //   brightness > 0.5 ? colorObj.fade(0.1) : colorObj.fade(0.9)
  //   console.log(color, whitenedColor)
  return colorObj.fade(0.5).hex()
}

function darken(color: string) {
  const colorObj = Color(color)
  const brightness = colorObj.luminosity()
  const darkenedColor =
    brightness > 0.5 ? colorObj.darken(0.04) : colorObj.darken(0.075)

  return darkenedColor.hex()
}

function nothing() {}

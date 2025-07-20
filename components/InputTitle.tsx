import { RFC } from "@/types"
import { ReactNode } from "react"

const InputTitle: RFC<InputTitleProps> = ({
  title,
  detail,
  id,
  styles,
  children,
}) => {
  return (
    <div className={"mb-[5px] md:mb-0 " + styles?.wrapper}>
      <h2 id={id || title} className="block">
        {title}
      </h2>
      {typeof detail === "string" ? (
        <div className="text-sm text-[#667085]">{detail}</div>
      ) : detail}

      {children}
    </div>
  )
}

export default InputTitle

type InputTitleProps = {
  title: string
  detail?: ReactNode
  id?: string
  styles?: { wrapper?: string }
}

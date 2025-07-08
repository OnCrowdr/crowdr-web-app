import Label from "./Label"
import { RFC } from "@/types"
import { ReactElement } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6"
import { regex } from "regex"

const Detail: RFC<DetailProps> = ({
  title,
  detail,
  date,
  status,
  label,
  button,
}) => {
  return (
    <details className="group border-b border-[#DDD] mb-5">
      <summary className="block pb-6">
        <div className="flex items-center group-open:items-end justify-between group-open:mb-4">
          <div className="flex flex-col gap-2">
            {label && (
              <p className="hidden group-open:block text-xs text-[#667085] mb-[9px]">
                {label}
              </p>
            )}
            <p className="text-[#667085]">{title}</p>
            <p className="group-open:hidden text-[#555] text-sm">{detail}</p>
          </div>
          <FaChevronDown className="group-open:hidden" />
          <FaChevronUp className="hidden group-open:block" />
        </div>

        <div className="hidden group-open:flex justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[#555]">{detail}</p>
            <p className="text-sm text-[#667085]">{date}</p>
          </div>

          {status &&
            !button &&
            (status.match(/success/i) ? (
              <Label text={status} />
            ) : (
              <Label text={status} textColor="#B42318" bgColor="#FEF3F2" />
            ))}

          {button}
        </div>
      </summary>
    </details>
  )
}

export default Detail

type DetailProps = {
  title: string
  detail: string
  date: string
  status?: string
  label?: string
  button?: ReactElement<any>
}

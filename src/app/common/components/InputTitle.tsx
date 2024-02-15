import { RFC } from "@/app/common/types"

const InputTitle: RFC<InputTitleProps> = ({ title, detail, id, styles, }) => {
  return (
    <div className={"mb-[5px] md:mb-0 " + styles?.wrapper}>
      <h2 id={id || title} className="block">
        {title}
      </h2>
      {detail && <p className="text-sm text-[#667085]">{detail}</p>}
    </div>
  )
}

export default InputTitle

type InputTitleProps = {
  title: string
  detail?: string
  id?: string
  styles?: { wrapper?: string }
}

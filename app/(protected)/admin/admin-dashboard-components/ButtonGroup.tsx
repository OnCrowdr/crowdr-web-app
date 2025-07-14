import { RFC } from "@/types"

const ButtonGroup: RFC<ButtonGroupProps> = ({ buttons, selected }) => {
  return (
    <div className="inline-flex rounded-md" role="group">
      {buttons.map((button, index) => {
        let buttonClasses =
          "text-sm font-semibold border border-[#D0D5DD] transition px-4 py-2"
        const isFirstItem = index === 0
        const isLastItem = index + 1 === buttons.length

        if (!isFirstItem) buttonClasses += " border-l-0"
        if (isFirstItem) buttonClasses += " rounded-l-lg"
        if (isLastItem) buttonClasses += " rounded-r-lg"

        if (selected === button.id) buttonClasses += " bg-primary text-white"
        else buttonClasses += " bg-white text-[#344054] hover:bg-[#EBECED]"

        return (
          <button
            key={index}
            type="button"
            onClick={button.onClick}
            className={buttonClasses}
          >
            {button.label}
          </button>
        )
      })}
    </div>
  )
}

export default ButtonGroup

type ButtonGroupProps = {
  buttons: Button[]
  selected: string
}

type Button = {
  id: string
  label: string
  onClick: () => void
}

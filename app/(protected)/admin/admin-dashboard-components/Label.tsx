import { RFC } from "@/types"

const Label: RFC<LabelProps> = ({
  text,
  textColor = "#344054",
  bgColor = "#FFF",
  dotColor,
  className,
}) => {
  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className={
        "inline-flex shrink-0 self-start items-center rounded-md border border-[#D0D5DD] px-1.5 py-0.5 " +
        className
      }
    >
      {dotColor && (
        <span
          style={{ backgroundColor: dotColor }}
          className="rounded-full h-2 w-2 mr-[6px]"
        ></span>
      )}
      <span className="whitespace-nowrap" style={{ color: textColor, fontSize: "12px" }}>{text}</span>
    </div>
  )
}

export default Label

type LabelProps = {
  text: string
  textColor?: string
  bgColor?: string
  dotColor?: string
  className?: string
}

const Approved = <Label text="Approved" dotColor="#17B26A" />
const Completed = <Label text="Completed" dotColor="#17B26A" />
const Pending = <Label text="Pending" dotColor="#F3C729" />
const In_Review = <Label text="In-Review" dotColor="#F3C729" />
const Rejected = <Label text="Rejected" dotColor="#F04438" />
const Blocked = <Label text="Blocked" dotColor="#6B7280" />

export const label = (type: string) => {
  switch (type) {
    case "Approved":
    case "approved":
      return Approved
    
    case "Success":
    case "success":
      return Approved

    case "completed":
      return Completed

    case "Pending":
    case "pending":
      return Pending

    case "in-review":
      return In_Review

    case "rejected":
      return Rejected

    case "blocked":
      return Blocked

    default:
      return <Label text={type} dotColor="#6B7280" />
  }
}

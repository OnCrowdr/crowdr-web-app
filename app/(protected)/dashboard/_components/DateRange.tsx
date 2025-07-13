import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import moment from "moment"
import flatpickr from "flatpickr"
import { Button, GrayButton } from "../../../../components/Button"

import { RFC } from "@/types"
import { Instance as Flatpickr } from "flatpickr/dist/types/instance"
import "flatpickr/dist/flatpickr.min.css"

// TODO: ENSURE MORE CONSISTENCY WITH PICKER BEHAVIOUR
const DateRange: RFC<DateRangeProps> = ({ onChange }) => {
  const [selectedRange, setSelectedRange] = useState<IRangeLabel>()
  const [range, setRange] = useState<Date[]>()
  const flatpickrInstance = useRef<Flatpickr>(undefined)
  const customButtonRef = useRef(null)
  const buttonClasses =
    "px-4 py-[10px] text-sm font-medium text-[#1D2939] border border-[#D0D5DD]"

  useEffect(() => {
    if (customButtonRef.current) {
      flatpickrInstance.current = flatpickr(customButtonRef.current, {
        mode: "range",
        wrap: true,
        static: true,
        closeOnSelect: false,
        maxDate: "today",
        onChange: (selectedDates, dateStr, instance) => {
          if (selectedDates.length === 2) {
            setRange(selectedDates)
          } else if (selectedDates.length === 0) {
            setRange(undefined)
            onChange(null)
            setSelectedRange(undefined)
            instance.close()
          }
        },
        onClose: () => {
          setRange(undefined)
        },
      })
    }
  }, [])

  const handleRangeSelect = (dateRange: IRangeOption) => {
    if (selectedRange === dateRange.label) {
      setSelectedRange(undefined)
      onChange(null)
    } else {
      setRange(undefined)
      setSelectedRange(dateRange.label)
      onChange([dateRange.startTime().format(ISO_Format), moment().format(ISO_Format)])
    }
  }

  return (
    <div className="inline-flex rounded-md" role="group">
      <div ref={customButtonRef}>
        <button
          type="button"
          data-toggle
          className={
            buttonClasses +
            " rounded-l-lg relative z-10" +
            (selectedRange === "Custom"
              ? " bg-gray-100"
              : " bg-white hover:bg-[#F9FAFB]")
          }
        >
          Custom
        </button>
        <input hidden data-input />
        {flatpickrInstance.current &&
          createPortal(
            <div className="flex justify-center gap-3 py-2">
              <GrayButton
                text="Clear"
                onClick={() => flatpickrInstance.current?.clear(true)}
                className="!h-9"
              />
              <Button
                text="Apply"
                bgColor="#569ff7"
                onClick={() => {
                  if (range) {
                    setSelectedRange("Custom")
                    onChange([moment(range[0]).format(ISO_Format), moment(range[1]).endOf("day").format(ISO_Format)])
                    flatpickrInstance.current?.close()
                  }
                }}
                className="!h-9"
              />
            </div>,
            flatpickrInstance.current.calendarContainer
          )}
      </div>

      {rangeOptions.map((rangeOption, index) => {
        const isLastItem = index + 1 === rangeOptions.length
        let buttonStyle = buttonClasses + " border-l-0"
        if (isLastItem) buttonStyle += " rounded-r-lg"
        if (selectedRange === rangeOption.label) buttonStyle += " bg-gray-100"
        else buttonStyle += " bg-white hover:bg-[#F9FAFB]"

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleRangeSelect(rangeOption)}
            className={buttonStyle}
          >
            {rangeOption.label}
          </button>
        )
      })}
    </div>
  )
}

export default DateRange

type DateRangeProps = {
  onChange: (dateRange: IDateRange | null) => void
}

export type IDateRange = [string, string] | null
type IRangeLabel = "Custom" | (typeof rangeOptions)[number]["label"]
type IRangeOption = (typeof rangeOptions)[number]

function timeAgo(amount: number, unit: moment.unitOfTime.DurationConstructor) {
  return () => moment().subtract(amount, unit)
}

const rangeOptions = [
  {
    label: "7 days",
    startTime: timeAgo(7, "days"),
  },
  {
    label: "24 hours",
    startTime: timeAgo(24, "hours"),
  },
] as const

const ISO_Format = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
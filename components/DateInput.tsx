/* eslint-disable */
import { useEffect, useRef } from "react"
// TODO: POSSIBLY SWITCH TO react-flatpickr
import flatpickr from "flatpickr"
import {
  useFormContext,
  FieldError,
  UseFormRegisterReturn,
  RegisterOptions,
} from "react-hook-form"

import { RFC } from "@/types"
import { Instance as Flatpickr } from "flatpickr/dist/types/instance"
import "flatpickr/dist/flatpickr.min.css"
import { Options } from "flatpickr/dist/types/options"
import _ from "lodash"

// TODO: INTERNATIONALIZE DATE VALUES; CONVERT TO AND FROM UTC WHEN SENDING AND RECEIVING DATE TO AND FROM SERVER
// TODO: MAKE DATE PICKER LOOK LIKE FIGMA UI
const DateInput: RFC<DateInputProps> = ({
  config,
  label,
  error,
  placeholder,
  showOptionalLabel,
  mode = "single",
  dateFormat = "M j, Y",
  enableTime,
  minDate,
  value,
  onChange,
  name,
  controlled,
  rules,
  datepickerOptions,
  classNames = {},
}) => {
  if (!controlled && !config && name) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      register,
      formState: { errors },
      setValue,
      getValues,
      setError,
    } = useFormContext()
    config = register(name, rules)
    error = _.get(errors, name) as FieldError
  }

  if (config) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var { setValue, getValues, setError } = useFormContext()
    var dateRange = getValues(config.name)
  } else {
    var dateRange = value as any
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const flatpickrInstance = useRef<Flatpickr>(undefined)

  useEffect(() => {
    if (inputRef.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        mode,
        dateFormat,
        enableTime,
        minDate,
        static: true,
        locale: {
          rangeSeparator: " — ",
        },
        defaultDate: dateRange,
        onChange: (selectedDates, dateStr, instance) => {
          instance.input.focus() // Keep focus on input element
          if (config) {
            if (dateStr) {
              if (mode === "range" && selectedDates.length < 2) {
                setValue(config.name, null)
                setError(config.name, { type: "required" })
              } else {
                setValue(config.name, selectedDates)
              }
            } else {
              setValue(config.name, null)
              setError(config.name, { type: "required" })
            }
            config.onChange({ target: inputRef.current })
          }

          if (onChange) {
            onChange({ value: selectedDates, dateString: dateStr, instance })
          }
        },
        ...datepickerOptions,
      })
    }
  }, [])

  useEffect(() => {
    if (!inputRef.current?.value && dateRange && flatpickrInstance.current) {
      flatpickrInstance.current.setDate(dateRange, true)
    }
  }, [dateRange])

  return (
    <span className={classNames.root}>
      {label && (
        <label
          htmlFor={config?.name || name}
          className="text-[14px] text-[#344054] mb-[6px]"
        >
          {label}{" "}
          {showOptionalLabel && (
            <span className="opacity-[0.44]">(Optional)</span>
          )}
        </label>
      )}
      <input
        {...config}
        type="text"
        ref={inputRef}
        id={config?.name || name}
        placeholder={placeholder}
        style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
        className="relative text-[13px] rounded-lg border border-[#D0D5DD] w-full py-[10px] px-[14px]"
      />
      {error && (
        <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
          {error?.message}
        </span>
      )}
    </span>
  )
}

export default DateInput

interface DateInputProps {
  config?: UseFormRegisterReturn
  label?: string
  error?: FieldError
  placeholder?: string
  showOptionalLabel?: boolean
  mode?: "single" | "multiple" | "range" | "time"
  minDate?: string | Date
  dateFormat?: string
  enableTime?: boolean
  value?: IDate | null | undefined
  onChange?: (event: DateChangeEvent) => void
  name?: string
  rules?: RegisterOptions
  controlled?: boolean
  datepickerOptions?: Options
  classNames?: Partial<{
    root: string
  }>
}

type DateChangeEvent = {
  value: IDate | null | undefined
  dateString: string
  instance: Flatpickr
}

type IDate = Array<Date | string>

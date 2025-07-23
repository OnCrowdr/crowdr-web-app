import Select, { SingleValue } from "react-select"
import {
  RegisterOptions,
  useFormContext,
  FieldError,
  Controller,
} from "react-hook-form"
import { RFC } from "@/types"
import _ from "lodash"

const SelectInput: RFC<SelectInputProps> = ({
  options,
  name,
  label,
  error,
  ariaLabelledBy,
  showOptionalLabel,
  ariaLabel,
  value,
  rules,
  onChange,
  controlled,
  isClearable,
  isSearchable,
  disabled,
  styles,
}) => {
  let control
  if (!controlled && name) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const formContext = useFormContext()
    const {
      control: control_,
      formState: { errors },
    } = formContext
    control = control_
    error = _.get(errors, name) as FieldError
  }

  const props = {
    id: name,
    options: options,
    defaultValue: options[0],
    isClearable: Boolean(isClearable),
    isSearchable: Boolean(isSearchable),
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    styles: {
      control: (baseStyles: any, state: any) => ({
        ...baseStyles,
        fontSize: 14,
        borderRadius: 8,
        borderColor: "#D0D5DD",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        padding: 4,
      }),
    },
  }

  return (
    <span className={styles?.wrapper}>
      {label && (
        <label htmlFor={name} className="text-[14px] text-[#344054] mb-[6px]">
          {label}{" "}
          {showOptionalLabel && (
            <span className="opacity-[0.44]">(Optional)</span>
          )}
        </label>
      )}
      {!controlled ? (
        <Controller
          name={name || ""}
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <Select
              {...props}
              isDisabled={disabled}
              value={options.find((g) => g.value === value)}
              onChange={(g: any) => onChange(g?.value)}
            />
          )}
        />
      ) : (
        <Select
          {...props}
          isDisabled={disabled}
          value={options.find((g) => g.value === value)}
          onChange={(g: any) => {
            if (onChange) {
              onChange(g)
            }
          }}
        />
      )}
      {error && (
        <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
          {error.message}
        </span>
      )}
    </span>
  )
}

export default SelectInput

type SelectInputProps = {
  options: readonly Option[]
  name?: string
  label?: string
  error?: FieldError
  placeholder?: string
  showOptionalLabel?: boolean
  ariaLabelledBy?: string
  ariaLabel?: string
  value?: string
  rules?: RegisterOptions
  onChange?: (e: SingleValue<Option>) => void
  controlled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  disabled?: boolean
  styles?: {
    wrapper?: string
  }
}

interface Option {
  value: string
  label: string
}

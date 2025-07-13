import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { FieldError, RegisterOptions, UseFormRegisterReturn } from "react-hook-form"
import { RFC } from "@/types"
import { LuEye, LuEyeOff } from "react-icons/lu"

const PasswordInput: RFC<PasswordInputProps> = ({
  config,
  label,
  error,
  placeholder,
  optional,
  ariaLabelledBy,
  onChange,
  id,
  styles,
  value,
  name,
  rules,
  controlled,
  ariaLabel,
}) => {
  if (!controlled && !config && name) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {register, formState: {errors}} = useFormContext()
    config = register(name, rules)
    error = errors[name] as FieldError
  }
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (config) {
      config.onChange(e)
    }

    if (onChange) {
      onChange(e)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <span className={styles?.wrapper}>
      {label && (
        <label
          htmlFor={id || config?.name}
          className="text-[14px] text-[#344054] mb-[6px]"
        >
          {label}{" "}
          {optional && <span className="opacity-[0.44]">(Optional)</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...config}
          id={id || config?.name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={
            "text-[13px] rounded-lg border border-[#D0D5DD] w-full py-[10px] pl-[14px] pr-10 " +
            styles?.input
          }
        />
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? (
            <LuEyeOff size="1.25rem" title="Hide password" />
          ) : (
            <LuEye size="1.25rem" title="Show password" />
          )}
        </span>
      </div>
      {error && (
        <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
          {error?.message}
        </span>
      )}
    </span>
  )
}

export default PasswordInput

type PasswordInputProps = {
  config?: UseFormRegisterReturn
  label?: string
  error?: FieldError
  placeholder?: string
  optional?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  name?: string
  rules?: RegisterOptions
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  controlled?: boolean
  styles?: {
    wrapper?: string
    input?: string
  }
}

/* eslint-disable */
import { RFC } from "@/types"
import _ from "lodash"
import { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react"
import CurrencyInput from "react-currency-input-field"
import {
  useFormContext,
  FieldError,
  UseFormRegisterReturn,
  RegisterOptions,
} from "react-hook-form"

const NumberInput: RFC<NumberInputProps> = ({
  config,
  label,
  error,
  placeholder,
  showOptionalLabel,
  prefix = "",
  suffix = "",
  name,
  value,
  onChange,
  rules,
  controlled,
  styles,
  disableGroupSeparators = false,
}) => {
  if (!controlled && !config && name) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {
      register,
      formState: { errors },
    } = useFormContext()
    config = register(name, rules)
    error = _.get(errors, name) as FieldError
  }

  if (config) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var { setValue, trigger, getValues } = useFormContext()
    value = getValues(config.name)
  }

  // const regex = /[^0-9.]/gi
  // const handleInput = (e: InputEvent) => {
  //   const currentInput = config ? getValues(config.name) : value

  //   if (isChangeEvent(e)) {
  //     let value = e.target.value.replace(regex, "")
  //     if (value.endsWith(".")) value += "0"

  //     if (config) {
  //       setValue(config.name, value ? Number(value) : "")
  //       trigger(config.name)
  //     }

  //     if (onChange) {
  //       onChange({ ...e, target: { ...e.target, value } })
  //     }
  //   } else if (isKeyboardEvent(e)) {
  //     if (e.ctrlKey) {
  //     } else if (e.key == ".") {
  //       if (currentInput?.includes(".")) e.preventDefault() // BUG: CAN'T INPUT DECIMALS
  //       else if (currentInput?.length === 0) e.preventDefault()
  //     } else if (e.key.match(/^[^0-9.]$/i)) {
  //       e.preventDefault()
  //     }
  //   } else {
  //     // TODO: HANDLE CASE WITH PASTED TEXT
  //     const pastedText = e.clipboardData.getData("text")
  //     // console.log("Pasted text:", pastedText);
  //   }
  // }

  const nonNumericGlobal = /[^0-9.]/gi
  const nonNumericSingle = /^[^0-9.]$/i

  function handleInput(
    e:
      | ChangeEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | ClipboardEvent<HTMLInputElement>
  ) {
    const inputEl = e.currentTarget // always HTMLInputElement
    const rawValue = inputEl.value

    if (e.type === "change") {
      // --- ChangeEvent branch ---
      const changeEvent = e as ChangeEvent<HTMLInputElement>
      let clean = changeEvent.target.value.replace(nonNumericGlobal, "")

      // FIX: allow leading "." by prefixing zero; ensure trailing "." gets a "0"
      if (clean.startsWith(".")) {
        clean = "0" + clean
      }
      if (clean.endsWith(".")) {
        clean += "0"
      }

      if (config) {
        setValue(config.name, clean ? Number(clean) : "")
        trigger(config.name)
      }
      if (onChange) {
        onChange({ ...changeEvent, target: inputEl, currentTarget: inputEl })
      }
    } else if (e.type === "keydown") {
      // --- KeyboardEvent branch ---
      const keyEvent = e as KeyboardEvent<HTMLInputElement>

      if (keyEvent.ctrlKey) {
        // allow ctrl+X/C/V/etc.
      } else if (keyEvent.key === ".") {
        // only block if there's already a decimal
        if (rawValue.includes(".")) {
          keyEvent.preventDefault()
        }
        // otherwise allow a leading dot—change handler will prefix "0"
      } else if (keyEvent.key.match(nonNumericSingle)) {
        // block any non-digit/non-dot single key
        keyEvent.preventDefault()
      }
    } else if (e.type === "paste") {
      // --- ClipboardEvent branch ---
      const pasteEvent = e as ClipboardEvent<HTMLInputElement>
      pasteEvent.preventDefault()

      // 1) sanitize the pasted string
      let pasted = pasteEvent.clipboardData
        .getData("text")
        .replace(nonNumericGlobal, "")

      // 2) collapse extra dots: keep only the first
      const parts = pasted.split(".")
      if (parts.length > 2) {
        pasted = parts.shift()! + "." + parts.join("")
      }

      // 3) ensure valid leading/trailing dot
      if (pasted.startsWith(".")) pasted = "0" + pasted
      if (pasted.endsWith(".")) pasted += "0"

      // 4) splice into the input at the caret/selection
      const start = inputEl.selectionStart ?? 0
      const end = inputEl.selectionEnd ?? 0
      const before = rawValue.slice(0, start)
      const after = rawValue.slice(end)
      const newValue = before + pasted + after

      inputEl.value = newValue

      if (config) {
        setValue(config.name, newValue ? Number(newValue) : "")
        trigger(config.name)
      }
      if (onChange) {
        // fire a synthetic ChangeEvent with updated target
        const synthetic: ChangeEvent<HTMLInputElement> = {
          ...pasteEvent,
          target: inputEl,
          currentTarget: inputEl,
        } as any
        onChange(synthetic)
      }
    }
  }

  const isChangeEvent = (
    e: InputEvent
  ): e is React.ChangeEvent<HTMLInputElement> => {
    if (e.type == "change") return true
    else return false
  }

  const isKeyboardEvent = (e: InputEvent): e is React.KeyboardEvent => {
    if (e.type.startsWith("key")) return true
    else return false
  }

  return (
    <span className={styles?.wrapper}>
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
      <CurrencyInput
        placeholder={placeholder}
        decimalsLimit={2}
        onChange={handleInput}
        onKeyDown={handleInput}
        onPaste={handleInput}
        prefix={prefix}
        disableGroupSeparators={disableGroupSeparators}
        value={value}
        style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
        className="text-[13px] rounded-lg border border-[#D0D5DD] w-full py-[10px] px-[14px]"
      />
      <input
        {...config}
        type="number"
        id={config?.name || name}
        value={value}
        className="hidden"
      />
      {error && (
        <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
          {error.message}
        </span>
      )}
    </span>
  )
}

export default NumberInput

type NumberInputProps = {
  config?: UseFormRegisterReturn
  label?: string
  error?: FieldError
  placeholder?: string
  prefix?: string
  suffix?: string
  disableGroupSeparators?: boolean
  showOptionalLabel?: boolean
  name?: string
  value?: number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  rules?: RegisterOptions
  controlled?: boolean
  styles?: {
    wrapper?: string
    input?: string
  }
}

type InputEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.KeyboardEvent
  | React.ClipboardEvent

import Image from 'next/image'
import { RFC } from '@/types'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'
import CurrencyInput from 'react-currency-input-field'

type InputProps = {
  label: string
  placeholder?: string
  name: string
  id?: string
  value?: string | number
  type?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  info?: string
  formattedValue?: string
  // Number formatting props
  isNumberInput?: boolean
  prefix?: string
  suffix?: string
  decimalsLimit?: number
  disableGroupSeparators?: boolean
  error?: string
}

const Input: RFC<InputProps> = props => {
  const { 
    label, 
    placeholder, 
    name, 
    id, 
    value, 
    onChange, 
    type, 
    info, 
    formattedValue,
    isNumberInput = false,
    prefix = "",
    suffix = "",
    decimalsLimit = 2,
    disableGroupSeparators = false,
    error
  } = props

  // Handle CurrencyInput value changes
  const handleCurrencyChange = (value: string | undefined, name?: string) => {
    if (onChange) {
      // Create a synthetic event that matches the expected signature
      const syntheticEvent = {
        target: {
          name: name || props.name,
          value: value || ''
        },
        currentTarget: {
          name: name || props.name,
          value: value || ''
        }
      } as React.ChangeEvent<HTMLInputElement>
      
      onChange(syntheticEvent)
    }
  }

  // Render number input with CurrencyInput
  if (isNumberInput) {
    return (
      <div className='flex flex-col mb-[14px]'>
        <label htmlFor={id || name} className='text-[14px] text-[#344054] mb-[6px] flex flex-row items-center gap-1'>
          {label}
          {formattedValue && (
            <span className='text-[#344054] text-[14px] font-bold'>{" - "} {formattedValue}</span>
          )}
          {info && (
            <div className="w-fit">
              <a data-tooltip-id={`tooltip-${name}`} data-tooltip-content={info} className="tooltip-anchor">
                <Image src={'/svg/info.svg'} height={15} width={15} alt="info" />
              </a>
              <Tooltip id={`tooltip-${name}`} className="tooltip-anchor" />
            </div>
          )}
        </label>
        
        <CurrencyInput
          id={id || name}
          name={name}
          placeholder={placeholder}
          decimalsLimit={decimalsLimit}
          onValueChange={handleCurrencyChange}
          prefix={prefix}
          suffix={suffix}
          disableGroupSeparators={disableGroupSeparators}
          value={value}
          style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
          className="text-[15px] rounded-lg border border-[#D0D5DD] w-full py-[10px] px-[14px]"
        />
        
        {error && (
          <span className="text-[13px] text-red-500 mt-[6px]">
            {error}
          </span>
        )}
      </div>
    )
  }

  // Render regular input
  return (
    <div className='flex flex-col mb-[14px]'>
      <label htmlFor={id || name} className='text-[14px] text-[#344054] mb-[6px] flex flex-row items-center gap-1'>
        {label}
        {formattedValue && (
          <span className='text-[#344054] text-[14px] font-bold'>{" - "} {formattedValue}</span>
        )}
        {info && (
          <div className="w-fit">
            <a data-tooltip-id={`tooltip-${name}`} data-tooltip-content={info} className="tooltip-anchor">
              <Image src={'/svg/info.svg'} height={15} width={15} alt="info" />
            </a>
            <Tooltip id={`tooltip-${name}`} className="tooltip-anchor" />
          </div>
        )}
      </label>

      <input
        type={type ? type : "text"}
        value={value}
        id={id || name}
        placeholder={placeholder}
        name={name}
        className='text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]'
        onChange={onChange}
      />
      
      {error && (
        <span className="text-[13px] text-red-500 mt-[6px]">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
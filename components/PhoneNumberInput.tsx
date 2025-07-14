import 'react-phone-number-input/style.css'
import Image from 'next/image'
import { RFC } from '@/types'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import PhoneInput from 'react-phone-number-input'
import { useFormContext } from 'react-hook-form'

type PhoneInputProps = {
  label: string
  placeholder?: string
  name: string
  id?: string
  value: string
  onChange: (value: string) => void
  info?: string
  required?: boolean
  formattedValue?: string
  error?: string
}

const PhoneNumberInput: RFC<PhoneInputProps> = props => {
  const { 
    label, 
    placeholder, 
    name, 
    id, 
    value, 
    onChange, 
    info, 
    required = false,
    formattedValue,
    error
  } = props

  // Handle the phone input change correctly
  const handlePhoneChange = (value: string | undefined) => {
    // Convert the value to string or empty string if undefined
    onChange(value || '');
  };

  return (
    <div className='flex flex-col mb-[14px]'>
      <label htmlFor={id} className='text-[14px] text-[#344054] mb-[6px] flex flex-row items-center gap-1'>
        {label}
      </label>

      <PhoneInput
        international
        defaultCountry="NG" // Nigeria as default country
        value={value}
        countryCallingCodeEditable={false}
        countrySelectProps={{
          disabled: true, // Disable the country selector dropdown
        }}
        onChange={handlePhoneChange}
        placeholder={placeholder || "Enter phone number"}
        name={name}
        id={id}
        className='text-[15px] rounded-lg border border-[#D0D5DD] pl-2'
      />
      
      {error && (
        <p className="mt-1 text-[13px] text-[#667085] opacity-[0.67]">
          {error}
        </p>
      )}
    </div>
  )
}

export default PhoneNumberInput
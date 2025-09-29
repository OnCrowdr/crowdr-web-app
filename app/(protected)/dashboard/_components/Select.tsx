import Image from "next/image";
import { RFC } from "@/types";

type SelectProps = {
  label: string;
  name: string;
  id?: string;
  options: any[];
  value?: string;
  onChange?: any;
  error?: string;
};

const Select: RFC<SelectProps> = (props) => {
  const { label, name, id, options, value, onChange, error } = props;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(e);
  };

  return (
    <div className="flex flex-col mb-[14px]">
      <label htmlFor={id} className="text-[14px] text-[#344054] mb-[6px]">
        {label}
      </label>
      <select
        name={name}
        id={id}
        className={`text-[15px] rounded-lg border py-[10px] px-[14px] ${
          error ? "border-red-500" : "border-[#D0D5DD]"
        }`}
        value={value}
        onChange={handleChange}>
        <option value="" selected>
          Select an option
        </option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-[13px] text-red-500 mt-[6px]">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;

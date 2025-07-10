import Image from "next/image";
import { RFC } from "../../../common/types";

type SelectProps = {
  label: string;
  name: string;
  id?: string;
  options: any[];
  value?: string;
  onChange?: any;
};

const Select: RFC<SelectProps> = (props) => {
  const { label, name, id, options, value, onChange } = props;

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
        className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
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
    </div>
  );
};

export default Select;

import Image from "next/image";
import { RFC } from "@/types";
import { ChangeEvent } from "react";
import { ReactNode } from "react";


type CheckboxProps = {
    label: string | ReactNode
    id?: string
    onChange: (checked: boolean) => void;
    checked: boolean;
}


const Checkbox: RFC<CheckboxProps> = (props) => {
    const { label, id, onChange, checked } = props

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
      };

    return (

        <div className="flex flex-row mb-[14px] items-baseline gap-[12px]">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={handleCheckboxChange}
            />
            <label
                htmlFor={id}
                className="text-sm text-[#667085]"
            >
                {label}
            </label>

        </div>
    );
};

export default Checkbox;


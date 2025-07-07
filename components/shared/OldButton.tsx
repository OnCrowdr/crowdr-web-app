import React, { MouseEvent } from "react";
import { CgSpinner } from "react-icons/cg";

interface Props {
  isValid?: boolean;
  isSubmitting?: boolean;
  text?: string;
  type?: "submit" | "button" | "reset";
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function OldButton({
  isValid = true,
  isSubmitting,
  text,
  type = "submit",
  className,
  onClick,
}: Props) {
  const baseClassName = `flex items-center justify-center bg-[#068645] cursor-pointer text-white text-[14px] md:text-base font-[400] md:font-[500] leading-[24px] rounded-[10px] w-full py-[12px] px-[20px] `;

  // Combine the base class name with the additional class name if provided
  const combinedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type,
    disabled: !isValid || isSubmitting,
    className: `${
      isValid && !isSubmitting ? "opacity-100" : "opacity-50"
    } ${combinedClassName}`,
  };

  // Conditionally add an onClick handler for type "button"
  if (type === "button" && onClick) {
    buttonProps.onClick = onClick;
  }

  return (
    <button {...buttonProps}>
      {text}{" "}
      {isSubmitting && (
        <span>
          <CgSpinner
            size="1.5rem"
            className="animate-spin icon opacity-100 ml-2.5"
          />
        </span>
      )}
    </button>
  );
}

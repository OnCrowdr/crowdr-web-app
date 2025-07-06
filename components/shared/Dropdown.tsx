import { RFC } from "@/types";

const Dropdown: RFC<DropdownProps> = ({ id, children, ariaLabel }) => {
  return (
    <div
      id={id}
      tabIndex={-1}
      aria-hidden="true"
      aria-label={ariaLabel}
      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
    >
      {children}
    </div>
  );
};

export default Dropdown;

type DropdownProps = {
  id: string;
  children: React.ReactNode;
  ariaLabel?: string
};

import { RFC } from "@/types";

const Icon: RFC<IconProps> = ({ name, className = '' }) => {
  return <i className={`ci-${name} ` +  className}></i>;
};

export default Icon;

type IconProps = {
  name: string;
  className?: string
};

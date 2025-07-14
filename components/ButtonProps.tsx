interface ButtonProps {
  text: string;
  bgColor: string;
  width: string;
  color: string;
  border: string;
}

export const Buttonprops: React.FC<ButtonProps> = ({
  text,
  bgColor,
  width,
  color,
  border,
}) => {
  const buttonClasses = `h-[35px] rounded-lg px-4 ${bgColor} ${width} ${color} ${border}`;
  return <button className={buttonClasses}>{text}</button>;
};

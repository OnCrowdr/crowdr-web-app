import { RFC } from "@/types";

const ProgressBar: RFC<ProgressBarProps> = ({ percent, bgColor ="#00B964", showValue }) => {
  return (
    <div className="flex items-center">
      <div className="grow bg-[#EBECEC] rounded-full h-2">
        <div
          style={{ width: `${percent <= 100 ? percent : 100}%`, background: bgColor }}
          className="bg-primary h-full rounded-full transition"
        ></div>
      </div>
      {showValue && <p className="text-[#344054] text-[14px] ml-3">{percent.toFixed(0)}%</p>}
    </div>
  );
};

export default ProgressBar;

type ProgressBarProps = {
  percent: number;
  bgColor?: string;
  showValue?: boolean
};
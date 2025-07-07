import Image from 'next/image';
import {FaArrowUp, FaArrowDown} from 'react-icons/fa6'
import BgPattern from "@/public/assets/stat-card-pattern.png"

import { RFC } from "@/types";

const StatCard: RFC<StatCardProps> = ({title, text, percentage, changeType = 'rise', time, pattern, colorScheme = 'dark', iconUrl, detail}) => {
  const backgroundColor = colorScheme == 'dark' ? '#00B964' : '#F8F8F8'
  const backgroundImage = "url('assets/stat-card-pattern.png')"
  const changeColor = colorScheme == 'dark' ? 'white' : (changeType == 'rise' ? '#00B964' : '#F36960')
  const titleColor = colorScheme == 'dark' ? 'white' : '#292A2E'
  const textColor = colorScheme == 'dark' ? 'white' : '#0C0C0C'

  return (
    <div style={{backgroundColor}} className="relative flex flex-col justify-center gap-2 rounded-[5px] h-[127px] py-[22.5px] px-[21px]">
      {pattern && <div style={{backgroundImage}} className="absolute opacity-[0.06] bg-blend-multiply inset-0" />}
      <p style={{color: titleColor}} className="text-sm z-10">{title}</p>
      <p style={{color: textColor}} className={(iconUrl ? "" : "text-2xl") + " flex items-center z-10"}>{iconUrl && <Image src={iconUrl} width={30} height={30} alt='icon' />} {text}</p>
      {percentage && <div className="flex items-center z-10">
        <p className="flex items-center mr-[10px]">
          {changeType == 'rise' && <FaArrowUp style={{fill: changeColor}} className="text-[1.05rem] mr-1" />}
          {changeType == 'fall' && <FaArrowDown style={{fill: changeColor}} className="text-[1.05rem] mr-1" />}
          <span style={{color: changeColor}}>{percentage}%</span>
        </p>
        <p className={colorScheme == 'dark' ? "text-white" : 'text-[#5C636E]'}>vs {time}</p>
      </div>}
      {detail && <p className="text-xs text-[#667085] z-10">{detail}</p>}
    </div>
  );
};

export default StatCard;

type StatCardProps = {
  title: string;
  text: string | number;
  percentage?: number;
  changeType?: "rise" | "fall";
  time?: string;
  pattern?: boolean
  colorScheme?: 'light' | 'dark'
  iconUrl?: string
  detail?: string | React.ReactNode
};

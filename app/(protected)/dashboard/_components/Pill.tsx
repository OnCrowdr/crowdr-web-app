import Image from "next/image";

import { RFC } from "@/types";
import { cn } from "@/lib/utils";

const Pill: RFC<PillProps> = ({text, textColor, bgColor, icon, className}) => {
  const pillStyle: React.CSSProperties = {
    color: textColor,
    background: bgColor,
  }

  const textStyle: React.CSSProperties = {
    color: textColor
  }
  
  return (
    <div style={pillStyle} className={cn("inline-flex shrink-0 self-start items-center rounded-full px-[21px] py-[8px]", className)}>
      {icon && <Image src={`/svg/emoji/${icon}.svg`} alt={icon} width={15} height={15} className="mr-[5px]" />}
      <span style={textStyle} className="text-sm">{text}</span>
    </div>
  );
}

export default Pill;

type PillProps = {
  text: string
  icon?: string
  textColor: string
  bgColor: string
  className?: string
}

const Education = <Pill text="Education" icon="books" textColor="#0B5351" bgColor="#FEF8E4" />
const Business = <Pill text="Business" icon="toolbox" textColor="#101E51" bgColor="#E5EDFF" />
const Arts = <Pill text="Arts" icon="artist-palette" textColor="#4C160F" bgColor="#FFE7E3" />
const Events = <Pill text="Events" icon="artist-palette" textColor="#4C160F" bgColor="#FFE7E3" />
const Sports = <Pill text="Sports" icon="man-swimming-light-skin-tone" textColor="#874100" bgColor="#FFF1E4" />
const Politics = <Pill text="Politics" icon="balance-scale" textColor="#4C0E3E" bgColor="#FEE4FB" />
const Climate = <Pill text="Climate" icon="books" textColor="#076C11" bgColor="#E3FFE6" />
const Technology = <Pill text="Technology" icon="desktop-computer" textColor="#085D70" bgColor="#DEFAFF" />
const Personal = <Pill text="Personal" icon="books" textColor="#960966" bgColor="#FFEBF2" />
const Startup = <Pill text="Startup" icon="office-building" textColor="#606E09" bgColor="#FBFFE2" />
const Family = <Pill text="Family" icon="family-man-woman-girl-boy" textColor="#4C160F" bgColor="#FFE7E3" />
const Health = <Pill text="Health" icon="syringe" textColor="#085D70" bgColor="#DEFAFF" />
const Legal = <Pill text="Legal" icon="balance-scale" textColor="#085D70" bgColor="#DEFAFF" />
const Others = <Pill text="Others" icon="books" textColor="#0C0C0CA8" bgColor="#F5F5F5" />

export const pill = (type: string) => {
  switch (type) {
    case 'education':
      return Education
      
    case 'business':
      return Business
      
    case 'arts':
      return Arts
      
    case 'events':
      return Events

    case 'family':
      return Family
      
    case 'sport':
      return Sports
      
    case 'politics':
      return Politics
      
    case 'climate':
      return Climate
      
    case 'tech':
      return Technology
      
    case 'personal':
      return Personal
      
    case 'startup':
      return Startup

    case 'health':
      return Health

    case 'legal':
      return Legal
  
    default:
      return Others
  }
}
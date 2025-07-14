import { RFC } from "@/types";
import Image from "next/image";
import FilterIcon from "@/public/svg/filters.svg";

type FilterProps = {
  query?: string;
};

const Filter: RFC<FilterProps> = (props) => {
  const { query } = props;

  return (
    <div className="flex flex-row items-center gap-[8px] px-[16px] py-[10px] rounded-lg border-[0.4px] border-[#D0D5DD]">
      <Image src={FilterIcon} alt="filter-icon" width="20" height="20" />
      <span className="text-[13px] text-[#344054] ">{query}</span>
    </div>
  );
};

export default Filter;

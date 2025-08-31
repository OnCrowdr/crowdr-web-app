import { CampaignType } from "@/api/_campaigns/models/GetCampaigns";
import Label from "./Label";
import { RFC } from "@/types";
import { ReactElement, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const Detail: RFC<DetailProps> = ({
  title,
  detail,
  date,
  status,
  label,
  button,
  campaignType,
  withdrawnAmount,
  availableAmount,
  totalDonated
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-[#DDD] mb-5">
      <div 
        className="block pb-6 cursor-pointer"
        onClick={toggleAccordion}
      >
        <div className={`flex items-center ${isOpen ? 'items-end' : ''} justify-between ${isOpen ? 'mb-4' : ''}`}>
          <div className="flex flex-col gap-2">
            {label && (
              <p className={`${isOpen ? 'block' : 'hidden'} text-xs text-[#667085] mb-[9px]`}>
                {label}
              </p>
            )}
            <p className="text-[#667085]">{title}</p>
            <p className={`${isOpen ? 'hidden' : 'block'} text-[#555] text-sm`}>{detail}</p>
          </div>
          <FaChevronDown className={`${isOpen ? 'hidden' : 'block'}`} />
          <FaChevronUp className={`${isOpen ? 'block' : 'hidden'}`} />
        </div>

        {isOpen && (
          <div className="flex justify-between">
            {campaignType === "volunteer" && (
              <div className="flex flex-col gap-2">
                <p className="text-[#555]">Gender: {detail}</p>
                <p className="text-[#555]">Status: {status}</p>
                <p className="text-sm text-[#667085]">{date}</p>
              </div>
            )}

            {campaignType !== "volunteer" && !withdrawnAmount && (
              <div className="flex flex-col gap-2">
                <p className="text-[#555]">Amount: {detail}</p>
              </div>
            )}

            {withdrawnAmount && (
              <div className="flex flex-col gap-2">
                <p className="text-[#555]">Withdrawn Amount: {withdrawnAmount}</p>
                <p className="text-[#555]">Available Amount: {availableAmount}</p>
                <p className="text-[#555]">Total Donated: {totalDonated}</p>
                <p className="text-sm text-[#667085]">{date}</p>
                {status && (
                  /approved/i.test(status) ? (
                    <Label text={status} />
                  ) : (
                    <Label text={status} textColor="#B42318" bgColor="#FEF3F2" />
                  )
                )}
              </div>
            )}

            {campaignType === "volunteer" &&
              status &&
              !button &&
              (/success/i.test(status) ? (
                <Label text={status} />
              ) : (
                <Label text={status} textColor="#B42318" bgColor="#FEF3F2" />
              ))}

            {button}
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;

type DetailProps = {
  title: string;
  detail: string;
  date: string;
  status?: string;
  label?: string;
  button?: ReactElement<any>;
  campaignType?: CampaignType;
  withdrawnAmount?: string;
  availableAmount?: string;
  totalDonated?: string;
};

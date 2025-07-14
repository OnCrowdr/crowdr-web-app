"use client";
import { useState, useRef, useEffect, type JSX } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/Button";
import { IconType } from "react-icons/lib";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiCheck } from "react-icons/fi";
import { useUser } from "../../../../contexts/UserProvider";
import { useAuth } from "@/contexts/AppProvider";

interface CampaignOption {
  id: string;
  label: string;
  url: string;
}

const CreateCampaignDropdown = (): JSX.Element => {
  const {user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const userType = user?.userType || "individual"; 

  const campaignOptions: CampaignOption[] = [
    {
      id: "fundraising",
      label: "Fundraising Campaign",
      url: "/dashboard/campaigns/create-or-edit-campaign?type=fundraise"
    },
    {
      id: "volunteer",
      label: "Volunteer Campaign",
      url: "/dashboard/campaigns/create-or-edit-campaign?type=volunteer"
    },
    {
      id: "both",
      label: "Both Campaigns",
      url: "/dashboard/campaigns/create-or-edit-campaign?type=fundraiseAndVolunteer"
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (url: string): void => {
    router.push(url);
    setIsOpen(false);
  };

  // Custom arrow icon that rotates when dropdown is open
  const ArrowIcon: IconType = (props) => (
    <MdKeyboardArrowDown
      {...props}
      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} text-gray-800`}
      style={{ color: "#fff" }}
      stroke="#fff"
      fill="#fff"
    />
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={
          userType === "individual" ? (
            () => router.push("/dashboard/campaigns/create-or-edit-campaign?type=fundraise")
          ) : (
            () => setIsOpen(!isOpen)
          )
        }
        text="Create Campaign"
        icon={userType === "individual" ? undefined : ArrowIcon}
        iconPosition="right"
        className="min-w-44"
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden">
          {campaignOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.url)}
              className="px-5 py-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors">
              <span className="text-gray-800">{option.label}</span>
              {/* {option.id === "volunteer" && (
                <FiCheck className="text-green-500 w-5 h-5" />
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateCampaignDropdown;
import React from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { Mixpanel } from "../../../utils/mixpanel";
import { CampaignDonors } from "@/app/_hooks/useFetchCampaignById";
import HeartHand from "@/public/svg/hand-holding-heart.svg";
import { formatAmount } from "@/app/(protected)/dashboard/_common/utils/currency";

type DonorsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  donors: CampaignDonors[];
  campaignTitle: string;
  campaignId?: string;
  donorCount?: number;
};

const DonorsModal: React.FC<DonorsModalProps> = ({
  isOpen,
  onClose,
  donors,
  campaignTitle,
  donorCount,
  campaignId
}) => {
  if (!isOpen) return null;

  // Sort donors by amount (highest first) - convert string to number for comparison
  const sortedDonors = [...donors].sort((a, b) => {
    const amountA = parseInt(a.amount) || 0;
    const amountB = parseInt(b.amount) || 0;
    return amountB - amountA;
  });

  const handleClose = () => {
    Mixpanel.track("Donors modal closed", {
      campaignId,
      totalDonors: donors.length
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 relative">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Donations ({donorCount})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {donorCount} {donorCount === 1 ? "supporter" : "supporters"}{" "}
              for "{campaignTitle}"
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 absolute top-5 right-2">
            <IoMdClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Donors List */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {sortedDonors.length > 0 ? (
            <div className="p-4 space-y-3">
              {sortedDonors.map((donor, index) => (
                <div
                  key={donor._id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  {/* Donor Avatar */}
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-[#F8F8F8] rounded-full">
                      <Image
                        src={HeartHand}
                        alt="donor"
                        className="bg-F8F8F8"
                      />
                    </div>
                  </div>

                  {/* Donor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {donor.isAnonymous ? "Anonymous" : donor.fullName}
                      </p>
                     
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-1">
                      Donated {formatAmount(parseInt(donor.amount), "naira")} to
                      this campaign
                    </p> */}
                  </div>

                  {/* Donation Amount */}
                  <div className="flex-shrink-0">
                    <p className="text-sm font-semibold text-[#667085]">
                      {formatAmount(parseInt(donor.amount), "naira")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <p className="text-gray-500 text-sm">No donors yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Be the first to support this campaign!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
      </div>
    </div>
  );
};

export default DonorsModal;

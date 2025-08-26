import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useQuery } from "react-query";
import { Mixpanel } from "@/utils/mixpanel";
import { CampaignDonors } from "@/hooks/useFetchCampaignById";
import HeartHand from "@/public/svg/hand-holding-heart.svg";
import { formatAmount } from "@/app/(protected)/dashboard/_common/utils/currency";
import publicCampaigns, { PublicDonation } from "@/services/publicCampaigns";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedDonations, setAccumulatedDonations] = useState<PublicDonation[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Main query for fetching donations
  const {
    data: donationsData,
    isLoading
  } = useQuery({
    queryKey: ["campaign-donations", campaignId, currentPage],
    queryFn: () => 
      campaignId 
        ? publicCampaigns.getCampaignDonations(campaignId, {
            page: currentPage,
            perPage: 20
          })
        : Promise.reject("No campaign ID"),
    enabled: isOpen && !!campaignId,
    keepPreviousData: false, // Don't keep previous data to avoid stale state
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache data between modal opens
    refetchOnWindowFocus: false,
  });

  // Handle data accumulation when new data arrives
  useEffect(() => {
    if (donationsData && isOpen) {
      const newDonations = donationsData.donations || [];
      
      if (currentPage === 1) {
        setAccumulatedDonations(newDonations);
      } else {
        setAccumulatedDonations(prev => [...prev, ...newDonations]);
      }
    }
  }, [donationsData, currentPage, isOpen]);

  // Reset state when modal opens and handle focus
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setAccumulatedDonations([]);
      
      // Focus the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // Reset state when modal closes
      setAccumulatedDonations([]);
      setCurrentPage(1);
    }
  }, [isOpen]);

  const loadMoreDonations = () => {
    if (!isLoading && donationsData?.pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  // Determine which donations to show (accumulated from API or fallback to props)
  const donationsToShow = accumulatedDonations.length > 0 
    ? accumulatedDonations 
    : (isLoading ? [] : donors?.map(donor => ({
        _id: donor._id || `${Date.now()}-${Math.random()}`,
        fullName: donor.fullName,
        amount: donor.amount,
        currency: "NGN",
        isAnonymous: donor.isAnonymous,
        createdAt: new Date().toISOString()
      })) || []);

  // Sort donations by amount (highest first)
  const sortedDonations = [...donationsToShow].sort((a, b) => {
    const amountA = parseInt(a.amount) || 0;
    const amountB = parseInt(b.amount) || 0;
    return amountB - amountA;
  });

  // Calculate total donors
  const totalDonors = donationsData?.pagination?.total || sortedDonations.length || donorCount || 0;

  const handleClose = () => {
    Mixpanel.track("Donors modal closed", {
      campaignId,
      totalDonors: sortedDonations.length
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[450px] flex flex-col overflow-y-scroll focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              Donations ({totalDonors})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalDonors} {totalDonors === 1 ? "supporter" : "supporters"}{" "}
              for "{campaignTitle}"
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <IoMdClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Donors List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && sortedDonations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-2xl">💝</span>
              </div>
              <p className="text-gray-500 text-sm">Loading donations...</p>
            </div>
          ) : sortedDonations?.length > 0 ? (
            <div className="p-4 space-y-3">
              {sortedDonations?.map((donation) => (
                <div
                  key={donation._id}
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
                        {donation.isAnonymous ? "Anonymous" : donation.fullName}
                      </p>
                    </div>
                  </div>

                  {/* Donation Amount */}
                  <div className="flex-shrink-0">
                    <p className="text-sm font-semibold text-[#667085]">
                      {formatAmount(parseInt(donation.amount), "naira")}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {donationsData?.pagination?.hasNextPage && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={loadMoreDonations}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-[#00B964] bg-white border border-[#00B964] rounded-lg hover:bg-[#00B964] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
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

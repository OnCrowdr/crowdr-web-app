import React from "react"
import Image from "next/image"
import { RFC } from "@/types"
import { formatCurrency } from "@/utils/seperateText"
import { IGetCampaignsSummaryResponseData } from "@/api/_campaigns/models/GetCampaignsSummary"

const CampaignProgress: RFC<Props> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#0000001A]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Campaign Progress
      </h2>

      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {/* Total Money Raised */}
        <div className="flex flex-col items-center justify-center pr-4">
          <div className="w-10 h-10 mb-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 10C21.375 10 22.5 8.875 22.5 7.5C22.5 6.125 21.375 5 20 5C18.625 5 17.5 6.125 17.5 7.5C17.5 8.875 18.625 10 20 10Z"
                fill="#D4A700"
              />
              <path
                d="M27.5 17.5C27.5 13.625 24.375 10.5 20.5 10.5H19.5C15.625 10.5 12.5 13.625 12.5 17.5V22.5C12.5 23.375 13.125 24 14 24C14.875 24 15.5 23.375 15.5 22.5V17.5C15.5 15.3 17.3 13.5 19.5 13.5H20.5C22.7 13.5 24.5 15.3 24.5 17.5V22.5C24.5 23.375 25.125 24 26 24C26.875 24 27.5 23.375 27.5 22.5V17.5Z"
                fill="#D4A700"
              />
              <path
                d="M22 27.5H18C16.625 27.5 15.5 28.625 15.5 30V33.75C15.5 34.45 16.05 35 16.75 35H23.25C23.95 35 24.5 34.45 24.5 33.75V30C24.5 28.625 23.375 27.5 22 27.5Z"
                fill="#D4A700"
              />
              <path
                d="M32.5 17.5V20C32.5 20.7 31.95 21.25 31.25 21.25H29.375C28.675 21.25 28.125 20.7 28.125 20V17.5C28.125 16.8 28.675 16.25 29.375 16.25H31.25C31.95 16.25 32.5 16.8 32.5 17.5Z"
                fill="#D4A700"
              />
              <path
                d="M11.875 17.5V20C11.875 20.7 11.325 21.25 10.625 21.25H8.75C8.05 21.25 7.5 20.7 7.5 20V17.5C7.5 16.8 8.05 16.25 8.75 16.25H10.625C11.325 16.25 11.875 16.8 11.875 17.5Z"
                fill="#D4A700"
              />
            </svg>
          </div>
          <div className="text-[#46AF7B] text-2xl font-bold mb-1">
            {/* ₦{stats.totalAmountDonated[0].totalAmount} */}
            {formatCurrency(stats.totalAmountDonated[0].totalAmount, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
          </div>
          <div className="text-gray-600 text-sm text-center">
            Total money raised
          </div>
        </div>

        {/* Lives Impacted */}
        <div className="flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 mb-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 13C16.8807 13 18 11.8807 18 10.5C18 9.11929 16.8807 8 15.5 8C14.1193 8 13 9.11929 13 10.5C13 11.8807 14.1193 13 15.5 13Z"
                stroke="#46AF7B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 22C16.8807 22 18 20.8807 18 19.5C18 18.1193 16.8807 17 15.5 17C14.1193 17 13 18.1193 13 19.5C13 20.8807 14.1193 22 15.5 22Z"
                fill="#46AF7B"
              />
              <path
                d="M15.5 31C16.8807 31 18 29.8807 18 28.5C18 27.1193 16.8807 26 15.5 26C14.1193 26 13 27.1193 13 28.5C13 29.8807 14.1193 31 15.5 31Z"
                stroke="#8A939B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.5 13C25.8807 13 27 11.8807 27 10.5C27 9.11929 25.8807 8 24.5 8C23.1193 8 22 9.11929 22 10.5C22 11.8807 23.1193 13 24.5 13Z"
                stroke="#46AF7B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.5 22C25.8807 22 27 20.8807 27 19.5C27 18.1193 25.8807 17 24.5 17C23.1193 17 22 18.1193 22 19.5C22 20.8807 23.1193 22 24.5 22Z"
                fill="#46AF7B"
              />
              <path
                d="M24.5 31C25.8807 31 27 29.8807 27 28.5C27 27.1193 25.8807 26 24.5 26C23.1193 26 22 27.1193 22 28.5C22 29.8807 23.1193 31 24.5 31Z"
                stroke="#8A939B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-[#46AF7B] text-2xl font-bold mb-1">N/A</div>
          <div className="text-gray-600 text-sm text-center">
            Lives Impacted
          </div>
        </div>

        {/* Campaign Count */}
        <div className="flex flex-col justify-center pl-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-[#46AF7B] text-2xl font-bold">
              {stats?.campaignCountByStatus?.active ?? 0}
            </div>
            <div className="text-gray-600">|</div>
            <div className="text-gray-600">
              Active Campaign
              {stats?.campaignCountByStatus?.active !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-[#46AF7B] text-2xl font-bold">
              {stats?.totalNoOfCampaigns}
            </div>
            <div className="text-gray-600">|</div>
            <div className="text-gray-600">Total Campaigns</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignProgress

interface Props {
  stats: IGetCampaignsSummaryResponseData
}

interface CampaignProgressProps {
  stats: {
    totalRaised: number
    totalRaisedFormatted: string
    livesImpacted: number
    activeCampaigns: number
    totalCampaigns: number
    currency: string
  }
}

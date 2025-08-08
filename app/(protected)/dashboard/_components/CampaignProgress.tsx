"use client"
import React from "react"
import Image from "next/image"
import { RFC } from "@/types"
import { formatCurrency } from "@/utils/seperateText"
import { IGetCampaignsSummaryResponseData } from "@/api/_campaigns/models/GetCampaignsSummary"

const CampaignProgress: RFC<Props> = ({ stats, campaignCount }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#0000001A]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Campaign Progress
      </h2>

      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {/* Total Money Raised */}
        <div className="flex flex-col items-center justify-center pr-4">
          <div className="w-10 h-10 mb-2 text-2xl">
            💰
          </div>
          <div className="text-[#46AF7B] text-2xl font-bold mb-1">
            {/* ₦{stats.totalAmountDonated[0].totalAmount} */}
            {formatCurrency(stats.totalAmountDonated[0].totalAmount, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
          </div>
          <div className="text-gray-600 text-sm text-center">
            Total raised funds
          </div>
        </div>

        {/* Lives Impacted */}
        {/* <div className="flex flex-col items-center justify-center px-4">
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
        </div> */}

        {/* Campaign Count */}
        <div className="flex flex-col items-center justify-center pl-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-[#46AF7B] text-2xl font-bold">
              {campaignCount ?? 0}
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
  campaignCount?: number
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

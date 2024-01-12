"use client"
import { useState } from "react"
import { useQuery } from "react-query"
import CampaignCard from "../dashboard-components/CampaignCard"
import { Button, GrayButton, WhiteButton } from "../dashboard-components/Button"
import TextInput from "../dashboard-components/TextInput"
import DateRange from "../dashboard-components/DateRange"
import StatCard from "../dashboard-components/StatCard"
import Pagination from "../dashboard-components/Pagination"
import StatCardSkeleton from "../dashboard-components/skeletons/StatCardSkeleton"
import CampaignCardSkeleton from "../dashboard-components/skeletons/CampaignCardSkeleton"
import { useUser } from "../common/hooks/useUser"
import { formatAmount } from "../common/utils/currency"
import { extractErrorMessage } from "@/utils/extractErrorMessage"
import makeRequest from "@/utils/makeRequest"
import { keys } from "../utils/queryKeys"
import { time } from "../utils/time"

import { Doubt, QF } from "@/app/common/types"
import { CampaignResponse, ICampaignStats } from "@/app/common/types/Campaign"
import { IDateRange } from "../dashboard-components/DateRange"
import { IUser } from "@/app/api/user/getUser"

import { BiSearch } from "react-icons/bi"
import FileDownloadIcon from "../../../../../public/svg/file-download.svg"
import FilterIcon from "../../../../../public/svg/filter.svg"

const Campaigns = () => {
  const [dateRange, setDateRange] = useState<IDateRange>()
  const [page, setPage] = useState(1)
  const [input, setInput] = useState('')
  const user = useUser()


  const { data: stats } = useQuery([keys.myCampaigns.summary, user, dateRange], fetchStats, {
    enabled: Boolean(user),
    // staleTime: time.mins(2),
  })

  const {isPreviousData, data} = useQuery([keys.myCampaigns.campaigns, user, page], fetchCampaigns, {
    enabled: Boolean(user),
    // keepPreviousData: true,
    // staleTime: time.mins(10),
    // refetchOnWindowFocus: false
  })

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-[5px]">
        <h1 className="text-lg md:text-2xl font-semibold text-[#101828] mb-[5px]">
          My Campaigns
        </h1>
        <p className="text-[15px] text-[#667085]">
          Manage campaigns and earnings
        </p>
      </hgroup>

      {/* action buttons */}
      <div className="flex justify-between items-center mb-5 md:mb-10">
        <DateRange onChange={setDateRange} />

        <div className="hidden md:flex">
          <WhiteButton
            text="Export Report"
            iconUrl={FileDownloadIcon}
            shadow
            className="mr-3"
          />
          <Button text="Withdraw Donations" />
        </div>
      </div>

      {/* stats */}
      <div className="grid md:grid-cols-[repeat(3,_minmax(0,_350px))] 2xl:grid-cols-3 gap-4 md:gap-5 mb-[23px] md:mb-[44px]">
        {stats ? (
          <>
            <StatCard
              title="Total Raised"
              text={formatAmount(
                stats.totalAmountDonated[0].totalAmount,
                stats.totalAmountDonated[0].currency,
                { minimumFractionDigits: 2 }
              )}
              percentage={100}
              time="yesterday"
              pattern
            />
            <StatCard
              title="Total Campaigns"
              text={stats.totalNoOfCampaigns}
              percentage={100}
              time="yesterday"
              colorScheme="light"
            />
            <StatCard
              title="Campaign Views"
              text={stats.totalCampaignViews}
              percentage={100}
              time="yesterday"
              colorScheme="light"
            />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        )}
      </div>

      {/* export x withdraw buttons */}
      <div className="flex md:hidden gap-3 mb-[23px] md:mb-[9px]">
        <WhiteButton text="Export Report" iconUrl={FileDownloadIcon} shadow />
        <Button text="Withdraw Donations" />
      </div>

      {/* all campaigns x filters */}
      <h2 className="md:hidden text-lg text-[#292A2E] mb-[9px]">
        All Campaigns
      </h2>
      <div className="flex justify-between items-center mb-6">
        <h2 className="hidden md:block text-xl text-[#292A2E]">
          All Campaigns
        </h2>
        <TextInput
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            console.log(e.target.value)
          }}
          placeholder="Search campaigns"
          icon={BiSearch}
          styles={{
            wrapper: "grow mr-[22px] block md:hidden",
            input: "text-sm",
          }}
        />
        <GrayButton text="Filters" iconUrl={FilterIcon} />
      </div>

      {/* campaigns */}
      <div className="grid md:grid-cols-[repeat(2,_minmax(0,_550px))] 2xl:grid-cols-3 gap-x-[10px] gap-y-3 md:gap-y-[40px] mb-[30px] md:mb-10">
        {data
          ? data.campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
      </div>

      {/* pagination */}
      {data && data.campaigns.length !== 0 && (
        <Pagination
          currentPage={data.pagination.currentPage}
          perPage={data.pagination.perPage}
          total={data.pagination.total}
          onPageChange={setPage}
          className="px-4 py-3 md:p-0"
        />
      )}
    </div>
  )
}

export default Campaigns


const fetchStats: QF<Doubt<ICampaignStats>, [Doubt<IUser>, IDateRange?]> = async ({
  queryKey,
}) => {
  const [_, user, dateRange] = queryKey

  if (user) {
    const query = new URLSearchParams()
    if (dateRange) {
      query.set("startDate", dateRange[0])
      query.set("endDate", dateRange[1])
    }

    const endpoint = `/api/v1/my-campaigns/summary?${query}`
    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": user.token,
    }

    try {
      const { data } = await makeRequest<ICampaignStats>(endpoint, {
        headers,
        method: "GET",
      })

      return data
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

const fetchCampaigns: QF<Doubt<CampaignResponse>, [Doubt<IUser>, number]> = async ({queryKey}) => {
  const [_, user, page] = queryKey
  
  if (user) {
    const query = new URLSearchParams({ page: `${page}`, perPage: "4" })
    const endpoint = `/api/v1/my-campaigns?${query}`
    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": user.token,
    }
  
    try {
      const { data } = await makeRequest<CampaignResponse>(endpoint, {
        headers,
        method: "GET",
      })
  
      return data
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}
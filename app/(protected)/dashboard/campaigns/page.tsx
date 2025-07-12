"use client";
import { useState } from "react";
import { useQuery } from "react-query";
import CampaignCard from "../_components/CampaignCard";
import {
  Button,
  GrayButton,
  WhiteButton
} from "@/components/shared/Button";
import TextInput from "@/components/shared/TextInput";
import DateRange from "../_components/DateRange";
import StatCard from "../_components/StatCard";
import Pagination from "../_components/Pagination";
import StatCardSkeleton from "../_components/skeletons/StatCardSkeleton";
import CampaignCardSkeleton from "../_components/skeletons/CampaignCardSkeleton";
import { useUser } from "@/contexts/UserProvider";
import { formatAmount } from "../_common/utils/currency";
import { extractErrorMessage } from "../../../../utils/extractErrorMessage";
import makeRequest from "../../../../utils/makeRequest";
import { keys } from "../_utils/queryKeys";
import { time } from "../_utils/time";

import { Nullable, QF } from "@/types";
// import { CampaignResponse, ICampaignStats } from "@/app/common/types/Campaign"
import { IDateRange } from "../_components/DateRange";

import { BiSearch } from "react-icons/bi";
import FileDownloadIcon from "@/public/svg/file-download.svg";
import FilterIcon from "@/public/svg/filter.svg";
import { ICampaignStats } from "@/types/UserStats";
import { ICampaignResponse } from "@/types/Campaign";
import { Mixpanel } from "../../../../utils/mixpanel";

const Campaigns = () => {
  const [dateRange, setDateRange] = useState<IDateRange>();
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const user = useUser();

  const { data: stats } = useQuery(
    [keys.myCampaigns.stats, user?.token, dateRange],
    fetchStats,
    {
      enabled: Boolean(user?.token),
      // staleTime: time.mins(2),
      refetchOnWindowFocus: false
    }
  );

  const {
    isPreviousData,
    data,
    refetch: refetchCampaigns
  } = useQuery(
    [keys.myCampaigns.campaigns, user?.token, page],
    fetchCampaigns,
    {
      enabled: Boolean(user?.token),
      // keepPreviousData: true,
      // staleTime: time.mins(10),
      refetchOnWindowFocus: false
    }
  );

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
          {/* <WhiteButton
            text="Export Report"
            iconUrl={FileDownloadIcon}
            shadow
            className="mr-3"
          /> */}
          <Button text="Withdraw Donations" href="/campaigns/withdrawal" />
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
              // percentage={100}
              // time="yesterday"
              pattern
            />
            {/* <StatCard
              title="Withdrawable Amount"
              text={formatAmount(
                stats.totalWithdrawableAmount[0].amount,
                stats.totalWithdrawableAmount[0].currency,
                { minimumFractionDigits: 2 }
              )}
              // percentage={100}
              // time="yesterday"
              // colorScheme="light"
              pattern
            /> */}
            <StatCard
              title="Total Campaigns"
              text={stats.totalNoOfCampaigns}
              // percentage={100}
              // time="yesterday"
              colorScheme="light"
            />
            <StatCard
              title="Campaign Views"
              text={stats.totalCampaignViews}
              // percentage={100}
              // time="yesterday"
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
        <Button text="Withdraw Donations" href="/campaigns/withdrawal" />
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
            setInput(e.target.value);
          }}
          placeholder="Search campaigns"
          icon={BiSearch}
          styles={{
            wrapper: "grow mr-[22px] block md:hidden",
            input: "text-sm"
          }}
        />
        {/* <GrayButton text="Filters" iconUrl={FilterIcon} /> */}
      </div>

      {/* campaigns */}
      <div className="grid md:grid-cols-[repeat(2,_minmax(0,_550px))] 2xl:grid-cols-3 gap-x-[10px] gap-y-3 md:gap-y-[10px] mb-[30px] md:mb-10">
        {data
          ? data.campaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                onDelete={refetchCampaigns}
              />
            ))
          : Array.from({ length: 6 }).map((_, index) => (
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

      {/* no campaigns */}
      {data && data.campaigns.length === 0 && (
        <p className="flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px]">
          No campaigns available at this moment.
        </p>
      )}
    </div>
  );
};

export default Campaigns;

const fetchStats: QF<
  Nullable<ICampaignStats>,
  [Nullable<string>, IDateRange?]
> = async ({ queryKey }) => {
  const [_, token, dateRange] = queryKey;

  if (token) {
    const query = new URLSearchParams();
    if (dateRange) {
      query.set("startDate", dateRange[0]);
      query.set("endDate", dateRange[1]);
    }

    const endpoint = `/my-campaigns/summary?${query}`;
    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token
    };

    try {
      const { data } = await makeRequest<ICampaignStats>(endpoint, {
        headers,
        method: "GET"
      });

      return data;
    } catch (error) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  }
};

const fetchCampaigns: QF<
  Nullable<ICampaignResponse>,
  [Nullable<string>, number]
> = async ({ queryKey }) => {
  const [_, token, page] = queryKey;

  if (token) {
    const query = new URLSearchParams({ page: `${page}`, perPage: "6" });
    const endpoint = `/my-campaigns?${query}`;
    const headers = {
      "x-auth-token": token
    };

    try {
      const { data } = await makeRequest<ICampaignResponse>(endpoint, {
        headers,
        method: "GET"
      });

      return data;
    } catch (error) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  }
};

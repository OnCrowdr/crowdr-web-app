"use client";
import { useState } from "react";
import { useQuery } from "react-query";
import CampaignCard from "../_components/CampaignCard";
import { Button, GrayButton, WhiteButton } from "@/components/Button";
import TextInput from "@/components/TextInput";
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

import { Nullable, QF } from "@/types";
// import { CampaignResponse, ICampaignStats } from "@/app/common/types/Campaign"
import { IDateRange } from "../_components/DateRange";

import { BiSearch } from "react-icons/bi";
import FileDownloadIcon from "@/public/svg/file-download.svg";
import FilterIcon from "@/public/svg/filter.svg";
import { ICampaignStats } from "@/types/UserStats";
import { ICampaignResponse } from "@/types/Campaign";
import { Mixpanel } from "../../../../utils/mixpanel";
import query from "@/api/query";
import _my_campaigns from "@/api/_my_campaigns";
import { useAuthQuery } from "@/hooks/useAuthQuery";

const Campaigns = () => {
  const [dateRange, setDateRange] = useState<IDateRange>();
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [startDate, endDate] = dateRange ?? [];

  const summaryParams = { startDate, endDate };
  const campaignsSummaryQuery = useAuthQuery({
    queryKey: [query.keys.MY_CAMPAIGNS, summaryParams],
    queryFn: () => _my_campaigns.getCampaignsSummary(summaryParams)
  });

  const campaignsQuery = useAuthQuery({
    queryKey: [query.keys.MY_CAMPAIGNS, page],
    queryFn: () => _my_campaigns.getCampaigns({ page })
  });

  const summary = campaignsSummaryQuery.data;
  const campaigns = campaignsQuery.data;

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
      <div className="grid md:grid-cols-[repeat(4,_minmax(0,_350px))] 2xl:grid-cols-4 gap-4 md:gap-5 mb-[23px] md:mb-[44px]">
        {summary ? (
          <>
            <StatCard
              title="Total Raised"
              text={formatAmount(
                summary.totalAmountDonated[0].totalAmount,
                summary.totalAmountDonated[0].currency,
                { minimumFractionDigits: 2 }
              )}
              // percentage={100}
              // time="yesterday"
              pattern
            />
            <StatCard
              title="Withdrawable Amount"
              text={formatAmount(
                summary.totalWithdrawableAmount[0].amount,
                summary.totalWithdrawableAmount[0].currency,
                { minimumFractionDigits: 2 }
              )}
              // percentage={100}
              // time="yesterday"
              // colorScheme="light"
              pattern
            />
            <StatCard
              title="Total Campaigns"
              text={summary.totalNoOfCampaigns}
              // percentage={100}
              // time="yesterday"
              colorScheme="light"
            />
            <StatCard
              title="Campaign Views"
              text={summary.totalCampaignViews}
              // percentage={100}
              // time="yesterday"
              colorScheme="light"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
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
        {campaigns
          ? campaigns.campaigns.map((campaign: any) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                onDelete={campaignsQuery.refetch}
              />
            ))
          : Array.from({ length: 6 }).map((_, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
      </div>

      {/* pagination */}
      {campaigns && campaigns.campaigns.length !== 0 && (
        <Pagination
          currentPage={campaigns.pagination.currentPage}
          perPage={campaigns.pagination.perPage}
          total={campaigns.pagination.total}
          onPageChange={setPage}
          className="px-4 py-3 md:p-0"
        />
      )}

      {/* no campaigns */}
      {campaigns && campaigns.campaigns.length === 0 && (
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

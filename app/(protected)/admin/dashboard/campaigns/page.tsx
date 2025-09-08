"use client"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import Image from "next/image"
import StatCard from "../../admin-dashboard-components/StatCard"
import ButtonGroup from "../../admin-dashboard-components/ButtonGroup"
import TextInput from "../../../../../components/TextInput"
import DropdownTrigger from "../../../../../components/DropdownTrigger"
import Pagination from "../../admin-dashboard-components/Pagination"
import Table from "../../admin-dashboard-components/Table"
import CircularProgress from "../../admin-dashboard-components/CircularProgress"
import { Button } from "../../../../../components/Button"
import ExportButton from "../../admin-dashboard-components/ExportButton"
import campaignService from "../../common/services/campaign"

import {
  IGetCampaignsParams,
  RunningStatus,
} from "../../common/services/campaign/models/GetCampaigns"

import SearchIcon from "@/public/svg/search.svg"
import FilterIcon from "@/public/svg/filter-2.svg"
import TempLogo from "@/public/temp/c-logo.png"
import { mapCampaignResponseToView } from "../../common/utils/mappings"
import DateRange from "../../../dashboard/_components/DateRange"
import { IDateRange } from "../../../dashboard/_components/DateRange"

const SORT_OPTIONS = [
  { value: "milestonePercentage", label: "Milestone Percentage" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title" },
  { value: "campaignEndDate", label: "End Date" },
  { value: "campaignStartDate", label: "Start Date" },
  { value: "goalAmount", label: "Goal Amount" },
  { value: "donatedAmount", label: "Donated Amount" },
] as const

const Campaigns = () => {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState<RunningStatus>(
    RunningStatus.Upcoming
  )
  const [dateRange, setDateRange] = useState<IDateRange>()
  const [startDate, endDate] = dateRange ?? []
  const [params, setParams] = useState<Partial<IGetCampaignsParams>>({
    runningStatus: RunningStatus.Upcoming,
    sortBy: 'milestonePercentage',
    page,
    startDate,
    endDate,
  })

  const { data } = useAuthQuery({
    queryKey: ["GET /admin/campaigns", params],
    queryFn: () => campaignService.getCampaigns(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const campaignStatsQuery = useAuthQuery({
    queryKey: ["GET /admin/campaigns-stats"],
    queryFn: () => campaignService.getCampaignStats(),
  })

  // Update params when date range changes
  useEffect(() => {
    setParams(prev => ({ ...prev, startDate, endDate, page: 1 }))
    setPage(1)
  }, [startDate, endDate])

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({ ...params, page: 1, title: text })
        setPage(1)

        return text
      }),
    1000
  )

  const handleSortChange = (sortBy: string) => {
    setParams({ ...params, sortBy, page: 1 })
    setPage(1)
  }

  const tableFilterButtons = [
    {
      id: RunningStatus.Upcoming,
      label: "Upcoming",
      onClick: () => {
        setActiveFilter(RunningStatus.Upcoming)
        setParams({ ...params, runningStatus: RunningStatus.Upcoming })
      },
    },
    {
      id: RunningStatus.Active,
      label: "Active",
      onClick: () => {
        setActiveFilter(RunningStatus.Active)
        setParams({ ...params, runningStatus: RunningStatus.Active })
      },
    },
    {
      id: RunningStatus.Completed,
      label: "Completed",
      onClick: () => {
        setActiveFilter(RunningStatus.Completed)
        setParams({ ...params, runningStatus: RunningStatus.Completed })
      },
    },
  ]

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-3">
        <h1 className="text-3xl font-semibold text-[#101828] mb-0.5">
          Welcome back, Admin
        </h1>
        <p className=" text-[#475467]">
          Upload, Track and manage the expert’s tasks.
        </p>
      </hgroup>

      {/* date range */}
      <div className="flex justify-between items-center mb-5 px-8">
        <DateRange onChange={setDateRange} />
      </div>

      {/* stats */}
      <div className="flex gap-6 px-8 pt-8 mb-8">
        {campaignStatsQuery.data &&
          campaignStatsQuery.data.map((stat, index) => (
            <StatCard key={index} title={getStatTitle(stat.status)} value={stat.count} />
          ))}
      </div>

      {/* toggle buttons x search x filters */}
      <div className="flex justify-between items-center px-4 py-3">
        <ButtonGroup buttons={tableFilterButtons} selected={activeFilter} />

        <div className="flex gap-3 items-center w-[515px]">
          <TextInput
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setSearch()
            }}
            placeholder="Search"
            iconUrl={SearchIcon}
            styles={{
              input: "text-base",
              wrapper: "grow",
            }}
          />

          <ExportButton entity="campaigns" />

          <DropdownTrigger
            triggerId="campaignsSortBtn"
            targetId="campaignsSortDropdown"
            options={{ placement: "bottom-end" }}
          >
            <Button
              text="Sort"
              bgColor="#FFF"
              textColor="#344054"
              iconUrl={FilterIcon}
              shadow
              className="font-semibold"
            />
          </DropdownTrigger>

          {/* Sort dropdown */}
          <div
            id="campaignsSortDropdown"
            className="z-10 hidden w-64 bg-white divide-y divide-gray-100 rounded-lg shadow border"
          >
            <div className="p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Sort by</h4>
              <div className="max-h-60 overflow-y-auto">
                <ul className="space-y-2 text-sm text-gray-700">
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <div className="flex items-center">
                        <input
                          id={`sort-${option.value}`}
                          type="radio"
                          value={option.value}
                          name="sortBy"
                          checked={params.sortBy === option.value}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                          onChange={() => handleSortChange(option.value)}
                        />
                        <label
                          htmlFor={`sort-${option.value}`}
                          className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-8" />

      {/* table */}
      <div className="px-8">
        {data && (
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Campaign</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Raised Amount</Table.HeadCell>
              <Table.HeadCell>Target Amount</Table.HeadCell>
              <Table.HeadCell>Campaign Type</Table.HeadCell>
              <Table.HeadCell>Progress</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {mapCampaignResponseToView(data.campaigns).map(
                (campaign, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <div className="flex items-center gap-3 font-medium">
                        <Image src={TempLogo} alt="" className="shrink-0" />
                        {campaign.accountName}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      {<div className="font-medium">{campaign.title}</div>}
                    </Table.Cell>

                    <Table.Cell>
                      {<div className="font-medium">{campaign.email}</div>}
                    </Table.Cell>

                    <Table.Cell>{campaign.raisedAmount}</Table.Cell>

                    <Table.Cell>{campaign.targetAmount}</Table.Cell>

                    <Table.Cell>{campaign.type}</Table.Cell>

                    <Table.Cell>
                      <div className="text-center">
                        {typeof campaign.progressPercentage === "number" ? (
                          <CircularProgress
                            percent={campaign.progressPercentage.toFixed(0)}
                          />
                        ) : (
                          "--"
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>

            <Pagination
              currentPage={data.pagination.currentPage}
              perPage={data.pagination.perPage}
              total={data.pagination.total}
              onPageChange={(page) => {
                setParams({ ...params, page })
                setPage(page)
              }}
            />
          </Table>
        )}
      </div>
    </div>
  )
}

export default Campaigns

const getStatTitle = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Campaigns"
    case "active":
      return "Active Campaigns"
    case "completed":
      return "Completed Campaigns"

    default:
      return ""
  }
}

const dummyStats = [
  {
    title: "Pending Campaigns",
    value: 123,
  },
  {
    title: "Active Campaigns",
    value: 456,
  },
  {
    title: "Completed Campaigns",
    value: 789,
  },
]

"use client"
import { useState } from "react"
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

const Campaigns = () => {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState<RunningStatus>(
    RunningStatus.Upcoming
  )
  const [params, setParams] = useState<Partial<IGetCampaignsParams>>({
    runningStatus: RunningStatus.Upcoming,
    page,
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

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({ ...params, page: 1, title: text })
        setPage(1)

        return text
      }),
    1000
  )

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

          {/* <DropdownTrigger
            triggerId="withdrawalsFilterBtn"
            targetId="dropdownDefaultRadio"
            options={{ placement: "bottom-end" }}
          >
            <Button
              text="Filters"
              bgColor="#FFF"
              textColor="#344054"
              iconUrl={FilterIcon}
              shadow
              className="font-semibold"
            />
          </DropdownTrigger> */}

          {/* filter dropdown */}
          {/* <div
            id="dropdownDefaultRadio"
            className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow"
          >
            <ul className="p-3 space-y-3 text-sm text-gray-700">
              {_filter[selectedView].map((filter) => (
                <li key={filter.value}>
                  <div className="flex items-center">
                    <input
                      id={filter.value}
                      type="radio"
                      value={filter.value}
                      name={selectedView}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                      onChange={() => {
                        resetPage()
                        setFilter((prev) => {
                          return {
                            ...prev,
                            [selectedView]: {
                              status: filter.value as Status<
                                typeof selectedView
                              >,
                            },
                          }
                        })
                      }}
                    />
                    <label
                      htmlFor={filter.value}
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      {filter.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-center px-4 py-3">
              <Button
                text="Clear"
                bgColor="#FFF"
                textColor="#344054"
                shadow
                className="grow !justify-center font-semibold"
                onClick={() => {
                  setFilter({ KYC: {}, Withdrawals: {} })
                  const radioButtons =
                    document.querySelectorAll<HTMLInputElement>(
                      'input[type="radio"]'
                    )
                  radioButtons.forEach((button) => {
                    button.checked = false
                  })
                }}
              />
            </div>
          </div> */}
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

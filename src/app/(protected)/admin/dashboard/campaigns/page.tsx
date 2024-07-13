"use client"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useUser } from "@/app/(protected)/(dashboard)/common/hooks/useUser"
import StatCard from "../../admin-dashboard-components/StatCard"
import ButtonGroup from "../../admin-dashboard-components/ButtonGroup"
import TextInput from "@/app/common/components/TextInput"
import DropdownTrigger from "@/app/common/components/DropdownTrigger"
import { Button } from "@/app/common/components/Button"
import Pagination from "../../admin-dashboard-components/Pagination"
import Table from "../../admin-dashboard-components/Table"
import Image from "next/image"
import makeRequest from "@/utils/makeRequest"
import { extractErrorMessage } from "@/utils/extractErrorMessage"
import { Nullable } from "@/app/common/types"
import { useDebounceCallback } from "usehooks-ts"
import campaignService from "../../common/services/campaign"

import {
  CampaignType,
  IGetCampaignsParams,
  RunningStatus,
} from "../../common/services/campaign/models/GetCampaigns"

import SearchIcon from "../../../../../../public/svg/search.svg"
import FilterIcon from "../../../../../../public/svg/filter-2.svg"
import TempLogo from "../../../../../../public/temp/c-logo.png"
import CircularProgress from "../../admin-dashboard-components/CircularProgress"

const Campaigns = () => {
  const user = useUser()
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState("Pending")
  const [params, setParams] = useState<Partial<IGetCampaignsParams>>({
    runningStatus: RunningStatus.Active,
    page,
  })

  const { data } = useQuery({
    queryKey: ["GET /admin/campaigns", params],
    queryFn: () => campaignService.getCampaigns(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: Boolean(user),
  })

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({...params, page: 1, title: text})
        setPage(1)

        return text
      }),
    1000
  )

  const tableFilterButtons = [
    {
      label: "Pending",
      onClick: () => {
        setActiveFilter("Pending")
        setParams({ ...params, runningStatus: RunningStatus.Active })
      },
    },
    {
      label: "Active",
      onClick: () => {
        setActiveFilter("Active")
        setParams({ ...params, runningStatus: RunningStatus.Active })
      },
    },
    {
      label: "Completed",
      onClick: () => {
        setActiveFilter("Completed")
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
        {dummyStats &&
          dummyStats.map((stat, index) => <StatCard key={index} {...stat} />)}
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

          <DropdownTrigger
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
          </DropdownTrigger>

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
              <Table.HeadCell>Raised Amount</Table.HeadCell>
              <Table.HeadCell>Target Amount</Table.HeadCell>
              <Table.HeadCell>Campaign Type</Table.HeadCell>
              <Table.HeadCell>Progress</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {data.campaigns.map((campaign, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex items-center gap-3 font-medium">
                      <Image src={TempLogo} alt="" className="shrink-0" />
                      {campaign.user.fullName || campaign.user.organizationName}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {<div className="font-medium">{campaign.title}</div>}
                  </Table.Cell>

                  <Table.Cell>
                    {campaign.campaignType == CampaignType.Fundraise ||
                    campaign.campaignType == CampaignType.FundraiseVolunteer
                      ? `₦${campaign.totalAmountDonated[0].amount}`
                      : "--"}
                  </Table.Cell>

                  <Table.Cell>
                    {campaign.campaignType == CampaignType.Fundraise ||
                    campaign.campaignType == CampaignType.FundraiseVolunteer
                      ? `₦${campaign.fundraise.fundingGoalDetails[0].amount}`
                      : "--"}
                  </Table.Cell>

                  <Table.Cell>
                    {(() => {
                      switch (campaign.campaignType) {
                        case CampaignType.Fundraise:
                          return "Fundraise"
                        case CampaignType.Volunteer:
                          return "Volunteer"
                        case CampaignType.FundraiseVolunteer:
                          return "Fundraise/Volunteer"
                        default:
                          return "--"
                      }
                    })()}
                  </Table.Cell>

                  <Table.Cell>
                    <div className="text-center">
                      {campaign.campaignType == CampaignType.Fundraise ||
                      campaign.campaignType == CampaignType.FundraiseVolunteer ||
                      (campaign.fundraise &&
                        campaign.fundraise.fundingGoalDetails[0].amount === 0) ? (
                        <CircularProgress
                          percent={(
                            (campaign.totalAmountDonated[0].amount /
                              campaign.fundraise.fundingGoalDetails[0].amount) *
                            100
                          ).toFixed(0)}
                        />
                      ) : (
                        "--"
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
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

// type Token = Nullable<string>
// type Stats = Nullable<IStats>
// const fetchStats: QF<Stats, [Token]> = async ({ queryKey }) => {
//   const [_, token] = queryKey

//   if (token) {
//     const query = new URLSearchParams({
//       kycStatus: "pending",
//       withdrawalStatus: "in-review",
//     })
//     const endpoint = `/api/v1/admin/dashboard?${query}`

//     const headers = {
//       "x-auth-token": token,
//     }

//     try {
//       const { data } = await makeRequest<StatsResponse>(endpoint, {
//         headers,
//         method: "GET",
//       })

//       const pendingCampaigns = {
//         title: "Pending Campaigns",
//         value: data.KYCs,
//       }

//       const activeCampaigns = {
//         title: "Active Campaigns",
//         value: data.withdrawals,
//       }

//       const completedCampaigns = {
//         title: "Completed Campaigns",
//         value: data.users,
//       }

//       return [pendingCampaigns, activeCampaigns, completedCampaigns]
//     } catch (error) {
//       const message = extractErrorMessage(error)
//       throw new Error(message)
//     }
//   }
// }

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

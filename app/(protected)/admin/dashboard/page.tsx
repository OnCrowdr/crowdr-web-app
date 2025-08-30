"use client"
import { useReducer, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useQuery } from "react-query"
import { useDebounceCallback } from "usehooks-ts"
import { useUser } from "../../../../contexts/UserProvider"
import Image from "next/image"
import { Button } from "../../../../components/Button"
import TextInput from "../../../../components/TextInput"
import StatCard from "../admin-dashboard-components/StatCard"
import ButtonGroup from "../admin-dashboard-components/ButtonGroup"
import Table from "../admin-dashboard-components/Table"
import Pagination from "../admin-dashboard-components/Pagination"
import ModalTrigger, {
  modalStoreAtom,
} from "../../../../components/ModalTrigger"
import DropdownTrigger from "../../../../components/DropdownTrigger"
import CircularProgress from "../admin-dashboard-components/CircularProgress"
import { label } from "../admin-dashboard-components/Label"
import makeRequest from "../../../../utils/makeRequest"
import { toTitleCase } from "../../../../utils/toTitleCase"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import campaignService from "../common/services/campaign"
import kycService from "../common/services/kyc"
import withdrawalService from "../common/services/withdrawal"
import { activeKycIdAtom } from "../admin-dashboard-components/KycPopup"
import { activeWithdrawalIdAtom } from "../admin-dashboard-components/WithdrawalPopup"
import { userCountAtom } from "../admin-dashboard-components/Sidebar"
import {
  mapCampaignResponseToView,
  mapKycResponseToView,
  mapWithdrawalResponseToView,
} from "../common/utils/mappings"
import { keys } from "../../dashboard/_utils/queryKeys"

import {
  IGetCampaignsParams,
  RunningStatus,
} from "../common/services/campaign/models/GetCampaigns"
import {
  IGetKycsParams,
  KycStatus,
} from "../common/services/kyc/models/GetKycs"
import {
  IGetWithdrawalsParams,
  WithdrawalStatus,
} from "../common/services/withdrawal/models/GetWithdrawals"
import { Nullable, QF } from "@/types"

import SearchIcon from "@/public/svg/search.svg"
import FilterIcon from "@/public/svg/filter-2.svg"
import TempLogo from "@/public/temp/c-logo.png"
import UserIcon from "@/public/svg/user-01.svg"
import { useAuth } from "@/contexts/AppProvider"

const Dashboard = () => {
  const [searchText, setSearchText] = useState("")
  const [tableParams, setTableParams] = useReducer(filterReducer, {
    campaigns: { page: 1 },
    kycs: { page: 1 },
    withdrawals: { page: 1 },
  })

  const modalStore = useAtomValue(modalStoreAtom)
  const setActiveKycId = useSetAtom(activeKycIdAtom)
  const setActiveWithdrawalIdAtom = useSetAtom(activeWithdrawalIdAtom)
  const [userCount, setUserCount] = useAtom(userCountAtom)
  const searchParams = useSearchParams()
  const route = useRouter()
  const {user } = useAuth()

  const view = searchParams.get("view")
  const selectedTable = (
    view && view in _filter ? view : "campaigns"
  ) as FilterKeys

  const [filter, setFilter] = useState<{
    [K in FilterKeys]: { status?: Status<K>; username?: string }
  }>({
    campaigns: {},
    kycs: {},
    withdrawals: {},
  })

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        selectedTable === "campaigns"
          ? setTableParams({
              table: "campaigns",
              params: { title: text, page: 1 },
            })
          : setTableParams({
              table: selectedTable,
              params: { username: text, page: 1 },
            })

        return text
      }),
    1000
  )

  const { data: stats } = useQuery(
    [keys.admin.stats, user?.token],
    fetchStats,
    {
      enabled: Boolean(user?.token),
      refetchOnWindowFocus: false,
      onSuccess: (stats) => {
        if (stats) {
          const userData = stats[2]
          if (userData.value !== userCount) {
            setUserCount(userData.value)
          }
        }
      },
    }
  )

  const queryConfig = {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  }

  const { data: campaignData } = useQuery({
    queryKey: ["GET /admin/campaigns", tableParams.campaigns],
    queryFn: () => campaignService.getCampaigns(tableParams.campaigns),
    enabled: Boolean(user) && selectedTable === "campaigns",
    ...queryConfig,
  })

  const { data: kycData, refetch: refetchKycs } = useQuery({
    queryKey: ["GET /admin/kyc", tableParams.kycs],
    queryFn: () => kycService.getKycs(tableParams.kycs),
    enabled: Boolean(user) && selectedTable === "kycs",
    ...queryConfig,
  })

  const { data: withdrawalData, refetch: refetchWithdrawals } = useQuery({
    queryKey: ["GET /admin/withdrawals", tableParams.withdrawals],
    queryFn: () => withdrawalService.getWithdrawals(tableParams.withdrawals),
    enabled: Boolean(user) && selectedTable === "withdrawals",
    ...queryConfig,
  })

  kycService.refreshKyc = refetchKycs
  withdrawalService.refreshWithdrawal = refetchWithdrawals

  const tablePickerButtons = [
    {
      id: "campaigns",
      label: "Campaigns",
      onClick: () => {
        const view: FilterKeys = "campaigns"
        route.replace(`/admin/dashboard?view=${view}`)
      },
    },
    {
      id: "kycs",
      label: "KYC",
      onClick: () => {
        const view: FilterKeys = "kycs"
        route.replace(`/admin/dashboard?view=${view}`)
      },
    },
    {
      id: "withdrawals",
      label: "Withdrawals",
      onClick: () => {
        const view: FilterKeys = "withdrawals"
        route.replace(`/admin/dashboard?view=${view}`)
      },
    },
  ]

  const resetPage = () => {
    setTableParams({ table: selectedTable, type: "reset" })
  }

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
        {stats &&
          stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* toggle buttons x search x filters */}
      <div className="flex justify-between items-center px-4 py-3">
        <ButtonGroup buttons={tablePickerButtons} selected={selectedTable} />

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
          <div
            id="dropdownDefaultRadio"
            className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow"
          >
            <ul className="p-3 space-y-3 text-sm text-gray-700">
              {_filter[selectedTable].map((filter) => (
                <li key={filter.value}>
                  <div className="flex items-center">
                    <input
                      id={filter.value}
                      type="radio"
                      value={filter.value}
                      name={selectedTable}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                      onChange={() => {
                        switch (selectedTable) {
                          case "campaigns":
                            setTableParams({
                              table: "campaigns",
                              params: {
                                page: 1,
                                runningStatus: filter.value as RunningStatus,
                              },
                            })
                            break

                          case "kycs":
                            setTableParams({
                              table: "kycs",
                              params: {
                                page: 1,
                                status: filter.value as KycStatus,
                              },
                            })
                            break

                          case "withdrawals":
                            setTableParams({
                              table: "withdrawals",
                              params: {
                                page: 1,
                                status: filter.value as WithdrawalStatus,
                              },
                            })
                            break
                        }
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
                  resetPage()
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
          </div>
        </div>
      </div>
      <hr className="mb-8" />

      {/* table */}
      <div className="px-8">
        {/* Campaigns */}
        {selectedTable === "campaigns" && campaignData && (
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
              {mapCampaignResponseToView(campaignData.campaigns).map(
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
              currentPage={campaignData.pagination.currentPage}
              perPage={campaignData.pagination.perPage}
              total={campaignData.pagination.total}
              onPageChange={(page) =>
                setTableParams({ table: "campaigns", params: { page } })
              }
            />
          </Table>
        )}

        {/* KYC */}
        {selectedTable === "kycs" && kycData && (
          <Table>
            <Table.Head>
              <Table.HeadCell>Account Name</Table.HeadCell>
              <Table.HeadCell>Account Type</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {mapKycResponseToView(kycData.kycs).map((kyc, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex items-center gap-3 font-medium">
                      <div className="grid place-items-center h-10 w-10 shrink-0 border border-black/10 bg-[#F2F4F7] rounded-full">
                        <Image src={TempLogo} alt="" className="shrink-0" />
                      </div>
                      {kyc.accountName}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {
                      <div className="font-medium">
                        {toTitleCase(kyc.accountType)}
                      </div>
                    }
                  </Table.Cell>

                  <Table.Cell>{label(kyc.status)}</Table.Cell>

                  <Table.Cell>
                    <div className="flex gap-3">
                      <ModalTrigger id="kycPopup">
                        <button
                          type="button"
                          className="font-semibold text-sm text-[#475467] cursor-pointer"
                          onClick={() => setActiveKycId(kyc.id)}
                        >
                          View
                        </button>
                      </ModalTrigger>

                      {/pending/i.test(kyc.status) ? (
                        <ModalTrigger id="kycPopup">
                          <button
                            type="button"
                            className="font-semibold text-sm text-[#00B964]"
                            onClick={() => setActiveKycId(kyc.id)}
                          >
                            Approve
                          </button>
                        </ModalTrigger>
                      ) : (
                        <button
                          type="button"
                          className="font-semibold text-sm text-[#F04438]"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            <Pagination
              currentPage={kycData.pagination.currentPage}
              perPage={kycData.pagination.perPage}
              total={kycData.pagination.total}
              onPageChange={(page) =>
                setTableParams({ table: "kycs", params: { page } })
              }
            />
          </Table>
        )}

        {/* Withdrawals */}
        {selectedTable === "withdrawals" && withdrawalData && (
          <Table>
            <Table.Head>
              <Table.HeadCell>Account Name</Table.HeadCell>
              <Table.HeadCell>Campaign</Table.HeadCell>
              <Table.HeadCell>Withdrawal Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {mapWithdrawalResponseToView(withdrawalData.withdrawals).map(
                (withdrawal, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <div className="flex items-center gap-3 font-medium">
                        <Image src={TempLogo} alt="" className="shrink-0" />
                        {withdrawal.accountName}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      {
                        <div className="font-medium">
                          {withdrawal.campaignTitle}
                        </div>
                      }
                    </Table.Cell>

                    <Table.Cell>{withdrawal.amount}</Table.Cell>

                    <Table.Cell>{label(withdrawal.status)}</Table.Cell>

                    <Table.Cell>
                      <div className="flex gap-3">
                        <ModalTrigger id="withdrawalPopup">
                          <button
                            className="font-semibold text-sm text-[#475467] cursor-pointer"
                            onClick={() =>
                              setActiveWithdrawalIdAtom(withdrawal.id)
                            }
                          >
                            View
                          </button>
                        </ModalTrigger>

                        <ModalTrigger id="withdrawalPopup">
                          <button
                            type="button"
                            className="font-semibold text-sm text-[#6941C6]"
                            onClick={() =>
                              setActiveWithdrawalIdAtom(withdrawal.id)
                            }
                          >
                            Approve
                          </button>
                        </ModalTrigger>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>

            <Pagination
              currentPage={withdrawalData.pagination.currentPage}
              perPage={withdrawalData.pagination.perPage}
              total={withdrawalData.pagination.total}
              onPageChange={(page) =>
                setTableParams({ table: "withdrawals", params: { page } })
              }
            />
          </Table>
        )}
      </div>
    </div>
  )
}

export default Dashboard

export type IStats = {
  title: string
  value: number
}[]

interface StatsResponse {
  users: number
  withdrawals: number
  KYCs: number
}

type FilterKeys = keyof typeof _filter
type Status<K extends FilterKeys> = (typeof _filter)[K][number]["value"]

type Token = Nullable<string>
type Stats = Nullable<IStats>
const fetchStats: QF<Stats, [Token]> = async ({ queryKey }) => {
  const [_, token] = queryKey

  if (token) {
    const query = new URLSearchParams({
      kycStatus: "pending",
      withdrawalStatus: "in-review",
    })
    const endpoint = `/admin/dashboard?${query}`

    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<StatsResponse>(endpoint, {
        headers,
        method: "GET",
      })

      const pendingKYCs = {
        title: "Pending KYCs",
        value: data.KYCs,
      }

      const pendingWithdrawals = {
        title: "Pending Withdrawals",
        value: data.withdrawals,
      }

      const totalUser = {
        title: "Total Users",
        value: data.users,
      }

      return [pendingKYCs, pendingWithdrawals, totalUser]
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

const _filter = {
  campaigns: [
    { label: "Upcoming", value: RunningStatus.Upcoming },
    { label: "Active", value: RunningStatus.Active },
    { label: "Completed", value: RunningStatus.Completed },
  ],
  kycs: [
    {
      label: "Pending",
      value: KycStatus.Pending,
    },
    {
      label: "Rejected",
      value: KycStatus.Rejected,
    },
    {
      label: "Completed",
      value: KycStatus.Completed,
    },
  ],
  withdrawals: [
    {
      label: "In-Review",
      value: WithdrawalStatus.InReview,
    },
    {
      label: "Rejected",
      value: WithdrawalStatus.Rejected,
    },
    {
      label: "Approved",
      value: WithdrawalStatus.Approved,
    },
  ],
} as const

interface TableParams {
  campaigns: Partial<IGetCampaignsParams>
  kycs: Partial<IGetKycsParams>
  withdrawals: Partial<IGetWithdrawalsParams>
}

type ActionBase = {
  type?: "patch" | "reset"
}
type Action = ActionBase &
  (
    | { table: "campaigns"; params?: Partial<IGetCampaignsParams> }
    | { table: "kycs"; params?: Partial<IGetKycsParams> }
    | { table: "withdrawals"; params?: Partial<IGetWithdrawalsParams> }
  )

function filterReducer(tableParams: TableParams, action: Action) {
  const { table, params = {}, type = "patch" } = action

  switch (type) {
    case "patch":
      return {
        ...tableParams,
        [table]: { ...tableParams[table], ...params },
      }
    case "reset":
      return {
        ...tableParams,
        [table]: { page: 1 },
      }
    default:
      return tableParams
  }
}

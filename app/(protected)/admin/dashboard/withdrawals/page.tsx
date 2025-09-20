"use client"
import { useState } from "react"
import { useSetAtom } from "jotai"
import { useDebounceCallback } from "usehooks-ts"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import Image from "next/image"
import StatCard from "../../admin-dashboard-components/StatCard"
import ButtonGroup from "../../admin-dashboard-components/ButtonGroup"
import TextInput from "../../../../../components/TextInput"
import DropdownTrigger from "../../../../../components/DropdownTrigger"
import Pagination from "../../admin-dashboard-components/Pagination"
import Table from "../../admin-dashboard-components/Table"
import ModalTrigger from "../../../../../components/ModalTrigger"
import { Button } from "../../../../../components/Button"
import ExportButton from "../../admin-dashboard-components/ExportButton"
import { label } from "../../admin-dashboard-components/Label"
import { activeWithdrawalIdAtom } from "../../admin-dashboard-components/WithdrawalPopup"
import withdrawalService from "../../common/services/withdrawal"
import { TbRefresh } from "react-icons/tb"

import SearchIcon from "@/public/svg/search.svg"
import FilterIcon from "@/public/svg/filter-2.svg"
import TempLogo from "@/public/temp/c-logo.png"
import {
  IGetWithdrawalsParams,
  WithdrawalStatus,
} from "../../common/services/withdrawal/models/GetWithdrawals"
import { mapWithdrawalResponseToView } from "../../common/utils/mappings"

const Withdrawals = () => {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const setActiveWithdrawalIdAtom = useSetAtom(activeWithdrawalIdAtom)
  const [activeFilter, setActiveFilter] = useState<WithdrawalStatus>(
    WithdrawalStatus.InReview
  )
  const [params, setParams] = useState<Partial<IGetWithdrawalsParams>>({
    status: WithdrawalStatus.InReview,
    page,
  })

  const { data } = useAuthQuery({
    queryKey: ["GET /admin/withdrawals", params],
    queryFn: () => withdrawalService.getWithdrawals(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  // Fetch metrics for all statuses
  const { data: inReviewData } = useAuthQuery({
    queryKey: ["GET /admin/withdrawals/in-review"],
    queryFn: () => withdrawalService.getWithdrawals({ status: WithdrawalStatus.InReview, page: 1 }),
    refetchOnWindowFocus: false,
  })

  const { data: approvedData } = useAuthQuery({
    queryKey: ["GET /admin/withdrawals/approved"],
    queryFn: () => withdrawalService.getWithdrawals({ status: WithdrawalStatus.Approved, page: 1 }),
    refetchOnWindowFocus: false,
  })

  const { data: rejectedData } = useAuthQuery({
    queryKey: ["GET /admin/withdrawals/rejected"],
    queryFn: () => withdrawalService.getWithdrawals({ status: WithdrawalStatus.Rejected, page: 1 }),
    refetchOnWindowFocus: false,
  })

  // Fetch Paystack balance
  const { data: balanceData, refetch: refetchBalance, isLoading: balanceLoading } = useAuthQuery({
    queryKey: ["GET /payments/paystack/balance"],
    queryFn: () => withdrawalService.getPaystackBalance(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  // Calculate metrics from the data
  const calculateMetrics = () => {
    return [
      {
        title: "Pending Withdrawals",
        value: inReviewData?.pagination?.total || 0,
      },
      {
        title: "Approved Withdrawals",
        value: approvedData?.pagination?.total || 0,
      },
      {
        title: "Rejected Withdrawals", 
        value: rejectedData?.pagination?.total || 0,
      },
    ]
  }

  const metrics = calculateMetrics()

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({ ...params, page: 1, username: text })
        return text
      }),
    1000
  )

  const tableFilterButtons = [
    {
      id: WithdrawalStatus.InReview,
      label: "In-Review",
      onClick: () => {
        setActiveFilter(WithdrawalStatus.InReview)
        setParams({ ...params, status: WithdrawalStatus.InReview })
      },
    },
    {
      id: WithdrawalStatus.Approved,
      label: "Approved",
      onClick: () => {
        setActiveFilter(WithdrawalStatus.Approved)
        setParams({ ...params, status: WithdrawalStatus.Approved })
      },
    },
    {
      id: WithdrawalStatus.Rejected,
      label: "Rejected",
      onClick: () => {
        setActiveFilter(WithdrawalStatus.Rejected)
        setParams({ ...params, status: WithdrawalStatus.Rejected })
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

      {/* balance section */}
      <div className="mb-6 px-4 mt-8">
        <div className="bg-white border border-[rgba(57, 62, 70, 0.08)] rounded-xl p-4 flex items-center justify-between w-fit">
          <div className="mr-4">
            <p className="text-sm text-gray-600 mb-1">Balance</p>
            <p className="text-xl font-semibold text-gray-900">
              {balanceLoading ? (
                "Loading..."
              ) : balanceData?.data?.data ? (
                (() => {
                  const ngnBalance = balanceData.data.data.find((item: any) => item.currency === "NGN");
                  const amountInNaira = (ngnBalance?.balance || 0) / 100;
                  return `₦${amountInNaira.toLocaleString()}`;
                })()
              ) : (
                "₦0"
              )}
            </p>
          </div>
          <Button
            text="Refresh"
            icon={TbRefresh}
            bgColor="#FFF"
            textColor="#344054"
            outlineColor="#D0D5DD"
            onClick={() => refetchBalance()}
            loading={balanceLoading}
            className="w-fit font-semibold"
          />
        </div>
      </div>

      {/* stats */}
      <div className="flex gap-6 px-4 pt-2 mb-8 w-full justify-between">
        {metrics.map((stat, index) => <StatCard key={index} {...stat} />)}
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

          <ExportButton entity="withdrawals" />

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
              <Table.HeadCell>Account Name</Table.HeadCell>
              <Table.HeadCell>Campaign</Table.HeadCell>
              <Table.HeadCell>Withdrawable Amount</Table.HeadCell>
              <Table.HeadCell>Payable Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {mapWithdrawalResponseToView(data.withdrawals).map(
                (withdrawal, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <div className="flex items-center gap-3 font-medium">
                        <Image
                          src={TempLogo}
                          alt=""
                          className="shrink-0"
                        />
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
                    <Table.Cell>{withdrawal.payableAmount}</Table.Cell>

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

                        {activeFilter !== WithdrawalStatus.Approved && (
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

export default Withdrawals


"use client"
import { useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import Image from "next/image"
import StatCard from "../../admin-dashboard-components/StatCard"
import TextInput from "../../../../../components/TextInput"
import Pagination from "../../admin-dashboard-components/Pagination"
import Table from "../../admin-dashboard-components/Table"
import ExportButton from "../../admin-dashboard-components/ExportButton"
import { label } from "../../admin-dashboard-components/Label"
import transferService from "../../common/services/transfer"
import { Button } from "../../../../../components/Button"
import { TbRefresh } from "react-icons/tb"

import SearchIcon from "@/public/svg/search.svg"
import TempLogo from "@/public/temp/c-logo.png"
import {
  IGetTransfersParams,
  IPaystackTransfer,
} from "../../common/services/transfer/models/GetTransfers"

const Transfers = () => {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [params, setParams] = useState<Partial<IGetTransfersParams>>({
    page,
  })

  const { data, refetch, isLoading } = useAuthQuery({
    queryKey: ["GET /payments/paystack/transfers", params],
    queryFn: () => transferService.getTransfers(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  // Simple metrics based on main data
  const metrics = [
    {
      title: "Total Transfers",
      value: data?.pagination?.total || 0,
    },
    {
      title: "Current Page",
      value: data?.pagination?.currentPage || 0,
    },
    {
      title: "Total Pages",
      value: data?.pagination?.totalPages || 0,
    },
  ]

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({ ...params, page: 1, userId: text })
        return text
      }),
    1000
  )


  const formatAmount = (amount: number) => {
    // Amount is in kobo, convert to naira
    const amountInNaira = amount / 100;
    return `₦${amountInNaira.toLocaleString()}`;
  }

  const getStatusLabel = (status: string) => {
    return label(status);
  }

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-3">
        <h1 className="text-3xl font-semibold text-[#101828] mb-0.5">
          Transfers Management
        </h1>
        <p className=" text-[#475467]">
          Track and manage all payment transfers.
        </p>
      </hgroup>

      {/* stats */}
      <div className="flex gap-6 px-4 pt-2 mb-8 w-full justify-between">
        {metrics.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* search x filters */}
      <div className="flex justify-end items-center px-4 py-3">
        <div className="flex gap-3 items-center w-[515px]">
          <TextInput
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setSearch()
            }}
            placeholder="Search by User ID"
            iconUrl={SearchIcon}
            styles={{
              input: "text-base",
              wrapper: "grow",
            }}
          />

          <Button
            text="Refresh"
            icon={TbRefresh}
            bgColor="#FFF"
            textColor="#344054"
            outlineColor="#D0D5DD"
            onClick={() => refetch()}
            loading={isLoading}
            className="w-fit font-semibold"
          />

          <ExportButton entity="transfers" />
        </div>
      </div>
      <hr className="mb-8" />

      {/* table */}
      <div className="px-8">
        {data && (
          <Table>
            <Table.Head>
              <Table.HeadCell>Recipient</Table.HeadCell>
              <Table.HeadCell>Reference</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Bank Details</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Transfer Code</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {data.transfers.map((transfer: IPaystackTransfer, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex items-center gap-3 font-medium">
                      <Image
                        src={TempLogo}
                        alt=""
                        className="shrink-0"
                      />
                      {transfer.recipient.name}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="font-medium">
                      {transfer.reference}
                    </div>
                  </Table.Cell>

                  <Table.Cell>{formatAmount(transfer.amount)}</Table.Cell>

                  <Table.Cell>
                    <div>
                      <div className="font-medium">{transfer.recipient.details.bank_name}</div>
                      <div className="text-sm text-gray-500">{transfer.recipient.details.account_number}</div>
                      <div className="text-xs text-gray-400">{transfer.recipient.details.account_name}</div>
                    </div>
                  </Table.Cell>

                  <Table.Cell>{getStatusLabel(transfer.status)}</Table.Cell>

                  <Table.Cell>
                    <span className="text-sm text-gray-600">{transfer.transfer_code}</span>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="text-sm">
                      {new Date(transfer.createdAt).toLocaleDateString()}
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

export default Transfers
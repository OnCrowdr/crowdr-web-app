"use client"
import { useState } from "react"
import { useQuery } from "react-query"
import { useDebounceCallback } from "usehooks-ts"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import Image from "next/image"
import StatCard from "../../admin-dashboard-components/StatCard"
import ButtonGroup from "../../admin-dashboard-components/ButtonGroup"
import TextInput from "../../../../../components/TextInput"
import Pagination from "../../admin-dashboard-components/Pagination"
import Table from "../../admin-dashboard-components/Table"
import Label from "../../admin-dashboard-components/Label"
import ExportButton from "../../admin-dashboard-components/ExportButton"
import { Button } from "../../../../../components/Button"
import transactionService from "../../common/services/transaction"

import { IGetTransactionsParams } from "../../common/services/transaction/models/GetTransactions"

import SearchIcon from "@/public/svg/search.svg"
import TempLogo from "@/public/temp/c-logo.png"

const Transactions = () => {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [campaignSearch, setCampaignSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("")
  const [params, setParams] = useState<Partial<IGetTransactionsParams>>({
    page,
  })

  const { data, refetch } = useAuthQuery({
    queryKey: ["GET /admin/transactions", params],
    queryFn: () => transactionService.getTransactions(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  // TODO: REPLACE WITH SINGLE ENDPOINT CALL
  const allTransactionsQuery = useAuthQuery({
    queryKey: ["GET /admin/transactions", "all-transactions"],
    queryFn: () => transactionService.getTransactions({ perPage: 1 }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const successfulTransactionsQuery = useAuthQuery({
    queryKey: ["GET /admin/transactions", "completed"],
    queryFn: () =>
      transactionService.getTransactions({ perPage: 1, status: "completed" }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const pendingTransactionsQuery = useAuthQuery({
    queryKey: ["GET /admin/transactions", "pending"],
    queryFn: () =>
      transactionService.getTransactions({ perPage: 1, status: "pending" }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const handleRefresh = () => {
    refetch()
    allTransactionsQuery.refetch()
    successfulTransactionsQuery.refetch()
    pendingTransactionsQuery.refetch()
  }

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        // Search by userId - could be email or user ID
        setParams({ ...params, page: 1, userId: text })
        setPage(1)

        return text
      }),
    1000
  )

  const setCampaignSearchDebounced = useDebounceCallback(
    () =>
      setCampaignSearch((text) => {
        // Search by campaignId
        setParams({ ...params, page: 1, campaignId: text })
        setPage(1)

        return text
      }),
    1000
  )

  const tableFilterButtons = [
    {
      id: "",
      label: "All",
      onClick: () => {
        setActiveFilter("")
        setParams({ ...params, status: "" })
      },
    },
    {
      id: "completed",
      label: "Completed",
      onClick: () => {
        setActiveFilter("completed")
        setParams({ ...params, status: "completed" })
      },
    },
    {
      id: "pending",
      label: "Pending",
      onClick: () => {
        setActiveFilter("pending")
        setParams({ ...params, status: "pending" })
      },
    },
    {
      id: "failed",
      label: "Failed",
      onClick: () => {
        setActiveFilter("failed")
        setParams({ ...params, status: "failed" })
      },
    },
  ]


  const stats = [
    {
      title: "All Transactions",
      value: allTransactionsQuery.data?.pagination?.total ?? 0,
    },
    {
      title: "Completed",
      value: successfulTransactionsQuery.data?.pagination?.total ?? 0,
    },
    {
      title: "Pending",
      value: pendingTransactionsQuery.data?.pagination?.total ?? 0,
    },
  ]

  const formatAmount = (amount: number, currency: string = "naira") => {
    // Handle currency mapping for proper formatting
    const currencyCode = currency === "naira" ? "NGN" : currency.toUpperCase();
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount) // Amount is already in the correct format
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Label text="Completed" dotColor="#17B26A" />
      case "pending":
        return <Label text="Pending" dotColor="#F79009" />
      case "failed":
        return <Label text="Failed" dotColor="#F04438" />
      default:
        return <Label text={status} dotColor="#6B7280" />
    }
  }

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-3">
        <h1 className="text-3xl font-semibold text-[#101828] mb-0.5">
          Donations
        </h1>
        <p className=" text-[#475467]">
          Track and manage all platform donations.
        </p>
      </hgroup>

      {/* stats */}
      <div className="flex gap-6 px-8 pt-8 mb-8">
        {stats &&
          stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* toggle buttons x search x filters */}
      <div className="flex justify-between items-center px-4 py-3">
        <ButtonGroup buttons={tableFilterButtons} selected={activeFilter} />

        <div className="flex gap-3 items-center w-[700px]">
          <TextInput
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setSearch()
            }}
            placeholder="Search by user (email or ID)"
            iconUrl={SearchIcon}
            styles={{
              input: "text-base",
              wrapper: "flex-1",
            }}
          />
          
          <TextInput
            value={campaignSearch}
            onChange={(e) => {
              setCampaignSearch(e.target.value)
              setCampaignSearchDebounced()
            }}
            placeholder="Search by campaign ID"
            iconUrl={SearchIcon}
            styles={{
              input: "text-base",
              wrapper: "flex-1",
            }}
          />

          <Button
            text="Refresh"
            bgColor="#FFF"
            textColor="#344054"
            onClick={handleRefresh}
            shadow
            className="font-semibold"
          />

          <ExportButton entity="transactions" />
        </div>
      </div>
      <hr className="mb-8" />

      {/* table */}
      <div className="px-8">
        {data && (
          <Table>
            <Table.Head>
              <Table.HeadCell>Transaction ID</Table.HeadCell>
              <Table.HeadCell>Donor</Table.HeadCell>
              <Table.HeadCell>Payment Method</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {data.results.map((transaction, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="font-medium font-mono text-sm">
                      {transaction.reference || transaction._id}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center gap-3 font-medium">
                      <Image src={TempLogo} alt="" className="shrink-0" />
                      {transaction.isAnonymous ? "Anonymous" : transaction.fullName}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="font-medium capitalize">{transaction.paymentMethod}</div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="font-medium">
                      {formatAmount(parseInt(transaction.amount), transaction.currency)}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {getStatusLabel(transaction.status)}
                  </Table.Cell>

                  <Table.Cell>
                    <div className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </Table.Cell>

                  <Table.Cell></Table.Cell>
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

export default Transactions
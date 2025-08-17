"use client"
import { useState } from "react"
import { useQuery } from "react-query"
import { useDebounceCallback } from "usehooks-ts"
import Image from "next/image"
import StatCard from "../../admin-dashboard-components/StatCard"
import ButtonGroup from "../../admin-dashboard-components/ButtonGroup"
import TextInput from "../../../../../components/TextInput"
import Pagination from "../../admin-dashboard-components/Pagination"
import Table from "../../admin-dashboard-components/Table"
import Label from "../../admin-dashboard-components/Label"
import ExportButton from "../../admin-dashboard-components/ExportButton"
import transactionService from "../../common/services/transaction"

import { IGetTransactionsParams } from "../../common/services/transaction/models/GetTransactions"

import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import SearchIcon from "@/public/svg/search.svg"
import TempLogo from "@/public/temp/c-logo.png"
import { useAuth } from "@/contexts/AppProvider"

const Transactions = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("")
  const [params, setParams] = useState<Partial<IGetTransactionsParams>>({
    page,
  })

  const { data } = useQuery({
    queryKey: ["GET /admin/transactions", params],
    queryFn: () => transactionService.getTransactions(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: Boolean(user),
  })

  // TODO: REPLACE WITH SINGLE ENDPOINT CALL
  const allTransactionsQuery = useQuery({
    queryKey: ["GET /admin/transactions", "all-transactions"],
    queryFn: () => transactionService.getTransactions({ perPage: 1 }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: Boolean(user),
  })

  const successfulTransactionsQuery = useQuery({
    queryKey: ["GET /admin/transactions", "successful"],
    queryFn: () =>
      transactionService.getTransactions({ perPage: 1, status: "successful" }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: Boolean(user),
  })

  const pendingTransactionsQuery = useQuery({
    queryKey: ["GET /admin/transactions", "pending"],
    queryFn: () =>
      transactionService.getTransactions({ perPage: 1, status: "pending" }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: Boolean(user),
  })

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({ ...params, page: 1, reference: text })
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
      id: "successful",
      label: "Successful",
      onClick: () => {
        setActiveFilter("successful")
        setParams({ ...params, status: "successful" })
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

  const sort = () => {
    let amountOrder = undefined as typeof params.amountOrder
    if (params.amountOrder === "asc") {
      amountOrder = "desc"
    } else if (params.amountOrder === "desc" || !params.amountOrder) {
      amountOrder = "asc"
    }

    setParams({ ...params, amountOrder })
  }
  
  const sortIcon = () => {
    switch (params.amountOrder) {
      case "asc":
        return <FaArrowDown />

      case "desc":
        return <FaArrowUp />

      default:
        return null
    }
  }

  const stats = [
    {
      title: "All Transactions",
      value: allTransactionsQuery.data?.pagination?.total ?? 0,
    },
    {
      title: "Successful",
      value: successfulTransactionsQuery.data?.pagination?.total ?? 0,
    },
    {
      title: "Pending",
      value: pendingTransactionsQuery.data?.pagination?.total ?? 0,
    },
  ]

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100) // Assuming amount is in cents
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return <Label text="Successful" dotColor="#17B26A" />
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
          Transactions
        </h1>
        <p className=" text-[#475467]">
          Track and manage all platform transactions.
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

        <div className="flex gap-3 items-center w-[515px]">
          <TextInput
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              setSearch()
            }}
            placeholder="Search by reference"
            iconUrl={SearchIcon}
            styles={{
              input: "text-base",
              wrapper: "grow",
            }}
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
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>
                <div
                  onClick={sort}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  Amount {sortIcon()}
                </div>
              </Table.HeadCell>
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
                      {transaction.user?.fullName || transaction.user?.organizationName || transaction.user?.email}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="font-medium capitalize">{transaction.type}</div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="font-medium">
                      {formatAmount(transaction.amount, transaction.currency)}
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
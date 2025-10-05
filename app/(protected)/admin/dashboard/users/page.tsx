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
import Label from "../../admin-dashboard-components/Label"
import { Button } from "../../../../../components/Button"
import ExportButton from "../../admin-dashboard-components/ExportButton"
import userService from "../../common/services/user"
import otpService from "../../common/services/otp"
import ModalTrigger, { modalStoreAtom } from "../../../../../components/ModalTrigger"
import SidebarModal from "../../../dashboard/_components/SidebarModal"
import CompletionCard from "../../../dashboard/_components/CompletionCard"

import { IGetUsersParams } from "../../common/services/user/models/GetUsers"

import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import { BsThreeDotsVertical } from "react-icons/bs"
import { LuTrash2 } from "react-icons/lu"
import SearchIcon from "@/public/svg/search.svg"
import FilterIcon from "@/public/svg/filter-2.svg"
import TempLogo from "@/public/temp/c-logo.png"
import { UserType } from "@/types"
import DateRange from "../../../dashboard/_components/DateRange"
import { IDateRange } from "../../../dashboard/_components/DateRange"
import { useAuth } from "@/contexts/AppProvider"
import { useToast } from "@/hooks/useToast"
import { extractErrorMessage } from "@/utils/extractErrorMessage"
import { useAtomValue } from "jotai"

const Users = () => {
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [activeFilter, setActiveFilter] = useState<UserType | "">("")
  const [dateRange, setDateRange] = useState<IDateRange>()
  const [startDate, endDate] = dateRange ?? []
  const [params, setParams] = useState<Partial<IGetUsersParams>>({
    page,
    startDate,
    endDate,
  })
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [adminOtp, setAdminOtp] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [hardDelete, setHardDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useAuth()
  const toast = useToast()
  const modalStore = useAtomValue(modalStoreAtom)

  const { data } = useAuthQuery({
    queryKey: ["GET /admin/users", params],
    queryFn: () => userService.getUsers(params),
    onSuccess: (data) => setPage(data.pagination.currentPage),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  // TODO: REPLACE WITH SINGLE ENDPOINT CALL
  const allUsersQuery = useAuthQuery({
    queryKey: ["GET /admin/users", "all-users"],
    queryFn: () => userService.getUsers({ perPage: 1 }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const individualsQuery = useAuthQuery({
    queryKey: ["GET /admin/users", "individuals"],
    queryFn: () =>
      userService.getUsers({ perPage: 1, userType: UserType.Individual }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const organizationsQuery = useAuthQuery({
    queryKey: ["GET /admin/users", "organizations"],
    queryFn: () =>
      userService.getUsers({ perPage: 1, userType: UserType.NonProfit }),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  const setSearch = useDebounceCallback(
    () =>
      setSearchText((text) => {
        setParams({ ...params, page: 1, name: text })
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
        setParams({ ...params, userType: "" })
      },
    },
    {
      id: UserType.Individual,
      label: "Individuals",
      onClick: () => {
        setActiveFilter(UserType.Individual)
        setParams({ ...params, userType: UserType.Individual })
      },
    },
    {
      id: UserType.NonProfit,
      label: "Organizations",
      onClick: () => {
        setActiveFilter(UserType.NonProfit)
        setParams({ ...params, userType: UserType.NonProfit })
      },
    },
  ]

  // Update params when date range changes
  useEffect(() => {
    setParams(prev => ({ ...prev, startDate, endDate, page: 1 }))
    setPage(1)
  }, [startDate, endDate])

  const generateToken = async () => {
    if (user) {
      try {
        const res = await otpService.generateOtp(user.token)
        toast({ title: "OTP created!", body: `OTP sent to ${res.email}` })
      } catch (error) {
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  const deleteUser = async () => {
    if (user && selectedUserId) {
      setIsDeleting(true)

      try {
        await userService.deleteUser({
          userId: selectedUserId,
          adminOtp: adminOtp,
          authToken: user.token,
          reason: deleteReason,
          hardDelete: hardDelete,
        })

        toast({ title: "User Deleted", body: "User has been successfully deleted" })
        setIsDeleting(false)

        const modal = modalStore.get(`delete_user_modal-${selectedUserId}`)
        modal?.hide()

        // Refresh the user list
        window.location.reload()
      } catch (error) {
        setIsDeleting(false)
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  const hideConfirmationModal = (modalId: string) => {
    const modal = modalStore.get(modalId)
    modal?.hide()
    setAdminOtp("")
    setDeleteReason("")
    setHardDelete(false)
    setSelectedUserId(null)
  }

  const sort = () => {
    let nameOrder = undefined as typeof params.nameOrder
    if (params.nameOrder === "asc") {
      nameOrder = "desc"
    } else if (params.nameOrder === "desc" || !params.nameOrder) {
      nameOrder = "asc"
    }

    setParams({ ...params, nameOrder })
  }
  const sortIcon = () => {
    switch (params.nameOrder) {
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
      title: "All Users",
      value: allUsersQuery.data?.pagination?.total ?? 0,
    },
    {
      title: "Individuals",
      value: individualsQuery.data?.pagination?.total ?? 0,
    },
    {
      title: "Organizations",
      value: organizationsQuery.data?.pagination?.total ?? 0,
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
      <div className="flex justify-between items-center mb-5 px-4">
        <DateRange onChange={setDateRange} />
      </div>

      {/* stats */}
      <div className="flex gap-6 px-4 mb-8 justify-between">
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
            placeholder="Search"
            iconUrl={SearchIcon}
            styles={{
              input: "text-base",
              wrapper: "grow",
            }}
          />

          <ExportButton entity="users" />

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
              <Table.HeadCell>
                <div
                  onClick={sort}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  Name {sortIcon()}
                </div>
              </Table.HeadCell>
              <Table.HeadCell>Email Address</Table.HeadCell>
              <Table.HeadCell>Verification Status</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {data.results.map((user, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex items-center gap-3 font-medium">
                      <Image src={TempLogo} alt="" className="shrink-0" />
                      {user.fullName || user.organizationName}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {<div className="font-medium">{user.email}</div>}
                  </Table.Cell>

                  <Table.Cell>
                    {user.isEmailVerified ? (
                      <Label text="Verified" dotColor="#17B26A" />
                    ) : (
                      <Label text="Unverified" dotColor="#F04438" />
                    )}
                  </Table.Cell>

                  <Table.Cell>{user.userType}</Table.Cell>

                  <Table.Cell>
                    <DropdownTrigger
                      triggerId={`userActionsBtn-${user._id}`}
                      targetId={`userActions-${user._id}`}
                      options={{ placement: "left-start" }}
                    >
                      <button className="hover:bg-gray-100 rounded-full transition-colors p-2">
                        <BsThreeDotsVertical size={20} />
                      </button>
                    </DropdownTrigger>

                    {/* Dropdown menu */}
                    <div
                      id={`userActions-${user._id}`}
                      className="hidden w-36 text-gray-900 bg-white border border-gray-200 rounded-lg"
                    >
                      <ModalTrigger id={`delete_user_modal-${user._id}`}>
                        <button
                          onClick={() => setSelectedUserId(user._id)}
                          className="relative inline-flex items-center gap-2 w-full px-2 py-2 text-sm font-medium border-gray-200 rounded-lg hover:bg-gray-100 text-[#FE0A2D]"
                        >
                          <LuTrash2 stroke="#FE0A2D" size={16} />
                          Delete
                        </button>
                      </ModalTrigger>
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

      {/* Delete User Modal */}
      {data?.results.map((user) => (
        <SidebarModal key={user._id} id={`delete_user_modal-${user._id}`} position="center">
          <CompletionCard
            title="Delete User"
            text={
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#475467]">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>

                <div className="max-w-xs">
                  <TextInput
                    label="Reason for deletion (optional)"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Enter reason..."
                    controlled
                  />
                </div>

                <div className="max-w-xs">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hardDelete}
                      onChange={(e) => setHardDelete(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-[#475467]">Hard delete (permanent removal)</span>
                  </label>
                </div>

                <div className="max-w-xs">
                  <p
                    className="text-primary text-xs mb-1.5 hover:underline cursor-pointer"
                    onClick={generateToken}
                  >
                    Generate OTP
                  </p>
                  <TextInput
                    value={adminOtp}
                    onChange={(e) => setAdminOtp(e.target.value)}
                    placeholder="Fill in OTP"
                    controlled
                  />
                </div>
              </div>
            }
            primaryButton={{
              label: "Delete User",
              bgColor: "#D92D20",
              loading: isDeleting,
              onClick: deleteUser,
            }}
            secondaryButton={{
              label: "Cancel",
              onClick: () => hideConfirmationModal(`delete_user_modal-${user._id}`),
            }}
            clearModal={() => hideConfirmationModal(`delete_user_modal-${user._id}`)}
            icon={
              <div className="grid place-items-center rounded-full bg-[#FEE4E2] p-3">
                <LuTrash2 fill="#D92D20" size={20} />
              </div>
            }
            altLayout
          />
        </SidebarModal>
      ))}
    </div>
  )
}

export default Users

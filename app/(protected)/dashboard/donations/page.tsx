"use client"
import { useState } from "react"
import { useQuery } from "react-query"
import moment from "moment"
import StatCard from "../_components/StatCard"
import Tabs from "../_components/Tabs"
import Table from "../_components/Table"
import Pagination from "../_components/Pagination"
import Label from "../_components/Label"
import Detail from "../_components/Detail"
import StatCardSkeleton from "../_components/skeletons/StatCardSkeleton"
import DateRange, { IDateRange } from "../_components/DateRange"
import { formatAmount } from "../_common/utils/currency"
import { useUser } from "../../../../contexts/UserProvider"
import makeRequest from "../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { keys } from "../_utils/queryKeys"

import { Nullable, QF } from "@/types"
import { IDonationResponse, IVolunteeringResponse } from "@/types/DonationsVolunteering"
import { IDonationStats } from "@/types/UserStats"

const Donations = () => {
  const [dateRange, setDateRange] = useState<IDateRange>()
  const [donationsPage, setDonationsPage] = useState(1)
  const [volunteeringPage, setVolunteeringPage] = useState(1)
  const user = useUser()

  const { data: stats } = useQuery(
    [keys.myDonations.stats, user?.token, dateRange],
    fetchStats,
    {
      enabled: Boolean(user?.token),
      refetchOnWindowFocus: false,
      // staleTime: time.mins(2),
    }
  )

  const { data: donations } = useQuery(
    [keys.myDonations.donations, user?.token, donationsPage],
    fetchDonations,
    {
      enabled: Boolean(user?.token),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  )

  const { data: volunteering } = useQuery(
    [keys.myDonations.volunteering, user?.token, volunteeringPage],
    fetchVolunteering,
    {
      enabled: Boolean(user?.token),
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  )

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-[5px]">
        <h1 className="text-lg md:text-2xl font-semibold text-[#101828] mb-[5px]">
          My Donations
        </h1>
        <p className="text-[15px] text-[#667085]">Manage your donations</p>
      </hgroup>
      {/* action buttons */}
      <div className="flex justify-between items-center mb-5 md:mb-10 py-[1px]">
        <DateRange onChange={setDateRange} />
      </div>
      {/* stats */}
      <div className="grid md:grid-cols-[repeat(3,_minmax(0,_350px))] 2xl:grid-cols-3 gap-4 md:gap-5 mb-[23px] md:mb-[43px]">
        {stats ? (
          <>
            <StatCard
              title="Total Donations"
              text={formatAmount(
                stats.totalAmountDonated[0].totalAmount,
                stats.totalAmountDonated[0].currency,
                { minimumFractionDigits: 2 }
              )}
              pattern
            />
            <StatCard
              title="All Campaigns"
              text={stats.totalNoOfCampaigns}
              colorScheme="light"
            />
            <StatCard
              title="My Badge"
              text="Saviour"
              detail="Keep spreading love to unlock more badges!"
              colorScheme="light"
              iconUrl="/svg/badge.svg"
            />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        )}
      </div>
      {/* donations x volunteering */}
      <Tabs>
        <Tabs.Item heading="Donations">
          {donations && (
            <>
              <Table className="hidden md:block mb-9">
                <Table.Head>
                  <Table.HeadCell>Campaign</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Date & time</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>

                <Table.Body>
                  {donations.donations.map((donation, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{donation.title}</Table.Cell>
                      <Table.Cell>{donation.detail}</Table.Cell>
                      <Table.Cell>{donation.date}</Table.Cell>
                      <Table.Cell>
                        {/success/i.test(donation.status) ? (
                          <Label text={donation.status} />
                        ) : (
                          <Label
                            text={donation.status}
                            textColor="#B42318"
                            bgColor="#FEF3F2"
                          />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <div className="flex flex-col md:hidden">
                {donations.donations.map((donation, index) => (
                  <Detail key={index} {...donation} />
                ))}
              </div>
            </>
          )}

          {donations && donations.donations.length !== 0 && (
            <Pagination
              currentPage={donations.pagination.currentPage}
              perPage={donations.pagination.perPage}
              total={donations.pagination.total}
              onPageChange={setDonationsPage}
              className="px-[18px] py-4"
            />
          )}

          {/* no donations */}
          {donations && donations.donations.length === 0 && (
            <p className="flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px]">
              No donations available at this moment.
            </p>
          )}
        </Tabs.Item>

        <Tabs.Item heading="Volunteering">
          {volunteering && (
            <>
              <Table className="hidden md:block mb-9">
                <Table.Head>
                  <Table.HeadCell>Campaign</Table.HeadCell>
                  <Table.HeadCell>Skill needed</Table.HeadCell>
                  <Table.HeadCell>Date & time</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>

                <Table.Body>
                  {volunteering.volunteerings.map((volunteering, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{volunteering.title}</Table.Cell>
                      <Table.Cell>{volunteering.detail}</Table.Cell>
                      <Table.Cell>{volunteering.date}</Table.Cell>
                      <Table.Cell>
                        {/success/i.test(volunteering.status) ? (
                          <Label text={volunteering.status} />
                        ) : (
                          <Label
                            text={volunteering.status}
                            textColor="#B42318"
                            bgColor="#FEF3F2"
                          />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <div className="flex flex-col md:hidden">
                {volunteering.volunteerings.map((donation, index) => (
                  <Detail key={index} {...donation} />
                ))}
              </div>
            </>
          )}

          {volunteering && volunteering.volunteerings.length !== 0 && (
            <Pagination
              currentPage={volunteering.pagination.currentPage}
              perPage={volunteering.pagination.perPage}
              total={volunteering.pagination.total}
              onPageChange={setVolunteeringPage}
              className="px-[18px] py-4"
            />
          )}

          {/* no volunteering */}
          {volunteering && volunteering.volunteerings.length === 0 && (
            <p className="flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px]">
              No volunteering available at this moment.
            </p>
          )}
        </Tabs.Item>
      </Tabs>
    </div>
  );
}

export default Donations

type IDonations = {
  donations: ReturnType<typeof mapDonationsResponseToView>
  pagination: IDonationResponse["pagination"]
}

type IVolunteering = {
  volunteerings: ReturnType<typeof mapVolunteeringResponseToView>
  pagination: IVolunteeringResponse["pagination"]
}

const ITEMS_PER_PAGE = "5"
const DATE_FORMAT = "ddd DD MMM, YYYY; hh:mm A"

const fetchStats: QF<
  Nullable<IDonationStats>,
  [Nullable<string>, IDateRange?]
> = async ({ queryKey }) => {
  const [_, token, dateRange] = queryKey

  if (token) {
    const query = new URLSearchParams()
    if (dateRange) {
      query.set("startDate", dateRange[0])
      query.set("endDate", dateRange[1])
    }

    const endpoint = `/my-donations/summary?${query}`
    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<IDonationStats>(endpoint, {
        headers,
        method: "GET",
      })

      return data
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

const fetchDonations: QF<Nullable<IDonations>, [Nullable<string>, number]> = async ({
  queryKey,
}) => {
  const [_, token, donationsPage] = queryKey

  if (token) {
    const query = new URLSearchParams({
      page: `${donationsPage}`,
      perPage: ITEMS_PER_PAGE,
    })
    const endpoint = `/my-donations?${query}`

    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<IDonationResponse>(endpoint, {
        headers,
        method: "GET",
      })

      return {
        donations: mapDonationsResponseToView(data.donations),
        pagination: data.pagination,
      }
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

const fetchVolunteering: QF<
  Nullable<IVolunteering>,
  [Nullable<string>, number]
> = async ({ queryKey }) => {
  const [_, token, volunteeringPage] = queryKey

  if (token) {
    const query = new URLSearchParams({
      page: `${volunteeringPage}`,
      perPage: ITEMS_PER_PAGE,
    })

    const endpoint = `/my-volunteerings?${query}`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<IVolunteeringResponse>(endpoint, {
        headers,
        method: "GET",
      })

      return {
        volunteerings: mapVolunteeringResponseToView(data.volunteerings),
        pagination: data.pagination,
      }
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

function mapDonationsResponseToView(donations: IDonationResponse["donations"]) {
  return donations.map((donation) => ({
    title: donation.fullName,
    detail: formatAmount(Number(donation.amount), donation.currency),
    date: moment(donation.createdAt).format(DATE_FORMAT),
    status: "Success",
  }))
}

function mapVolunteeringResponseToView(
  volunteering: IVolunteeringResponse["volunteerings"]
) {
  return volunteering.map((volunteer) => ({
    title: volunteer.fullName,
    detail: volunteer.gender,
    date: moment(volunteer.createdAt).format(DATE_FORMAT),
    status: "Success",
  }))
}

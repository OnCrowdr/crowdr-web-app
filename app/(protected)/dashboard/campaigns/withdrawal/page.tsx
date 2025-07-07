"use client"
import Image from "next/image"
import { useState } from "react"
import { useQuery } from "react-query"
import { useUser } from "../../../../../contexts/UserProvider"
import { useModal } from "../../../../../hooks/useModal"
import { useToast } from "../../../../../hooks/useToast"
import { Button } from "../../../../../components/shared/Button"
import Table from "../../_components/Table"
import Detail from "../../_components/Detail"
import Pagination from "../../_components/Pagination"
import StatCard from "../../_components/StatCard"
import StatCardSkeleton from "../../_components/skeletons/StatCardSkeleton"
import CompletionCard from "../../_components/CompletionCard"
import makeRequest from "../../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import { formatAmount } from "../../_common/utils/currency"
import {
  ICampaignView,
  mapCampaignResponseToView,
} from "../../_common/utils/campaign"
import { keys } from "../../_utils/queryKeys"

import { Nullable, IPagination, QF } from "@/types"
import { ICampaignStats } from "@/types/UserStats"
import { ICampaignResponse } from "@/types/Campaign"
import DollarIcon from "@/public/svg/dollar.svg"

const Withdrawal = () => {
  const [page, setPage] = useState(1)
  const user = useUser()
  const modal = useModal()
  const toast = useToast()

  const { data: stats } = useQuery(
    [keys.myCampaigns.stats, user?.token],
    fetchStats,
    {
      enabled: Boolean(user?.token),
      refetchOnWindowFocus: false,
    }
  )

  const { data: campaigns } = useQuery(
    [keys.myCampaigns.campaigns, user?.token, page],
    fetchCampaigns,
    {
      enabled: Boolean(user?.token),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )

  const withdraw = async (campaignId: string) => {
    if (user) {
      const endpoint = `/withdrawals/request`
      const headers = {
        "x-auth-token": user.token,
      }
      const payload = { campaignId }

      try {
        const { success, message } = await makeRequest(endpoint, {
          headers,
          method: "POST",
          payload: JSON.stringify(payload),
        })

        if (success) {
          activateWithdrawalCompletionModal()
        }
      } catch (error) {
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  // TODO: CREATE WITHDRAWAL CARD
  const activateWithdrawalModal = (campaign: ICampaignView) => {
    const { payableAmount, serviceFee, amount, currency } =
      campaign.amountDonated!

    modal.show(
      <CompletionCard
        altLayout
        title={`You’re making a withdrawal of ${formatAmount(
          payableAmount,
          currency
        )}`}
        text={
          <div className="flex flex-col gap-5">
            <p className="text-sm text-[#475467] md:text-justify md:pr-2">
              You are making a withdrawal from the{" "}
              <span className="text-[#00B964]">{campaign.title}</span> campaign.
            </p>

            {/* break down */}
            <div className="flex flex-col gap-4 text-xs">
              <hr className="border-t-[#CFCFCF]" />
              <h3 className="font-semibold text-[#666]">
                Withdrawal Breakdown
              </h3>

              <div className="flex justify-between">
                <p>Total</p>
                <p>{campaign.fundsGotten}</p>
              </div>

              <div className="flex justify-between">
                <p>Service fee</p>
                <p>
                  -{formatAmount(serviceFee, currency, { prefixSymbol: false })}
                </p>
              </div>
              <hr className="border-t-[#CFCFCF]" />

              <div className="flex justify-between font-semibold text-base">
                <p>Amount to be received</p>
                <p>
                  {formatAmount(payableAmount, currency, {
                    prefixSymbol: false,
                  })}
                </p>
              </div>
            </div>
          </div>
        }
        primaryButton={{
          label: "Withdraw Funds",
          onClick: () => {
            modal.hide()
            withdraw(campaign._id)
          },
        }}
        secondaryButton={{ label: "Cancel", onClick: modal.hide }}
        clearModal={modal.hide}
        icon={
          <div
            style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
            className="grid place-items-center rounded-[10px] border border-[#EAECF0] p-4"
          >
            <Image src={DollarIcon} alt="" />
          </div>
        }
      />
    )
  }

  const activateWithdrawalCompletionModal = () => {
    modal.show(
      <CompletionCard
        title={`Your withdrawal has been submitted for review`}
        text={`Your money is on its way to your bank account. Thank you for choosing Crowdr.`}
        primaryButton={{
          label: "Back to Dashboard",
          onClick: modal.hide,
        }}
        clearModal={modal.hide}
      />
    )
  }

  const mapCampaignToView = (campaign: ICampaignView) => {
    return {
      title: campaign.title,
      detail: campaign.fundsGotten || "",
      date: campaign.endDate,
      button: (
        <Button
          text="Withdraw"
          className="!h-9"
          disabled={!campaign.isCompleted}
          onClick={() => activateWithdrawalModal(campaign)}
        />
      ),
    }
  }

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-10">
        <h1 className="text-lg md:text-2xl font-semibold text-[#101828]">
          All Campaigns
        </h1>
      </hgroup>

      {/* stats */}
      <div className="grid md:grid-cols-[repeat(3,_minmax(0,_350px))] 2xl:grid-cols-3 gap-4 md:gap-5 mb-[23px] md:mb-[75px]">
        {stats ? (
          <>
            <StatCard
              title="Total Withdrawals"
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
              title="Active Campaigns"
              text={stats.totalNoOfCampaigns}
              colorScheme="light"
            />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        )}
      </div>

      {/* campaigns */}
      {campaigns && (
        <>
          <Table className="hidden md:block mb-20">
            <Table.Head>
              <Table.HeadCell>Campaign</Table.HeadCell>
              <Table.HeadCell>Target Amount</Table.HeadCell>
              <Table.HeadCell>Amount Raised</Table.HeadCell>
              <Table.HeadCell>End Date</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {campaigns.campaigns.map((campaign, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{campaign.title}</Table.Cell>
                  <Table.Cell>{campaign.fundingGoal}</Table.Cell>
                  <Table.Cell>{campaign.fundsGotten}</Table.Cell>
                  <Table.Cell>{campaign.endDate}</Table.Cell>
                  <Table.Cell>
                    {campaign.campaignType !== "volunteer" && (
                      <Button
                        text="Withdraw"
                        onClick={() => activateWithdrawalModal(campaign)}
                        disabled={
                          (campaign.amountDonated?.amount ?? 0) <= 0 ||
                          !campaign.isCompleted
                        }
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <div className="flex flex-col md:hidden">
            {campaigns.campaigns.map((campaign) => (
              <Detail key={campaign._id} {...mapCampaignToView(campaign)} />
            ))}
          </div>

          {/* pagination */}
          {campaigns && campaigns.campaigns.length !== 0 && (
            <Pagination
              currentPage={campaigns.pagination.currentPage}
              perPage={campaigns.pagination.perPage}
              total={campaigns.pagination.total}
              onPageChange={setPage}
              className="px-[18px] py-4"
            />
          )}
          {/* no campaigns */}
          {campaigns && campaigns.campaigns.length === 0 && (
            <p className="flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px]">
              No campaigns available at this moment.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Withdrawal

type ICampaign = {
  campaigns: ICampaignView[]
  pagination: IPagination
}

const fetchStats: QF<Nullable<ICampaignStats>, [Nullable<string>]> = async ({
  queryKey,
}) => {
  const [_, token] = queryKey

  if (token) {
    const endpoint = `/my-campaigns/summary`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<ICampaignStats>(endpoint, {
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

type Data = Nullable<ICampaign>
type Token = Nullable<string>
type Page = number
const fetchCampaigns: QF<Data, [Token, Page]> = async ({ queryKey }) => {
  const [_, token, page] = queryKey

  if (token) {
    const query = new URLSearchParams({ page: `${page}`, perPage: "6" })
    const endpoint = `/my-campaigns?${query}`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<ICampaignResponse>(endpoint, {
        headers,
        method: "GET",
      })

      return {
        campaigns: data.campaigns.map(mapCampaignResponseToView),
        pagination: data.pagination,
      }
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

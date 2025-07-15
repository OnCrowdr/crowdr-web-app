"use client"
import { useState } from "react"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useUser } from "@/contexts/UserProvider"
import moment from "moment"
import { formatAmount } from "../../_common/utils/currency"
import { mapCampaignResponseToView } from "../../_common/utils/campaign"

import { Button, GrayButton } from "@/components/Button"
import Detail from "../../_components/Detail"
import Pagination from "../../_components/Pagination"
import Table from "../../_components/Table"
import Tabs from "../../_components/Tabs"
import CampaignPageSkeleton from "../../_components/skeletons/CampaignPageSkeleton"
import ProgressBar from "../../_components/ProgressBar"
import Text from "../../_components/Text"
import { pill } from "../../_components/Pill"

import {
  IDonationResponse,
  IVolunteeringResponse,
} from "@/types/DonationsVolunteering"
import { useToast } from "@/hooks/useToast"
import { useModal } from "@/hooks/useModal"
import { BiSearch } from "react-icons/bi"
import { IoShareSocial, IoDownload } from "react-icons/io5"
import FileDownloadIcon from "@/public/svg/file-download.svg"
import OldModal from "@/components/OldModal"
import ShareCampaign from "@/components/ShareCampaign"
import { Parser } from "json2csv"
import { Mixpanel } from "../../../../../utils/mixpanel"
import SidebarModal from "../../_components/SidebarModal"
import VolunteerProfile from "../../_components/VolunteerProfile"
import ModalTrigger from "@/components/ModalTrigger"
import { regex } from "regex"
import { isAfter, parseISO } from "date-fns"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import query from "@/api/query"
import _my_campaigns from "@/api/_my_campaigns"
import _campaigns from "@/api/_campaigns"

const Campaign = () => {
  const { campaignId } = useParams() as { campaignId: string }
  const [donorsPage, setDonorsPage] = useState(1)
  const [volunteersPage, setVolunteersPage] = useState(1)
  const [volunteerProfile, setVolunteerProfile] = useState<IVolunteerProfile>()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // const {user } = useAuth()
  // const modal = useModal()
  // const toast = useToast()

  const [shareModal, setShareModal] = useState(false)

  const campaignQuery = useAuthQuery({
    queryKey: [query.keys.MY_CAMPAIGN, campaignId],
    queryFn: () => _my_campaigns.getCampaign({ campaignId }),
    select: (data) => mapCampaignResponseToView(data),
  })

  const donationsQuery = useAuthQuery({
    queryKey: [query.keys.CAMPAIGN_DONATIONS, campaignId, donorsPage],
    queryFn: () =>
      _campaigns.getCampaignDonations({ campaignId }, { page: donorsPage }),
    select: (data) => {
      return {
        donors: mapDonationsResponseToView(data.donations),
        pagination: data.pagination,
      }
    },
  })

  const volunteersQuery = useAuthQuery({
    queryKey: [query.keys.CAMPAIGN_VOLUNTEERS, campaignId, volunteersPage],
    queryFn: () =>
      _campaigns.getCampaignVolunteers(
        { campaignId },
        { page: volunteersPage }
      ),
    select: (data) => {
      return {
        volunteers: mapVolunteeringResponseToView(data.volunteerings),
        pagination: data.pagination,
        unfiltered: data.volunteerings,
      }
    },
  })

  const campaign = campaignQuery.data
  const donors = donationsQuery.data
  const volunteers = volunteersQuery.data
  const isFundraiseCampaign = /fundraise/i.test(campaign?.campaignType || "")
  const isVolunteerCampaign = /volunteer/i.test(campaign?.campaignType || "")

  const downloadCSV = () => {
    if (!volunteers?.unfiltered) return

    const volunteerings = volunteers?.unfiltered

    const fields = [
      "fullName",
      "email",
      "gender",
      "ageRange",
      "address",
      "about",
      "phoneNumber",
      "createdAt",
      "updatedAt",
    ]

    const headers = fields.map((field) => ({
      label: camelCaseToTitleCase(field),
      value: field,
    }))

    const json2csvParser = new Parser({ fields: headers })
    const csv = json2csvParser.parse(volunteerings)

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${campaign?.title}.volunteers.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareCampaign = async (campaign: any) => {
    setShareModal(true)
    // downloadCSV();
  }

  // Helper function to create volunteer management buttons
  const createVolunteerButtons = (volunteer: IVolunteerProfile) => (
    <div className="flex flex-col gap-2 min-w-[100px]">
      <ModalTrigger id="volunteer">
        <button
          className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 font-medium text-sm text-[#475467] px-3 py-2 rounded border border-gray-200"
          onClick={() => setVolunteerProfile(volunteer)}
        >
          View Profile
        </button>
      </ModalTrigger>

      <ModalTrigger id="volunteer">
        <button
          type="button"
          className="bg-blue-50 hover:bg-blue-100 transition-colors duration-200 font-medium text-sm text-primary px-3 py-2 rounded border border-blue-200"
          onClick={() => setVolunteerProfile(volunteer)}
        >
          Manage
        </button>
      </ModalTrigger>
    </div>
  )

  // Check if campaign has ended
  const currentDate = new Date()
  const campaignEndDate = campaign?.endDate ? parseISO(campaign?.endDate) : null
  const hasEnded = campaignEndDate
    ? isAfter(currentDate, campaignEndDate)
    : false

  const selectedView =
    searchParams.get("view") ||
    (isFundraiseCampaign && "Donors") ||
    (isVolunteerCampaign && "Volunteers") ||
    undefined

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row justify-between md:mb-[90px]">
          {campaign ? (
            <div className="md:max-w-[570px] grow mb-[33px] md:mb-0">
              <div className="flex flex-col md:flex-row justify-between mb-[5px]">
                <p className="text-lg md:text-2xl text-black md:font-semibold">
                  {campaign.title}
                </p>
                <div className="hidden md:block">{pill(campaign.category)}</div>
              </div>

              <Text
                characterLimit={128}
                expandText="Read more"
                className="md:hidden text-[#667085] text-[15px] md:text-[13px] mb-[9px]"
              >
                {campaign.story}
              </Text>

              <p className="hidden md:block text-[#667085] text-[15px] md:text-[13px] mb-8">
                {campaign.story}
              </p>

              <div className="md:hidden mb-[5px]">
                {pill(campaign.category)}
              </div>

              <div className="px-[10px] py-3 md:px-0 md:py-0">
                {campaign.percentage !== undefined ? (
                  <div className="bg-[#F9F9F9] rounded-lg p-4 mb-[12px] md:mb-3">
                    <p className="text-sm text-[#667085] mb-1">
                      <span className="text-[#292A2E]">Goal</span>{" "}
                      {campaign.fundsGotten}/{campaign.fundingGoal}
                    </p>
                    <ProgressBar percent={campaign.percentage} showValue />
                  </div>
                ) : (
                  <div className="h-20 m-3" />
                )}

                <div className="flex flex-col md:flex-row justify-between md:items-end">
                  <div className="flex flex-col gap-2.5 text-[13px] text-[#5C636E] px-[7px] mb-[13px] md:px-0 md:mb-0">
                    <p>
                      <span className="text-black font-medium">Views:</span>{" "}
                      <span className="text-[#5C636E] font">
                        {campaign.views}
                      </span>
                    </p>
                    <p>
                      <span className="text-black font-medium">Donors:</span>{" "}
                      <span>{donors?.pagination?.total}</span>
                    </p>
                    <p>
                      <span className="text-black font-medium">Duration:</span>{" "}
                      <span
                        className={hasEnded ? "text-red-600 font-medium" : ""}
                      >
                        {hasEnded ? "Ended" : campaign.duration}
                      </span>
                    </p>
                  </div>

                  <GrayButton
                    href={`/dashboard/campaigns/create-or-edit-campaign/${campaign._id}`}
                    text="Update campaign"
                    textColor="#667085"
                    outlineColor="transparent"
                    className="self-end !px-7 !h-[44px]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <CampaignPageSkeleton />
          )}

          <OldModal isOpen={shareModal} onClose={() => setShareModal(false)}>
            <div
              className="relative p-12"
              style={{
                background: "rgba(76, 76, 76, 0)",
              }}
            >
              <ShareCampaign
                onClose={() => setShareModal(false)}
                campaignId={campaign?._id}
                title={campaign?.title}
                story={campaign?.story?.split(" ").slice(0, 30)?.join(" ")}
              />
            </div>
          </OldModal>

          <div className="flex items-start gap-3 mb-[23px] md:mb-[9px]">
            {isVolunteerCampaign && (
              <Button
                text="Download CSV"
                icon={IoDownload}
                bgColor="#FFF"
                textColor="#344054"
                outlineColor="#D0D5DD"
                onClick={() => {
                  downloadCSV()
                  Mixpanel.track("Downloaded volunteer CSV file")
                }}
              />
            )}

            <Button
              text="Share Campaign"
              icon={IoShareSocial}
              bgColor="#FFF"
              textColor="#344054"
              outlineColor="#D0D5DD"
              onClick={() => {
                shareCampaign(campaign)
                Mixpanel.track("Clicked Share Campaign")
              }}
            />

            {!isVolunteerCampaign && (
              <Button
                text="Withdraw Donations"
                href="/dashboard/campaigns/withdrawal"
              />
            )}
          </div>
        </div>

        {/* donors x volunteers */}
        {/* TODO: CONFIGURE TABS TO REPLACE NAVIGATION HISTORY INSTEAD OF PUSHING */}
        {campaign && (
          <Tabs activeTab={selectedView}>
            {isFundraiseCampaign && (
              <Tabs.Item heading="Donors" href={`${pathname}?view=Donors`}>
                {donors && (
                  <>
                    <Table className="hidden md:block mb-9">
                      <Table.Head>
                        <Table.HeadCell>Donors</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Date & time</Table.HeadCell>
                      </Table.Head>

                      <Table.Body>
                        {donors.donors.map((donation, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{donation.title}</Table.Cell>
                            <Table.Cell>{donation.detail}</Table.Cell>
                            <Table.Cell>{donation.date}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>

                    <div className="flex flex-col md:hidden">
                      {donors.donors.map((donation, index) => (
                        <Detail key={index} {...donation} />
                      ))}
                    </div>
                  </>
                )}
                {donors && donors.donors.length !== 0 && (
                  <Pagination
                    currentPage={donors.pagination.currentPage}
                    perPage={donors.pagination.perPage}
                    total={donors.pagination.total}
                    onPageChange={setDonorsPage}
                    className="px-[18px] py-4"
                  />
                )}
                {donors && donors.donors.length === 0 && (
                  <p className="flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px]">
                    No donors available at this moment.
                  </p>
                )}
              </Tabs.Item>
            )}

            {isVolunteerCampaign && (
              <Button
                text="Download CSV"
                bgColor="#FFF"
                textColor="#344054"
                outlineColor="#D0D5DD"
                onClick={() => {
                  downloadCSV()
                  Mixpanel.track("Downloaded volunteer CSV file")
                }}
              />
            )}

            {isVolunteerCampaign && (
              <Tabs.Item
                heading="Volunteers"
                href={`${pathname}?view=Volunteers`}
              >
                {volunteers && (
                  <>
                    <Table className="hidden md:block mb-9">
                      <Table.Head>
                        <Table.HeadCell>Volunteers</Table.HeadCell>
                        <Table.HeadCell>Phone number</Table.HeadCell>
                        <Table.HeadCell>Gender</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Date & time</Table.HeadCell>
                        <Table.HeadCell></Table.HeadCell>
                      </Table.Head>

                      <Table.Body>
                        {volunteers.volunteers.map((volunteer, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{volunteer.title}</Table.Cell>
                            <Table.HeadCell>
                              {volunteer.phoneNumber}
                            </Table.HeadCell>
                            <Table.Cell>{volunteer.detail}</Table.Cell>
                            <Table.Cell>{volunteer.status}</Table.Cell>
                            <Table.Cell>{volunteer.date}</Table.Cell>
                            <Table.Cell>
                              <div className="flex gap-3">
                                <ModalTrigger id="volunteer">
                                  <button
                                    className="font-semibold text-sm text-[#475467]"
                                    onClick={() =>
                                      setVolunteerProfile(volunteer)
                                    }
                                  >
                                    View Profile
                                  </button>
                                </ModalTrigger>

                                <ModalTrigger id="volunteer">
                                  <button
                                    type="button"
                                    className="font-semibold text-sm text-primary"
                                    onClick={() =>
                                      setVolunteerProfile(volunteer)
                                    }
                                  >
                                    Manage
                                  </button>
                                </ModalTrigger>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>

                    {/* Updated mobile view with modal triggers */}
                    <div className="flex flex-col md:hidden">
                      {volunteers.volunteers.map((volunteer, index) => (
                        <Detail 
                          key={index} 
                          {...volunteer} 
                          status={volunteer.status}
                          button={createVolunteerButtons(volunteer)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {volunteers && volunteers.volunteers.length !== 0 && (
                  <Pagination
                    currentPage={volunteers.pagination.currentPage}
                    perPage={volunteers.pagination.perPage}
                    total={volunteers.pagination.total}
                    onPageChange={setVolunteersPage}
                    className="px-[18px] py-4"
                  />
                )}

                {volunteers && volunteers.volunteers.length === 0 && (
                  <p className="flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px]">
                    No volunteers available at this moment.
                  </p>
                )}
              </Tabs.Item>
            )}
          </Tabs>
        )}
      </div>

      <SidebarModal id="volunteer" position="right">
        <VolunteerProfile volunteer={volunteerProfile} />
      </SidebarModal>
    </>
  )
}

export default Campaign

export type IVolunteerProfile = ReturnType<
  typeof mapVolunteeringResponseToView
>[number]

const ITEMS_PER_PAGE = "20"
const DATE_FORMAT = "ddd DD MMM, YYYY; hh:mm A"

const camelCaseToTitleCase = (str: string) => {
  // 1. Split before each uppercase letter (global)
  const splitter = regex("g")`([A-Z])`

  // 2. Match the very first character of the string
  const firstChar = regex`^.`

  // return str.replace(/([A-Z])/g, " $1").replace(/^./, function (ch) {
  return str.replace(splitter, " $1").replace(firstChar, function (ch) {
    return ch.toUpperCase()
  })
}

function mapDonationsResponseToView(donations: IDonationResponse["donations"]) {
  return donations.map((donation) => ({
    title: donation.fullName,
    detail: formatAmount(Number(donation.amount), donation.currency),
    date: moment(donation.createdAt).format(DATE_FORMAT),
  }))
}

function mapVolunteeringResponseToView(
  volunteering: IVolunteeringResponse["volunteerings"]
) {
  return volunteering.map((volunteer) => ({
    ...volunteer,
    title: volunteer.fullName,
    phoneNumber: volunteer.phoneNumber,
    detail: volunteer.gender,
    status: volunteer.status,
    date: moment(volunteer.createdAt).format(DATE_FORMAT),
  }))
}
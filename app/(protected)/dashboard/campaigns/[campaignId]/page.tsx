"use client";
import { useState, use } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { useUser } from "@/contexts/UserProvider";
import moment from "moment";
import makeRequest from "../../../../../utils/makeRequest";
import { formatAmount } from "../../_common/utils/currency";
import { mapCampaignResponseToView } from "../../_common/utils/campaign";
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage";
import { keys } from "../../_utils/queryKeys";

import { Button, GrayButton } from "@/components/shared/Button";
import Detail from "../../_components/Detail";
import Pagination from "../../_components/Pagination";
import Table from "../../_components/Table";
import Tabs from "../../_components/Tabs";
import CampaignPageSkeleton from "../../_components/skeletons/CampaignPageSkeleton";
import ProgressBar from "../../_components/ProgressBar";
import Text from "../../_components/Text";
import { pill } from "../../_components/Pill";

import { Nullable, QF, Route } from "@/types";
import {
  ICampaign,
  IFundraiseVolunteerCampaign
} from "@/types/Campaign";
import {
  IDonationResponse,
  IVolunteeringResponse
} from "@/types/DonationsVolunteering";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { BiSearch } from "react-icons/bi";
import { IoShareSocial, IoDownload } from "react-icons/io5";
import FileDownloadIcon from "@/public/svg/file-download.svg";
import OldModal from "@/app/(homepage)/_components/layout/OldModal";
import ShareCampaign from "@/components/shared/ShareCampaign";
import { Parser } from "json2csv";
import { Mixpanel } from "../../../../../utils/mixpanel";
import SidebarModal from "../../_components/SidebarModal";
import VolunteerProfile from "../../_components/VolunteerProfile";
import ModalTrigger from "@/components/shared/ModalTrigger";
import { regex } from "regex";
import { isAfter, parseISO } from "date-fns";

const Campaign = () => {
  const { campaignId } = useParams() as { campaignId: string };
  const [donorsPage, setDonorsPage] = useState(1);
  const [volunteersPage, setVolunteersPage] = useState(1);
  const [volunteerProfile, setVolunteerProfile] = useState<IVolunteerProfile>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const user = useUser();
  const modal = useModal();
  const toast = useToast();

  const [shareModal, setShareModal] = useState(false);

  const { data: campaign } = useQuery(
    [keys.campaignPage.details, user?.token, campaignId],
    fetchCampaign,
    {
      enabled: Boolean(user?.token),
      refetchOnWindowFocus: false
    }
  );

  const isFundraiseCampaign = /fundraise/i.test(campaign?.campaignType || "");
  const isVolunteerCampaign = /volunteer/i.test(campaign?.campaignType || "");

  const { data: donors } = useQuery(
    [keys.campaignPage.donors, user?.token, campaignId, donorsPage],
    fetchDonors,
    {
      enabled: isFundraiseCampaign,
      refetchOnWindowFocus: false
    }
  );

  const { data: volunteers } = useQuery(
    [keys.campaignPage.volunteers, user?.token, campaignId, volunteersPage],
    fetchVolunteers,
    {
      enabled: isVolunteerCampaign,
      refetchOnWindowFocus: false
    }
  );

  const camelCaseToTitleCase = (str: string) => {
    // 1. Split before each uppercase letter (global)
    const splitter = regex("g")`([A-Z])`;

    // 2. Match the very first character of the string
    const firstChar = regex`^.`;

    // return str.replace(/([A-Z])/g, " $1").replace(/^./, function (ch) {
    return str.replace(splitter, " $1").replace(firstChar, function (ch) {
      return ch.toUpperCase();
    });
  };

  const downloadCSV = () => {
    if (!volunteers?.unfiltered) return;

    const volunteerings = volunteers?.unfiltered;

    const fields = [
      "fullName",
      "email",
      "gender",
      "ageRange",
      "address",
      "about",
      "phoneNumber",
      "createdAt",
      "updatedAt"
    ];

    const headers = fields.map((field) => ({
      label: camelCaseToTitleCase(field),
      value: field
    }));

    const json2csvParser = new Parser({ fields: headers });
    const csv = json2csvParser.parse(volunteerings);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${campaign?.title}.volunteers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareCampaign = async (campaign: any) => {
    setShareModal(true);
    // downloadCSV();
  };

  // Check if campaign has ended
  const currentDate = new Date();
  const campaignEndDate = campaign?.endDate
    ? parseISO(campaign?.endDate)
    : null;
  const hasEnded = campaignEndDate
    ? isAfter(currentDate, campaignEndDate)
    : false;

  const selectedView =
    searchParams.get("view") ||
    (isFundraiseCampaign && "Donors") ||
    (isVolunteerCampaign && "Volunteers") ||
    undefined;

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
                className="md:hidden text-[#667085] text-[15px] md:text-[13px] mb-[9px]">
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
                        className={hasEnded ? "text-red-600 font-medium" : ""}>
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
          {/* TODO: ADD SKELETON LOADING */}

          <OldModal isOpen={shareModal} onClose={() => setShareModal(false)}>
            <div
              className="relative p-12"
              style={{
                background: "rgba(76, 76, 76, 0)"
              }}>
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
                  downloadCSV();
                  Mixpanel.track("Downloaded volunteer CSV file");
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
                shareCampaign(campaign);
                Mixpanel.track("Clicked Share Campaign");
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
        {campaign && (
          <Tabs activeTab={selectedView}>
            {isFundraiseCampaign && (
              // TODO: CONFIGURE TABS TO REPLACE NAVIGATION HISTORY INSTEAD OF PUSHING
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
                  downloadCSV();
                  Mixpanel.track("Downloaded volunteer CSV file");
                }}
              />
            )}

            {isVolunteerCampaign && (
              <Tabs.Item
                heading="Volunteers"
                href={`${pathname}?view=Volunteers`}>
                {volunteers && (
                  <>
                    <Table className="hidden md:block mb-9">
                      <Table.Head>
                        <Table.HeadCell>Volunteers</Table.HeadCell>
                        <Table.HeadCell>Phone number</Table.HeadCell>
                        <Table.HeadCell>Gender</Table.HeadCell>
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
                            <Table.Cell>{volunteer.date}</Table.Cell>
                            <Table.Cell>
                              <div className="flex gap-3">
                                <ModalTrigger id="volunteer">
                                  <button
                                    className="font-semibold text-sm text-[#475467]"
                                    onClick={() =>
                                      setVolunteerProfile(volunteer)
                                    }>
                                    View Profile
                                  </button>
                                </ModalTrigger>

                                <ModalTrigger id="volunteer">
                                  <button
                                    type="button"
                                    className="font-semibold text-sm text-primary"
                                    onClick={() =>
                                      setVolunteerProfile(volunteer)
                                    }>
                                    Manage
                                  </button>
                                </ModalTrigger>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>

                    <div className="flex flex-col md:hidden">
                      {volunteers.volunteers.map((volunteer, index) => (
                        <Detail key={index} {...volunteer} status={undefined} />
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
  );
};

export default Campaign;

type ICampaignView = ReturnType<typeof mapCampaignResponseToView>;

type IDonors = {
  donors: ReturnType<typeof mapDonationsResponseToView>;
  pagination: IDonationResponse["pagination"];
};

type IVolunteers = {
  volunteers: ReturnType<typeof mapVolunteeringResponseToView>;
  pagination: IVolunteeringResponse["pagination"];
  unfiltered: IVolunteeringResponse["volunteerings"];
};

export type IVolunteerProfile = ReturnType<
  typeof mapVolunteeringResponseToView
>[number];

const ITEMS_PER_PAGE = "20";
const DATE_FORMAT = "ddd DD MMM, YYYY; hh:mm A";

const fetchCampaign: QF<
  Nullable<ICampaignView>,
  [Nullable<string>, string]
> = async ({ queryKey }) => {
  const [_, token, campaignId] = queryKey;

  if (token) {
    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token
    };

    const endpoint = `/my-campaigns/${campaignId}`;

    try {
      const { data } = await makeRequest<IFundraiseVolunteerCampaign>(
        endpoint,
        {
          headers,
          method: "GET"
        }
      );

      const campaign = mapCampaignResponseToView(data);
      return campaign;
    } catch (error) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  }
};

const fetchDonors: QF<
  Nullable<IDonors>,
  [Nullable<string>, string, number]
> = async ({ queryKey }) => {
  const [_, token, campaignId, donorsPage] = queryKey;

  if (token) {
    const query = new URLSearchParams({
      page: `${donorsPage}`,
      perPage: ITEMS_PER_PAGE
    });
    const endpoint = `/campaigns/${campaignId}/donations?${query}`;

    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token
    };

    try {
      const { data } = await makeRequest<IDonationResponse>(endpoint, {
        headers,
        method: "GET"
      });

      return {
        donors: mapDonationsResponseToView(data.donations),
        pagination: data.pagination
      };
    } catch (error) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  }
};

const fetchVolunteers: QF<
  Nullable<IVolunteers>,
  [Nullable<string>, string, number]
> = async ({ queryKey }) => {
  const [_, token, campaignId, volunteersPage] = queryKey;

  if (token) {
    const query = new URLSearchParams({
      page: `${volunteersPage}`,
      perPage: ITEMS_PER_PAGE
    });
    const endpoint = `/campaigns/${campaignId}/volunteers?${query}`;

    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token
    };

    try {
      const { data } = await makeRequest<IVolunteeringResponse>(endpoint, {
        headers,
        method: "GET"
      });

      return {
        volunteers: mapVolunteeringResponseToView(data.volunteerings),
        pagination: data.pagination,
        unfiltered: data.volunteerings
      };
    } catch (error) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  }
};

function mapDonationsResponseToView(donations: IDonationResponse["donations"]) {
  return donations.map((donation) => ({
    title: donation.fullName,
    detail: formatAmount(Number(donation.amount), donation.currency),
    date: moment(donation.createdAt).format(DATE_FORMAT)
  }));
}

function mapVolunteeringResponseToView(
  volunteering: IVolunteeringResponse["volunteerings"]
) {
  return volunteering.map((volunteer) => ({
    ...volunteer,
    title: volunteer.fullName,
    phoneNumber: volunteer.phoneNumber,
    detail: volunteer.gender,
    date: moment(volunteer.createdAt).format(DATE_FORMAT)
  }));
}

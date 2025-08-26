"use client";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/Button";
import Table from "../../_components/Table";
import Pagination from "../../_components/Pagination";
import StatCard from "../../_components/StatCard";
import StatCardSkeleton from "../../_components/skeletons/StatCardSkeleton";
import CompletionCard from "../../_components/CompletionCard";
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage";
import { formatAmount } from "../../_common/utils/currency";
import {
  ICampaignView,
  mapCampaignResponseToView
} from "../../_common/utils/campaign";
import DollarIcon from "@/public/svg/dollar.svg";
import { parseISO, format } from "date-fns";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import query from "@/api/query";
import _my_campaigns from "@/api/_my_campaigns";
import _withdrawals from "@/api/_withdrawals";
import { useAuth } from "@/contexts/AppProvider";
import makeRequest from "@/utils/makeRequest";
import Link from "next/link";
import Label from "../../_components/Label";
import moment from "moment";
import { regex } from "regex";

const Withdrawal = () => {
  const [page, setPage] = useState(1);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const modal = useModal();
  const toast = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const campaignsSummaryQuery = useAuthQuery({
    queryKey: query.keys.MY_CAMPAIGN,
    queryFn: () => _my_campaigns.getCampaignsSummary()
  });

  const campaignsQuery = useAuthQuery({
    queryKey: [query.keys.MY_CAMPAIGNS, page],
    queryFn: () => _my_campaigns.getCampaigns({ page }),
    select: (data) => {
      return {
        campaigns: data.campaigns.map(mapCampaignResponseToView),
        pagination: data.pagination
      };
    }
  });

  const withdrawMutation = useMutation(_withdrawals.requestWithdrawal);

  const bankDetailsQuery = useAuthQuery({
    queryKey: ["bank-details", user?.token],
    queryFn: async () => {
      if (!user?.token) return null;
      const endpoint = `/settings/bank-details`;
      const headers = { "x-auth-token": user.token };
      try {
        const { data } = await makeRequest<IBankDetail[]>(endpoint, {
          headers,
          method: "GET"
        });
        return data;
      } catch (error) {
        const message = extractErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: Boolean(user?.token)
  });

  const withdrawalsQuery = useAuthQuery({
    queryKey: ["withdrawals", user?.token, withdrawalPage],
    queryFn: async () => {
      if (!user?.token) return null;
      const query = new URLSearchParams({
        page: `${withdrawalPage}`,
        perPage: "50"
      });
      const endpoint = `/withdrawals?${query}`;
      const headers = { "x-auth-token": user.token };
      try {
        const { data } = await makeRequest<IWithdrawals>(endpoint, {
          headers,
          method: "GET"
        });
        return data;
      } catch (error) {
        const message = extractErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: Boolean(user?.token)
  });

  const summary = campaignsSummaryQuery.data;
  const campaigns = campaignsQuery.data;
  const bankDetails = bankDetailsQuery.data;
  const withdrawals = withdrawalsQuery.data;

  // Create a mapping of campaign ID to withdrawal status
  const getWithdrawalStatusForCampaign = (campaignId: string) => {
    if (!withdrawals?.withdrawals) return null;
    const withdrawal = withdrawals.withdrawals.find(w => w.campaignId === campaignId);
    return withdrawal?.status || null;
  };

  // Helper function to determine if status should be displayed based on withdrawal amount
  const shouldShowApprovedStatus = (campaign: ICampaignView, status: string | null) => {
    if (!status) return false;
    
    const amount = campaign.withdrawableAmount as string;
    const numericValue = parseInt(amount?.replace(/[₦,]/g, "") || "0") || 0;
    
    // Only show approved status if withdrawal amount is 0 and status is approved
    if (status.toLowerCase() === 'approved') {
      return numericValue === 0;
    }
    
    return true; // Show other statuses regardless of amount
  };

  const withdraw = async (campaignId: string) => {
    try {
      await withdrawMutation.mutateAsync({ campaignId });
      // Refetch both campaigns and withdrawals data
      queryClient.invalidateQueries([query.keys.MY_CAMPAIGNS]);
      queryClient.invalidateQueries([query.keys.MY_CAMPAIGN]);
      queryClient.invalidateQueries(["withdrawals"]);
      activateWithdrawalCompletionModal();
    } catch (error) {
      const message = extractErrorMessage(error);
      toast({ title: "Oops!", body: message, type: "error" });
    }
  };

  // TODO: CREATE WITHDRAWAL CARD
  const activateWithdrawalModal = (campaign: ICampaignView) => {
    const { payableAmount, serviceFee, amount, currency } =
      campaign.amountDonated!;

    modal.show(
      <CompletionCard
        altLayout
        title={`You’re making a withdrawal of ${campaign.withdrawableAmount}`}
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
                <p>-{formatAmount(serviceFee, currency)}</p>
              </div>

              <div className="flex justify-between">
                <p>Withdrawable Amount</p>
                <p>{campaign.withdrawableAmount}</p>
              </div>
              <hr className="border-t-[#CFCFCF]" />

              <div className="flex justify-between font-semibold text-base">
                <p>Amount to be received:</p>
                <p>{campaign.withdrawableAmount}</p>
              </div>
            </div>
          </div>
        }
        primaryButton={{
          label: "Withdraw Funds",
          onClick: () => {
            modal.hide();
            withdraw(campaign._id);
          }
        }}
        secondaryButton={{ label: "Cancel", onClick: modal.hide }}
        clearModal={modal.hide}
        icon={
          <div
            style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
            className="grid place-items-center rounded-[10px] border border-[#EAECF0] p-4">
            <Image src={DollarIcon} alt="" />
          </div>
        }
      />
    );
  };

  const activateWithdrawalCompletionModal = () => {
    modal.show(
      <CompletionCard
        title={`Your withdrawal has been submitted for review`}
        text={`Your money is on its way to your bank account. Thank you for choosing Crowdr.`}
        primaryButton={{
          label: "Back to Dashboard",
          onClick: modal.hide
        }}
        clearModal={modal.hide}
      />
    );
  };


  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className="mb-10">
        <h1 className="text-lg md:text-2xl font-semibold text-[#101828]">
          All Campaigns
        </h1>
      </hgroup>

      {/* Bank details check */}
      {bankDetails && bankDetails.length === 0 && (
        <div className="mb-10 p-6 bg-[#FEF0C7] border border-[#FED7AA] rounded-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-[#A75003]"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#A75003]">
                  Bank Account Required
                </h3>
              </div>
            </div>
            <div className="ml-8">
              <div className="text-sm text-[#9A3412]">
                <p className="mb-4">
                  You need to add your bank account details before you can make
                  withdrawals. This ensures your funds can be transferred to
                  your account securely.
                </p>
                <Link
                  href="/dashboard/settings/payment"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#A75003] hover:bg-[#A75003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] transition-colors duration-200">
                  Add Bank Account Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* stats - only show when bank details exist */}
      <div className="grid md:grid-cols-[repeat(4,_minmax(0,_350px))] 2xl:grid-cols-4 gap-4 md:gap-5 mb-[23px] md:mb-[75px]">
        {summary ? (
          <>
            <StatCard
              title="Total Withdrawals"
              text={formatAmount(
                summary.totalAmountDonated[0].totalAmount,
                summary.totalAmountDonated[0].currency,
                { minimumFractionDigits: 2 }
              )}
              pattern
            />
            <StatCard
              title="Withdrawable Amount"
              text={formatAmount(
                summary.totalWithdrawableAmount[0].amount,
                summary.totalWithdrawableAmount[0].currency,
                { minimumFractionDigits: 2 }
              )}
              // percentage={100}
              // time="yesterday"
              // colorScheme="light"
              pattern
            />
            <StatCard
              title="All Campaigns"
              text={summary.totalNoOfCampaigns}
              colorScheme="light"
            />
            <StatCard
              title="Active Campaigns"
              text={summary.totalNoOfCampaigns}
              colorScheme="light"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        )}
      </div>

      {/* campaigns - only show when bank details exist */}
      {campaigns && (
        <>
          <Table className="hidden md:block mb-20">
            <Table.Head>
              <Table.HeadCell>Campaign</Table.HeadCell>
              <Table.HeadCell>Target Amount</Table.HeadCell>
              <Table.HeadCell>Amount Raised</Table.HeadCell>
              <Table.HeadCell>Withdrawal Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>End Date</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {campaigns.campaigns
                .filter(
                  (campaign) =>
                    campaign.campaignType === "fundraise" ||
                    campaign.campaignType === "fundraiseAndVolunteer"
                )
                .map((campaign, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{campaign.title}</Table.Cell>
                    <Table.Cell>{campaign.fundingGoal}</Table.Cell>
                    <Table.Cell>{campaign.fundsGotten}</Table.Cell>
                    <Table.Cell>{campaign.withdrawableAmount}</Table.Cell>
                    <Table.Cell>
                      {(() => {
                        const status = getWithdrawalStatusForCampaign(campaign._id);
                        if (!status || !shouldShowApprovedStatus(campaign, status)) {
                          return <span className="text-gray-500">-</span>;
                        }
                        return status.match(regex("i")`approved`) ? (
                          <Label text={status} />
                        ) : (
                          <Label
                            text={status}
                            textColor="#B42318"
                            bgColor="#FEF3F2"
                          />
                        );
                      })()}
                    </Table.Cell>
                    <Table.Cell>
                      {campaign?.endDate &&
                        format(parseISO(campaign?.endDate), "PPP 'at' p")}
                    </Table.Cell>
                    <Table.Cell>
                      {campaign.campaignType !== "volunteer" && (() => {
                        const amount = campaign.withdrawableAmount as string;
                        const numericValue = parseInt(amount?.replace(/[₦,]/g, "") || "0") || 0;
                        const status = getWithdrawalStatusForCampaign(campaign._id);
                        
                        // Don't render button if withdrawal is approved and amount is 0 (completed withdrawal)
                        if (status && status.toLowerCase() === 'approved' && numericValue === 0) {
                          return null;
                        }
                        
                        return (
                          <Button
                            text="Withdraw"
                            onClick={() => activateWithdrawalModal(campaign)}
                            disabled={(() => {
                              // Check if bank details exist
                              if (!bankDetails || bankDetails.length === 0)
                                return true;
                              
                              // If withdrawal amount is 0, disable button
                              if (numericValue <= 0) return true;
                              
                              // Disable if status is "in-review"
                              if (status && status.toLowerCase() === 'in-review') {
                                return true;
                              }
                              
                              // Enable button for all other cases
                              return false;
                            })()}
                          />
                        );
                      })()}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>

          <div className="flex flex-col md:hidden">
            {campaigns.campaigns
              .filter(
                (campaign) =>
                  campaign.campaignType === "fundraise" ||
                  campaign.campaignType === "fundraiseAndVolunteer"
              )
              .map((campaign) => {
                const status = getWithdrawalStatusForCampaign(campaign._id);
                return (
                  <details key={campaign._id} className="group border-b border-[#DDD] mb-5">
                    <summary className="block pb-6 cursor-pointer">
                      <div className="flex items-center group-open:items-end justify-between group-open:mb-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-[#667085] font-medium">{campaign.title}</p>
                          <p className="group-open:hidden text-[#555] text-sm">{campaign.fundsGotten}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {/* Status badge - visible when closed */}
                          <div className="group-open:hidden">
                            {status && shouldShowApprovedStatus(campaign, status) ? (
                              status.match(regex("i")`approved`) ? (
                                <Label text={status} />
                              ) : (
                                <Label
                                  text={status}
                                  textColor="#B42318"
                                  bgColor="#FEF3F2"
                                />
                              )
                            ) : (
                              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">No withdrawal</span>
                            )}
                          </div>
                          {/* Chevron icons */}
                          <svg className="group-open:hidden w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <svg className="hidden group-open:block w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <div className="hidden group-open:block">
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-[#667085]">Target Amount:</span>
                            <span className="text-sm text-[#555] font-medium">{campaign.fundingGoal}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-[#667085]">Amount Raised:</span>
                            <span className="text-sm text-[#555] font-medium">{campaign.fundsGotten}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-[#667085]">Withdrawal Amount:</span>
                            <span className="text-sm text-[#555] font-medium">{campaign.withdrawableAmount}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#667085]">Status:</span>
                            <div>
                              {status && shouldShowApprovedStatus(campaign, status) ? (
                                status.match(regex("i")`approved`) ? (
                                  <Label text={status} />
                                ) : (
                                  <Label
                                    text={status}
                                    textColor="#B42318"
                                    bgColor="#FEF3F2"
                                  />
                                )
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#667085]">End Date:</span>
                            <span className="text-sm text-[#555]">
                              {campaign?.endDate && format(parseISO(campaign?.endDate), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                        
                        {/* Withdraw Button */}
                        {campaign.campaignType !== "volunteer" && (() => {
                          const amount = campaign.withdrawableAmount as string;
                          const numericValue = parseInt(amount?.replace(/[₦,]/g, "") || "0") || 0;
                          
                          // Don't render button if withdrawal is approved and amount is 0 (completed withdrawal)
                          if (status && status.toLowerCase() === 'approved' && numericValue === 0) {
                            return null;
                          }
                          
                          return (
                            <div className="flex justify-end">
                              <Button
                                text="Withdraw"
                                className="!h-9"
                                disabled={(() => {
                                  // Check if bank details exist
                                  if (!bankDetails || bankDetails.length === 0) return true;
                                  
                                  // If withdrawal amount is 0, disable button
                                  if (numericValue <= 0) return true;
                                  
                                  // Disable if status is "in-review"
                                  if (status && status.toLowerCase() === 'in-review') {
                                    return true;
                                  }
                                  
                                  // Enable button for all other cases
                                  return false;
                                })()}
                                onClick={() => activateWithdrawalModal(campaign)}
                              />
                            </div>
                          );
                        })()}
                      </div>
                    </summary>
                  </details>
                );
              })}
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
  );
};

export default Withdrawal;

interface IBankDetail {
  _id: string;
  userId: string;
  accountType: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  isVerifiedWithBVN: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IWithdrawals {
  withdrawals: Withdrawal[];
  pagination: Pagination;
}

interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Withdrawal {
  _id: string;
  userId: string;
  campaignId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  campaign: Campaign;
  totalAmountDonated: TotalAmountDonated[];
}

interface Campaign {
  _id: string;
  userId: string;
  category: string;
  title: string;
  story: string;
  campaignType: string;
  campaignStatus: string;
  campaignCoverImage: string;
  campaignAdditionalImages: string[];
  campaignStartDate: string;
  campaignEndDate: string;
  campaignViews: number;
  fundraise: Fundraise;
}

interface Fundraise {
  fundingGoalDetails: TotalAmountDonated[];
}

interface TotalAmountDonated {
  amount: number;
  currency: string;
}

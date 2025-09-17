"use client";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import StatCard from "../../admin-dashboard-components/StatCard";
import Table from "../../admin-dashboard-components/Table";
import revenueService from "../../common/services/revenue";
import { Button } from "../../../../../components/Button";
import { TbRefresh } from "react-icons/tb";

import {
  IRevenueData,
  ICurrencyBreakdown
} from "../../common/services/revenue/models/GetRevenue";

const Revenue = () => {
  const { data, refetch, isLoading } = useAuthQuery({
    queryKey: ["GET /payments/revenue/comprehensive"],
    queryFn: () => revenueService.getComprehensiveRevenue(),
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    // Values are already in their base currency units (not kobo)
    const symbol =
      currency === "NGN" || currency === "naira"
        ? "₦"
        : currency === "USD" || currency === "dollar"
        ? "$"
        : currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Calculate metrics from the data
  const calculateMetrics = () => {
    if (!data) return [];

    return [
      {
        title: "Total Transactions",
        value: data.totalTransactionCount
      },
      {
        title: "Successful Transactions",
        value: data.successfulTransactionCount
      },
      {
        title: "Failed Transactions",
        value: data.failedTransactionCount
      },
      {
        title: "Total Withdrawals",
        value: data.totalWithdrawalCount
      },
      {
        title: "Approved Withdrawals",
        value: data.approvedWithdrawalCount
      },
      {
        title: "Pending Withdrawals",
        value: data.pendingWithdrawalCount
      }
    ];
  };

  const metrics = calculateMetrics();

  // Calculate financial metrics
  const calculateFinancialMetrics = () => {
    if (!data) return [];

    return [
      {
        title: "Overall Net Revenue",
        value: formatCurrency(data.overallNetRevenue)
      },
      {
        title: "Total Service Charges",
        value: formatCurrency(data.totalServiceChargesCollected)
      },
      {
        title: "Total Transaction Fees",
        value: formatCurrency(data.totalTransactionFeesCollected)
      }
    ];
  };

  const financialMetrics = calculateFinancialMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* page title x subtitle */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <hgroup className="mb-3">
          <h1 className="text-3xl font-semibold text-[#101828] mb-2">
            Revenue Overview
          </h1>
          <p className="text-[#475467] text-lg">
            Comprehensive revenue analytics and financial metrics.
          </p>
        </hgroup>

        {/* refresh button */}
        <div className="flex justify-end">
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
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* financial metrics - highlighted section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#101828]">
              💰 Financial Performance
            </h2>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {financialMetrics.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-1">
                  {stat.title}
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* transaction stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold text-[#101828]">
              📊 Transaction Statistics
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* currency breakdown table */}
        {data &&
          data.currencyBreakdown &&
          data.currencyBreakdown.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold text-[#101828]">
                  💱 Currency Breakdown
                </h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Currency</Table.HeadCell>
                    <Table.HeadCell>Total Donations</Table.HeadCell>
                    <Table.HeadCell>Total Withdrawals</Table.HeadCell>
                    <Table.HeadCell>Service Charges</Table.HeadCell>
                    <Table.HeadCell>Transaction Fees</Table.HeadCell>
                    <Table.HeadCell>Net Revenue</Table.HeadCell>
                    <Table.HeadCell>Pending Withdrawals</Table.HeadCell>
                    <Table.HeadCell>Available Balance</Table.HeadCell>
                  </Table.Head>

                  <Table.Body>
                    {data.currencyBreakdown.map(
                      (breakdown: ICurrencyBreakdown, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-700 font-bold text-sm">
                                  {breakdown.currency === "naira"
                                    ? "₦"
                                    : breakdown.currency === "dollar"
                                    ? "$"
                                    : breakdown.currency}
                                </span>
                              </div>
                            </div>
                          </Table.Cell>

                          <Table.Cell>
                            <div className="font-medium text-blue-600">
                              {formatCurrency(
                                breakdown.totalDonations,
                                breakdown.currency
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="font-medium text-orange-600">
                              {formatCurrency(
                                breakdown.totalWithdrawals,
                                breakdown.currency
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            {formatCurrency(
                              breakdown.totalServiceCharges,
                              breakdown.currency
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {formatCurrency(
                              breakdown.totalTransactionFees,
                              breakdown.currency
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-center">
                              {formatCurrency(
                                breakdown.netRevenue,
                                breakdown.currency
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="font-medium text-yellow-600">
                              {formatCurrency(
                                breakdown.pendingWithdrawals,
                                breakdown.currency
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="font-medium text-emerald-600">
                              {formatCurrency(
                                breakdown.availableBalance,
                                breakdown.currency
                              )}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      )
                    )}
                  </Table.Body>
                </Table>
              </div>
            </div>
          )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-500 text-lg">
                Loading revenue data...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Revenue;

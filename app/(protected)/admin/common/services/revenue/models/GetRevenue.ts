export interface IGetRevenueResponse {
  message: string;
  data: IRevenueData;
}

export interface IRevenueData {
  totalTransactionCount: number;
  successfulTransactionCount: number;
  failedTransactionCount: number;
  totalWithdrawalCount: number;
  approvedWithdrawalCount: number;
  pendingWithdrawalCount: number;
  rejectedWithdrawalCount: number;
  currencyBreakdown: ICurrencyBreakdown[];
  overallNetRevenue: number;
  totalServiceChargesCollected: number;
  totalTransactionFeesCollected: number;
}

export interface ICurrencyBreakdown {
  currency: string;
  totalDonations: number;
  totalWithdrawals: number;
  totalServiceCharges: number;
  totalTransactionFees: number;
  netRevenue: number;
  pendingWithdrawals: number;
  availableBalance: number;
}
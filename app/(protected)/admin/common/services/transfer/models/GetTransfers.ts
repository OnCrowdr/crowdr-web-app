export interface IGetTransfersParams {
  page?: number;
  perPage?: number;
  userId?: string;
}

export interface IGetTransfersResponse {
  success: boolean;
  message: string;
  data: {
    status: boolean;
    message: string;
    data: IPaystackTransfer[];
    meta: {
      total: number;
      skipped: number;
      perPage: number;
      page: number;
      pageCount: number;
    };
  };
}

export interface IPaystackTransfer {
  amount: number;
  createdAt: string;
  currency: string;
  domain: string;
  failures: any;
  id: number;
  integration: number;
  reason: string;
  reference: string;
  source: string;
  source_details: any;
  status: string;
  titan_code: any;
  transfer_code: string;
  batch_code: any;
  request: number;
  transferred_at: any;
  updatedAt: string;
  recipient: IRecipient;
  session: {
    provider: any;
    id: any;
  };
  fee_charged: number;
  fees_breakdown: any;
}

export interface IRecipient {
  active: boolean;
  createdAt: string;
  currency: string;
  description: any;
  domain: string;
  email: any;
  id: number;
  integration: number;
  metadata: any;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  isDeleted: boolean;
  details: {
    authorization_code: any;
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
  };
}

export enum TransferStatus {
  Pending = "pending",
  Success = "success",
  Reversed = "reversed",
  Failed = "failed",
  Otp = "otp",
  Abandoned = "abandoned",
  Blocked = "blocked",
  Rejected = "rejected",
  Received = "received",
}

export enum WithdrawalStatus {
  InReview = "in-review",
  Rejected = "rejected",
  Approved = "approved",
  Completed = "completed",
}
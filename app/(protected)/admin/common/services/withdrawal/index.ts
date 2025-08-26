import api from "@/api";
import { extractErrorMessage } from "../../../../../../utils/extractErrorMessage";
import makeRequest from "../../../../../../utils/makeRequest";
import {
  IBankingDetails,
  IGetBankingDetails,
  IGetWithdrawal,
  IPatchWithdrawal,
  IWithdrawal
} from "./models";
import {
  IGetWithdrawalsParams,
  IGetWithdrawalsResponse
} from "./models/GetWithdrawals";
import axios from "axios";

const getWithdrawals = async (params: Partial<IGetWithdrawalsParams>) => {
  const url = `/admin/withdrawals`;

  type Key = keyof IGetWithdrawalsParams;
  for (let key in params) {
    if (params[key as Key] == null || params[key as Key] === "") {
      delete params[key as Key];
    }
  }

  try {
    const res = await api.get<IGetWithdrawalsResponse>(url, { params });
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

async function fetchWithdrawal({ withdrawalId, authToken }: IGetWithdrawal) {
  const endpoint = `/admin/withdrawals/${withdrawalId}`;
  const headers = {
    "x-auth-token": authToken
  };

  try {
    const { data } = await makeRequest<IWithdrawal>(endpoint, {
      headers,
      method: "GET"
    });

    return data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

async function changeWithdrawalStatus({
  withdrawalId: kycId,
  adminOtp,
  authToken,
  status,
  remark
}: IPatchWithdrawal) {
  const endpoint = `/admin/withdrawals/${kycId}`;
  const headers = {
    "x-admin-otp": adminOtp,
    "x-auth-token": authToken
  };

  const body = {
    status,
    ...(remark ? { remark } : {})
  };

  try {
    const { data } = await makeRequest<any>(endpoint, {
      headers,
      method: "PATCH",
      payload: JSON.stringify(body)
    });

    return data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

async function fetchBankDetails({ userId, authToken }: IGetBankingDetails) {
  const endpoint = `/admin/bank-details/user/${userId}`;
  const headers = {
    "x-auth-token": authToken
  };

  try {
    const { data } = await makeRequest<IBankingDetails[]>(endpoint, {
      headers,
      method: "GET"
    });

    return data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

const refreshWithdrawal = () => {
  
};

export default {
  fetchWithdrawal,
  changeWithdrawalStatus,
  fetchBankDetails,
  refreshWithdrawal,
  getWithdrawals
};

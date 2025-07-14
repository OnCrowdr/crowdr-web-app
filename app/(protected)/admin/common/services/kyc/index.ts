import axios from "axios";
import makeRequest from "../../../../../../utils/makeRequest";
import { extractErrorMessage } from "../../../../../../utils/extractErrorMessage";

import { IGetKyc, IKyc, IPatchKyc } from "./models";
import { IGetKycsParams, IGetKycsResponse } from "./models/GetKycs";
import api from "@/api";

const getKycs = async (params: Partial<IGetKycsParams> = {}) => {
  const url = `/admin/kyc`;

  type Key = keyof IGetKycsParams;
  for (let key in params) {
    if (params[key as Key] == null || params[key as Key] == "") {
      delete params[key as Key];
    }
  }

  try {
    const res = await api.get<IGetKycsResponse>(url, { params });
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

const _changeKycStatus = async () => {};

async function fetchKyc({ kycId, authToken }: IGetKyc) {
  const endpoint = `/admin/kyc/${kycId}`;
  const headers = {
    "x-auth-token": authToken
  };

  try {
    const { data } = await makeRequest<IKyc>(endpoint, {
      headers,
      method: "GET"
    });

    return data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

async function changeKycStatus({
  kycId,
  adminOtp,
  authToken,
  verificationStatus,
  remark
}: IPatchKyc) {
  const endpoint = `/admin/kyc/${kycId}`;
  const headers = {
    "x-admin-otp": adminOtp,
    "x-auth-token": authToken
  };

  const body = {
    verificationStatus,
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

const refreshKyc = () => {};

export default { fetchKyc, changeKycStatus, refreshKyc, getKycs };

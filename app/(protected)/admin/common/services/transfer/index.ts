import api from "@/api";
import {
  IGetTransfersParams,
  IGetTransfersResponse
} from "./models/GetTransfers";

const getTransfers = async (params: Partial<IGetTransfersParams>) => {
  const url = `/payments/paystack/transfers`;

  type Key = keyof IGetTransfersParams;
  for (let key in params) {
    if (params[key as Key] == null || params[key as Key] === "") {
      delete params[key as Key];
    }
  }

  try {
    const res = await api.get<IGetTransfersResponse>(url, { params });
    return {
      transfers: res.data.data.data,
      pagination: {
        total: res.data.data.meta.total,
        perPage: res.data.data.meta.perPage,
        currentPage: res.data.data.meta.page,
        totalPages: res.data.data.meta.pageCount,
        hasNextPage: res.data.data.meta.page < res.data.data.meta.pageCount,
        hasPrevPage: res.data.data.meta.page > 1,
      },
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export default {
  getTransfers
};
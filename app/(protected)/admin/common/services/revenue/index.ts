import api from "@/api";
import { IGetRevenueResponse } from "./models/GetRevenue";

const getComprehensiveRevenue = async () => {
  const url = `/payments/revenue/comprehensive`;

  try {
    const res = await api.get<IGetRevenueResponse>(url);
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch revenue data");
  }
};

export default {
  getComprehensiveRevenue
};
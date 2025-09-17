import api from "@/api";

export interface ExportParams {
  entity:
    | "users"
    | "campaigns"
    | "donations"
    | "withdrawals"
    | "volunteers"
    | "transactions"
    | "transfers";
  format: "csv";
  startDate?: string;
  endDate?: string;
}

const exportData = async (params: ExportParams) => {
  const url = `/export`;

  try {
    const response = await api.get(url, {
      params,
      responseType: "blob"
    });

    // Create blob link to download file
    const blob = new Blob([response.data], { type: "text/csv" });
    const href = URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = href;
    link.download = `${params.entity}_export_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(href);

    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Export failed");
  }
};

export default { exportData };

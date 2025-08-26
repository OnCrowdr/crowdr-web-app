"use client"
import { useState } from "react"
import { useMutation } from "react-query"
import { Button } from "../../../../components/Button"
import DateInput from "../../../../components/DateInput"
import exportService, { ExportParams } from "../common/services/export"
import toast from "react-hot-toast"
import DownloadIcon from "@/public/svg/file-download.svg"


interface ExportButtonProps {
  entity: ExportParams["entity"]
  className?: string
}

const ExportButton = ({ entity, className = "" }: ExportButtonProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<Date[] | null>(null)

  const exportMutation = useMutation({
    mutationFn: (params: ExportParams) => exportService.exportData(params),
    onSuccess: () => {
      setShowDatePicker(false)
      setDateRange(null)
    },
    onError: (error: any) => {
      // alert(`Export failed: ${error.message}`)
      toast.error("Export failed", { position: "top-center" })
    },
  })

  const handleExport = () => {
    if (!showDatePicker) {
      setShowDatePicker(true)
      return
    }

    const params: ExportParams = {
      entity,
      format: "csv",
    }

    if (dateRange && dateRange.length === 2) {
      params.startDate = dateRange[0].toISOString().split('T')[0]
      params.endDate = dateRange[1].toISOString().split('T')[0]
    }

    exportMutation.mutate(params)
  }

  const handleCancel = () => {
    setShowDatePicker(false)
    setDateRange(null)
  }

  if (showDatePicker) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex flex-col">
          <DateInput
            mode="range"
            placeholder="Select date range (optional)"
            value={dateRange}
            controlled
            onChange={({ value }) => setDateRange(value as Date[])}
          />
        </div>
        <Button
          text={exportMutation.isLoading ? "Exporting..." : "Export"}
          bgColor="#00B964"
          textColor="#FFF"
          onClick={handleExport}
          disabled={exportMutation.isLoading}
          className="font-semibold whitespace-nowrap"
        />
        <Button
          text="Cancel"
          bgColor="#FFF"
          textColor="#344054"
          onClick={handleCancel}
          className="font-semibold border border-gray-300"
        />
      </div>
    )
  }

  return (
    <Button
      text="Export"
      bgColor="#FFF"
      textColor="#344054"
      iconUrl={DownloadIcon}
      onClick={handleExport}
      shadow
      className={`font-semibold ${className}`}
    />
  )
}

export default ExportButton
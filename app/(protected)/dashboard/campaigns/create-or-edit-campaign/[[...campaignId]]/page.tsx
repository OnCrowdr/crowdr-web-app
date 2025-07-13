"use client"
import { useParams } from "next/navigation"
import CreateEditCampaign from "./_components/CreateEditCampaign"
import CampaignProvider from "./_components/useCampaignForm"

const CreateOrEditCampaign = () => {
  const { campaignId } = useParams() as { campaignId: string }

  return (
    <CampaignProvider campaignId={campaignId}>
      <CreateEditCampaign />
    </CampaignProvider>
  )
}

export default CreateOrEditCampaign

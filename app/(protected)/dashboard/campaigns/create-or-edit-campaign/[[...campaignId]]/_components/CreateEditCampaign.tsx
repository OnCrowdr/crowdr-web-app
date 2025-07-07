import { useFormContext } from "react-hook-form"
import { CampaignFormContext } from "./useCampaignForm"
import FundraiserFlow from "./FundraiserFlow"
import VolunteerFlow from "./VolunteerFlow"
import { RFC } from "@/types"

const CreateEditCampaign: RFC = () => {
  const { campaignForm, ...form } = useFormContext() as CampaignFormContext

  if (!campaignForm) return null

  return campaignForm === "fundraise" ? <FundraiserFlow /> : <VolunteerFlow />
}

export default CreateEditCampaign

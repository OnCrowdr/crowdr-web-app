import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { RFC } from "@/types";
import { CampaignCategory } from "../../../../../../utils/campaignCategory";
import { CampaignType } from "../../../../admin/common/services/campaign/models/GetCampaigns";

// TODO: CREATE A useForm HOOK
const CampaignFormContext: RFC = ({ children }) => {
  const formContext: CampaignFormContext = {
    ...useForm<FormFields>(config),
  };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default CampaignFormContext;
export type { CampaignFormContext, FormFields };

const config: UseFormConfig = {
  defaultValues: {},
  mode: "onChange",
};

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0];
type FormFields = {
  title: string;
  category: CampaignCategory;
  campaignType: CampaignType
  story: string;
  currency: string;
  fundingGoal: number;
  campaignDuration: [string, string];
  campaignImages?: File[];
  skillsNeeded: string[];
  otherSkillsNeeded: string;
  ageRange: string;
  genderPreference: string;
  timeCommitment: [string, string];
  volunteerCommitment: string;
  additionalNotes: string;
};
type CampaignFormContext = UseFormReturn<FormFields>;

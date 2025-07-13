import { atom } from "jotai";
import { IBaseCampaign } from "@/types/Campaign";
import { Campaign } from "@/api/_campaigns/models/GetCampaigns";

export const shareCampaignModalAtom = atom<IShareCampaignModal>({
  isOpen: false,
  campaign: null,
})

interface IShareCampaignModal {
  isOpen: boolean
  campaign: Campaign | null
}
import { atom } from "jotai";
import { ICampaign } from "@/types/Campaign";

export const shareCampaignModalAtom = atom<IShareCampaignModal>({
  isOpen: false,
  campaign: null,
})

interface IShareCampaignModal {
  isOpen: boolean
  campaign: ICampaign | null
}
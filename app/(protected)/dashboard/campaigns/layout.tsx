"use client"
import { atom, useAtom } from "jotai"
import OldModal from "../../../../components/OldModal"
import ShareCampaign from "../../../../components/ShareCampaign"
import { shareCampaignModalAtom } from "../_utils/atoms"

import { RFC } from "@/types"

const CampaignsPageLayout: RFC = ({ children }) => {
  const [{ isOpen, campaign }, setShareCampaignModal] = useAtom(
    shareCampaignModalAtom
  )

  const closeShareModal = () => {
    setShareCampaignModal({ isOpen: false, campaign: null })
  }

  return (
    <>
      {children}

      {campaign && (
        <OldModal isOpen={isOpen} onClose={closeShareModal}>
          <div
            className="relative p-12"
            style={{
              background: "rgba(76, 76, 76, 0)",
            }}
          >
            <ShareCampaign
              onClose={closeShareModal}
              campaignId={campaign._id}
              title={campaign.title}
              story={campaign.story}
              campaignCoverImage={campaign.campaignCoverImage.url}
            />
          </div>
        </OldModal>
      )}
    </>
  )
}

export default CampaignsPageLayout

import Link from "next/link"
import { mapCampaignResponseToView } from "../_common/utils/campaign"
import ProgressBar from "./ProgressBar"
import { GrayButton } from "../../../../components/Button"
import { label } from "./Label"
import { pill } from "./Pill"

import { Nullable, QF, RFC } from "@/types"
import { ICampaign } from "@/types/Campaign"
import makeRequest from "../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { BsThreeDotsVertical } from "react-icons/bs"
import { RiDeleteBinLine } from "react-icons/ri"
import DropdownTrigger from "../../../../components/DropdownTrigger"
import { useRouter } from "next/navigation"
import { useMutation } from "react-query"
import _my_campaign from "../../../../api/_my_campaigns"
import { CgSpinner } from "react-icons/cg"
import toast from "react-hot-toast"
import { isAxiosError } from "axios"
import { IPatchEndCampaignError } from "../../../../api/_my_campaigns/models/PatchEndCampaign"
import SidebarModal from "./SidebarModal"
import CompletionCard from "./CompletionCard"
import ModalTrigger, {
  modalStoreAtom,
} from "../../../../components/ModalTrigger"
import { useAtomValue } from "jotai"
import { LuEye, LuTrash2 } from "react-icons/lu"
import { MdBlock } from "react-icons/md"
import { isAfter, parseISO } from "date-fns"
import { Campaign } from "@/api/_campaigns/models/GetCampaigns"

const CampaignCard: RFC<CampaignCardProps> = ({ campaign, onDelete }) => {
  const {
    _id,
    title,
    category,
    duration,
    status,
    views,
    donors,
    volunteers,
    fundingGoal,
    fundsGotten,
    percentage,
    campaignType,
  } = mapCampaignResponseToView(campaign)
  const router = useRouter()
  const isVolunteerCampaign = campaignType === "volunteer"
  const modalStore = useAtomValue(modalStoreAtom)

  // Check if campaign has ended
  const currentDate = new Date()
  const campaignEndDate = campaign.campaignEndDate ? parseISO(campaign.campaignEndDate) : null
  const hasEnded = campaignEndDate ? isAfter(currentDate, campaignEndDate) : false

  const deleteMutation = useMutation({
    mutationFn: () => _my_campaign.deleteCampaign({ id: _id }),
    onSuccess: (res) => {
      onDelete()
      toast.success("Campaign deleted!")
    },
    onError: (err) => {
      if (isAxiosError<IPatchEndCampaignError>(err) && err.response) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Failed to end campaign")
      }
    },
  })

  const endMutation = useMutation({
    mutationFn: () => _my_campaign.endCampaign({ id: _id }),
    onSuccess: (res) => {
      toast.success("Campaign ended!")
    },
    onError: (err) => {
      if (isAxiosError<IPatchEndCampaignError>(err) && err.response) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Failed to end campaign")
      }
    },
  })

  const hideConfirmationModal = (modalId: string) => {
    const modal = modalStore.get(modalId)
    modal?.hide()
  }

  const cardProps = {
    onClick: () => router.push(`/dashboard/campaigns/${_id}`),
    onHover: () => router.prefetch(`/dashboard/campaigns/${_id}`),
  }

  const dontPropagate = {
    onClick: (e: any) => e.stopPropagation(),
  }

  return (
    <>
      <div
        {...cardProps}
        className="bg-white border border-[rgba(57, 62, 70, 0.08)] hover:cursor-pointer rounded-xl px-[10px] pt-6 pb-[10px] md:py-[26px] md:px-6"
      >
        <div className="px-[7px] md:px-0">
          <div className="flex items-center justify-between mb-2 md:mb-[10px]">
            {label(status)}

            <DropdownTrigger
              triggerId={`campaignCardOptionsBtn-${_id}`}
              targetId={`campaignCardOptions-${_id}`}
              options={{ placement: "left-start" }}
              className="ml-auto"
            >
              <button
                {...dontPropagate}
                className="relative left-2 hover:bg-gray-100 rounded-full transition-colors p-2"
              >
                <BsThreeDotsVertical size={22} />
              </button>
            </DropdownTrigger>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-[19px]">
            <p className="text-lg text-black mb-2 md:mb-0">{title}</p>
            {pill(category)}
          </div>
        </div>

        {percentage !== undefined ? (
          <div className="bg-[#F9F9F9] rounded-lg p-4 mb-[12px] md:mb-3">
            <p className="text-sm text-[#667085] mb-1">
              <span className="text-[#292A2E]">Goal</span> {fundsGotten}/
              {fundingGoal}
            </p>
            <ProgressBar percent={percentage} showValue />
          </div>
        ) : (
          <div className="h-20 m-3" />
        )}

        <div className="flex flex-col md:flex-row justify-between md:items-end">
          <div className="text-[13px] text-[#5C636E] px-[7px] md:px-0 mb-2.5">
            <p className="mb-2.5">
              <span className="text-black font-medium">Views:</span>{" "}
              <span className="text-[#5C636E] font">{views}</span>
            </p>
            <p className="mb-2.5">
              <span className="text-black font-medium">
                {!isVolunteerCampaign ? "Donors:" : "Volunteers:"}
              </span>{" "}
              <span>{!isVolunteerCampaign ? campaign?.campaignDonors?.length : volunteers}</span>
            </p>
            <p>
              <span className="text-black font-medium">Duration:</span>{" "}
              <span className={hasEnded ? "text-red-600 font-medium" : ""}>
                {hasEnded ? "Ended" : duration}
              </span>
            </p>
          </div>
          <GrayButton
            {...dontPropagate}
            href={`/dashboard/campaigns/create-or-edit-campaign/${_id}`}
            text="Update campaign"
            textColor="#667085"
            outlineColor="transparent"
            className="self-end !px-7 !h-[44px]"
          />
        </div>
      </div>

      {/* dropdown */}
      <div
        id={`campaignCardOptions-${_id}`}
        className="hidden w-36 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <Link href={`/dashboard/campaigns/${_id}`}>
          <button className="relative inline-flex items-center gap-2 w-full px-2 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 text-[#61656B]">
            <LuEye size={16} />
            View
          </button>
        </Link>
        {!hasEnded && (
          <ModalTrigger id={`end_campaign_modal-${_id}`}>
            <button className="relative inline-flex items-center gap-2 w-full px-2 py-2 text-sm font-medium border-gray-200 hover:bg-gray-100 text-[#61656B]">
              <MdBlock size={16} />
              End campaign
            </button>
          </ModalTrigger>
        )}
        <ModalTrigger id={`delete_campaign_modal-${_id}`}>
          <button className={`relative inline-flex items-center gap-2 w-full px-2 py-2 text-sm font-medium border-gray-200 hover:bg-gray-100 text-[#FE0A2D] ${hasEnded ? 'rounded-b-lg' : ''}`}>
            <LuTrash2 stroke="#FE0A2D" size={16} />
            Delete
          </button>
        </ModalTrigger>
      </div>

      <SidebarModal id={`delete_campaign_modal-${_id}`}>
        <CompletionCard
          title="Delete campaign"
          text="Are you sure you want to delete this campaign?"
          primaryButton={{
            label: "Delete campaign",
            bgColor: "#D92D20",
            loading: deleteMutation.isLoading,
            onClick: () => deleteMutation.mutate(),
          }}
          secondaryButton={{
            label: "Cancel",
            onClick: () =>
              hideConfirmationModal(`delete_campaign_modal-${_id}`),
          }}
          clearModal={() =>
            hideConfirmationModal(`delete_campaign_modal-${_id}`)
          }
          icon={
            <div className="grid place-items-center rounded-full bg-[#FEE4E2] p-3">
              <RiDeleteBinLine fill="#D92D20" size={20} />
            </div>
          }
        />
      </SidebarModal>

      {!hasEnded && (
        <SidebarModal id={`end_campaign_modal-${_id}`}>
          <CompletionCard
            title="End campaign"
            text="Are you sure you want to end this campaign?"
            primaryButton={{
              label: "End campaign",
              bgColor: "#D92D20",
              loading: endMutation.isLoading,
              onClick: () => endMutation.mutate(),
            }}
            secondaryButton={{
              label: "Cancel",
              onClick: () => hideConfirmationModal(`end_campaign_modal-${_id}`),
            }}
            clearModal={() => hideConfirmationModal(`end_campaign_modal-${_id}`)}
            icon={
              <div className="grid place-items-center rounded-full bg-[#FEE4E2] p-3">
                <RiDeleteBinLine fill="#D92D20" size={20} />
              </div>
            }
          />
        </SidebarModal>
      )}
    </>
  )
}

export default CampaignCard

type CampaignCardProps = {
  campaign: Campaign
  onDelete: () => void
}

const endCampaign: QF<Nullable<any>, [Nullable<string>, number]> = async ({
  queryKey,
}) => {
  const [_, token, id] = queryKey

  if (token) {
    const endpoint = `/my-campaigns/end/${id}`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<any>(endpoint, {
        headers,
        method: "PATCH",
      })

      return data
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}
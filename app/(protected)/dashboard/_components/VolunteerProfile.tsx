import ModalTrigger from "../../../../components/shared/ModalTrigger"
import { useSetAtom } from "jotai"
import { pageDrawerAtom } from "./Sidebar"
import { HiMiniXMark } from "react-icons/hi2"
import { IVolunteerProfile } from "../campaigns/[campaignId]/page"
import { RFC } from "@/types"
import TextInput from "../../../../components/shared/TextInput"
import TextAreaInput from "../../../../components/shared/TextAreaInput"
import { Button, WhiteButton } from "../../../../components/shared/Button"
import { useUser } from "../../../../contexts/UserProvider"
import makeRequest from "../../../../utils/makeRequest"
import toast from "react-hot-toast"

const VolunteerProfile: RFC<Props> = ({ volunteer }) => {
  const setCurrentDrawerId = useSetAtom(pageDrawerAtom)
  const clearDrawerId = () => setCurrentDrawerId("")
  const user = useUser()

  const updateApproval = async (body: IPatchVolunteerBody) => {
    if (user && volunteer) {
      const endpoint = `/my-campaigns/${volunteer.campaignId}/volunteer/${volunteer._id}`
      const headers = {
        "x-auth-token": user.token,
      }

      try {
        const { data } = await makeRequest<IPatchVolunteerResponse>(endpoint, {
          method: "PATCH",
          headers,
          payload: JSON.stringify(body),
        })
        toast.success(data.message)
      } catch (error: any) {
        toast.error(error?.error || "Something went wrong")
      }
    }
  }

  return (
    <div className="flex flex-col bg-white w-[400px] h-full max-h-full pt-6">
      <div className="flex justify-between px-6 mb-6">
        <h1 className="font-semibold text-2xl">Volunteer Details</h1>

        <ModalTrigger id="volunteer" type="hide">
          <div
            onClick={clearDrawerId}
            className="relative hover:bg-[#F8F8F8] transition cursor-pointer rounded-full p-2 -top-1"
          >
            <HiMiniXMark fill="#98A2B3" className="h-6 w-6" />
          </div>
        </ModalTrigger>
      </div>

      {volunteer && (
        <div className="flex flex-col gap-[14px] grow overflow-y-auto px-6">
          <TextInput disabled label="Full name" value={volunteer.fullName} />
          <TextInput disabled label="Email address" value={volunteer.email} />
          <TextInput
            disabled
            label="Phone number"
            value={volunteer.phoneNumber}
          />
          <TextInput disabled label="Gender" value={volunteer.gender} />
          <TextInput disabled label="Age" value={volunteer.ageRange} />
          <TextInput disabled label="Social Media Links" value={"--"} />
          <div className="grid gap-1.5">
            <p>Skills</p>
            <p>--</p>
          </div>
          <TextAreaInput
            disabled
            label="Volunteer's Motivation"
            value={volunteer.about}
          />

          <div className="flex justify-end gap-3 my-[60px]">
            <WhiteButton
              onClick={() => updateApproval({ status: "REJECTED" })}
              text="Reject Volunteer"
              outlineColor="#D0D5DD"
            />
            <Button
              onClick={() => updateApproval({ status: "APPROVED" })}
              text="Accept Volunteer"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default VolunteerProfile

interface Props {
  volunteer: IVolunteerProfile | undefined
}

interface IPatchVolunteerBody {
  status: "PENDING" | "APPROVED" | "REJECTED"
  remark?: string
}

export interface IPatchVolunteerResponse {
  success: boolean;
  message: string;
  data:    IPatchVolunteerResponseData;
}

export interface IPatchVolunteerResponseData {
  _id:         string;
  campaignId:  string;
  fullName:    string;
  email:       string;
  status:      string;
  gender:      string;
  ageRange:    string;
  address:     string;
  about:       string;
  userId:      string;
  phoneNumber: string;
  createdAt:   Date;
  updatedAt:   Date;
  __v:         number;
  remark:      string;
}

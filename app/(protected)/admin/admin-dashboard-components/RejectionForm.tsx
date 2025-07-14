"use client"
import { useEffect, useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { useUser } from "../../../../contexts/UserProvider"
import { useToast } from "../../../../hooks/useToast"
import { Button } from "../../../../components/Button"
import TextInput from "../../../../components/TextInput"
import TextAreaInput from "../../../../components/TextAreaInput"
import ModalTrigger, {
  modalStoreAtom,
} from "../../../../components/ModalTrigger"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import kycService from "../common/services/kyc"
import { kycToRejectAtom } from "./KycPopup"
import { withdrawalToRejectAtom } from "./WithdrawalPopup"

import { RFC } from "@/types"
import withdrawalService from "../common/services/withdrawal"
import { useAuth } from "@/contexts/AppProvider"

const RejectionForm: RFC<RejectionFormProps> = () => {
  const [title, setTitle] = useState("")
  const [remark, setRemark] = useState("")
  const [kycToReject, setKycToReject] = useAtom(kycToRejectAtom)
  const [withdrawalToReject, setWithdrawalToReject] = useAtom(
    withdrawalToRejectAtom
  )
  const [isRejecting, setIsRejecting] = useState(false)
  const modalStore = useAtomValue(modalStoreAtom)
  const {user } = useAuth()
  const toast = useToast()

  const modal = modalStore.get("kycRejectionForm")!
  if (modal) {
    modal._options.onHide = () => {
      setTitle("")
      setRemark("")
      setKycToReject(null)
      setWithdrawalToReject(null)
    }
  }

  const reject = async () => {
    if (user && (kycToReject?.id || withdrawalToReject?.id)) {
      setIsRejecting(true)

      try {
        if (kycToReject) {
          const res = await kycService.changeKycStatus({
            kycId: kycToReject.id,
            adminOtp: kycToReject.otp,
            authToken: user.token,
            verificationStatus: "rejected",
            remark,
          })

          toast({ title: "KYC Rejected" })
          kycService.refreshKyc()
        } else if (withdrawalToReject) {
          const res = await withdrawalService.changeWithdrawalStatus({
            withdrawalId: withdrawalToReject.id,
            adminOtp: withdrawalToReject.otp,
            authToken: user.token,
            status: "rejected",
            remark,
          })

          toast({ title: "Withdrawal Rejected" })
          withdrawalService.refreshWithdrawal()
        }

        setIsRejecting(false)
        modal.hide()
      } catch (error) {
        setIsRejecting(false)
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message })
      }
    }
  }

  return (
    <div
      style={{ boxShadow }}
      className="max-w-[342px] md:max-w-[544px] bg-white rounded-lg overflow-hidden p-4 md:p-6"
    >
      <div className="relative flex justify-between md:gap-4 mb-5 w-full">
        <Rings />

        {/* md:(heading x subheading) */}
        <div className="hidden md:flex flex-col gap-1 w-full">
          <div className="flex justify-between text-lg text-[#101828] font-semibold md:mb-1">
            Reason for Rejection
            <ModalTrigger id="kycRejectionForm" type="hide">
              <XIcon className="hidden md:inline cursor-pointer" />
            </ModalTrigger>
          </div>

          <p className="text-sm text-[#475467] md:text-justify md:pr-2">
            Let the user know why he/she was not selected
          </p>
        </div>

        <div className="md:pointer-events-none contents">
          <ModalTrigger id="kycRejectionForm" type="hide">
            <XIcon
              className="md:hidden cursor-pointer"
              wrapperClass="mr-4 md:mr-0 ml-auto md:ml-0"
            />
          </ModalTrigger>
        </div>
      </div>

      {/* title x description */}
      <div className="flex flex-col gap-4 mb-8">
        {/* <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title*"
          placeholder="What is your title?"
        /> */}

        <TextAreaInput
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          label="Description*"
          placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
        />
      </div>

      {/* base:(heading x subheading) */}
      <div className="flex flex-col md:hidden gap-1 mb-6">
        <p className="text-lg font-semibold">Reason for Rejection</p>
        <p className="text-sm text-[#475467]">
          Let the user know why he/she was not selected
        </p>
      </div>

      <div className="flex flex-col">
        <Button
          text="Add Reason"
          onClick={reject}
          loading={isRejecting}
          disabled={isRejecting}
          className={buttonClasses}
          shadow
        />
      </div>
    </div>
  )
}

export default RejectionForm

type RejectionFormProps = {}

type Button = {
  label: string
  href?: string
  onClick?: () => void
  bgColor?: string
}

const Rings = () => {
  const ringClasses =
    "absolute scale border rounded-full border-[#D0D5DD] left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] "

  return (
    <div
      className={`absolute grid place-content-center shrink-0 rounded-full w-12 h-12`}
    >
      <div
        className={
          ringClasses +
          "opacity-90 w-[calc(48px+(24px*2))] h-[calc(48px+(24px*2))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-70 w-[calc(48px+(24px*4))] h-[calc(48px+(24px*4))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-50 w-[calc(48px+(24px*6))] h-[calc(48px+(24px*6))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-30 w-[calc(48px+(24px*8))] h-[calc(48px+(24px*8))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-10 w-[calc(48px+(24px*10))] h-[calc(48px+(24px*10))]"
        }
      ></div>
    </div>
  )
}

const XIcon = ({ onClick, className, wrapperClass }: any) => {
  return (
    <div className={`relative ${wrapperClass || ""}`}>
      <div className="absolute grid place-items-center top-[50%] right-[50%] -translate-y-[50%] translate-x-[50%] rounded-full hover:bg-[#F8F8F8] transition h-10 w-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          onClick={onClick}
          className={className}
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="#98A2B3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

const boxShadow =
  "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)"
const buttonClasses = "!justify-center font-semibold !text-base !bg-red-500"

"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { atom, useAtom } from "jotai"
import { useUser } from "../../../../contexts/UserProvider"
import { useToast } from "../../../../hooks/useToast"
import { Button, GrayButton } from "../../../../components/shared/Button"
import FileItem from "./FileItem"
import TextInput from "../../../../components/shared/TextInput"
import ModalTrigger, {
  modalStoreAtom,
} from "../../../../components/shared/ModalTrigger"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import otpService from "../common/services/otp"
import kycService from "../common/services/kyc"

import { CgSpinner } from "react-icons/cg"
import XMark from "@/public/svg/x-mark.svg"
import { IKyc } from "../common/services/kyc/models"

export const activeKycIdAtom = atom<string | null>(null)
export const kycToRejectAtom = atom<{ id: string; otp: string } | null>(null)

const KycPopup = () => {
  const [adminOtp, setAdminOtp] = useState("")
  const [kycData, setKycData] = useState<IKyc | null>(null)
  const [activeKycId, setActiveKycId] = useAtom(activeKycIdAtom)
  const [modalStore] = useAtom(modalStoreAtom)
  const [_, setKycToReject] = useAtom(kycToRejectAtom)
  const [isApproving, setIsApproving] = useState(false)
  const user = useUser()
  const toast = useToast()
  const otpIsFilled = adminOtp.length > 0
  const isOrganization = kycData?.kyc?.user?.userType === "non-profit"
  const kycApproved = kycData?.kyc?.verificationStatus === "completed"

  useEffect(() => {
    if (user && activeKycId) {
      kycService
        .fetchKyc({
          kycId: activeKycId,
          authToken: user.token,
        })
        .then((res) => setKycData(res))

      const modal = modalStore.get("kycPopup")!
      modal._options.onHide = () => {
        setAdminOtp("")
        setActiveKycId(null)
        setKycData(null)
      }
    } else {
      setKycData(null)
      setIsApproving(false)
    }
  }, [activeKycId])

  const generateToken = async () => {
    if (user) {
      const res = await otpService.generateOtp(user.token)
      toast({ title: "OTP created!", body: `OTP sent to ${res.email}` })
    }
  }

  const approveKyc = async () => {
    if (user && activeKycId) {
      setIsApproving(true)

      try {
        const res = await kycService.changeKycStatus({
          kycId: activeKycId,
          adminOtp: adminOtp,
          authToken: user.token,
          verificationStatus: "completed",
        })

        const kycData = await kycService.fetchKyc({
          kycId: activeKycId,
          authToken: user.token,
        })

        setKycData(kycData)
        setIsApproving(false)
        toast({ title: "KYC Approved" })

        kycService.refreshKyc()
      } catch (error) {
        setIsApproving(false)
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message })
      }
    }
  }

  if (kycData) {
    return (
      <div className="grow max-w-[1031px] bg-white px-[50px] py-10 mb-11 border">
        <div className="flex justify-between items-center mb-11">
          <h2 className="font-semibold text-2xl text-black">KYC Information</h2>
          <ModalTrigger id="kycPopup" type="hide">
            <Image src={XMark} alt="" />
          </ModalTrigger>
        </div>

        <div className="flex flex-col gap-4 max-w-[440px] mb-6">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#61656B]">
                {isOrganization ? "Organization" : "Individual"}
              </p>
              <h2 className="font-semibold text-2xl text-black">
                {isOrganization
                  ? kycData.kyc.user?.organizationName
                  : kycData.kyc.user?.fullName}
              </h2>
            </div>
            {/* {isOrganization && (
              <p className="self-end font-semibold text-[#61656B]">
                4536673337
              </p>
            )} */}
          </div>

          <div className="flex gap-3">
            {/* <div className="flex flex-col gap-1">
              <p className="text-xs text-[#61656B]">BVN Number</p>
              <p className="text-sm text-[#393E46]">{kycData.kyc.BVN}</p>
            </div> */}
            {kycData.org && (
              <>
                {/* <div className="border-r border-[#61656B] self-stretch"></div> */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-[#61656B]">CAC Number</p>
                  <p className="text-sm text-[#393E46]">
                    {kycData.org.cacNumber}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-[55px]">
          <p className="font-semibold text-[#61656B] mb-4">
            Verification Documents
          </p>
          <div className="flex flex-col gap-5 max-w-[480px]">
            <FileItem
              fileName={kycData.kyc.docType}
              url={kycData.kyc.docImg?.url}
            />
            <FileItem fileName="selfie" url={kycData.kyc.selfieImg?.url} />
            {/* {files.map((file, index) => (
              <FileItem key={index} />
            ))} */}
          </div>
        </div>

        {!kycApproved && (
          <div className="max-w-xs mb-[55px]">
            <p
              className="text-primary text-xs mb-1.5 hover:underline cursor-pointer"
              onClick={generateToken}
            >
              Generate OTP
            </p>
            <TextInput
              value={adminOtp}
              onChange={(e) => setAdminOtp(e.target.value)}
              placeholder="Fill in OTP"
              controlled
            />
          </div>
        )}

        <div className="flex gap-6">
          {kycApproved ? (
            <GrayButton
              text="KYC Verified"
              className="h-11 !w-[218px] !justify-center"
              disabled
            />
          ) : (
            <>
              <ModalTrigger id="kycPopup" type="hide">
                <ModalTrigger id="kycRejectionForm">
                  <GrayButton
                    text="Decline"
                    className="h-11 !w-[218px] !justify-center !bg-red-600 !text-white"
                    disabled={!otpIsFilled}
                    onClick={() =>
                      setKycToReject({ id: activeKycId!, otp: adminOtp })
                    }
                  />
                </ModalTrigger>
              </ModalTrigger>

              <Button
                text="Approve KYC"
                loading={isApproving}
                disabled={!otpIsFilled || isApproving}
                className="h-11 !w-[218px] !justify-center"
                onClick={approveKyc}
              />
            </>
          )}
        </div>
      </div>
    )
  }

  return <CgSpinner size="50px" className="animate-spin icon opacity-100" />
}

export default KycPopup

const files = [
  {
    name: "CAC Documents",
    size: "200 KB",
  },
  {
    name: "Company's logo",
    size: "200 KB",
  },
]

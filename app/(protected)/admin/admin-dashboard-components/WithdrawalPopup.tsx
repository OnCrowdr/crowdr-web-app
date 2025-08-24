"use client"
import Image from "next/image"
import { atom, useAtom } from "jotai"
import { Button, GrayButton } from "../../../../components/Button"
import TextInput from "../../../../components/TextInput"
import ModalTrigger, {
  modalStoreAtom,
} from "../../../../components/ModalTrigger"

import { CgSpinner } from "react-icons/cg"
import XMark from "@/public/svg/x-mark.svg"
import { useEffect, useState } from "react"
import withdrawalService from "../common/services/withdrawal"
import { useUser } from "../../../../contexts/UserProvider"
import { useToast } from "../../../../hooks/useToast"
import otpService from "../common/services/otp"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import Text from "../../dashboard/_components/Text"
import { formatAmount } from "../../dashboard/_common/utils/currency"
import { IBankingDetails, IWithdrawal } from "../common/services/withdrawal/models"
import { useAuth } from "@/contexts/AppProvider"

export const activeWithdrawalIdAtom = atom<string | null>(null)
export const withdrawalToRejectAtom = atom<{ id: string; otp: string } | null>(
  null
)

const WithdrawalPopup = () => {
  const [adminOtp, setAdminOtp] = useState("")
  const [withdrawalData, setWithdrawalData] = useState<IWithdrawal | null>(null)
  const [bankDetails, setBankDetails] = useState<IBankingDetails | null>(null)
  const [activeWithdrawalId, setActiveWithdrawalId] = useAtom(
    activeWithdrawalIdAtom
  )
  const [modalStore] = useAtom(modalStoreAtom)
  const [_, setWithdrawalToReject] = useAtom(withdrawalToRejectAtom)
  const [isApproving, setIsApproving] = useState(false)
  const {user } = useAuth()
  const toast = useToast()
  const otpIsFilled = adminOtp.length > 0
  const isOrganization = withdrawalData?.user.userType === "non-profit"
  const withdrawalApproved = withdrawalData?.status === "approved"

  useEffect(() => {
    const initialize = async () => {
      if (user && activeWithdrawalId) {
        const modal = modalStore.get("withdrawalPopup")!

        try {
          const withdrawalData = await withdrawalService.fetchWithdrawal({
            withdrawalId: activeWithdrawalId,
            authToken: user.token,
          })

          const [bankingDetails] = await withdrawalService.fetchBankDetails({
            userId: withdrawalData.userId,
            authToken: user.token,
          })

          setWithdrawalData(withdrawalData)
          setBankDetails(bankingDetails)

          modal._options.onHide = () => {
            setAdminOtp("")
            setActiveWithdrawalId(null)
            setWithdrawalData(null)
          }
        } catch (error) {
          modal.hide()
          const message = extractErrorMessage(error)
          toast({ title: "Oops!", body: message })
        }
      } else {
        setWithdrawalData(null)
        setIsApproving(false)
      }
    }

    initialize()
  }, [activeWithdrawalId])

  const generateToken = async () => {
    if (user) {
      const res = await otpService.generateOtp(user.token)
      toast({ title: "OTP created!", body: `OTP sent to ${res.email}` })
    }
  }

  const approveWithdrawal = async () => {
    if (user && activeWithdrawalId) {
      setIsApproving(true)

      try {
        const res = await withdrawalService.changeWithdrawalStatus({
          withdrawalId: activeWithdrawalId,
          adminOtp: adminOtp,
          authToken: user.token,
          status: "approved",
        })

        const withdrawalData = await withdrawalService.fetchWithdrawal({
          withdrawalId: activeWithdrawalId,
          authToken: user.token,
        })

        setWithdrawalData(withdrawalData)
        setIsApproving(false)
        toast({ title: "Withdrawal Approved" })
        
         withdrawalService.refreshWithdrawal()
        withdrawalService.fetchWithdrawal({
          withdrawalId: activeWithdrawalId,
          authToken: user.token,
        })
        const modal = modalStore.get("withdrawalPopup")!
        modal.hide()

       
      } catch (error) {
        setIsApproving(false)
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message })
      }
    }
  }

  if (withdrawalData) {
    const [{ payableAmount, serviceFee, currency, amount }] =
      withdrawalData.totalAmountDonated

      const [{ availableAmount }] = withdrawalData.withdrawableAmounts

    return (
      <div className="grow max-w-[1031px] bg-white px-[50px] py-10 mb-11 border max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-11">
          <h2 className="font-semibold text-2xl text-black">Withdrawal</h2>
          <ModalTrigger id="withdrawalPopup" type="hide">
            <Image src={XMark} alt="" />
          </ModalTrigger>
        </div>

        <div className="flex flex-col gap-4 max-w-[440px] mb-[7px]">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#61656B]">
                {isOrganization ? "Organization" : "Individual"}
              </p>
              <h2 className="font-semibold text-2xl text-black">
                {isOrganization ? withdrawalData.user.organizationName : withdrawalData.user.fullName}
              </h2>
            </div>
            {/* {isOrganization && (
              <p className="self-end font-semibold text-[#61656B]">
                4536673337
              </p>
            )} */}
          </div>

          <div className="flex flex-col gap-1">
            <Text
              characterLimit={128}
              expandText="Read more"
              className="text-sm text-[#393E46]"
              toggle
            >
              {withdrawalData.campaign.story}
            </Text>
          </div>
        </div>

        <div className="px-2.5 max-w-[512px]">
          <div className="flex flex-col gap-[26px] pt-2.5 mb-6">
            <TextInput
              label="Withdrawal amount"
              value={formatAmount(availableAmount, currency)}
              disabled
            />
            <TextInput
              label="Account number"
              value={bankDetails?.accountNumber}
              disabled
            />
            <TextInput label="Bank" value={bankDetails?.bankName} disabled />
            <TextInput
              label="Account name"
              value={bankDetails?.accountName}
              disabled
            />
          </div>

          {/* break down */}
          <div className="flex flex-col gap-4 text-xs mb-10">
            <hr className="border-t-[#CFCFCF]" />
            <h3 className="font-semibold text-[#666]">Donation Breakdown</h3>

            <div className="flex justify-between">
              <p>Total raised</p>
              <p>{formatAmount(amount, currency)}</p>
            </div>

            <div className="flex justify-between">
              <p>Service fee</p>
              <p>
                - {formatAmount(serviceFee, currency)}
              </p>
            </div>

             <div className="flex justify-between">
              <p>Withdrawable Amount</p>
              <p>
               {formatAmount(availableAmount, currency)}
              </p>
            </div>
            <hr className="border-t-[#CFCFCF]" />

            <div className="flex justify-between font-semibold text-base">
              <p>Amount payable</p>
              <p>
                {formatAmount(availableAmount, currency)}
              </p>
            </div>
          </div>

          {!withdrawalApproved && (
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
            <ModalTrigger id="withdrawalPopup" type="hide">
              <ModalTrigger id="kycRejectionForm">
                <GrayButton
                  text="Decline"
                  className="h-11 !w-[218px] !justify-center"
                  disabled={!otpIsFilled}
                  onClick={() =>
                    setWithdrawalToReject({
                      id: activeWithdrawalId!,
                      otp: adminOtp,
                    })
                  }
                />
              </ModalTrigger>
            </ModalTrigger>

            <Button
              text="Approve Withdrawal"
              loading={isApproving}
              disabled={!otpIsFilled || isApproving}
              className="h-11 !w-[218px] !justify-center"
              onClick={approveWithdrawal}
            />
          </div>
        </div>
      </div>
    )
  }

  return <CgSpinner size="50px" className="animate-spin icon opacity-100" />
}

export default WithdrawalPopup

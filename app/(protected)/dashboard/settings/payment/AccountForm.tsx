import { useEffect, useState } from "react"
import { useFormContext, Controller } from "react-hook-form"
import TextInput from "../../../../../components/TextInput"
import SelectInput from "../../../../../components/SelectInput"
import AccountFormContext, { FormFields } from "../utils/useAccountForm"
import { Option } from "../../_common/utils/form"
import { Button } from "../../../../../components/Button"
import _banks from "../../_common/utils/banks"
import { IBankDetail } from "./page"
import { QF, RFC } from "@/types"
import { useQuery } from "react-query"
import makeRequest from "../../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import { keys } from "../../_utils/queryKeys"
import { useToast } from "../../../../../hooks/useToast"

const AccountForm: RFC<AccountFormProps> = ({
  onSubmit,
  onCloseForm,
  accountDetails,
}) => {
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useFormContext() as AccountFormContext
  const toast = useToast()

  // Local state for account resolution
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifiedAccount, setVerifiedAccount] = useState<string | null>(null)

  // Watch for changes to account number and bank
  const accountNumber = watch("accountNumber")
  const bankName = watch("bankName")

  // Find the bank code based on selected bank name
  const selectedBank = _banks.find((bank) => bank.name === bankName)
  const bankCode = selectedBank?.code || ""

  // Format banks for dropdown
  const banks = [Option("", "Select a bank...", true)].concat(
    _banks
      .map(({ name }) => Option(name, name))
      .sort((a, b) => a.label.localeCompare(b.label))
  )

  // Verify account number when both account number and bank are selected
  const verifyAccount = async () => {
    if (!accountNumber || !bankCode || accountNumber.length !== 10) {
      return
    }

    setIsVerifying(true)
    setVerifiedAccount(null)

    try {
      const endpoint = `/payments/banks/resolve/account_number/${accountNumber}/bank_code/${bankCode}`
      const { data } = await makeRequest<{ account_name: string }>(endpoint, {
        method: "GET",
      })

      if (data && data.account_name) {
        setVerifiedAccount(data.account_name)
        setValue("accountName", data.account_name, { shouldValidate: true })
        toast({
          title: "Account Verified",
          body: "Account details have been verified successfully.",
          type: "success",
        })
      }
    } catch (error) {
      const message = extractErrorMessage(error)
      toast({
        title: "Verification Failed",
        body: message || "Could not verify account. Please check your details.",
        type: "error",
      })
      setValue("accountName", "", { shouldValidate: true })
    } finally {
      setIsVerifying(false)
    }
  }

  // Effect to handle auto-verification when both fields have values
  useEffect(() => {
    // Only verify if account number is complete (10 digits) and bank is selected
    if (accountNumber?.length === 10 && bankCode) {
      verifyAccount()
    }
  }, [accountNumber, bankCode])

  // Populate form with existing account details
  useEffect(() => {
    if (accountDetails) {
      const { accountNumber, bankName, accountName, accountType } =
        accountDetails
      reset({
        accountNumber,
        bankName,
        accountName,
        accountType,
      })
    }
  }, [accountDetails, reset])

  return (
    <form
      onSubmit={handleSubmit((formFields) =>
        onSubmit({ ...formFields, bankCode })
      )}
      className="max-w-lg flex flex-col gap-[26px] mb-[33px] md:mb-[35px]"
    >
      <div className="flex flex-col gap-5 mb-[33px] md:mb-[31px]">
        <TextInput
          name="accountNumber"
          rules={{
            required: "Account number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Enter a valid 10-digit account number",
            },
          }}
          label="Account number"
          placeholder="Enter your 10-digit account number"
        />

        <SelectInput
          name="bankName"
          rules={{
            required: "Bank is required",
          }}
          options={banks}
          label="Bank"
          ariaLabel="Bank"
          isSearchable
        />

        {/* Verification Status */}
        {(isVerifying || verifiedAccount) && (
          <div
            className={`text-sm ${
              verifiedAccount ? "text-green-600" : "text-gray-500"
            } pl-1`}
          >
            {isVerifying
              ? "Verifying account details..."
              : verifiedAccount
              ? `✓ Account verified: ${verifiedAccount}`
              : null}
          </div>
        )}

        <SelectInput
          name="accountType"
          rules={{
            required: "Account type is required",
          }}
          options={accountTypes}
          label="Account type"
          ariaLabel="Account type"
        />

        {/* Read-only account name field that gets populated after verification */}
        <Controller
          name="accountName"
          control={control}
          rules={{ required: "Account name is required" }}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-[14px] text-[#344054] mb-[6px]">
                Account name
              </label>
              <input
                {...field}
                readOnly
                placeholder="Account name will appear here after verification"
                className={`text-[15px] rounded-lg border ${
                  verifiedAccount
                    ? "border-green-500 bg-green-50"
                    : "border-[#D0D5DD] bg-gray-100"
                } py-[10px] px-[14px] ${
                  verifiedAccount ? "" : "cursor-not-allowed"
                }`}
              />
              {errors.accountName && (
                <span className="text-[13px] text-[#B42318] mt-[6px]">
                  {errors.accountName.message as string}
                </span>
              )}
            </div>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-end gap-3">
        <Button
          onClick={onCloseForm}
          text="Cancel"
          textColor="#344054"
          bgColor="white"
          outlineColor="#D0D5DD"
          className="grow md:grow-0 !justify-center"
        />
        <Button
          text="Save changes"
          buttonType="submit"
          disabled={isSubmitting || !verifiedAccount}
          loading={isSubmitting}
          className="grow md:grow-0 !justify-center"
        />
      </div>
    </form>
  );
}

export default AccountForm

// Types
type AccountFormProps = {
  onSubmit: (formFields: FormFields & { bankCode: string }) => void
  onCloseForm: () => void
  accountDetails?: IBankDetail
}

// Bank account types
const accountTypes = [
  Option("", "Select an account type", true),
  Option("naira", "Naira"),
]

// Additional interfaces for account verification
export interface IAccountVerificationResponse {
  status: string
  message: string
  data: {
    account_number: string
    account_name: string
    bank_code: string
  }
}

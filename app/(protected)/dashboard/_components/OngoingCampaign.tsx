"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "../../../../components/Button"
import ProgressBar from "./ProgressBar"
import { getUser } from "../../../../utils/api/user/getUser"
import makeRequest from "../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { calculateTransactionFee } from "../../../../utils/seperateText"
import { useToast } from "../../../../hooks/useToast"
import { useModal } from "../../../../hooks/useModal"
import { Mixpanel } from "../../../../utils/mixpanel"
import { formatAmount } from "../_common/utils/currency"
import { Campaign } from "../../../../api/_campaigns/models/GetCampaigns"
import { isFundraise } from "../_common/utils/campaign"
// import { Campaign } from '@/app/api/campaigns/getCampaigns';

// interface OngoingCampaignProps {
//   campaign: {
//     _id: string;
//     title: string;
//     story: string;
//     user: {
//       userType: string;
//       fullName?: string;
//       organizationName?: string;
//     };
//     photo?: {
//       url: string;
//     };
//     fundraise?: {
//       fundingGoalDetails: {
//         amount: number;
//         currency: string;
//       }[];
//     };
//     totalAmountDonated?: {
//       amount: number
//     }[];
//     totalNoOfCampaignDonors: number;
//     campaignType: 'fundraise' | 'volunteer' | 'fundraiseAndVolunteer';
//   };
// }

// Form validation helpers

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateAmount = (amount: string): boolean => {
  return parseFloat(amount) > 0
}

const OngoingCampaign: React.FC<Props> = ({ campaign }) => {
  const modal = useModal()
  const toast = useToast()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // States
  const [redirectUrl, setRedirectUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>("")
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})

  // Donation form state
  const [donationInputs, setDonationInputs] = useState({
    amount: "",
    fullName: "",
    email: "",
  })

  // Checkbox states
  const [checkboxValues, setCheckboxValues] = useState({
    isAnonymous: false,
    shouldShareDetails: false,
    isSubscribedToPromo: false,
    agreeToTerms: false,
  })

  // Calculate donation progress
  const totalDonationAmount = isFundraise(campaign)
    ? campaign?.fundraise?.fundingGoalDetails[0]?.amount
    : 0
  const donatedAmount = isFundraise(campaign)
    ? campaign?.totalAmountDonated?.[0]?.amount
    : 0
  const currency = isFundraise(campaign)
    ? campaign?.fundraise?.fundingGoalDetails[0]?.currency
    : "$"
  const [currencySymbol] = formatAmount(donatedAmount, currency?.toLowerCase())
  const percentComplete =
    Math.round((donatedAmount / totalDonationAmount) * 100) || 0

  // Get current user if they're logged in, but don't require it
  const getCurrentUser = async () => {
    try {
      const user = await getUser().catch(() => null)
      if (user) {
        setUserId(user?._id)
        setDonationInputs((prev) => ({
          ...prev,
          email: user?.email || "",
        }))
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      // User is not logged in - that's okay, continue without user data
    }
  }

  // Update donation inputs
  const updateDonationInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setDonationInputs((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear validation error when field is edited
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  // Update checkbox values
  const updateCheckbox = (key: string, value: boolean) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Validate donation form
  const validateDonationForm = () => {
    const errors: { [key: string]: string } = {}

    if (!donationInputs.amount) {
      errors.amount = "Donation amount is required"
    } else if (!validateAmount(donationInputs.amount)) {
      errors.amount = "Amount must be greater than 0"
    }

    if (!donationInputs.fullName) {
      errors.fullName = "Full name is required"
    }

    if (!donationInputs.email) {
      errors.email = "Email is required"
    } else if (!validateEmail(donationInputs.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!checkboxValues.agreeToTerms) {
      errors.terms = "You must agree to the terms"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle donation submission
  const handleDonate = async () => {
    if (!validateDonationForm()) {
      toast({
        title: "Error",
        body: "Please fill in all required fields",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      const endpoint = "/payments/initiate"

      // Get user if they're logged in, but don't require login
      const user = await getUser().catch(() => null)

      // Prepare headers - only include auth token if user is logged in
      const headers: Record<string, string> = {}
      if (user?.token) {
        headers["x-auth-token"] = user.token
      }

      const payload = {
        campaignId: campaign._id,
        campaignDonorId: userId || undefined, // Only include if logged in
        amount: donationInputs.amount,
        email: donationInputs.email,
        fullName: donationInputs.fullName,
        currency: currency,
        isAnonymous: checkboxValues.isAnonymous,
        shouldShareDetails: checkboxValues.shouldShareDetails,
        isSubscribedToPromo: checkboxValues.isSubscribedToPromo,
        callback_url: window.location.href,
        cancel_url: `${window.location.href}?cancelled=true`,
      }

      if (checkboxValues.isAnonymous) {
        Mixpanel.track("Anonymous Donation")
      }

      const { data } = await makeRequest(endpoint, {
        method: "POST",
        payload: JSON.stringify(payload),
        ...(Object.keys(headers).length > 0 ? { headers } : {}),
      })

      Mixpanel.track("Routes to Paystack Gateway")
      setRedirectUrl(data.authorization_url)
      setLoading(false)
    } catch (error) {
      Mixpanel.track("Error completing donation")
      setLoading(false)
      const message = extractErrorMessage(error)
      toast({ title: "Oops!", body: message, type: "error" })
    }
  }

  // Close payment iframe
  const closeIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank"
    }
    setRedirectUrl("")
    modal.hide()
    scrollTo(0, 0)

    // Reset donation form but keep the email for convenience
    setDonationInputs({
      amount: "",
      fullName: "",
      email: donationInputs.email,
    })

    // Reset checkbox values
    setCheckboxValues({
      isAnonymous: false,
      shouldShareDetails: false,
      isSubscribedToPromo: false,
      agreeToTerms: false,
    })
  }

  // Check iframe URL for payment completion
  const checkIframeUrl = () => {
    const iframe = iframeRef.current
    if (redirectUrl && iframe) {
      const iframeUrl = iframe.contentWindow?.location.href
      if (
        (iframeUrl && iframeUrl.includes("reference")) ||
        (iframeUrl && iframeUrl.includes("cancelled"))
      ) {
        closeIframe()
        if (iframeUrl.includes("reference")) {
          Mixpanel.track("Successful Donation")
          toast({
            title: "Success",
            body: "Donation successful",
            type: "success",
          })

          // Refresh current page to update donation info
          window.location.reload()
        }
      }
    }
  }

  // Initialize and cleanup
  useEffect(() => {
    getCurrentUser()
  }, [])

  // Handle payment iframe
  useEffect(() => {
    if (redirectUrl) {
      modal.show(
        <iframe
          src={redirectUrl}
          style={{ height: "100vh", width: "100%", background: "#fff" }}
          id="paystack-gateway"
          ref={iframeRef}
        />
      )
      const intervalId = setInterval(checkIframeUrl, 1000)
      return () => clearInterval(intervalId)
    }
  }, [redirectUrl])

  // Get organization name or individual name
  const organizationName =
    campaign.user?.userType === "individual"
      ? campaign.user?.fullName
      : campaign.user?.organizationName

  // Determine if campaign has volunteer option
  const hasVolunteerOption =
    campaign.campaignType === "volunteer" ||
    campaign.campaignType === "fundraiseAndVolunteer"

  // Determine if campaign has donation option
  const hasDonationOption =
    campaign.campaignType === "fundraise" ||
    campaign.campaignType === "fundraiseAndVolunteer"

  return (
    <div className="bg-white rounded-2xl selectedCampaign">
      {/* <div className="flex justify-between items-start">
        <div className="text-green-600 font-medium text-sm mb-3">Ongoing Campaign</div>
      </div> 
      // p-4
      */}
      {/*  */}
      <div className="flex gap-3 mb-4 pt-4">
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={campaign.photo?.url || "/placeholder-logo.png"}
            alt={organizationName || "Campaign"}
            width={40}
            height={40}
          />
        </div>

        <div>
          <h3 className="font-medium text-base">{campaign.title}</h3>
          <p className="text-sm text-gray-600">by {organizationName}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-700 mb-4">
          {campaign.story?.length > 100
            ? `${campaign.story.substring(0, 100)}...`
            : campaign.story}
          <button className="text-green-600 ml-1 font-medium">view more</button>
        </p>
      </div>

      {/* Campaign Type Tabs (if both options are available) */}
      {campaign.campaignType === "fundraiseAndVolunteer" && (
        <div className="mb-4">
          <div className="flex mb-2 border-b">
            <button
              className={`py-2 px-4 text-sm font-medium ${
                hasDonationOption
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500"
              }`}
            >
              Donate
            </button>
            <button
              onClick={() =>
                (window.location.href = `/explore/c/${campaign._id}`)
              }
              className="py-2 px-4 text-sm font-medium text-gray-500"
            >
              Volunteer
            </button>
          </div>
        </div>
      )}

      {/* Show Campaign Progress for donation campaigns */}
      {hasDonationOption && (
        <div className="bg-[#F9F9F9] p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">
              <span className="text-black">Goal</span>{" "}
              {formatAmount(donatedAmount, currency?.toLowerCase())} /{" "}
              {formatAmount(totalDonationAmount, currency?.toLowerCase())}
            </span>
            {/* <span className="text-sm font-medium">{percentComplete}%</span> */}
          </div>

          <ProgressBar bgColor="#00B964" percent={percentComplete} showValue />

          <p className="text-xs text-gray-500 mt-2">
            {campaign.campaignDonors.length} donation(s)
          </p>
        </div>
      )}

      {/* Donation Form */}
      {hasDonationOption && (
        <div className="space-y-3">
          {/* Amount Input */}
          <div className="flex flex-col">
            <label className="text-sm text-[#344054] mb-1">
              Donation amount
            </label>
            <input
              type="number"
              placeholder={`${currencySymbol}10.00`}
              className={`border ${
                validationErrors.amount ? "border-red-500" : "border-gray-200"
              } rounded-lg p-2 text-sm`}
              name="amount"
              value={donationInputs.amount}
              onChange={updateDonationInputs}
            />
            {validationErrors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.amount}
              </p>
            )}
            {donationInputs.amount && (
              <p className="text-gray-500 text-xs mt-1">
                Our payment processor charges a small donation fulfillment fee.
                This brings your total to{" "}
                {formatAmount(
                  calculateTransactionFee(parseFloat(donationInputs.amount)) +
                    parseFloat(donationInputs.amount),
                  currency?.toLowerCase()
                )}
              </p>
            )}
          </div>

          {/* Full Name Input */}
          <div className="flex flex-col">
            <label className="text-sm text-[#344054] mb-1">Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              className={`border ${
                validationErrors.fullName ? "border-red-500" : "border-gray-200"
              } rounded-lg p-2 text-sm`}
              name="fullName"
              value={donationInputs.fullName}
              onChange={updateDonationInputs}
            />
            {validationErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-sm text-[#344054] mb-1">Email address</label>
            <input
              type="email"
              placeholder="example@crowdr.com"
              className={`border ${
                validationErrors.email ? "border-red-500" : "border-gray-200"
              } rounded-lg p-2 text-sm`}
              name="email"
              value={donationInputs.email}
              onChange={updateDonationInputs}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="anonymous"
                className="mt-1"
                checked={checkboxValues.isAnonymous}
                onChange={(e) =>
                  updateCheckbox("isAnonymous", e.target.checked)
                }
              />
              <label htmlFor="anonymous" className="text-xs text-[#344054]">
                Don't display my name publicly on the fundraiser.
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="shareDetails"
                className="mt-1"
                checked={checkboxValues.shouldShareDetails}
                onChange={(e) =>
                  updateCheckbox("shouldShareDetails", e.target.checked)
                }
              />
              <label htmlFor="shareDetails" className="text-xs text-[#344054]">
                I'm delighted to share my name and email with this charity to
                receive updates on other ways I can help.
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="promoUpdates"
                className="mt-1"
                checked={checkboxValues.isSubscribedToPromo}
                onChange={(e) =>
                  updateCheckbox("isSubscribedToPromo", e.target.checked)
                }
              />
              <label htmlFor="promoUpdates" className="text-xs text-[#344054]">
                Get occasional marketing updates from Crowdr. You may
                unsubscribe at any time.
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="termsAgree"
                className="mt-1"
                checked={checkboxValues.agreeToTerms}
                onChange={(e) =>
                  updateCheckbox("agreeToTerms", e.target.checked)
                }
              />
              <label htmlFor="termsAgree" className="text-xs text-[#344054]">
                By ticking this box, you agree with the{" "}
                <a className="text-[#00B964] underlined">
                  Terms and Conditions provided
                </a>{" "}
                by Crowdr.*
              </label>
            </div>
            {validationErrors.terms && (
              <p className="text-red-500 text-xs">{validationErrors.terms}</p>
            )}
          </div>

          {/* Donate Button */}
          <Button
            text="Donate"
            onClick={handleDonate}
            loading={loading}
            disabled={
              !donationInputs.amount ||
              !donationInputs.fullName ||
              !donationInputs.email ||
              !checkboxValues.agreeToTerms
            }
            className="w-full mt-4 !justify-center"
          />
        </div>
      )}

      {/* For volunteer-only campaigns, show a volunteer button */}
      {campaign.campaignType === "volunteer" && (
        <div className="mt-4">
          <Button
            text="Volunteer"
            onClick={() =>
              (window.location.href = `/explore/c/${campaign._id}`)
            }
            className="w-full !justify-center"
          />
        </div>
      )}
    </div>
  )
}

export default OngoingCampaign

interface Props {
  campaign: Campaign
}

"use client";

import { useState, useEffect, use, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaApplePay } from "react-icons/fa";

// Components
import ProgressBar from "../../../../(protected)/dashboard/_components/ProgressBar";
import ExploreCard from "../../../../(protected)/dashboard/_components/ExploreCard";
import Filter from "../../../../(protected)/dashboard/_components/Filter";
import Input from "../../../../(protected)/dashboard/_components/Input";
import Checkbox from "../../../../(protected)/dashboard/_components/Checkbox";
import Select from "../../../../(protected)/dashboard/_components/Select";
import { Button } from "../../../../common/components/Button";
import Footer from "../../../../common/components/Footer";
import NavBar from "../../components/NavBar";
import Loading from "../../../../loading";
import NotFound from "../../../../not-found";
import PhoneNumberInput from "../../../../common/components/PhoneNumberInput";

// Hooks and utilities
import { useToast } from "../../../../common/hooks/useToast";
import makeRequest from "../../../../../utils/makeRequest";
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage";
import { formatAmount } from "../../../../(protected)/dashboard/_common/utils/currency";
import { calculateTransactionFee } from "../../../../../utils/seperateText";
import { presetAmounts } from "../../../../../utils/constants";
import { Mixpanel } from "../../../../../utils/mixpanel";

// Assets
import HeartHand from "@/public/svg/hand-holding-heart.svg";
import ShareCampaign from "@/app/common/components/share-campaign";
import OldModal from "@/app/common/components/OldModal";
import {
  useFetchSingleCampaign,
  useVerifyPaymentReference
} from "@/app/_hooks/useFetchCampaignById";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface DonationInputs {
  amount: string;
  fullName: string;
  email: string;
}

interface VolunteerInputs {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  ageRange: string;
  address: string;
  about: string;
}

interface CheckboxValues {
  isAnonymous: boolean;
  shouldShareDetails: boolean;
  isSubscribedToPromo: boolean;
}

export default function DonateOrVolunteer(props: {
  params: Promise<{ campaignId: string }>;
}) {
  const params = use(props.params);
  const toast = useToast();

  // Check for payment reference in URL
  const [trxRef, setTrxRef] = useState<string | null>(null);

  // React Query for campaign data
  const {
    data: campaign,
    isLoading: loadingCampaign,
    error: campaignError,
    refetch: refetchCampaign
  } = useFetchSingleCampaign(params.campaignId, true);

  // React Query for payment verification
  const {
    data: paymentVerification,
    isLoading: verifyingPayment,
    error: paymentVerificationError
  } = useVerifyPaymentReference(trxRef);

  // State
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("");
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [applePaySupported, setApplePaySupported] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [shareModal, setShareModal] = useState(false);

  const [donationInputs, setDonationInputs] = useState<DonationInputs>({
    amount: "",
    fullName: "",
    email: ""
  });

  const [volunteerInputs, setVolunteerInputs] = useState<VolunteerInputs>({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    ageRange: "",
    address: "",
    about: ""
  });

  const [checkboxValues, setCheckboxValues] = useState<CheckboxValues>({
    isAnonymous: false,
    shouldShareDetails: false,
    isSubscribedToPromo: false
  });

  // Memoized values
  const campaignImages = useMemo(() => {
    return (
      campaign?.campaignAdditionalImages?.map(
        (item: { url: string }) => item.url
      ) || []
    );
  }, [campaign?.campaignAdditionalImages]);

  const totalDonationAmount = useMemo(() => {
    return (
      campaign?.fundraise?.fundingGoalDetails?.reduce(
        (accumulator: number, current: { amount: number }) => {
          return accumulator + current.amount;
        },
        0
      ) || 0
    );
  }, [campaign?.fundraise?.fundingGoalDetails]);

  const donatedAmount = useMemo(() => {
    return campaign?.totalAmountDonated?.[0]?.amount || 0;
  }, [campaign?.totalAmountDonated]);

  const currency = useMemo(() => {
    return campaign?.fundraise?.fundingGoalDetails?.[0]?.currency || "NGN";
  }, [campaign?.fundraise?.fundingGoalDetails]);

  const userDetails = useMemo(() => {
    return campaign?.user;
  }, [campaign?.user]);

  const donationProgressPercent = useMemo(() => {
    return totalDonationAmount > 0
      ? (donatedAmount / totalDonationAmount) * 100
      : 0;
  }, [donatedAmount, totalDonationAmount]);

  const campaignVolunteersNeeded = useMemo(() => {
    return campaign?.volunteer?.volunteersNeeded || 0;
  }, [campaign?.volunteer?.volunteersNeeded]);

  const campaignTotalVolunteers = useMemo(() => {
    return campaign?.totalNoOfCampaignVolunteers || 0;
  }, [campaign?.totalNoOfCampaignVolunteers]);

  const volunteerProgressPercent = useMemo(() => {
    return campaignVolunteersNeeded > 0
      ? (campaignTotalVolunteers / campaignVolunteersNeeded) * 100
      : 0;
  }, [campaignTotalVolunteers, campaignVolunteersNeeded]);

  // Memoized functions
  const updateDonationInputs = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      if (name === "amount") {
        setSelectedAmount(value);
      }

      setDonationInputs((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    []
  );

  const updateVolunteerInputs = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setVolunteerInputs((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    []
  );

  const updateCheckbox = useCallback(
    (key: keyof CheckboxValues, value: boolean) => {
      setCheckboxValues((prev) => ({
        ...prev,
        [key]: value
      }));
    },
    []
  );

  const onAmountSelect = useCallback((amount: string) => {
    setSelectedAmount(amount);
    setDonationInputs((prev) => ({
      ...prev,
      amount: amount
    }));
  }, []);

  const areAllInputsFilled = useCallback((inputs: Record<string, any>) => {
    return Object.values(inputs).every((value) => value !== "");
  }, []);

  // Share modal handlers
  const closeShareModal = useCallback(() => {
    setShareModal(false);

    // Clean up trxref from URL when modal is closed
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("trxref");
      window.history.replaceState({}, document.title, url.toString());
      setTrxRef(null);
    }
  }, []);

  // Apple Pay detection
  const checkApplePaySupport = useCallback(() => {
    if (typeof window === "undefined") return false;

    try {
      const isSafari =
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
        navigator.userAgent.includes("iPhone") ||
        navigator.userAgent.includes("iPad") ||
        navigator.userAgent.includes("Mac");

      const mightSupportApplePay =
        isSafari &&
        window.PaymentRequest &&
        !navigator.userAgent.includes("Chrome");

      return mightSupportApplePay;
    } catch (error) {
      console.error("Error checking Apple Pay support:", error);
      return false;
    }
  }, []);

  // API calls
  const donate = useCallback(async () => {
    setLoading(true);
    const endpoint = "/payments/initiate";

    const payload = {
      campaignId: params.campaignId,
      amount: donationInputs.amount,
      email: donationInputs.email,
      fullName: donationInputs.fullName,
      currency: currency,
      isAnonymous: checkboxValues.isAnonymous,
      shouldShareDetails: checkboxValues.shouldShareDetails,
      isSubscribedToPromo: checkboxValues.isSubscribedToPromo,
      callback_url: window.location.href,
      cancel_url: `${window.location.href}?cancelled=true`
    };

    if (checkboxValues.isAnonymous) {
      Mixpanel.track("Anonymous Donation");
    }

    try {
      const { data } = await makeRequest(endpoint, {
        method: "POST",
        payload: JSON.stringify(payload)
      });

      Mixpanel.track("Routes to Paystack Gateway");

      const paymentWindow = window.open(data.authorization_url, "_blank");

      if (
        !paymentWindow ||
        paymentWindow.closed ||
        typeof paymentWindow.closed == "undefined"
      ) {
        window.location.href = data.authorization_url;
        return;
      }

      paymentWindow.focus();
    } catch (error) {
      Mixpanel.track("Error completing donation");
      const message = extractErrorMessage(error);
      toast({ title: "Oops!", body: message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [donationInputs, checkboxValues, currency, params.campaignId, toast]);

  const volunteer = useCallback(async () => {
    setLoading(true);
    const endpoint = `/campaigns/${params.campaignId}/volunteer`;

    try {
      const { data } = await makeRequest(endpoint, {
        method: "POST",
        payload: JSON.stringify(volunteerInputs)
      });

      toast({ title: "Success!", body: data.message, type: "success" });
      refetchCampaign();
      setVolunteerInputs({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        ageRange: "",
        address: "",
        about: ""
      });
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    } catch (error) {
      const message = extractErrorMessage(error);
      toast({ title: "Oops!", body: message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [volunteerInputs, params.campaignId, toast]);

  const handleDonateAgain = useCallback(() => {
    // Close the modal and clean up URL
    setShareModal(false);

    // Clean up trxref from URL
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("trxref");
      window.history.replaceState({}, document.title, url.toString());
      setTrxRef(null);
    }

    // Reset form to allow new donation
    setDonationInputs({
      amount: "",
      fullName: "",
      email: ""
    });
    setSelectedAmount("");

    // Switch to donate tab if not already there
    setTab("donate");

    Mixpanel.track("User wants to donate again after successful donation");
  }, []);

  // Effects
  useEffect(() => {
    if (campaign?.campaignType) {
      const newTab =
        campaign.campaignType === "fundraiseAndVolunteer"
          ? "donate"
          : campaign.campaignType === "fundraise"
          ? "donate"
          : "volunteer";

      setTab(newTab);

      const eventName =
        campaign.campaignType === "fundraiseAndVolunteer"
          ? "Donation campaign viewed"
          : "Volunteer campaign viewed";

      Mixpanel.track(eventName);
    }
  }, [campaign?.campaignType]);

  // Handle URL parameters for payment completion and trxref
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");
    const cancelled = urlParams.get("cancelled");
    const trxReference = urlParams.get("trxref");

    // Handle successful payment with reference
    if (reference || trxReference) {
      Mixpanel.track("Successful Donation");
      toast({
        title: "Success",
        body: "Donation successful",
        type: "success"
      });
      refetchCampaign();

      // const url = new URL(window.location.href);
      // url.searchParams.delete("reference");
      // window.history.replaceState({}, document.title, url.toString());
    }

    // Handle cancelled payment
    if (cancelled) {
      toast({
        title: "Payment Cancelled",
        body: "Your donation was not completed",
        type: "error"
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("cancelled");
      window.history.replaceState({}, document.title, url.toString());
    }

    // Handle trxref - show share modal
    if (trxReference) {
      setTrxRef(trxReference);
      setShareModal(true);
    }
  }, [toast, refetchCampaign]);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
      setApplePaySupported(checkApplePaySupport());
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [checkApplePaySupport]);

  // Handle error state
  useEffect(() => {
    if (campaignError) {
      toast({
        title: "Error loading campaign",
        body: "There was a problem loading this campaign. Please try again later.",
        type: "error"
      });
      Mixpanel.track("Error loading campaign", {
        campaignId: params.campaignId
      });
    }
  }, [campaignError, params.campaignId, toast]);

  // Loading and error states
  if (loadingCampaign) return <Loading />;
  if (!campaign) {
    return (
      <NotFound
        errorTitle="Campaign not found"
        errorMessage="The campaign you are looking for does not exist, has ended or has been removed. Please check the URL or return to the homepage."
      />
    );
  }

  return (
    <div className="font-satoshi">
      <NavBar />
      <div className="py-10 px-6 md:px-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl text-black font-semibold">
              {campaign.campaignType === "fundraiseAndVolunteer"
                ? "Donate and Volunteer"
                : campaign.campaignType === "fundraise"
                ? "Donate"
                : "Volunteer"}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 min-w-full md:grid-cols-2">
          <ExploreCard
            id={campaign._id}
            userId={campaign.user.userId}
            name={
              userDetails?.userType === "individual"
                ? userDetails?.fullName
                : userDetails?.organizationName
            }
            tier={userDetails?.userType}
            header={campaign.title}
            subheader={campaign.story}
            totalAmount={campaign.fundraise?.fundingGoalDetails[0].amount}
            currency={campaign.fundraise?.fundingGoalDetails[0].currency}
            currentAmount={donatedAmount}
            timePosted={campaign.campaignEndDate}
            volunteer={campaign.volunteer}
            totalVolunteers={campaign.totalNoOfCampaignVolunteers}
            avatar={campaign.photo?.url || ""}
            slideImages={[campaign.campaignCoverImage?.url, ...campaignImages]}
            donateImage={campaign.campaignCoverImage?.url}
            routeTo=""
            category={campaign.category}
            campaignType={campaign.campaignType}
          />

          <div>
            {/* Tab Navigation */}
            <div>
              {campaign.campaignType === "fundraiseAndVolunteer" ? (
                <>
                  <span
                    className={`text-sm p-3 cursor-pointer ${
                      tab === "donate" ? activeTabStyle : inActiveTabStyle
                    }`}
                    onClick={() => setTab("donate")}>
                    Donate
                  </span>
                  <span
                    className={`text-sm p-3 ml-4 cursor-pointer ${
                      tab === "volunteer" ? activeTabStyle : inActiveTabStyle
                    }`}
                    onClick={() => setTab("volunteer")}>
                    Volunteer
                  </span>
                </>
              ) : campaign.campaignType === "fundraise" ? (
                <span
                  className={`text-sm p-3 cursor-pointer ${
                    tab === "donate" ? activeTabStyle : inActiveTabStyle
                  }`}
                  onClick={() => setTab("donate")}>
                  Donate
                </span>
              ) : (
                <span
                  className={`text-sm p-3 ml-4 cursor-pointer ${
                    tab === "volunteer" ? activeTabStyle : inActiveTabStyle
                  }`}
                  onClick={() => setTab("volunteer")}>
                  Volunteer
                </span>
              )}
            </div>
            <hr className="mt-[9px]" />

            {/* Content based on active tab */}
            {tab === "volunteer" ? (
              <div className="mt-6">
                <div className="bg-[#F9F9F9] p-4">
                  <p className="text-sm text-[#667085] mb-2">
                    <span className="text-[#000]">Goal</span>{" "}
                    {campaign.totalNoOfCampaignVolunteers} /{" "}
                    {campaign.volunteer.volunteersNeeded} volunteers
                  </p>
                  <ProgressBar
                    bgColor="#F7CE50"
                    percent={volunteerProgressPercent}
                  />
                  <p className="mt-3 text-sm opacity-50">
                    {campaign.totalNoOfCampaignVolunteers} applications
                  </p>
                </div>

                <h3 className="mt-3 text-base text-[#292A2E]">Apply</h3>
                <div className="mt-4">
                  <Input
                    label="Full name"
                    placeholder="John doe"
                    name="fullName"
                    id="fullName"
                    value={volunteerInputs.fullName}
                    onChange={updateVolunteerInputs}
                  />
                  <Input
                    label="Email address"
                    placeholder="example@crowdr.com"
                    name="email"
                    id="email"
                    value={volunteerInputs.email}
                    onChange={updateVolunteerInputs}
                  />

                  <PhoneNumberInput
                    label="Phone number"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={volunteerInputs.phoneNumber}
                    onChange={(value) => {
                      setVolunteerInputs((prev) => ({
                        ...prev,
                        phoneNumber: value
                      }));
                    }}
                    required={true}
                    error=""
                  />

                  <Select
                    label="Gender"
                    name="gender"
                    id="gender"
                    options={genderOptions}
                    value={volunteerInputs.gender}
                    onChange={updateVolunteerInputs}
                  />

                  <Select
                    label="Age Range"
                    name="ageRange"
                    id="ageRange"
                    options={ageRange}
                    value={volunteerInputs.ageRange}
                    onChange={updateVolunteerInputs}
                  />

                  <Input
                    label="Address"
                    placeholder="Lagos, NG"
                    name="address"
                    id="address"
                    value={volunteerInputs.address}
                    onChange={updateVolunteerInputs}
                  />

                  <div className="flex flex-col items-start w-full">
                    <label
                      htmlFor="about"
                      className="text-[14px] text-[#344054] mb-[6px]">
                      Tell us a bit about yourself and why you're interested in
                      this project!
                    </label>
                    <textarea
                      id="about"
                      className="w-full text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
                      value={volunteerInputs.about}
                      onChange={updateVolunteerInputs}
                      name="about"
                    />
                  </div>
                </div>

                <Button
                  text="Apply"
                  className="w-full mt-4 !justify-center"
                  disabled={!areAllInputsFilled(volunteerInputs)}
                  loading={loading}
                  onClick={volunteer}
                />

                <div className="mt-10">
                  <div className="flex flex-row items-start justify-between mb-2">
                    <p className="text-[#292A2E] text-base">
                      {campaign.totalNoOfCampaignVolunteers > 0 &&
                        campaign.totalNoOfCampaignVolunteers}{" "}
                      Total Volunteer(s)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="bg-[#F9F9F9] p-4">
                  <p className="text-sm text-[#667085] mb-2">
                    <span className="text-[#000]">Goal</span>{" "}
                    {formatAmount(donatedAmount, currency?.toLowerCase())} /{" "}
                    {formatAmount(totalDonationAmount, currency?.toLowerCase())}
                  </p>
                  <ProgressBar
                    bgColor="#00B964"
                    percent={donationProgressPercent}
                  />
                  <p className="mt-3 text-sm opacity-50">
                    {campaign.totalNoOfCampaignDonors > 0 &&
                      campaign.totalNoOfCampaignDonors}{" "}
                    Donation(s)
                  </p>
                </div>

                {/* Preset Amount Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount.value}
                      type="button"
                      onClick={() => onAmountSelect(amount.value)}
                      className={`
                        px-3 py-3 md:py-2 text-sm rounded-lg border transition-colors 
                        ${
                          selectedAmount === amount.value
                            ? "border-[#00B964] bg-[#00B964]/5 text-[#00B964]"
                            : "border-[#D0D5DD] bg-white text-[#344054] hover:border-[#00B964]/50"
                        }
                      `}>
                      {amount.display}
                    </button>
                  ))}
                </div>

                {/* Donation Form */}
                <div className="mt-4">
                  <Input
                    isNumberInput
                    label="Donation Amount"
                    prefix="₦"
                    placeholder="₦1000.00"
                    name="amount"
                    id="amount"
                    type="number"
                    onChange={updateDonationInputs}
                    value={donationInputs.amount}
                    info={`Our payment processor charges a small donation fulfillment fee. ${
                      donationInputs.amount &&
                      `This brings your total to ${formatAmount(
                        calculateTransactionFee(
                          parseFloat(donationInputs.amount)
                        ) + parseFloat(donationInputs.amount),
                        currency?.toLowerCase()
                      )}`
                    }`}
                    formattedValue={
                      donationInputs.amount &&
                      formatAmount(
                        calculateTransactionFee(
                          parseFloat(donationInputs.amount)
                        ) + parseFloat(donationInputs.amount),
                        currency?.toLowerCase()
                      )
                    }
                  />
                  <Input
                    label="Full name"
                    placeholder="John doe"
                    name="fullName"
                    id="fullName"
                    onChange={updateDonationInputs}
                    value={donationInputs.fullName}
                  />
                  <Input
                    label="Email address"
                    placeholder="example@crowdr.com"
                    name="email"
                    id="email"
                    onChange={updateDonationInputs}
                    value={donationInputs.email}
                  />

                  <div className="flex flex-col mt-[30px]">
                    <Checkbox
                      id="1"
                      label="Don't display my name publicly on the fundraiser."
                      checked={checkboxValues.isAnonymous}
                      onChange={(newValue) =>
                        updateCheckbox("isAnonymous", newValue)
                      }
                    />
                    <Checkbox
                      id="2"
                      label="I'm delighted to share my name and email with this charity to receive updates on other ways I can help."
                      checked={checkboxValues.shouldShareDetails}
                      onChange={(newValue) =>
                        updateCheckbox("shouldShareDetails", newValue)
                      }
                    />
                    <Checkbox
                      id="3"
                      label="Get occasional marketing updates from Crowdr. You may unsubscribe at any time."
                      checked={checkboxValues.isSubscribedToPromo}
                      onChange={(newValue) =>
                        updateCheckbox("isSubscribedToPromo", newValue)
                      }
                    />
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="mt-4 flex flex-col gap-3 w-full">
                  <Button
                    text="Donate"
                    className="w-full !justify-center"
                    onClick={donate}
                    loading={loading}
                    disabled={!areAllInputsFilled(donationInputs)}
                  />

                  {paystackLoaded && applePaySupported && (
                    <button
                      onClick={donate}
                      className="apple-pay-button"
                      disabled={!areAllInputsFilled(donationInputs) || loading}>
                      <span className="apple-pay-text">Donate with</span>
                      <FaApplePay
                        className="mt-1"
                        size={50}
                        color="#fff"
                        fill="#fff"
                      />
                    </button>
                  )}
                </div>

                {/* Donors List */}
                <div className="mt-10">
                  {campaign.totalNoOfCampaignDonors > 0 && (
                    <div className="flex flex-row items-start justify-between mb-2">
                      <p className="text-[#292A2E] text-base">
                        {campaign.totalNoOfCampaignDonors > 0 &&
                          campaign.totalNoOfCampaignDonors}{" "}
                        Total Donor(s)
                      </p>
                      <Filter query="Top Donors" />
                    </div>
                  )}

                  <div className="flex items-start flex-col gap-5 mb-8">
                    {campaign.campaignDonors
                      ?.slice(0, 5)
                      .map((donor, index) => (
                        <div
                          className="flex items-center flex-row justify-start"
                          key={index}>
                          <div className="p-2 bg-[#F8F8F8] rounded-full">
                            <Image
                              src={HeartHand}
                              alt="donor"
                              className="bg-F8F8F8"
                            />
                          </div>
                          <div className="flex flex-col gap-[1px] ml-4">
                            <p className="text-[#344054] text-sm">
                              {donor.isAnonymous ? "Anonymous" : donor.fullName}
                            </p>
                            <span className="text-[13px] text-[#667085]">
                              Donated{" "}
                              {formatAmount(parseInt(donor.amount), "naira")} to
                              this campaign
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {campaign.totalNoOfCampaignDonors > 0 && (
                    <Link
                      className="cursor-pointer p-4 bg-[#F8F8F8] text-[#344054] w-fit mt-8 rounded-lg"
                      href="/login">
                      See all
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Campaign Modal */}
      <OldModal isOpen={shareModal} onClose={closeShareModal}>
        <div
          className="relative p-12"
          style={{
            background: "rgba(76, 76, 76, 0)"
          }}>
          <ShareCampaign
            onClose={closeShareModal}
            campaignId={campaign._id}
            title={campaign.title}
            story={campaign.story}
            campaignCoverImage={campaign.campaignCoverImage?.url}
            donationSuccess={!!trxRef}
            onDonateAgain={handleDonateAgain}
          />
        </div>
      </OldModal>

      <Footer />
    </div>
  );
}

// Constants
const activeTabStyle = "text-[#00B964] border-b-2 border-[#00B964]";
const inActiveTabStyle = "text-[#667085]";

const genderOptions = [
  { name: "Male", value: "male" },
  { name: "Female", value: "female" }
];

const ageRange = [
  { name: "18 - 25", value: "18 - 25" },
  { name: "26 - 35", value: "26 - 35" },
  { name: "36 - 45", value: "36 - 45" },
  { name: "46 - 55", value: "46 - 55" },
  { name: "56 and above", value: "56 and above" }
];

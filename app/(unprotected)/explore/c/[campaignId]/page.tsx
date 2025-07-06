"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import ProgressBar from "../../../../(protected)/dashboard/_components/ProgressBar";
import ExploreCard from "../../../../(protected)/dashboard/_components/ExploreCard";
import Filter from "../../../../(protected)/dashboard/_components/Filter";
import Input from "../../../../(protected)/dashboard/_components/Input";
import Checkbox from "../../../../(protected)/dashboard/_components/Checkbox";
import Select from "../../../../(protected)/dashboard/_components/Select";
import { Button } from "../../../../../components/shared/Button";
import { getSingleCampaign } from "../../../../../utils/api/campaigns/getCampaigns";
import makeRequest from "../../../../../utils/makeRequest";
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage";
import HeartHand from "@/public/svg/hand-holding-heart.svg";
import { useToast } from "../../../../../hooks/useToast";
import Link from "next/link";
import Footer from "../../../../(homepage)/_components/layout/Footer";
import NavBar from "../../components/NavBar";
import Loading from "../../../../loading";
import { Mixpanel } from "../../../../../utils/mixpanel";
import PhoneNumberInput from "../../../../../components/shared/PhoneNumberInput";
import NotFound from "../../../../not-found";
import { FaApplePay } from "react-icons/fa";
import { formatAmount } from "../../../../(protected)/dashboard/_common/utils/currency";
import { calculateTransactionFee } from "../../../../../utils/seperateText";
import { presetAmounts } from "../../../../../utils/constants";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function DonateOrVolunteer(
  props: {
    params: Promise<{ campaignId: string }>;
  }
) {
  const params = use(props.params);
  const toast = useToast();
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>();
  const [tab, setTab] = useState("");
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [applePaySupported, setApplePaySupported] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>("");

  // Handle amount selection
  const onAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setDonationInputs((prevState) => ({
      ...prevState,
      amount: amount
    }));
  };

  // Improved Apple Pay detection
  const checkApplePaySupport = () => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false;

    try {
      const isSafari =
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
        navigator.userAgent.includes("iPhone") ||
        navigator.userAgent.includes("iPad") ||
        navigator.userAgent.includes("Mac");

      // Check if Apple Pay might be available (rough detection)
      const mightSupportApplePay =
        isSafari &&
        window.PaymentRequest &&
        !navigator.userAgent.includes("Chrome");

      return mightSupportApplePay;
    } catch (error) {
      console.error("Error checking Apple Pay support:", error);
      return false;
    }
  };

  const fetchSingleCampaign = async () => {
    setLoadingCampaign(true);
    try {
      const singleCampaign = await getSingleCampaign(params.campaignId, true);

      if (!singleCampaign) {
        toast({
          title: "Campaign not found",
          body: "Unable to load the campaign. It may have been removed or is no longer available.",
          type: "error"
        });
      } else {
        setCampaign(singleCampaign);
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      toast({
        title: "Error loading campaign",
        body:
          message ||
          "There was a problem loading this campaign. Please try again later.",
        type: "error"
      });
      Mixpanel.track("Error loading campaign", { campaignId: params.campaignId });
      console.error("Error fetching campaign:", error);
    } finally {
      setLoadingCampaign(false);
    }
  };

  interface initTypes {
    amount: string;
    fullName?: "";
    email?: string;
  }

  const initProps: initTypes = {
    amount: "",
    fullName: "",
    email: ""
  };

  const [donationInputs, setDonationInputs] = useState(initProps);

  const updateProps = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const inputName = event.target.name;

    // Update selected amount when amount input changes
    if (inputName === "amount") {
      setSelectedAmount(newValue);
    }

    setDonationInputs((prevState: initTypes) => {
      return {
        ...prevState,
        [inputName]: newValue
      };
    });
  };

  interface initVolunteerTypes {
    fullName: string;
    email?: string;
    phoneNumber: string;
    gender: string;
    ageRange: string;
    address: string;
    about: string;
  }

  const initVolunteerProps: initVolunteerTypes = {
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    ageRange: "",
    address: "",
    about: ""
  };

  const [volunteerInputs, setVolunteerInputs] = useState(initVolunteerProps);

  const updateVolunteerProps = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    const inputName = event.target.name;
    setVolunteerInputs((prevState: initVolunteerTypes) => {
      return {
        ...prevState,
        [inputName]: newValue
      };
    });
  };

  const [checkboxValues, setCheckboxValues] = useState({
    isAnonymous: false,
    shouldShareDetails: false,
    isSubscribedToPromo: false
  });

  const updateCheckbox = (key: string, value: boolean) => {
    setCheckboxValues((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchSingleCampaign();
    setTab(
      campaign?.campaignType === "fundraiseAndVolunteer"
        ? "donate"
        : campaign?.campaignType === "fundraise"
        ? "donate"
        : "volunteer"
    );
    Mixpanel.track(
      campaign?.campaignType === "fundraiseAndVolunteer"
        ? "Donation campaign viewed"
        : "Volunteer campaign viewed"
    );
  }, [params.campaignId, campaign?.campaignType]);

  // Effect to check for payment completion in URL parameters
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Parse URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get("reference");
      const cancelled = urlParams.get("cancelled");

      // Handle payment completion
      if (reference) {
        Mixpanel.track("Successful Donation");
        toast({
          title: "Success",
          body: "Donation successful",
          type: "success"
        });
        // Refresh campaign data to show updated donations
        fetchSingleCampaign();

        // Clean up URL parameters using history API
        const url = new URL(window.location.href);
        url.searchParams.delete("reference");
        window.history.replaceState({}, document.title, url.toString());
      }

      // Handle cancelled payment
      if (cancelled) {
        toast({
          title: "Payment Cancelled",
          body: "Your donation was not completed",
          type: "info"
        });

        // Clean up URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete("cancelled");
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, []);

  // Effect to load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
      const supported = checkApplePaySupport();
      setApplePaySupported(supported);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const totalDonationAmount =
    campaign?.fundraise?.fundingGoalDetails?.reduce(
      (accumulator: number, current: { amount: number }) => {
        return accumulator + current.amount;
      },
      0
    ) || 0;

  const userDetails = campaign?.user;
  const donatedAmount = campaign?.totalAmountDonated?.[0]?.amount || 0;
  const currency =
    campaign?.fundraise?.fundingGoalDetails?.[0]?.currency || "NGN";

  const donate = async () => {
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

    checkboxValues.isAnonymous && Mixpanel.track("Anonymous Donation");
    try {
      const { data } = await makeRequest(endpoint, {
        method: "POST",
        payload: JSON.stringify(payload)
      });
      Mixpanel.track("Routes to Paystack Gateway");

      // Redirect in the same tab
      window.location.href = data.authorization_url;
    } catch (error) {
      Mixpanel.track("Error completing donation");
      setLoading(false);
      const message = extractErrorMessage(error);
      toast({ title: "Oops!", body: message, type: "error" });
    }
  };

  const volunteer = async () => {
    setLoading(true);
    const endpoint = `/campaigns/${params.campaignId}/volunteer`;

    const payload = {
      phoneNumber: volunteerInputs.phoneNumber,
      email: volunteerInputs.email,
      fullName: volunteerInputs.fullName,
      ageRange: volunteerInputs.ageRange,
      gender: volunteerInputs.gender,
      address: volunteerInputs.address,
      about: volunteerInputs.about
    };

    try {
      const { data } = await makeRequest(endpoint, {
        method: "POST",
        payload: JSON.stringify(payload)
      });
      toast({ title: "Success!", body: data.message, type: "success" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message = extractErrorMessage(error);
      toast({ title: "Oops!", body: message, type: "error" });
    }
  };

  const urlsOnly =
    campaign?.campaignAdditionalImages?.map(
      (item: { url: string }) => item.url
    ) || [];

  const areAllInputsFilled = (input: any) => {
    return Object.values(input).every((value) => value !== "");
  };

  if (loadingCampaign) return <Loading />;
  if (!campaign)
    return (
      <NotFound
        errorTitle="Campaign not found"
        errorMessage="The campaign you are looking for does not exist, has ended or has been removed. Please check the URL or return to the homepage."
      />
    );

  return (
    <div className="font-satoshi">
      <NavBar />
      <div className="py-10 px-6 md:px-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl text-black font-semibold">
              {campaign?.campaignType === "fundraiseAndVolunteer"
                ? "Donate and Volunteer"
                : campaign?.campaignType === "fundraise"
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
            header={campaign?.title}
            subheader={campaign?.story}
            totalAmount={campaign?.fundraise?.fundingGoalDetails[0].amount}
            currency={campaign?.fundraise?.fundingGoalDetails[0].currency}
            currentAmount={donatedAmount}
            timePosted={campaign?.campaignEndDate}
            volunteer={campaign?.volunteer}
            avatar={campaign?.photo?.url || ""}
            slideImages={[campaign?.campaignCoverImage?.url, ...urlsOnly]}
            donateImage={campaign?.campaignCoverImage?.url}
            routeTo={``}
            category={campaign?.category}
            campaignType={campaign?.campaignType}
          />
          <div>
            <div>
              {campaign?.campaignType === "fundraiseAndVolunteer" ? (
                <>
                  <span
                    className={`text-sm p-3 cursor-pointer ${
                      tab === "donate" ? activeTabStyle : inActiveTabStyle
                    }`}
                    onClick={() => {
                      setTab("donate");
                    }}>
                    Donate
                  </span>
                  <span
                    className={`text-sm p-3 ml-4 cursor-pointer ${
                      tab === "volunteer" ? activeTabStyle : inActiveTabStyle
                    }`}
                    onClick={() => {
                      setTab("volunteer");
                    }}>
                    Volunteer
                  </span>
                </>
              ) : campaign?.campaignType === "fundraise" ? (
                <span
                  className={`text-sm p-3 cursor-pointer ${
                    tab === "donate" ? activeTabStyle : inActiveTabStyle
                  }`}
                  onClick={() => {
                    setTab("donate");
                  }}>
                  Donate
                </span>
              ) : (
                <span
                  className={`text-sm p-3 ml-4 cursor-pointer ${
                    tab === "volunteer" ? activeTabStyle : inActiveTabStyle
                  }`}
                  onClick={() => {
                    setTab("volunteer");
                  }}>
                  Volunteer
                </span>
              )}
            </div>
            <hr className="mt-[9px]" />

            {tab === "volunteer" ? (
              <div className="mt-6">
                <div className="bg-[#F9F9F9] p-4 mb-2">
                  <p className="mt-1 text-sm opacity-50">
                    {campaign?.totalNoOfCampaignVolunteers} applications
                  </p>
                </div>

                <h3 className="mt-3 text-base text-[#292A2E]">Apply</h3>
                <div className="mt-4">
                  <Input
                    label={"Full name"}
                    placeholder="John doe"
                    name="fullName"
                    id="fullName"
                    value={volunteerInputs.fullName}
                    onChange={updateVolunteerProps}
                  />
                  <Input
                    label={"Email address"}
                    placeholder="example@crowdr.com"
                    name="email"
                    id="email"
                    value={volunteerInputs.email}
                    onChange={updateVolunteerProps}
                  />

                  <PhoneNumberInput
                    label="Phone number"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={volunteerInputs.phoneNumber}
                    onChange={(value) => {
                      setVolunteerInputs((prevState) => ({
                        ...prevState,
                        phoneNumber: value
                      }));
                    }}
                    required={true}
                    error={""}
                  />
                  <Select
                    label={"Gender"}
                    name="gender"
                    id="gender"
                    options={genderOptions}
                    value={volunteerInputs.gender}
                    onChange={updateVolunteerProps}
                  />

                  <Select
                    label={"Age Range"}
                    name="ageRange"
                    id="ageRange"
                    options={ageRange}
                    value={volunteerInputs.ageRange}
                    onChange={updateVolunteerProps}
                  />

                  <Input
                    label={"Address"}
                    placeholder="Lagos, NG"
                    name="address"
                    id="address"
                    value={volunteerInputs.address}
                    onChange={updateVolunteerProps}
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
                      onChange={updateVolunteerProps}
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
                      {campaign?.totalNoOfCampaignVolunteers > 0 &&
                        campaign?.totalNoOfCampaignVolunteers}{" "}
                      Total Volunteer(s)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="bg-[#F9F9F9] p-4">
                  <p className="text-sm text-[#667085] mb-2">
                    {" "}
                    <span className="text-[#000]">Goal</span>{" "}
                    {formatAmount(donatedAmount, currency?.toLowerCase())} /{" "}
                    {formatAmount(totalDonationAmount, currency?.toLowerCase())}
                  </p>
                  <ProgressBar
                    bgColor="#00B964"
                    percent={
                      totalDonationAmount > 0
                        ? (donatedAmount / totalDonationAmount) * 100
                        : 0
                    }
                  />
                  <p className="mt-3 text-sm opacity-50">
                    {campaign?.totalNoOfCampaignDonors > 0 &&
                      campaign?.totalNoOfCampaignDonors}{" "}
                    Donation(s)
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4 ">
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
                <div className="mt-4">
                  <Input
                    isNumberInput
                    label={"Donation Amount"}
                    prefix="₦"
                    placeholder="₦1000.00"
                    name="amount"
                    id="amount"
                    type="number"
                    onChange={updateProps}
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
                    label={"Full name"}
                    placeholder="John doe"
                    name="fullName"
                    id="fullName"
                    onChange={updateProps}
                    value={donationInputs.fullName}
                  />
                  <Input
                    label={"Email address"}
                    placeholder="example@crowdr.com"
                    name="email"
                    id="email"
                    onChange={updateProps}
                    value={donationInputs.email}
                  />
                  <div className="flex flex-col mt-[30px]">
                    <Checkbox
                      id={"1"}
                      label={
                        "Don't display my name publicly on the fundraiser."
                      }
                      checked={checkboxValues.isAnonymous}
                      onChange={(newValue) =>
                        updateCheckbox("isAnonymous", newValue)
                      }
                    />
                    <Checkbox
                      id={"2"}
                      label={
                        "I'm delighted to share my name and email with this charity to receive updates on other ways I can help."
                      }
                      checked={checkboxValues.shouldShareDetails}
                      onChange={(newValue) =>
                        updateCheckbox("shouldShareDetails", newValue)
                      }
                    />
                    <Checkbox
                      id={"3"}
                      label={
                        "Get occasional marketing updates from Crowdr. You may unsubscribe at any time."
                      }
                      checked={checkboxValues.isSubscribedToPromo}
                      onChange={(newValue) =>
                        updateCheckbox("isSubscribedToPromo", newValue)
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 w-full">
                  <Button
                    text="Donate"
                    className="w-full !justify-center"
                    onClick={donate}
                    loading={loading}
                    disabled={!areAllInputsFilled(donationInputs)}
                    // disabled
                  />

                  {paystackLoaded && applePaySupported && (
                    <button
                      onClick={donate}
                      className="apple-pay-button"
                      disabled={!areAllInputsFilled(donationInputs) || loading}
                      >
                      <span className="apple-pay-text">Donate with</span>
                      <FaApplePay
                        className="mt-1"
                        size={50}
                        color="#fff"
                        fill="#fff"
                      />
                    </button>
                  )}

                  {/* <span className=" text-center text-[#A75003] font-semibold underline">
                    Donations are temporarily disabled, please check back in a
                    couple of hours{" "}
                  </span> */}
                </div>

                <div className="mt-10">
                  {campaign?.totalNoOfCampaignDonors > 0 && (
                    <div className="flex flex-row items-start justify-between mb-2">
                      <p className="text-[#292A2E] text-base">
                        {campaign?.totalNoOfCampaignDonors > 0 &&
                          campaign?.totalNoOfCampaignDonors}{" "}
                        Total Donor(s)
                      </p>

                      <Filter query="Top Donors" />
                    </div>
                  )}
                  <div className="flex items-start flex-col gap-5 mb-8">
                    {campaign?.campaignDonors?.slice(0, 5).map(
                      (
                        donor: {
                          fullName: string;
                          amount: string;
                          isAnonymous: boolean;
                        },
                        index: number
                      ) => {
                        return (
                          <div
                            className="flex items-center flex-row justify-start"
                            key={index}>
                            <div className="p-2 bg-[#F8F8F8] rounded-full">
                              <Image
                                src={HeartHand}
                                alt="menu"
                                className="bg-F8F8F8"
                              />
                            </div>
                            <div className="flex flex-col gap-[1px] ml-4">
                              <p className="text-[#344054] text-sm">
                                {donor?.isAnonymous
                                  ? "Anonymous"
                                  : donor?.fullName}
                              </p>
                              <span className="text-[13px] text-[#667085]">
                                Donated{" "}
                                {formatAmount(parseInt(donor?.amount), "naira")}{" "}
                                to this campaign
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  {campaign?.totalNoOfCampaignDonors > 0 && (
                    <Link
                      className="cursor-pointer p-4 bg-[#F8F8F8] text-[#344054] w-fit mt-8 rounded-lg"
                      href={`/login`}>
                      See all
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const activeTabStyle = "text-[#00B964]  border-b-2 border-[#00B964]";
const inActiveTabStyle = "text-[#667085]";
const genderOptions = [
  {
    name: "Male",
    value: "male"
  },
  {
    name: "Female",
    value: "female"
  }
];

const ageRange = [
  {
    name: "18 - 25",
    value: "18 - 25"
  },
  {
    name: "26 - 35",
    value: "26 - 35"
  },
  {
    name: "36 - 45",
    value: "36 - 45"
  },
  {
    name: "46 - 55",
    value: "46 - 55"
  },
  {
    name: "56 and above",
    value: "56 and above"
  }
];

"use client"
import ExploreCard from "../../(protected)/dashboard/_components/ExploreCard"
import { useState, useEffect, useCallback } from "react"
import Footer from "../../common/components/Footer"
import OldModal from "../../common/components/OldModal"
import WaitlistForm from "../../_components/home/home-components/WaitlistForm"
import Head from "next/head"
import NavBar from "./components/NavBar"
import { Mixpanel } from "../../../utils/mixpanel"
import { Search } from "lucide-react"
import debounce from "lodash/debounce"
import Image from "next/image"
import { campaignCategories } from "../../../utils/campaignCategory"
import Pagination from "@/app/(protected)/dashboard/_components/Pagination"
import { RFC } from "@/app/common/types"
import { useQuery } from "react-query"
import _campaigns from "@/api/_campaigns"
import { IGetCampaignsParams } from "@/api/_campaigns/models/GetCampaigns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useQueryKey from "@/app/_hooks/useQueryKey"
import query from "@/api/query"
import { mapParamsToObject, sanitizeParams, useParamKey } from "@/utils/params"
import CampaignCardSkeleton from "@/app/(protected)/dashboard/_components/skeletons/CampaignCardSkeleton"

const Explore = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = mapParamsToObject<IGetCampaignsParams>(searchParams)
  const url = new URL(pathname)
  const [searchTerm, setSearchTerm] = useState(params.title)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const queryKey = useQueryKey()
  const paramKey = useParamKey<IGetCampaignsParams>()

  const campaignsQuery = useQuery({
    queryKey: queryKey(query.keys.GET_CAMPAIGNS, params),
    queryFn: () => _campaigns.getCampaigns(params),
  })
  const campaigns = campaignsQuery.data
  const selectedInterest = params.category ?? ALL_CATEGORY.value

  useEffect(() => {
    Mixpanel.track("Explore Page viewed")
  }, [])

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      url.searchParams.set(paramKey("page"), "1")
      url.searchParams.set(paramKey("title"), search)
      updatePageParams()
    }, 500),
    [url]
  )

  const updatePageParams = () => {
    const pageKey = paramKey("page")
    const categoryKey = paramKey("category")
    if (url.searchParams.get(pageKey) === "1") {
      url.searchParams.delete(pageKey)
    }
    if (url.searchParams.get(categoryKey) === ALL_CATEGORY.value) {
      url.searchParams.delete(categoryKey)
    }

    const urlWithSanitizedParams = sanitizeParams(url)
    router.replace(urlWithSanitizedParams.toString())
  }

  const handlePageChange = (page: number) => {
    url.searchParams.set(paramKey("page"), page.toString())
    updatePageParams()
  }

  const handleInterestToggle = (interest: string) => {
    url.searchParams.set(paramKey("page"), "1")
    url.searchParams.set(paramKey("category"), interest)
    updatePageParams()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const openModal = (open: boolean) => {
    return () => setModalIsOpen(open)
  }

  return (
    <div className="font-satoshi">
      <Head>
        <title>Explore campaigns on Crowdr</title>
        <meta
          name="description"
          content="Explore campaigns and spread love by donating."
        />
        <meta property="og:title" content="Explore campaigns" />
        <meta
          property="og:description"
          content="Explore campaigns and spread love by donating."
        />
      </Head>
      <NavBar />
      <div className={`py-10 px-6 md:px-40 relative min-h-screen`}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-[18px] md:text-[24px] font-normal text-[#000]">
              Explore
            </h2>
            <p className="text-[14px] font-normal">
              Explore campaigns on Crowdr.
            </p>
          </div>

          {/* search input */}
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search campaigns..."
              className="w-full text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] pl-[40px] pr-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Search className="absolute left-[14px] top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          {/* categories */}
          <div
            id="interests"
            className="flex flex-row scrollbar-thin overflow-x-scroll gap-5 mt-2"
          >
            {categories.map(({ value, label, icon, bgColor }) => (
              <label
                key={value}
                style={{
                  backgroundColor:
                    selectedInterest === value ? "#00B964" : bgColor,
                }}
                className={`flex justify-center items-center gap-x-[5px] rounded-full cursor-pointer py-[8px] px-[21px] mr-[5.5px] ${bgColor}`}
                onClick={() => handleInterestToggle(value)}
              >
                {icon && (
                  <Image
                    src={`svg/emoji/${icon}.svg`}
                    alt={icon}
                    width={15}
                    height={15}
                  />
                )}
                <span
                  className={`${
                    selectedInterest === value
                      ? "text-[#F8F8F8]"
                      : "text-[#0B5351]"
                  } text-[12px] md:text-base w-max`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {campaigns ? (
          campaigns.campaigns.length !== 0 ? (
            <CampaignsContainer>
              {campaigns.campaigns.map((campaign) => {
                const urlsOnly = campaign.campaignAdditionalImages.map(
                  (item) => item.url
                )

                const userDetails = campaign?.user
                const donatedAmount = campaign?.totalAmountDonated?.[0]?.amount

                return (
                  <ExploreCard
                    key={campaign._id}
                    userId={userDetails?._id}
                    id={campaign._id}
                    name={
                      (userDetails?.userType === "individual"
                        ? userDetails?.fullName
                        : userDetails?.organizationName) ?? "User"
                    }
                    tier={userDetails?.userType}
                    header={campaign?.title}
                    subheader={campaign?.story}
                    category={campaign?.category}
                    totalAmount={
                      campaign.fundraise?.fundingGoalDetails[0].amount
                    }
                    currency={
                      campaign.fundraise?.fundingGoalDetails[0].currency
                    }
                    currentAmount={donatedAmount}
                    timePosted={campaign?.campaignEndDate}
                    volunteer={campaign?.volunteer}
                    slideImages={[
                      campaign?.campaignCoverImage?.url,
                      ...(urlsOnly || []),
                    ]}
                    donateImage=""
                    routeTo={`/explore/c/${campaign._id}`}
                    avatar={campaign?.photo?.url || ""}
                    campaignType={campaign.campaignType}
                    user={userDetails}
                  />
                )
              })}
            </CampaignsContainer>
          ) : (
            <MessageContainer>No campaigns found.</MessageContainer>
          )
        ) : campaignsQuery.error ? (
          <MessageContainer>Something unexpected happened.</MessageContainer>
        ) : (
          <CampaignsContainer>
            {Array.from({ length: 10 }).map((item, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
          </CampaignsContainer>
        )}

        {/* pagination */}
        {campaigns &&
          campaigns.pagination &&
          campaigns.pagination.total !== 0 && (
            <Pagination
              currentPage={campaigns.pagination.currentPage}
              perPage={campaigns.pagination.perPage}
              total={campaigns.pagination.total}
              onPageChange={handlePageChange}
              className="px-4 py-3 md:p-0 mt-10"
            />
          )}
      </div>

      <Footer />
      <OldModal isOpen={modalIsOpen} onClose={openModal(false)}>
        <WaitlistForm />
      </OldModal>
    </div>
  )
}

export default Explore

const ALL_CATEGORY = {
  value: "all",
  label: "All categories",
  icon: "",
  bgColor: "#F8F8F8",
} as const

const categories = [ALL_CATEGORY, ...campaignCategories]

const CampaignsContainer: RFC = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 gap-y-10 min-w-full md:grid-cols-2 mt-8">
      {children}
    </div>
  )
}

const MessageContainer: RFC = ({ children }) => {
  return (
    <div className="text-center font-semibold text-[18px] md:text-[30px] mt-10">
      {children}
    </div>
  )
}

"use client"

import { Campaign, getCampaigns } from "../../api/campaigns/getCampaigns"
import ExploreCard from "../../(protected)/dashboard/_components/ExploreCard"
import { useState, useEffect, useCallback } from "react"
import Navigation from "../../common/components/Navigation"
import Footer from "../../common/components/Footer"
import OldModal from "../../common/components/OldModal"
import WaitlistForm from "../../_components/home/home-components/WaitlistForm"
import Head from "next/head"
import NavBar from "./components/NavBar"
import Loading from "../../loading"
import { Mixpanel } from "../../../utils/mixpanel"
import { Search } from "lucide-react"
import debounce from "lodash/debounce"
import Image from "next/image"
import { campaignCategories as interests } from "../../../utils/campaignCategory"
import Pagination from "@/app/(protected)/dashboard/_components/Pagination"
import { IPagination } from "@/app/common/types"

export default function DynamicExplore() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState<IPagination>()

  // Add state for selected interest and filtered campaigns
  const [selectedInterest, setSelectedInterest] = useState<string>("all")
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])

  // Define the "All" category
  const allCategory = {
    value: "all",
    label: "All categories",
    icon: "",
    bgColor: "#F8F8F8",
  }

  // Combine "All" with existing interests
  const allInterests = [allCategory, ...interests]

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const loadCampaigns = async (pageNum: number, search: string = "") => {
    try {
      setLoadingMore(pageNum > 1)
      const newCampaigns = await getCampaigns({
        page: pageNum,
        noAuth: true,
        title: search,
      })
      setHasNextPage(newCampaigns?.pagination.hasNextPage || false)
      setPagination(newCampaigns?.pagination)

      const campaignsArray = newCampaigns?.campaigns as Campaign[]

      if (Array.isArray(campaignsArray)) {
        setCampaigns((prevCampaigns) => {
          // If it's a new search or first page, replace all campaigns
          if (pageNum === 1) {
            return campaignsArray
          }

          // For pagination, merge with existing campaigns
          const existingCampaignIds = new Set(
            prevCampaigns.map((campaign) => campaign._id)
          )
          const filteredNewCampaigns = campaignsArray.filter(
            (campaign) => !existingCampaignIds.has(campaign._id)
          )
          return [...prevCampaigns, ...filteredNewCampaigns]
        })
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    setSelectedInterest(interest)
  }

  // Filter campaigns based on selected interests
  useEffect(() => {
    if (selectedInterest === "all") {
      setFilteredCampaigns(campaigns)
    } else {
      const filtered = campaigns.filter(
        (campaign) => campaign.category === selectedInterest
      )
      setFilteredCampaigns(filtered)
    }
  }, [selectedInterest, campaigns])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setPage(1)
      loadCampaigns(1, search)
    }, 500),
    []
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  useEffect(() => {
    loadCampaigns(1, "")
    Mixpanel.track("Explore Page viewed")
  }, [])

  const handleSeeMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadCampaigns(nextPage, searchTerm)
  }

  if (isLoading) return <Loading />

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
      <div
        className={`py-10 px-6 md:px-40 relative ${
          filteredCampaigns?.length < 1 ? "h-screen" : "h-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-[18px] md:text-[24px] font-normal text-[#000]">
              Explore
            </h2>
            <p className="text-[14px] font-normal">
              Explore campaigns on Crowdr.
            </p>
          </div>

          {/* Search Input */}
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

          {/* Interest Categories Filter */}
          <div
            id="interests"
            className="flex flex-row overflow-x-scroll gap-5 mt-2"
          >
            {allInterests.map(({ value, label, icon, bgColor }) => (
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

        <div className="grid grid-cols-1 gap-2.5 min-w-full md:grid-cols-2 mt-6">
          {Array.isArray(filteredCampaigns) &&
            filteredCampaigns?.map((campaign: Campaign, index: number) => {
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
                    userDetails?.userType === "individual"
                      ? userDetails?.fullName
                      : userDetails?.organizationName
                  }
                  tier={userDetails?.userType}
                  header={campaign?.title}
                  subheader={campaign?.story}
                  category={campaign?.category}
                  totalAmount={campaign.fundraise?.fundingGoalDetails[0].amount}
                  currency={campaign.fundraise?.fundingGoalDetails[0].currency}
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
        </div>

        {filteredCampaigns?.length < 1 && !isLoading && (
          <p className="text-center font-semibold text-[18px] md:text-[30px] mt-10">
            No campaigns found.
          </p>
        )}

        {/* pagination */}
        {pagination && pagination.total !== 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            perPage={pagination.perPage}
            total={pagination.total}
            onPageChange={setPage}
            className="px-4 py-3 md:p-0 mt-10"
          />
        )}

        {/* {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSeeMore}
              disabled={loadingMore}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-[15px]"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )} */}
      </div>

      <Footer />
      <OldModal isOpen={modalIsOpen} onClose={closeModal}>
        <WaitlistForm />
      </OldModal>
    </div>
  )
}

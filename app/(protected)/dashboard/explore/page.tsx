"use client"
import Image from "next/image"
import { Search } from "lucide-react"
import debounce from "lodash/debounce"
import { useUser } from "../_common/hooks/useUser"
import ExploreCard from "../_components/ExploreCard"
import makeRequest from "../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { campaignsTag } from "../../../../tags"

import { IPagination, Nullable, QF } from "../../../common/types"
import { ICampaignResponse } from "../../../common/types/Campaign"
import { useCallback, useEffect, useState } from "react"
import { Mixpanel } from "../../../../utils/mixpanel"
import { Campaign, getCampaigns } from "../../../api/campaigns/getCampaigns"
import Loading from "../../../loading"
import { campaignCategories as interests } from "../../../../utils/campaignCategory"
import { useDebounceCallback } from "usehooks-ts"
import Pagination from "../_components/Pagination"

const Explore = () => {
  const user = useUser()

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasNextPage, setHasNextPage] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<IPagination>()

  // Add "All" as the default selected interest
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

  const loadCampaigns = async (pageNum: number, search: string = "") => {
    try {
      setLoadingMore(pageNum > 1)
      const newCampaigns = await getCampaigns({
        page: pageNum,
        noAuth: true,
        title: search,
      })
      setHasNextPage(newCampaigns.pagination.hasNextPage)
      setPagination(newCampaigns.pagination)

      const campaignsArray = newCampaigns?.campaigns as Campaign[]

      if (Array.isArray(campaignsArray)) {
        setCampaigns((prevCampaigns) => {
          if (pageNum === 1) {
            return campaignsArray
          }

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
      setIsLoading(false)
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

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setPage(1)
      loadCampaigns(1, search)
    }, 500),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  useEffect(() => {
    loadCampaigns(1)
    Mixpanel.track("Explore Page viewed")
  }, [])

  const handleSeeMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadCampaigns(nextPage, searchTerm)
  }

  const setSearch = useDebounceCallback(() => {
    setPage(1)
    loadCampaigns(1)
  }, 3000)

  if (isLoading) return <Loading size="contain" />

  return (
    <div className="relative">
      <div className="flex flex-row items-center justify-between w-full">
        {user && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl text-black">
                Welcome to Crowdr, {user.organizationName} 💚
              </h3>
              <p className="text-sm text-[#61656B]">
                Explore campaigns and spread love by donating.{" "}
              </p>
            </div>
          </div>
        )}

        <div className="relative w-full md:w-[400px] mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search campaigns..."
            className="w-full text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] pl-[40px] pr-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <Search className="absolute left-[14px] top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      <div
        id="interests"
        className="flex flex-row scrollbar-thin scrollbar-track-[#f9f9f9] scrollbar-thumb-[#E5E7EB] overflow-x-scroll gap-5 mt-6"
      >
        {allInterests.map(({ value, label, icon, bgColor }) => (
          <label
            key={value}
            style={{
              backgroundColor: selectedInterest === value ? "#00B964" : bgColor,
            }}
            className={`flex justify-center items-center gap-x-[5px] rounded-full cursor-pointer py-[8px] px-[21px] mr-[5.5px] ${bgColor}`}
            onClick={() => handleInterestToggle(value)}
          >
            {icon && (
              <Image
                src={`/svg/emoji/${icon}.svg`}
                alt={icon}
                width={15}
                height={15}
              />
            )}
            <span
              className={`${
                selectedInterest === value ? "text-[#F8F8F8]" : "text-[#0B5351]"
              } text-[12px] md:text-base w-max`}
            >
              {label}
            </span>
          </label>
        ))}
      </div>

      {filteredCampaigns && (
        <>
          <div className="grid grid-cols-1 gap-2.5 min-w-full md:grid-cols-2">
            {Array.isArray(filteredCampaigns) &&
              filteredCampaigns?.map((campaign: Campaign, index: number) => {
                const urlsOnly = campaign.campaignAdditionalImages.map(
                  (item) => item.url
                )

                const userDetails = campaign?.user
                const donatedAmount = campaign?.totalAmountDonated?.[0].amount
                return (
                  <ExploreCard
                    id={campaign._id}
                    userId={userDetails?._id}
                    name={
                      userDetails?.userType === "individual"
                        ? userDetails?.fullName
                        : userDetails?.organizationName
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
                    donateImage={""}
                    routeTo={`/explore/c/${campaign._id}`}
                    avatar={campaign?.photo?.url || ""}
                    key={index}
                    campaignType={campaign.campaignType}
                    user={campaign.user}
                  />
                )
              })}

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

            {filteredCampaigns?.length < 1 && !isLoading && (
              <p className="absolute inset-0 flex justify-center items-center text-center font-semibold text-[18px] md:text-[30px] top-64">
                No campaigns available at this moment.
              </p>
            )}
          </div>
        </>
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
    </div>
  )
}

export default Explore

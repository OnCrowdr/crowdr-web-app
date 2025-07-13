import { Modal } from "flowbite-react"
import { useFormContext } from "react-hook-form"
import { CampaignFormContext } from "./useCampaignForm"
import { getInitials } from "../../../../_components/Header"
import { useUser } from "../../../../../../../contexts/UserProvider"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import Slider from "react-slick"
import ArrowRight from "@/public/svg/arrow-right.svg"
import ArrowLeft from "@/public/svg/arrow-left.svg"
import React from "react"
import ProgressBar from "../../../../_components/ProgressBar"
import { Button } from "../../../../../../../components/Button"
import moment from "moment"
import { regex } from "regex"
import { formatAmount } from "../../../../_common/utils/currency"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useAuth } from "@/contexts/AppProvider"
import { UserType } from "@/api/_users/models/PostSignUp"

const CampaignPreview = () => {
  const [hover, setHover] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const {
    campaignType,
    showPreview,
    isEdit,
    uploadedImages,
    setShowPreview,
    submitForm,
    ...form
  } = useFormContext() as CampaignFormContext
  const { user } = useAuth()
  const values = form.getValues()
  const subheader = values.story
  const totalAmount = values.fundingGoal
  const currency = values.currency
  const currentAmount = 0
  const progress = 0
  const [slideImages, setSlideImages] = useState(uploadedImages)
  const images = values.campaignImages ?? []
  const accountName = user
    ? user.userType === UserType.Individual
      ? user.fullName
      : user.organizationName
    : "User"

  useEffect(() => {
    const promises = images.map((img) => {
      const promise = new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result)
        }
        reader.readAsDataURL(img)
      })
      return promise
    })
    Promise.all(promises).then((images) =>
      setSlideImages([...slideImages, ...(images as any)])
    )
  }, [showPreview])

  // if (slideImages.length === 0) {
  //   const promises = images.map((img) => {
  //     const promise = new Promise((resolve) => {
  //       const reader = new FileReader()
  //       reader.onload = (e) => {
  //         resolve(e.target?.result)
  //       }
  //       reader.readAsDataURL(img)
  //     })
  //     return promise
  //   })
  //   Promise.all(promises).then((images) => setSlideImages(images as any))
  // }

  const formattedText = useMemo(() => {
    if (!subheader) return { shortText: "", fullText: "" }

    // WARN: Commented code uses look-behind which isn't compaitble with older safari browsers
    // const sentences = subheader.split(/(?<=[.!?])\s+/)
    const sentenceSplitter = /([.!?])\s+/
    const sentences = subheader.split(sentenceSplitter)
    const shortSentences = sentences.slice(0, 3).join(" ")
    const fullText = sentences
      .reduce((acc, sentence, index) => {
        if (index % 3 === 0 && index !== 0) {
          return acc + "\n\n" + sentence
        }
        return acc + " " + sentence
      }, "")
      .trim()

    return {
      shortText:
        shortSentences.length > 150
          ? shortSentences.slice(0, 150) + "..."
          : shortSentences,
      fullText: fullText,
    }
  }, [subheader])

  const toggleReadMore = () => {
    setIsCollapsed(!isCollapsed)
  }

  const settings = (images: string[]) => {
    return {
      dots: true,
      infinite: false,
      speed: 500,
      fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      arrows: hover ? true : false,
      swipeToSlide: true,
      afterChange: setCurrentSlide,
      nextArrow: (
        <Image
          src={ArrowLeft}
          alt="arrow-right"
          className={`${currentSlide === 0 && "slick-disabled"}`}
          onMouseEnter={() => setHover(true)}
        />
      ),
      prevArrow: (
        <Image
          src={ArrowLeft}
          alt="arrow-left"
          className={`${
            currentSlide === images.length - 1 && "slick-disabled"
          }`}
          onMouseEnter={() => setHover(true)}
        />
      ),
    }
  }

  if (!user || !showPreview) return null

  return (
    <Modal
      show={true}
      onClose={() => !form.formState.isSubmitting && setShowPreview(false)}
      size={"5xl"}
    >
      <Modal.Header className="items-center md:px-10">
        <span className="font-semibold text-lg mt-6 mb-3">
          Campaign Preview
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="max-w-[778px] mx-auto md:p-6">
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              {/* {avatar ? (
                <Image
                  src={avatar}
                  alt="user-avatar"
                  width={40}
                  height={40}
                  className="rounded-full !w-10 !h-10 object-cover"
                />
              ) : ( */}
              <div className="rounded-full bg-[#00B964] flex flex-row items-center justify-center h-[40px] w-[40px] font-bold text-white">
                {getInitials(accountName)}
              </div>
              {/* )} */}

              <div className="pl-3">
                <h3 className="text-sm font-normal text-[#344054]">
                  {accountName}
                </h3>
                <h4 className="text-xs font-normal text-[#667085]">
                  {user.userType.toLowerCase() === "non-profit"
                    ? "Organization"
                    : user.userType}
                </h4>
              </div>
            </div>
            {/* <Image src={Menu} alt='menu' /> */}
          </div>

          <div className="mt-4 mb-6 relative">
            <div className="absolute z-10 bg-[#F8F8F8] rounded-[25px] py-1 px-2 mt-[14px] ml-[14px] text-[#0B5351] capitalize opacity-80 text-sm">
              {values.category}
            </div>

            {slideImages && slideImages.length && (
              <div>
                {slideImages.length > 1 ? (
                  <Slider {...settings(slideImages)}>
                    {slideImages.map((image, index) => {
                      return (
                        <div key={index}>
                          {/* <OldModal isOpen={modalIsOpen} onClose={closeModal}>
                            <div
                              className="relative p-12"
                              style={{
                                background: "rgba(76, 76, 76, 0)",
                              }}
                            >
                              <IoMdClose
                                size={30}
                                className="absolute top-0 right-0 my-4 mx-4 bg-white p-1 rounded-full z-10 cursor-pointer"
                                onClick={closeModal}
                              />
                              <Image
                                src={slideImages[currentSlide]}
                                alt="donate"
                                className="h-60 object-center object-cover rounded-none"
                                width={500}
                                height={500}
                                style={{
                                  objectFit: "unset",
                                  height: "60vh",
                                  minWidth: "400px",
                                  width: "100%",
                                }}
                              />
                            </div>
                          </OldModal> */}

                          <Image
                            src={image}
                            alt="donate"
                            className="h-60 object-center object-cover rounded-lg cursor-pointer"
                            width={500}
                            height={400}
                            style={{
                              width: "100%",
                              maxWidth: "100%",
                              objectFit: "cover",
                            }}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            // onClick={() => {
                            //   openModal()
                            // }}
                          />
                        </div>
                      )
                    })}
                  </Slider>
                ) : (
                  <>
                    {/* <OldModal isOpen={modalIsOpen} onClose={closeModal}>
                      <div
                        className="relative p-12"
                        style={{
                          background: "rgba(76, 76, 76, 0)",
                        }}
                      >
                        <IoMdClose
                          size={30}
                          className="absolute top-0 right-0 my-4 mx-4 bg-white p-1 rounded-full z-10 cursor-pointer"
                          onClick={closeModal}
                        />
                        <Image
                          src={!!slideImages && slideImages[0]}
                          alt="donate"
                          className="h-60 object-center object-cover rounded-none"
                          width={500}
                          height={500}
                          style={{
                            objectFit: "unset",
                            height: "60vh",
                            minWidth: "400px",
                            width: "100%",
                          }}
                        />
                      </div>
                    </OldModal> */}
                    <Image
                      src={!!slideImages && slideImages[0]}
                      alt="donate"
                      className="h-60 object-center object-cover rounded-lg  cursor-pointer"
                      width={500}
                      height={400}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                      }}
                      // onClick={() => {
                      //   openModal()
                      // }}
                    />
                  </>
                )}
              </div>
            )}

            <div className="my-5">
              <h3 className="font-semibold text-[18px]">{values.title}</h3>
              <p className="mt-2 break-words text-sm whitespace-pre-line">
                {isCollapsed ? formattedText.shortText : formattedText.fullText}
                {formattedText.shortText !== formattedText.fullText && (
                  <span
                    onClick={toggleReadMore}
                    className="text-[#00B964] cursor-pointer pl-1 inline-block mt-2"
                  >
                    {isCollapsed ? "See more" : "See less"}
                  </span>
                )}
              </p>

              {/* {!routeTo &&
                campaignType?.toLowerCase().includes("volunteer") && (
                  <div className="mt-4 gap-4">
                    {Object.entries(additionalDetails).map(
                      ([key, value], index) => (
                        <div
                          key={index}
                          className="flex flex-row items-center justify-start gap-2 mb-2"
                        >
                          <h4 className="text-sm">
                            {camelCaseToSeparated(key)}:
                          </h4>
                          <h4 className="text-[#667085] text-sm capitalize">
                            {value}
                          </h4>
                        </div>
                      )
                    )}
                    <h4 className="text-sm">Additional Note</h4>
                    <h4 className="text-[#667085] text-sm capitalize">
                      {volunteer?.additonalNotes}
                    </h4>
                  </div>
                )} */}
              <h4 className="mt-5 text-[#667085] text-sm">
                Ends {moment(values.campaignDuration[1], "YYYYMMDD").fromNow()}
              </h4>
            </div>

            {campaignType?.includes("fundraise") && totalAmount && (
              <div className="bg-[#F9F9F9] p-4 rounded-[8px]">
                <p className="text-sm text-[#667085] mb-[4px]">
                  <span className="text-[#000] text-sm">Goal</span>{" "}
                  {currency && formatAmount(currentAmount, currency)}/
                  {currency && formatAmount(totalAmount, currency)}
                </p>
                <ProgressBar
                  bgColor="#00B964"
                  percent={progress * 100}
                  showValue
                />
              </div>
            )}
          </div>

          {/* <OldModal isOpen={shareModal} onClose={closeShareModal}>
            <div
              className="relative p-12"
              style={{
                background: "rgba(76, 76, 76, 0)",
              }}
            >
              <ShareCampaign
                onClose={closeShareModal}
                campaignId={id}
                title={header}
                story={displayText}
                campaignCoverImage={slideImages?.[0]}
              />
            </div>
          </OldModal> */}

          <div className="flex flex-col w-full gap-3 max-w-[494px] mx-auto mt-4">
            <Button
              onClick={submitForm}
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              text={"Launch Campaign"}
              className="w-full !justify-center"
            />
            <Button
              onClick={() => setShowPreview(false)}
              disabled={form.formState.isSubmitting}
              text="Continue Editing"
              bgColor="#FFF"
              textColor="#344054"
              outlineColor="#D0D5DD"
              className="w-full !justify-center"
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CampaignPreview

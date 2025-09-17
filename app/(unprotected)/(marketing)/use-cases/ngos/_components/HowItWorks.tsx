import React from "react"
import Image from "next/image"
import "@/app/(homepage)/_components/home-styles/todo.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { useRouter } from "next/navigation"
import Pill, { pill } from "@/app/(protected)/dashboard/_components/Pill"
import useWindowSize from "@/hooks/useWindowSize"

const HowItWorks = () => {
  const router = useRouter()
  const width = useWindowSize(800)

  const Sports = (
    <Pill
      text="Sports"
      icon="man-swimming-light-skin-tone"
      textColor="#874100"
      bgColor="#FFF1E4"
      className="min-w-[126px]"
    />
  )
  const Climate = (
    <Pill
      text="Climate"
      icon="books"
      textColor="#076C11"
      bgColor="#E3FFE6"
      className="min-w-[126px]"
    />
  )
  const Technology = (
    <Pill
      text="Technology"
      icon="desktop-computer"
      textColor="#085D70"
      bgColor="#DEFAFF"
      className="min-w-[126px]"
    />
  )
  const Startup = (
    <Pill
      text="Startup"
      icon="office-building"
      textColor="#606E09"
      bgColor="#FBFFE2"
      className="min-w-[126px]"
    />
  )

  return (
    <section className="todo max-w-[1484px] mx-auto !pt-20 !pb-[40px]">
      <h3 className="!text-[32px] !md:text-[42px]">How It Works</h3>

      {width ? (
        <div className="todo-content">
          <div className="todo-item flex-1">
            <div className="flex flex-col gap-[14px]">
              <h4 className="!md:text-[32px] !leading-10">
                Create an account within minutes and get a{" "}
                <span className="italic text-[#00B964]">
                  free dedicated website
                </span>{" "}
                for your NGO
              </h4>
              <div className="flex gap-2">
                <button
                  className="btn-primary !w-[171px]"
                  onClick={() => {
                    router.push("signup")
                  }}
                >
                  Get Started
                </button>
                <button
                  className="btn-secondary text-[#00B964] rounded-full hover:bg-[#00b96312] transition-colors border-[1.6px] border-[#00B964] !w-[171px]"
                  onClick={() => {
                    open(
                      "https://youtube.com/playlist?list=PL_Rbth8fvDDxbh5l-5sNCDRcNpSNSn1GZ&si=RcMGWZoLrAxwhhJK",
                      "_blank"
                    )
                  }}
                >
                  Watch Demo
                </button>
              </div>
            </div>
            <Image
              src="/svg/profile-mockup.svg"
              width={300}
              height={500}
              alt="hero-section"
              className="w-full mt-10 h-full overflow-hidden"
            />
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <div className="todo-item relative flex flex-col !items-center !overflow-hidden !h-[340px] !px-[14px]">
              <h4 className="text-center !text-[24px] font-medium !leading-snug mb-2">
                Set up your campaign & publish
              </h4>
              <div className="flex-1 flex items-end overflow-hidden max-w-[55%]">
                <Image
                  src="/images/campaign.png"
                  width={300}
                  height={300}
                  alt="hero-section"
                />
              </div>

              <div className="absolute bottom-[43px] left-[-31px] rotate-[-14deg]">
                {Climate}
              </div>
              <div className="absolute bottom-[17px] left-[-12px]">
                {Sports}
              </div>

              <div className="absolute bottom-[49px] right-[-26px] rotate-[3deg]">
                {Startup}
              </div>
              <div className="absolute bottom-[8px] right-[-31px]">
                {Technology}
              </div>
            </div>

            <div className="todo-item relative !items-center !overflow-hidden !h-[340px]">
              <h4 className="text-center !text-[24px] font-medium !leading-snug mb-[18px]">
                Share your campaign & receive donations
              </h4>

              <div className="flex flex-row items-center justify-center gap-4">
                <Image
                  src="/svg/twitter-x.svg"
                  width={40}
                  height={40}
                  alt="twitter"
                />
                <Image
                  src="/svg/facebook-new.svg"
                  width={40}
                  height={40}
                  alt="facebook"
                />
                <Image
                  src="/svg/linkedin-new.svg"
                  width={40}
                  height={40}
                  alt="linkedin"
                />
                <Image src="/svg/mail.svg" width={40} height={40} alt="mail" />
              </div>

              <div className="flex flex-col gap-2 absolute bottom-2 left-0 right-0">
                <Image
                  src="/svg/donation-notification.svg"
                  width={500}
                  height={200}
                  alt="hero-section"
                  className="self-end relative w-[80%] lg:w-[70%] bottom-[-30px] lg:bottom-[-40px] xl:bottom-[-60px]"
                />

                <Image
                  src="/svg/donation.svg"
                  width={500}
                  height={500}
                  alt="hero-section"
                  className="relative left-2 md:bottom-[-20px] lg:bottom-[-35px] xl:bottom-[-50px] w-[90%]"
                />
              </div>
            </div>
          </div>

          <div className="todo-item flex-1 overflow-hidden">
            <span className="text-black text-sm leading-10">
              Wanna get more reach?
            </span>
            <div className="flex flex-col gap-[14px]">
              <h4 className="!leading-snug mb-5">
                Withdraw your funds securely
              </h4>
            </div>

            <div className="w-[90%]">
              <Image
                src="/svg/campaign-stat-cards.svg"
                width={300}
                height={300}
                alt="hero-section"
                className="w-full"
              />
              <Image
                src="/svg/withdrawal-modal.svg"
                width={300}
                height={300}
                alt="hero-section"
                className="w-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <Slider {...settings}>
          <div className="todo-item !mt-4">
            <div className="flex flex-col gap-[14px]">
              <h4>Create an account in minutes</h4>
              <button
                className="btn-primary !w-[171px] z-10"
                onClick={() => {
                  router.push("signup")
                }}
              >
                Get started
              </button>
            </div>
            <Image
              src="/svg/profile-mockup.svg"
              width={300}
              height={500}
              alt="hero-section"
              className="w-full mt-1 h-full overflow-hidden"
            />
          </div>

          <div className="!flex !flex-col !items-center !gap-4 !mt-4">
            <div className="todo-item relative flex flex-col !items-center !overflow-hidden !h-[340px] !px-[14px]">
              <h4 className="text-center !text-[24px] font-medium !leading-snug">
                Set up your campaign & publish
              </h4>
              <div className="flex-1 flex items-end overflow-hidden max-w-[55%]">
                <Image
                  src="/images/campaign.png"
                  width={300}
                  height={300}
                  alt="hero-section"
                />
              </div>

              <div className="absolute bottom-[43px] left-[-31px] rotate-[-14deg]">
                {Climate}
              </div>
              <div className="absolute bottom-[17px] left-[-12px]">
                {Sports}
              </div>

              <div className="absolute bottom-[49px] right-[-26px] rotate-[3deg]">
                {Startup}
              </div>
              <div className="absolute bottom-[8px] right-[-31px]">
                {Technology}
              </div>
            </div>

            <div className="todo-item relative !items-center !overflow-hidden !h-[340px]">
              <h4 className="text-center !text-[24px] font-medium !leading-snug mb-[18px]">
                Share your campaign & receive donations
              </h4>

              <div className="flex flex-row items-center justify-center gap-4">
                <Image
                  src="/svg/twitter-x.svg"
                  width={40}
                  height={40}
                  alt="twitter"
                />
                <Image
                  src="/svg/facebook-new.svg"
                  width={40}
                  height={40}
                  alt="facebook"
                />
                <Image
                  src="/svg/linkedin-new.svg"
                  width={40}
                  height={40}
                  alt="linkedin"
                />
                <Image src="/svg/mail.svg" width={40} height={40} alt="mail" />
              </div>

              <div className="flex flex-col gap-2 absolute bottom-2 left-0 right-0">
                <Image
                  src="/svg/donation-notification.svg"
                  width={500}
                  height={200}
                  alt="hero-section"
                  className="self-end relative w-[80%] lg:w-[70%] bottom-[-30px] lg:bottom-[-40px] xl:bottom-[-60px]"
                />

                <Image
                  src="/svg/donation.svg"
                  width={500}
                  height={500}
                  alt="hero-section"
                  className="relative left-2 bottom-[-40px] lg:bottom-[-35px] xl:bottom-[-50px] w-[90%]"
                />
              </div>
            </div>
          </div>

          <div className="todo-item !mt-4">
            <span className="text-black text-sm leading-10">
              Wanna get more reach?
            </span>
            <div className="flex flex-col gap-[14px]">
              <h4 className="!leading-snug mb-5">
                Withdraw your funds securely
              </h4>
            </div>

            <div className="w-[90%]">
              <Image
                src="/svg/campaign-stat-cards.svg"
                width={300}
                height={300}
                alt="hero-section"
                className="w-full"
              />
              <Image
                src="/svg/withdrawal-modal.svg"
                width={300}
                height={300}
                alt="hero-section"
                className="w-full"
              />
            </div>
          </div>
        </Slider>
      )}
    </section>
  )
}

export default HowItWorks

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  swipeToSlide: true,
  arrows: false,
}

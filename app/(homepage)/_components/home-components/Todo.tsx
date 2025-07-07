import React from "react";
import Image from "next/image";
import "../home-styles/todo.css";
import useWindowSize from "../../../../hooks/useWindowSize";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRouter } from "next/navigation";

const Todo = () => {
  const router = useRouter();
  const width = useWindowSize(800);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    swipeToSlide: true,
    arrows: false
  };
  
  return (
    <section className="todo max-w-[1484px] mx-auto">
      <h3>How does Crowdr work?</h3>

      {width ? (
        <div className="todo-content">
          <div className="todo-item">
            <div className="flex flex-col gap-[14px]">
              <h4>Create an account in minutes</h4>
              <button
                className="btn-primary !w-[171px]"
                onClick={() => {
                  router.push("signup");
                }}>
                Get started
              </button>
            </div>
            <Image
              src="/svg/iphone.svg"
              width={300}
              height={500}
              alt="hero-section"
              className="w-full mt-10 h-full overflow-hidden"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="todo-item !items-center !h-[340px] w-full">
              <h4 className="text-center !text-[24px]">Create campaigns</h4>
              <div className="overflow-hidden">
                <Image
                  src="/images/campaign.png"
                  width={300}
                  height={300}
                  alt="hero-section"
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="todo-item !items-center !h-[340px]">
              <h4 className="text-center !text-[24px]">
                Get support from your community and beyond!
              </h4>
              <div className="overflow-hidden flex flex-col items-start">
                <Image
                  src="/svg/notification.svg"
                  width={500}
                  height={200}
                  alt="hero-section"
                  className="w-full  overflow-hidden"
                />
                <Image
                  src="/svg/donation.svg"
                  width={500}
                  height={500}
                  alt="hero-section"
                  className="w-[350px]  h-full overflow-hidden"
                />
              </div>
            </div>
          </div>
          <div className="todo-item">
            <span className="text-black text-sm leading-10">
              Wanna get more reach ?
            </span>
            <div className="flex flex-col gap-[14px]">
              <h4>Share campaign to socials </h4>
            </div>
            <div className="flex flex-row items-center justify-center gap-4 mt-10 w-full">
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
            <Image
              src="/svg/new-modal.svg"
              width={300}
              height={300}
              alt="hero-section"
              className="w-[340px] mt-10 h-full overflow-hidden"
            />
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
                  router.push("signup");
                }}>
                Get started
              </button>
            </div>
            <Image
              src="/svg/iphone.svg"
              width={300}
              height={500}
              alt="hero-section"
              className="w-full mt-1 h-full overflow-hidden"
            />
          </div>
          <div className="!flex !flex-col !items-center !gap-4 !mt-4">
            <div className="todo-item !items-center !h-[340px] w-full">
              <h4 className="text-center !text-[24px]">Create campaigns</h4>
              <div className="overflow-hidden">
                <Image
                  src="/images/campaign.png"
                  width={300}
                  height={300}
                  alt="hero-section"
                  className="w-full"
                />
              </div>
            </div>
            <div className="todo-item !items-center !h-[340px] w-full">
              <h4 className="text-center !text-[24px]">
                Get support from your community and beyond!
              </h4>
              <Image
                src="/svg/notification.svg"
                width={500}
                height={500}
                alt="hero-section"
                className="w-full  overflow-hidden"
              />
              <Image
                src="/svg/donation.svg"
                width={500}
                height={500}
                alt="hero-section"
                className="w-full overflow-hidden"
              />
            </div>
          </div>
          <div className="todo-item !mt-4">
            <span className="text-black text-sm leading-10">
              Wanna get more reach ?
            </span>
            <div className="flex flex-col gap-[14px]">
              <h4>Share campaign to socials </h4>
            </div>
            <div className="flex flex-row items-center justify-center gap-4 mt-10 w-full">
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
            <Image
              src="/svg/new-modal.svg"
              width={300}
              height={300}
              alt="hero-section"
              className="w-full mt-10 overflow-hidden"
            />
          </div>
        </Slider>
      )}
    </section>
  );
};

export default Todo;

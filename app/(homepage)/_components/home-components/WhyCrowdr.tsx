"use client";
import React, { useState } from "react";
import Image from "next/image";
import useWindowSize from "../../../../hooks/useWindowSize";
import { useRouter } from "next/navigation";
import { Mixpanel } from "../../../../utils/mixpanel";

const WhyCrowdr = () => {
  const router = useRouter();
  const tabs = ["Individuals", "Organizations", "Businesses"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const width = useWindowSize(768);
  const content = [
    {
      tab: "Individuals",
      items: [
        {
          id: 1,
          title: "Support your community",
          description:
            "Impact your community by volunteering and donating to our catalog of non-profit initiatives."
        },
        {
          id: 2,
          title: "Build a volunteering resume",
          description:
            "Boost your resume with volunteering experience and increase your chances of career success."
        },
        {
          id: 3,
          title: "Network and make new friends",
          description:
            "Expand your circle by connecting with other like-minded individuals."
        },
        {
          id: 4,
          title: "Learn new skills",
          description:
            "If you’re trying to upgrade your knowledge, volunteering is a low-stakes way to both learn and put your skills into practice."
        }
      ]
    },
    {
      tab: "Organizations",
      items: [
        {
          id: 1,
          title: "Receive donations",
          description:
            "Use our fundraising tools to meet and exceed your organization’s funding goals!"
        },
        {
          id: 2,
          title: "Source volunteers",
          description:
            "Find consistent and vetted volunteers to help execute your outreach initiatives."
        },
        {
          id: 3,
          title: "Get access to valuable insights",
          description:
            "Use our CRM and analytics tools to better understand your community and make more effective decisions."
        },
        {
          id: 4,
          title: "Maximize your impact",
          description:
            "Reach and engage with new audiences outside your organization’s locality."
        }
      ]
    },
    {
      tab: "Businesses",
      items: [
        {
          id: 1,
          title: "Fulfill your CSR initiatives",
          description:
            "Showcase your commitment to social and environmental issues that impact your customers. "
        },
        {
          id: 2,
          title: "Engage with your community and enhance visibility",
          description:
            "Participating in charitable events enables your business to foster positive relationships with existing and potential customers. "
        },
        {
          id: 3,
          title: "Save on taxes",
          description:
            "You can deduct donations amounting to 10% of your company's annual assessable profits!"
        },
        {
          id: 4,
          title: "Employee engagement",
          description:
            "Encouraging employees to participate in volunteering activities fosters a sense of purpose and boosts morale."
        }
      ]
    }
  ];

  const currentTabContent = content.find(
    (tabContent) => tabContent.tab === activeTab
  );

  const Tab = () => {
    return (
      <div className="flex flex-row items-center  justify-between gap-[24px] bg-[#383838] p-1.5 md:p-2.5 mt-4 md:mt-24 rounded-[80px]">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          const activeStyle = isActive
            ? "bg-[#F7CE50] text-[#1F2227]"
            : "text-[#EBECED]";
          return (
            <div
              key={index}
              className={`text-sm text-[13px] md:text-[16px] font-normal rounded-[50px] p-2 md:p-4 text-center ${activeStyle}`}
              onClick={() => {
                setActiveTab(tab);
                Mixpanel.track(tab);
              }}>
              {tab}
            </div>
          );
        })}
        {width && (
          <div
            onClick={() => router.push("/signup")}
            className="text-sm md:text-[16px] rounded-[50px] p-4 text-center text-white bg-[#006637] w-[170px] ml-12">
            Get Started
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="bg-[#181A1D] py-16 flex flex-col items-center justify-center w-full relative">
      <div className="px-6 w-full md:w-[80%] flex flex-col item-start max-w-[1484px]  mx-auto">
        <h2 className="text-white md:text-[42px]">Why Crowdr?</h2>
        {!width && <Tab />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:mt-4">
          {currentTabContent &&
            currentTabContent.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-row items-start justify-start gap-[24px]">
                <Image
                  src="/svg/heart-why.svg"
                  width={48}
                  height={48}
                  alt="hero-section"
                />
                <div className="flex flex-col items-start gap-1">
                  <h4 className="text-[#E6F8F0] text-[20px] md:text-[24px] text-start">
                    {item.title}
                  </h4>
                  <p className="text-[#A4A6AA] text-sm md:text-[16px] text-start">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {width ? (
        <Tab />
      ) : (
        <div
          onClick={() => router.push("/explore")}
          className="text-sm md:text-[16px] rounded-[50px] p-4 text-center text-white bg-[#00B964] w-[90%] mt-6 cursor-pointer">
          Get Started
        </div>
      )}

      <Image
        src="/svg/yellow-leaf.svg"
        width={48}
        height={48}
        alt="hero-section"
        className="absolute bottom-0 right-0"
      />
    </div>
  );
};

export default WhyCrowdr;

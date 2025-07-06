import React from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import useClipboard from "../../hooks/useClipboard";
import { BsWhatsapp } from "react-icons/bs";
import { Mixpanel } from "../../utils/mixpanel";

type ShareCampaignProps = {
  campaignId?: string;
  title?: string;
  campaignCoverImage?: string;
  story?: string;
  onClose: () => void;
};

const ShareCampaign = (props: ShareCampaignProps) => {
  const { campaignId, title, onClose, story } = props;

  const shareUrl = `https://www.oncrowdr.com/explore/c/${campaignId}`;

  const { copied, copy } = useClipboard();

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${title} campaign on oncrowdr.com`);
    const body = encodeURIComponent(
      `Hi, I’d really appreciate it if you would share or donate to this campaign! ${shareUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getWhatsAppShareLink = () => {
    const header = encodeURIComponent(`\n\n*${title}*`);
    const body = encodeURIComponent(
      `\n\n${story}…\n\nDonate here: ${shareUrl}`
    );
    const footer = encodeURIComponent(
      `\n\nForward this message to your contacts to help this campaign reach its goal!`
    );
    const message = `Hi, \n\nI’d really appreciate it if you would share or donate to this campaign!\n\n${header}\n\n${body}${footer}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return `whatsapp://send?text=${message}`;
    } else {
      return `https://web.whatsapp.com/send?text=${message}`;
    }
  };

  return (
    <div className="flex flex-col bg-[#fff] rounded-[10px] w-[350px] md:w-[500px] max-w-[500px] font-satoshi">
      <div className="flex flex-row items-start p-4 border-b-[#3C3C435C] w-full justify-between border-b-[1px]">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-[18px]">{title}</h2>
          <p className="text-[14px] ">
            Support this campaign by sharing it to friends and family!
          </p>
        </div>
        <IoMdClose size={30} className=" cursor-pointer" onClick={onClose} />
      </div>
      <div className="grid grid-cols-2  md:grid-cols-3 justify-between px-4 py-5 gap-6">
        <div
          className="flex flex-col cursor-pointer gap-1 items-center"
          onClick={() => {
            copy(shareUrl);
            Mixpanel.track("Copied share link");
          }}>
          <Image src={"/svg/copy.svg"} alt="campaign" width={60} height={60} />
          <p className="text-[#000] text-[12px]">
            {copied ? "Linked copied" : "Copy link"}
          </p>
        </div>

        <a
          href={getWhatsAppShareLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            Mixpanel.track("Shared via WhatsApp");
          }}
          className="decoration-none text-[#000]">
          <div className="flex flex-col cursor-pointer gap-1 items-center ">
            <BsWhatsapp size={60} />
            <p className="text-[#000] text-[12px]">WhatsApp</p>
          </div>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          className="decoration-none text-[#000]"
          onClick={() => Mixpanel.track("Shared via Facebook")}
          rel="noopener noreferrer">
          <div className="flex flex-col cursor-pointer gap-1 items-center">
            <Image
              src={"/svg/facebook.svg"}
              alt="campaign"
              width={60}
              height={60}
            />
            <p className="text-[#000] text-[12px]">Facebook</p>
          </div>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            shareUrl
          )}&title=${encodeURIComponent(!!title && title)}&source=oncrowdr.com`}
          target="_blank"
          className="decoration-none text-[#000]"
          onClick={() => Mixpanel.track("Shared via LinkedIn")}
          rel="noopener noreferrer">
          <div className="flex flex-col cursor-pointer gap-1 items-center">
            <Image
              src={"/svg/linkedin-new.svg"}
              alt="campaign"
              width={60}
              height={60}
            />
            <p className="text-[#000] text-[12px]">LinkedIn</p>
          </div>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(
            "Please join me in supporting this campaign!"
          )} @oncrowdr`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => Mixpanel.track("Shared via Twitter")}
          className="decoration-none text-[#000]">
          <div className="flex flex-col cursor-pointer gap-1 items-center ">
            <Image
              src={"/svg/twitter-x.svg"}
              alt="campaign"
              width={60}
              height={60}
            />
            <p className="text-[#000] text-[12px]">Twitter / X</p>
          </div>
        </a>

        <div
          className="flex flex-col cursor-pointer gap-1 items-center "
          onClick={() => {
            shareViaEmail();
            Mixpanel.track("Shared via Email");
          }}>
          <Image src={"/svg/mail.svg"} alt="campaign" width={60} height={60} />
          <p className="text-[#000] text-[12px]">Share via mail</p>
        </div>
      </div>
    </div>
  );
};

export default ShareCampaign;

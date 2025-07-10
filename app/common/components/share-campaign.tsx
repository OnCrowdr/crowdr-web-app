import React from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import useClipboard from "../hooks/useClipboard";
import { BsWhatsapp } from "react-icons/bs";
import { Mixpanel } from "../../../utils/mixpanel";

type ShareCampaignProps = {
  campaignId?: string;
  title?: string;
  campaignCoverImage?: string;
  story?: string;
  onClose: () => void;
  donationSuccess?: boolean;
  onDonateAgain?: () => void;
};

const ShareCampaign = (props: ShareCampaignProps) => {
  const { 
    campaignId, 
    title, 
    onClose, 
    story, 
    donationSuccess = false,
    onDonateAgain 
  } = props;

  const shareUrl = `https://www.oncrowdr.com/explore/c/${campaignId}`;

  const { copied, copy } = useClipboard();

  const boxShadow =
    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)";

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${title} campaign on oncrowdr.com`);
    const body = encodeURIComponent(
      donationSuccess 
        ? `Hi, I just donated to this amazing campaign and I'd really appreciate it if you would share or donate too! ${shareUrl}`
        : `Hi, I'd really appreciate it if you would share or donate to this campaign! ${shareUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getWhatsAppShareLink = () => {
    const header = encodeURIComponent(`\n\n*${title}*`);
    const body = encodeURIComponent(
      `\n\n${story}…\n\nDonate here: ${shareUrl}`
    );
    const footer = encodeURIComponent(
      donationSuccess
        ? `\n\nI just donated to this campaign! Forward this message to your contacts to help reach the goal!`
        : `\n\nForward this message to your contacts to help this campaign reach its goal!`
    );
    const message = donationSuccess
      ? `Hi, \n\nI just donated to this amazing campaign and I'd love for you to join me!\n\n${header}\n\n${body}${footer}`
      : `Hi, \n\nI'd really appreciate it if you would share or donate to this campaign!\n\n${header}\n\n${body}${footer}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return `whatsapp://send?text=${message}`;
    } else {
      return `https://web.whatsapp.com/send?text=${message}`;
    }
  };

  const handleDonateAgain = () => {
    if (onDonateAgain) {
      onDonateAgain();
    } else {
      onClose();
    }
    Mixpanel.track("Clicked Donate Again from Share Modal");
  };

  return (
    <div
      style={{ boxShadow }}
      className="max-w-[342px] md:max-w-[600px] bg-white rounded-lg overflow-hidden p-4 md:p-6 font-satoshi"
    >
      {/* Header Section */}
      <div className="flex justify-between md:gap-4 mb-3 md:mb-6">
        <Rings donationSuccess={donationSuccess} />

        <div className="hidden md:flex flex-col gap-1 mb-6 flex-1 ml-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              {donationSuccess ? (
                <h2 className="text-lg text-[#101828] font-semibold mb-1">
                  Donation Successful!
                </h2>
              ) : (
                <h2 className="text-lg text-[#101828] font-semibold mb-1">
                  Share {title}
                </h2>
              )}
              
              <p className="text-sm text-[#475467] md:text-justify">
                {donationSuccess ? (
                  <>
                    Thank you for your donation to <span className="font-semibold">{title}</span>! 
                    Help us reach our goal by sharing this campaign with your friends and family.
                  </>
                ) : (
                  "Support this campaign by sharing it to friends and family!"
                )}
              </p>
            </div>
            
            <XIcon onClick={onClose} className="cursor-pointer" />
          </div>
        </div>

        <div className="contents md:pointer-events-none">
          <XIcon
            onClick={onClose}
            className="cursor-pointer md:hidden"
            wrapperClass="mr-4 md:mr-0"
          />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex flex-col gap-1 mb-6 md:hidden">
        {donationSuccess ? (
          <>
            <p className="text-lg font-semibold text-green-600">Donation Successful!</p>
            <p className="text-sm text-[#475467]">
              Thank you for your donation to <span className="font-semibold">{title}</span>! 
              Help us reach our goal by sharing this campaign.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">Share {title}</p>
            <p className="text-sm text-[#475467]">
              Support this campaign by sharing it to friends and family!
            </p>
          </>
        )}
      </div>

      {/* Action Buttons for Donation Success */}
      {donationSuccess && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleDonateAgain}
              className="flex-1 bg-[#00B964] text-white py-3 px-4 rounded-lg font-semibold text-base hover:bg-[#009954] transition-colors shadow-sm"
            >
              Donate Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-[#D0D5DD] text-[#344054] py-3 px-4 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sharing Options */}
      <div className="border-t border-[#EAECF0] pt-6">
        <h3 className="text-sm font-medium text-[#344054] mb-4">Share via:</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div
            className="flex flex-col cursor-pointer gap-2 items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
            onClick={() => {
              copy(shareUrl);
              Mixpanel.track(donationSuccess ? "Copied share link after donation" : "Copied share link");
            }}>
            <Image src={"/svg/copy.svg"} alt="Copy link" width={40} height={40} />
            <p className="text-[#667085] text-[11px] text-center">
              {copied ? "Copied!" : "Copy link"}
            </p>
          </div>

          <a
            href={getWhatsAppShareLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              Mixpanel.track(donationSuccess ? "Shared via WhatsApp after donation" : "Shared via WhatsApp");
            }}
            className="decoration-none text-[#000]">
            <div className="flex flex-col cursor-pointer gap-2 items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <BsWhatsapp size={40} color="#25D366" />
              <p className="text-[#667085] text-[11px] text-center">WhatsApp</p>
            </div>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="decoration-none text-[#000]"
            onClick={() => Mixpanel.track(donationSuccess ? "Shared via Facebook after donation" : "Shared via Facebook")}
            rel="noopener noreferrer">
            <div className="flex flex-col cursor-pointer gap-2 items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <Image
                src={"/svg/facebook.svg"}
                alt="Facebook"
                width={40}
                height={40}
              />
              <p className="text-[#667085] text-[11px] text-center">Facebook</p>
            </div>
          </a>
          
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(!!title && title)}&source=oncrowdr.com`}
            target="_blank"
            className="decoration-none text-[#000]"
            onClick={() => Mixpanel.track(donationSuccess ? "Shared via LinkedIn after donation" : "Shared via LinkedIn")}
            rel="noopener noreferrer">
            <div className="flex flex-col cursor-pointer gap-2 items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <Image
                src={"/svg/linkedin-new.svg"}
                alt="LinkedIn"
                width={40}
                height={40}
              />
              <p className="text-[#667085] text-[11px] text-center">LinkedIn</p>
            </div>
          </a>
          
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
              donationSuccess 
                ? `I just donated to this amazing campaign! Please join me in supporting it!`
                : "Please join me in supporting this campaign!"
            )} @oncrowdr`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => Mixpanel.track(donationSuccess ? "Shared via Twitter after donation" : "Shared via Twitter")}
            className="decoration-none text-[#000]">
            <div className="flex flex-col cursor-pointer gap-2 items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <Image
                src={"/svg/twitter-x.svg"}
                alt="Twitter"
                width={40}
                height={40}
              />
              <p className="text-[#667085] text-[11px] text-center">Twitter / X</p>
            </div>
          </a>

          <div
            className="flex flex-col cursor-pointer gap-2 items-center p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
            onClick={() => {
              shareViaEmail();
              Mixpanel.track(donationSuccess ? "Shared via Email after donation" : "Shared via Email");
            }}>
            <Image src={"/svg/mail.svg"} alt="Email" width={40} height={40} />
            <p className="text-[#667085] text-[11px] text-center">Email</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCampaign;

const Rings = ({ donationSuccess }: { donationSuccess: boolean }) => {
  const ringClasses =
    "absolute scale border rounded-full border-[#D0D5DD] left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] ";

  return (
    <div
      className={`${
        donationSuccess ? "bg-[#DCFAE6]" : "bg-[#EFF8FF]"
      } relative grid place-content-center shrink-0 rounded-full w-12 h-12`}
    >
      {donationSuccess ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="#079455"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M8.5 14.5L12 11L15.5 14.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="#175CD3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <div
        className={
          ringClasses +
          "opacity-90 w-[calc(48px+(24px*2))] h-[calc(48px+(24px*2))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-70 w-[calc(48px+(24px*4))] h-[calc(48px+(24px*4))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-50 w-[calc(48px+(24px*6))] h-[calc(48px+(24px*6))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-30 w-[calc(48px+(24px*8))] h-[calc(48px+(24px*8))]"
        }
      ></div>
      <div
        className={
          ringClasses +
          "opacity-10 w-[calc(48px+(24px*10))] h-[calc(48px+(24px*10))]"
        }
      ></div>
    </div>
  );
};

const XIcon = ({ onClick, className, wrapperClass }: any) => {
  return (
    <div className={`relative ${wrapperClass || ""}`}>
      <div className="absolute grid place-items-center top-[50%] right-[50%] -translate-y-[50%] translate-x-[50%] rounded-full hover:bg-[#F8F8F8] transition h-10 w-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          onClick={onClick}
          className={className}
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="#98A2B3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
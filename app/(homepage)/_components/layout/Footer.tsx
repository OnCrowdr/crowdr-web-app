import React from "react"
import Image from "next/image"
import { email } from "../../../../utils/openEmail"
import Link from "next/link"
import "./component-styles/footer.css"

export default function Footer() {
  return (
    <footer className="flex flex-col-reverse md:flex-row gap-y-10 gap-x-16 bg-[#F8F8F8]">
      <div className="grid gap-4">
        <div className="description">
          <Link href={"/"}>
            <div
              className="w-[150px] md:w-[178px] h-[30px]"
              style={{
                background:
                  "url('/images/brand/crowdr_wordmark_svg/crowdr_wordmark_svg-BLACK.svg') transparent -30px center / cover no-repeat",
              }}
            />
          </Link>
          {/* <Image
            src="/images/brand/crowdr_wordmark_svg/crowdr_wordmark_svg-BLACK.svg"
            alt="crowdr logo"
            width={130}
            height={60}
            className=""
          /> */}
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/oncrowdr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            className=""
          >
            <Image
              src="/svg/instagram.svg"
              alt="instagram"
              width={32}
              height={32}
              className=""
            />
          </a>

          <a
            href="https://x.com/oncrowdr?s=21&t=7LoBQGAbuuakBget9QY3mw"
            target="_blank"
            className=""
          >
            <Image
              src="/svg/twitter.svg"
              alt="twitter"
              width={32}
              height={32}
              className=""
            />
          </a>

          <a
            href="https://www.linkedin.com/company/crowdr-app/"
            target="_blank"
            className=""
          >
            <Image
              src="/svg/linkedin.svg"
              alt="linkedin"
              width={32}
              height={32}
              className=""
            />
          </a>
        </div>

        <div className="grid gap-2">
          <p className="font-medium text-xl text-[#1F2227]">
            Join Our Community
          </p>
          <p className="text-[#282C32] max-w-[400px]">
            Get insider access to the Crowdr-verse, learn about the social-good
            ecosystem in Africa and more.
          </p>
        </div>

        {/* <div className="relative flex items-center rounded-full border border-[#86868691] max-w-[440px] p-4">
          <input
            placeholder="Email Address"
            className="flex-1 bg-transparent !outline-none h-full pr-24"
          />
          <button className="absolute -translate-y-[50%] top-[50%] right-3.5 font-medium text-xs text-[#EBECED] bg-[#00B964] rounded-full w-full max-w-[90px] h-8">
            Subscribe
          </button>
        </div> */}
      </div>

      <div className="flex-1 flex md:justify-center">
        <div className="flex flex-col sm:flex-row gap-5 justify-between w-full max-w-[400px]">
          <div className="links">
            <h3 className="text-[#1F2227]">Product</h3>
            <ul className="grid gap-2">
              <li className="">
                <Link href="/use-cases/individuals" className="">
                  For Individuals
                </Link>
              </li>
              <li className="">
                <Link href="/use-cases/organisations" className="">
                  For Organisations
                </Link>
              </li>
              <li className="">
                <Link href="/use-cases/ngos" className="">
                  For NGOs
                </Link>
              </li>
              <li className="">
                <Link href="/pricing" className="">
                  Pricing
                </Link>
              </li>
              <li className="">
                <Link href="/explore" className="">
                  Explore Campaigns
                </Link>
              </li>
            </ul>
          </div>

          <div className="links">
            <h3 className="text-[#1F2227]">Company</h3>
            <ul className="grid gap-2">
              <li className="">
                <Link href="/about" className="">
                  About
                </Link>
              </li>
              <li>
                <a href="https://blog.oncrowdr.com" target="_blank">
                  Blog
                </a>
              </li>
              <li className="">
                <Link href="/policies" className="">
                  Terms and Conditions
                </Link>
              </li>
              <li className="">
                <a href={`mailto:${email}`} target="_blank" className="">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

import React from "react";
import Image from "next/image";
import { email } from "../../../../utils/openEmail";
import Link from "next/link";
import "./component-styles/footer.css";

export default function Footer() {
  return (
    <footer className="">
      <div className="links-hold">
        <div className="links">
          <h3 className="">Company</h3>
          <ul className="">
            <li className="">
              <Link href="/about" className="">
                About us
              </Link>
            </li>
            <li>
              <a href="https://blog.oncrowdr.com" target="_blank">
                Blog
              </a>
            </li>
            <li className="">
              <Link href="/pricing" className="">
                Pricing
              </Link>
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
        <div className="links">
          <h3 className="">Connect</h3>
          <div className="socials-links">
            <a
              href="https://www.instagram.com/oncrowdr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              className="">
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
              className="">
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
              className="">
              <Image
                src="/svg/linkedin.svg"
                alt="linkedin"
                width={32}
                height={32}
                className=""
              />
            </a>
          </div>
        </div>
        <div className="links">
          <p className="copyright">
            Copyright {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <p className="copyright">CrowdrApp Technologies Limited.</p>
        </div>
      </div>
      <div className="description">
        <Image
          src="/svg/crowdr-logo.svg"
          alt="crowdr logo"
          width={130}
          height={60}
          className=""
        />
      </div>
    </footer>
  );
}

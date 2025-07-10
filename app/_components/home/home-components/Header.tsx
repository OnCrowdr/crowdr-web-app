import React from "react";
import Image from "next/image";
import "../home-styles/header.css";
import { useRouter } from "next/navigation";
import { FaApplePay } from "react-icons/fa";

type Props = {
  openModal?: () => void;
};

export default function Header({ openModal }: Props) {
  const router = useRouter();
  return (
    <section className="cta">
      
      <div className="content">
        <div className="tag">
          <Image src="/svg/planet.svg" width={20} height={20} alt="planet" />{" "}
          For individuals, non-profits & businesses
        </div>
        <h1 className="content-header">
        The easiest way to crowdfund <br/> online in Nigeria
        </h1>
        <p className="">
          Crowdr is the crowdfunding platform that makes it easy to fundraise in Nigeria and build trust with donors.
        </p>
        <div className="button-group">
          <button className="btn-primary" onClick={() => router.push("signup")}>
            Start a Campaign
          </button>
          <button
            className="btn-outline"
            onClick={() => router.push("/explore-campaigns")}>
            Donate to a Campaign
          </button>
        </div>
      </div>
      <Image
        src="/svg/crowdr-hero-section.svg"
        width={500}
        height={500}
        alt="hero-section"
        className="w-full
         -mt-[3rem] md:-mt-[16rem] 
         z-0"
      />
    </section>
  );
}

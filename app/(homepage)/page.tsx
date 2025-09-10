"use client"
import Faq from "./_components/home-components/Faq"
import Hero from "./_components/home-components/Hero"
import Community from "./_components/home-components/Community"
import { useEffect, useState } from "react"
import Footer from "./_components/layout/Footer"
import Navigation from "./_components/layout/Navigation"
import HowItWorks from "./_components/home-components/HowItWorks"
import WhyCrowdr from "./_components/home-components/WhyCrowdr"
import LiveCampaigns from "./_components/home-components/LiveCampaigns"
import Partners from "./_components/home-components/Partners"
import { Mixpanel } from "../../utils/mixpanel"
import ForeignDonationsBanner from "./_components/home-components/ForeignDonationsBanner"
import CrowdrStats from "./_components/home-components/CrowdrStats"
import RunningCampaigns from "./_components/home-components/RunningCampaigns"
import SoundFamiliar from "./_components/home-components/SoundFamiliar"
import CrowdrFeatures from "./_components/home-components/CrowdrFeatures"
import UseCases from "./_components/home-components/UseCases"
import Press from "./_components/home-components/Press"

export default function Home() {
  useEffect(() => {
    Mixpanel.track("Home Page viewed")
  }, [])

  return (
    <main>
      <Navigation />
      <main className="font-satoshi">
        <ForeignDonationsBanner />
        <Hero />
        <CrowdrStats />
        <RunningCampaigns />
        <SoundFamiliar />
        <CrowdrFeatures />
        <HowItWorks />
        <Press />
        {/* <WhyCrowdr /> */}
        <UseCases />
        <Partners />
        <Faq />
        {/* <Community /> */}
        <Footer />
      </main>
    </main>
  )
}

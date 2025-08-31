"use client"
import Navigation from "@/app/(homepage)/_components/layout/Navigation"
import Hero from "./_components/Hero"
import SoundFamiliar from "./_components/SoundFamiliar"
import HowItWorks from "@/app/(homepage)/_components/home-components/HowItWorks"
import Footer from "@/app/(homepage)/_components/layout/Footer"
import CrowdrFeatures from "./_components/CrowdrFeatures"
import Faq from "@/app/(homepage)/_components/home-components/Faq"

const Individuals = () => {
  return (
    <main>
      <Navigation />
      <main className="font-satoshi">
        <Hero />
        <SoundFamiliar />
        <CrowdrFeatures />
        <HowItWorks />
        <Faq />
        <Footer />
      </main>
    </main>
  )
}

export default Individuals

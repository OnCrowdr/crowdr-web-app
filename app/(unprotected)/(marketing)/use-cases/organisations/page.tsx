"use client"
import Navigation from "@/app/(homepage)/_components/layout/Navigation"
import Hero from "./_components/Hero"
import SoundFamiliar from "./_components/SoundFamiliar"
// import Faq from "./_components/Faq"
import Footer from "@/app/(homepage)/_components/layout/Footer"
import CrowdrFeatures from "./_components/CrowdrFeatures"
import HowItWorks from "./_components/HowItWorks"
import Testimonials from "../_components/Testimonials"
import UseCases from "./_components/UseCases"
import Faq from "./_components/Faq"

const Organizations = () => {
  return (
    <main>
      <Navigation />
      <main className="font-satoshi">
        <Hero />
        <SoundFamiliar />
        <CrowdrFeatures />
        <HowItWorks />
        <UseCases />
        <Testimonials testimonials={testimonials} />
        <Faq />
        <Footer />
      </main>
    </main>
  )
}

export default Organizations

const testimonials = [
  {
    quote:
      "“Working with Crowdr on the Mirabel Centre crowdfunding was amazing! They were hands-on and supportive every step of the way. From helping us spread the word and push out content to making sure we felt backed throughout the entire process. I’m so grateful for how invested you were in the cause. It truly felt like we were in it together.”",
    name: "OSHORIAME EGBAKUMEH",
    role: "Brand & Community Lead at BeautyHut Africa",
  },
  {
    quote: "“Crowdr is Nigeria’s GoFundMe! Super effective — donors can get refunds if scammed before payout. The last guy who faked being homeless was exposed in under 48 hours!”",
    name: "Aishat Mustapha",
    role: "Founder, Mairachamp",
  },
]

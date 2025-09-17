"use client"
import Navigation from "@/app/(homepage)/_components/layout/Navigation"
import Hero from "./_components/Hero"
import SoundFamiliar from "./_components/SoundFamiliar"
// import Faq from "./_components/Faq"
import Footer from "@/app/(homepage)/_components/layout/Footer"
import CrowdrFeatures from "./_components/CrowdrFeatures"
import HowItWorks from "./_components/HowItWorks"
import Testimonials from "../_components/Testimonials"
import Faq from "@/app/(homepage)/_components/home-components/Faq"

const NGOs = () => {
  return (
    <main>
      <Navigation />
      <main className="font-satoshi">
        <Hero />
        <SoundFamiliar />
        <CrowdrFeatures />
        <HowItWorks />
        <Testimonials testimonials={testimonials} />
        <Faq faqs={faqs} />
        <Footer />
      </main>
    </main>
  )
}

export default NGOs

const testimonials = [
  {
    quote:
      "“If you’re a social entrepreneur or NGO founder looking for a platform that will not only help you fundraise but also showcase your work. I highly recommend giving Crowdr a try. The support goes far beyond money - it’s about telling your story to the world.”",
    name: "AGNES ONYEKWERE",
    role: "Co-founder, Project Mend",
  },
  {
    quote:
      "“This product is really amazing. Thank you guys for what you are doing.”",
    name: "Mfonabasi Okutinyang",
    role: "Founder, Kasere",
  },
]

const faqs = [
  {
    heading: "How does Crowdr verify NGOs?",
    text: "We verify your organisation’s CAC registration during onboarding. This builds trust with donors and increases your chances of getting funded.",
  },
  {
    heading: "Does Crowdr take a fee?",
    text: (
      <>
        Yes, we charge a small platform fee to keep the app running. Please,
        check out the{" "}
        <a href="/pricing" target="_blank" className="text-[#00B964] underline">
          Pricing
        </a>{" "}
        section for more details.
      </>
    ),
  },
  {
    heading: "Can we run more than one fundraiser at a time?",
    text: "Yes. As long as each campaign is legitimate and clear, you can run multiple fundraisers for different projects.",
  },
  {
    heading: "Does Crowdr help promote NGO campaigns?",
    text: "Yes. We boost your campaign on our Explore page and on social media (if you tag us). We may also recommend you to organisations looking to partner on CSR projects.",
  },
]

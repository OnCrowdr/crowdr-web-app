"use client"
import Navigation from "@/app/(homepage)/_components/layout/Navigation"
import Hero from "./_components/Hero"
import SoundFamiliar from "./_components/SoundFamiliar"
import Faq from "./_components/Faq"
import Footer from "@/app/(homepage)/_components/layout/Footer"
import CrowdrFeatures from "./_components/CrowdrFeatures"
import HowItWorks from "./_components/HowItWorks"
import Testimonials from "../ngos/_components/Testimonials"
import WhyCrowdr from "./_components/WhyCrowdr"

const Organizations = () => {
  return (
    <main>
      <Navigation />
      <main className="font-satoshi">
        <Hero />
        <SoundFamiliar />
        <CrowdrFeatures />
        <HowItWorks />
        <WhyCrowdr />
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
    quote: "fdfdf",
    name: "dfd",
    role: "fdfdf",
  },
  {
    quote: "fdfdf",
    name: "dfd",
    role: "fdfdf",
  },
]

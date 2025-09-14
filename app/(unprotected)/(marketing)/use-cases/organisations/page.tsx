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
import Faq from "@/app/(homepage)/_components/home-components/Faq"

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
        <Faq faqs={faqs} />
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
    quote:
      "“Crowdr is Nigeria’s GoFundMe! Super effective — donors can get refunds if scammed before payout. The last guy who faked being homeless was exposed in under 48 hours!”",
    name: "Aishat Mustapha",
    role: "Founder, Mairachamp",
  },
]

const faqs = [
  {
    heading: "Can we choose the type of causes we want to support?",
    text: "Yes, absolutely. During our discovery call, we’ll ask questions about causes your organisation cares about. The CSR strategy we create will be fully tailored to your location, focus area, and kind of impact you’re looking to make.",
  },
  {
    heading: "How does Crowdr verify the fundraisers or causes?",
    text: "We have built an extensive network of causes through our self-serve platform; and every cause goes through a strict verification process. We check for authenticity and track record before recommending a cause to your organisation.",
  },
  {
    heading: "Can we use Crowdr for both donations and non-financial support (e.g., volunteers or awareness)?",
    text: "Yes. In addition to financial contributions, you can support causes through employee volunteering, awareness campaigns, or in-kind donations. Crowdr helps facilitate those connections.",
  },
  {
    heading: "Is there a cost to using Crowdr as a corporate partner?",
    text: "Yes, we charge a percentage commission on your CSR budget for the selected time period of project.",
  },
  {
    heading: "What if we already have a CSR team or PR agency?",
    text: "No problem. Crowdr complements your existing team by doing the legwork of cause sourcing and verification, so your team can focus on strategy and storytelling.",
  },
  {
    heading: "What kinds of companies use Crowdr for CSR?",
    text: "Our partners range from mid-sized companies launching their first CSR program to large organisations looking to support more grassroots impact causes.",
  },
]

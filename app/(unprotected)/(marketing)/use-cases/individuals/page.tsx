"use client"
import Navigation from "@/app/(homepage)/_components/layout/Navigation"
import Hero from "./_components/Hero"
import SoundFamiliar from "./_components/SoundFamiliar"
import HowItWorks from "@/app/(homepage)/_components/home-components/HowItWorks"
import Footer from "@/app/(homepage)/_components/layout/Footer"
import CrowdrFeatures from "./_components/CrowdrFeatures"
import Testimonials from "../_components/Testimonials"
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
        <Testimonials testimonials={testimonials} />
        <Faq faqs={faqs} />
        <Footer />
      </main>
    </main>
  )
}

export default Individuals

const testimonials = [
  {
    quote:
      "“The app is easy to use, and I like how it helps connect people to support causes. I think Crowdr has the potential to do a lot of good things and I’m excited to see how it grows.”",
    name: "Ifeanyi Moses",
  },
  {
    quote:
      "“Crowdr built a beautiful platform that enables people to do good in their communities and it has my heart.”",
    name: "Kamnelechukwu Obasi",
  },
  {
    quote:
      "“The first thing that caught my attention about Crowdr was that they’re community-based. I also really loved the user interface, it was really easy on the eyes.”",
    name: "Benedicta Ivarave",
  },
  {
    quote:
      "“God bless Crowdr, the funds I raised will go a long way in easing a number of stress and bills ahead of my final exams.”",
    name: "Victory Adeyemi",
  },
  {
    quote:
      "“I use Crowdr for transparency and accuracy. That way, I can just upload all my relevant proof at once and everybody can see how far along I am with my goal.”",
    name: "Sanni Morenikeji ‘BigBadReni’",
  },
]


const faqs = [
  {
    heading: "What kind of fundraisers can I start?",
    text: "You can raise money for anything, from medical bills, tuition, emergencies, and community projects—anything that genuinely helps you or someone else.",
  },
  {
    heading: "How do I get people to donate?",
    text: "Crowdr gives you tools to share your story, track donations, and update your supporters. You can share your fundraiser via WhatsApp, Instagram, Twitter, and more. We also boost your campaign within our network on social media and our Explore page.",
  },
  {
    heading: "Does Crowdr take a fee?",
    text: "Yes. We charge a small platform fee of 2% to keep the site running and support fundraisers. We’re transparent about all charges.",
  },
  {
    heading: "Can I raise funds for someone else?",
    text: "Absolutely. You can start a fundraiser on behalf of a friend, family member, or even someone in your community.",
  },
]
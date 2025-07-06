"use client";
import Faq from "./_components/home-components/Faq";
import Header from "./_components/home-components/Header";
import Community from "./_components/home-components/Community";
import { useEffect, useState } from "react";
import Footer from "./_components/layout/Footer";
import Navigation from "./_components/layout/Navigation";
import Todo from "./_components/home-components/Todo";
import WhyCrowdr from "./_components/home-components/WhyCrowdr";
import Happening from "./_components/home-components/Happening";
import Partners from "./_components/home-components/Partners";
import { Mixpanel } from "../../utils/mixpanel";
import ForeignDonationsBanner from "./_components/home-components/ForeignDonationsBanner";

export default function Home() {
  useEffect(() => {
    Mixpanel.track("Home Page viewed");
  }, []);
  return (
    <main>
      <Navigation />
      <main className="font-satoshi">
        <ForeignDonationsBanner />
        <Header />
        <Todo />
        <WhyCrowdr />
        <Happening />
        <Partners />
        <Faq />
        <Community />
        <Footer />
      </main>
    </main>
  );
}

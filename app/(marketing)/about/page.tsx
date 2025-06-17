"use client";
import React, { useEffect, useState } from "react";
import type { Metadata } from 'next'
import Header from "./about-components/Header";
import Image from "next/image";
import Details from "./about-components/Details";
import Contact from "./about-components/Contact";
import Team from "./about-components/Team";
import Navigation from "../../common/components/Navigation";
import Footer from "../../common/components/Footer";
import OldModal from "../../common/components/OldModal";
import WaitlistForm from "../../_components/home/home-components/WaitlistForm";
import Values from "./about-components/Values";
import { Mixpanel } from "../../../utils/mixpanel";


const AboutUs = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(()=>{
    Mixpanel.track(
      "About Page viewed"
    );
  },[])
  return (
    <div className="font-satoshi" >
      <Navigation openModal={openModal} />
      <Header />
      <Details />
      {/* <Accomplishments /> */}
      <Team />
      <Values/>
      <Contact />
      <Footer />
      <OldModal isOpen={modalIsOpen} onClose={closeModal}>
        <WaitlistForm />
      </OldModal>
    </div>
  );
};

export default AboutUs;

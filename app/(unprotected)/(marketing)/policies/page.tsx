"use client";
import React, { useEffect, useState } from "react";
import Navigation from "../../../(homepage)/_components/layout/Navigation";
import Footer from "../../../(homepage)/_components/layout/Footer";
import OurPolicies from "./policies-components/OurPolicies";
import OldModal from "../../../(homepage)/_components/layout/OldModal";
import WaitlistForm from "../../../(homepage)/_components/home-components/WaitlistForm";
import { Mixpanel } from "../../../../utils/mixpanel";

export default function Policies() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    Mixpanel.track("Policies Page viewed");
  }, []);
  return (
    <div className="font-satoshi">
      <Navigation openModal={openModal} />
      <OurPolicies />
      <Footer />
      <OldModal isOpen={modalIsOpen} onClose={closeModal}>
        <WaitlistForm />
      </OldModal>
    </div>
  );
}

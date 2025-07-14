import React from 'react'
import styles from '../pricing-styles/Team.module.css'
import "@/app/(homepage)/_components/home-styles/faq.css";
import Collapsible from "react-collapsible";


import Image from 'next/image'

export default function Faqs () {
  return (
    <section className={styles.team}>
      <div className='flex flex-col md:flex-row items-start justify-between gap-8'>
        <div className='flex flex-col items-start'>
          <span className="text-sm text-[#00B964] ">Support</span>
        <h2 className='text-center text-[32px] md:text-[36px] text-[#101828] font-medium leading-[44px] mt-3'>
          FAQs
        </h2>
        <p className='text-start text-sm md:text-[18px] text-[#475467] leading-[28px] mt-5'>
        Everything you need to know about the platform and billing. Can’t find the answer you’re looking for? Please reach out to our support team.
        </p>
        </div>
        <div>
          {faqArr.map((faq: { heading: string, text: string}, index) => (
            <div className="faq-collapsible-container" key={index}>
              <Collapsible
                trigger={
                  <div className="flex justify-between">
                    <p className="faq-collapsible-header !text-[18px]">{faq.heading}</p>
                    <Image src="/svg/plus-circle.svg" width={24} height={24} alt='accordion'/>
                  </div>
                }
                triggerWhenOpen={
                  <div className="flex justify-between">
                    <p className="faq-collapsible-header !text-[18px]">{faq.heading}</p>
                    <Image src="/svg/minus-circle.svg" width={24} height={24} alt='accordion'/>
                  </div>
                }
              >
                {index === 1 ?(<p className="pt-4 faq-collapsible-body !text-sm">Demos are available on a limited basis due to our team’s capacity. Please email us at <a className='text-[#00B964]' href='mailto:info@oncrowdr.com'>info@oncrowdr.com</a> for further assistance.</p>) :(<p className="pt-4 faq-collapsible-body !text-sm">{faq.text}</p>)}
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


const faqArr = [
  {
    heading: "Is there a different pricing structure for organizations and businesses?",
    text: "Yes. The above prices apply to registered organizations (this also applies to registered charity arms of corporations). If you intend to use Crowdr as a business, please schedule a meeting with us via the link below so we can better understand your company’s needs.",
  },
  {
    heading: "Can I see a demo of how the product works before signing up?",
    text: "",
  },
  {
    heading: "Do you offer special pricing packages for large-scale campaigns?",
    text: "At this time, we don’t — but never say never! Our platform is constantly evolving as we grow.",
  },
 
];

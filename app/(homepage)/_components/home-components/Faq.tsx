"use client"
import { openEmail } from "../../../../utils/openEmail"
import Image from "next/image"
import Collapsible from "react-collapsible"
import "../home-styles/faq.css"
import { RFC } from "@/types"

const Faq: RFC<Props> = ({faqs}) => {
  return (
    <section className="faq">
      <div className="faq-container max-w-[1484px] mx-auto">
        <p className="faq-header">Frequently Asked Questions</p>
        <p className="faq-header-big mt-[20px]">
          We knew you would ask. See? We’re two peas in a pod.
        </p>

        <div>
          {faqs.map((faq: { heading: string; text: string }, index) => (
            <div className="faq-collapsible-container" key={index}>
              <Collapsible
                trigger={
                  <div className="flex justify-between">
                    <p className="faq-collapsible-header">{faq.heading}</p>
                    <Image
                      src="/svg/plus-circle.svg"
                      width={24}
                      height={24}
                      alt="accordion"
                    />
                  </div>
                }
                triggerWhenOpen={
                  <div className="flex justify-between">
                    <p className="faq-collapsible-header">{faq.heading}</p>
                    <Image
                      src="/svg/minus-circle.svg"
                      width={24}
                      height={24}
                      alt="accordion"
                    />
                  </div>
                }
              >
                {index === 0 ? (
                  <p className="pt-4 faq-collapsible-body">
                    Please click the “Start a Campaign” button to create an
                    account! After that, please click{" "}
                    <a
                      href="https://blog.oncrowdr.com/starting-a-campaign/"
                      target="_blank"
                      className="text-[#00B964] underline"
                    >
                      here
                    </a>{" "}
                    for a comprehensive step-by-step guide for creating a
                    campaign. This guide is also located on our blog. If you run
                    into any issues, please don’t hesitate to email us at
                    support@oncrowdr.com.
                  </p>
                ) : (
                  <p className="pt-4 faq-collapsible-body">{faq.text}</p>
                )}
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq

interface Props {
  faqs: Array<{ heading: string; text: string }>
}

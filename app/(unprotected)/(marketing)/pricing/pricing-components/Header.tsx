import React from 'react'
import Image from 'next/image'
import styles from '../pricing-styles/Header.module.css'

export default function Header () {
  const pricingDetails = [
    {
      id: 1,
      title: 'Donor fee',
      description:
        'A processing fee is added at the donation point and paid by the donor. This goes to our payment provider, not Crowdr. Think of this like the processing fees all banks charge on transfers.',
      percentageCharge: '1.5% + ₦100 ',
      percentageDescription: (
        <>
          each donation. *Fee varies for Apple Pay transactions.{" "}
          <a
            href="https://blog.oncrowdr.com/payments-and-payouts/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00B964]"
          >
            Learn more here
          </a>.
        </>
      ),
      bgColor: 'bg-[#E3FFE6]',
      textColor: 'text-[#181A1D]'
    },
    {
      id: 2,
      title: 'Fundraising fee',
      description: (
        <>
          We deduct a small fee on funds raised to support our team and business operations. This helps us keep Crowdr running for everyone, so you can continue to make impact.{" "}
          <a
            href="https://blog.oncrowdr.com/payments-and-payouts/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EBECED] underline"
          >
            Read more on why we charge fees here
          </a>.
        </>
      ),
      percentageCharge: '5%',
      percentageDescription: 'amount raised',
      bgColor: 'bg-[#3B8249]',
      textColor: 'text-[#EBECED]'
    },
    {
      id: 3,
      title: 'Volunteer sourcing fee',
      description:
        'Sourcing volunteers through Crowdr is 100% free!',
      percentageCharge: '₦0',
      percentageDescription: 'volunteer',
      bgColor: 'bg-[#2B5F49]',
      textColor: 'text-[#EBECED]'
    }
  ]


  return (
    <section className={styles.headerContainer}>
      <div className='gap-4 md:gap-3  flex flex-col items-center md:w-full mx-auto my-0'>
        <span className='flex flex-row items-center border-[1px] border-[#EBECED] rounded-[50px] text-[13px] gap-2 leading-[20px] px-8 py-4'>
          <Image src='/svg/ticket.svg' alt='ticket' width={24} height={24} />
          Pricing
        </span>
        <div className="flex flex-col items-center gap-4 md:gap-6">
        <h2 className='text-[32px] md:text-[48px] font-medium text-[#1F2227] leading-[52px] md:leading-[60px] text-center'>
          Small Fees, Great Impact
        </h2>
        <p className='text-[14px] font-normal md:text-[20px] text-center'>
          Transaction fees help us run the platform successfully and we’ve
          worked hard to keep them lower than<br/> market costs. If you have any
          questions or concerns, please email us at{' '}
          <a 
            className='text-[#00B964]' 
            href='mailto:info@oncrowdr.com'
            target="_blank"
            rel="noopener noreferrer"
          >
            info@oncrowdr.com
          </a>.
        </p>
        </div>
        <div className='flex flex-col md:flex-row items-start gap-3 mt-16'>
        {
          pricingDetails.map(({id, title, description, percentageCharge, percentageDescription, bgColor, textColor}: {
            id: number;
            title: string;
            description: string | React.ReactElement;
            percentageCharge: string;
            percentageDescription: string | React.ReactElement;
            bgColor: string;
            textColor: string;
          }, index: number) => (
            <div key={id} className={`flex flex-col items-start justify-between gap-3 p-4 md:p-6 w-full ${bgColor} ${textColor} min-h-[280px] md:h-[340px]`}>
              <div>
              <h3 className={`text-[20px] md:text-[36px] font-medium  ${textColor} leading-[28px] md:leading-[55px]`}>{title}</h3>
              <p className={`text-[12px] md:text-sm ${textColor} leading-[18px] md:leading-[20px]`}>{description}</p>
              </div>
              <div className='flex flex-col items-start gap-1'>
                <h4 className={`text-[32px] md:text-[72px] font-medium ${textColor} leading-[36px] md:leading-[76px]`}>{percentageCharge}</h4>
                <p className={`text-[12px] md:text-[20px] ${textColor} leading-[16px] md:leading-[24px]`}>/ {percentageDescription}</p>
              </div>
            </div>
          ))
        }
      </div>
      </div>
      
    </section>
  )
}

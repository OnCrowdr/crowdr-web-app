import React from 'react'
import Image from 'next/image'
import styles from '../pricing-styles/Header.module.css'

export default function Header () {
  const pricingDetails = [
    {
      id: 1,
      title: 'Donor fee',
      description:
        'To fulfill the transaction with our payment processor, we charge a fee of 1.5% and ₦100 — capped at ₦500.',
      percentageCharge: '1.5% + ₦100',
      percentageDescription: 'each donation',
      bgColor: 'bg-[#E3FFE6]',
      textColor: 'text-[#181A1D]'
    },
    {
      id: 2,
      title: 'Fundraising fee',
      description:
        'A 5% fee is deducted from the total funds raised by a campaign creator.',
      percentageCharge: '5%',
      percentageDescription: 'amount raised',
      bgColor: 'bg-[#3B8249]',
      textColor: 'text-[#EBECED]'
    },
    {
      id: 3,
      title: 'Volunteer sourcing fee',
      description:
        'At this time, sourcing volunteers through our platform is free!',
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
          <a className='text-[#00B964]' href='mailto:info@oncrowdr.com'>info@oncrowdr.com</a>.
        </p>
        </div>
        <div className='flex flex-col md:flex-row items-start gap-3 mt-16'>
        {
          pricingDetails.map(({id, title, description, percentageCharge, percentageDescription, bgColor, textColor}, index) => (
            <div key={id} className={`flex flex-col items-start justify-between gap-3 p-6 ${index !== 0 && "w-full md:w-auto"}  ${bgColor} ${textColor} h-[280px] md:h-[340px]`}>
              <div>
              <h3 className={`text-[24px] md:text-[36px] font-medium  ${textColor} leading-[55px]`}>{title}</h3>
              <p className={`text-[14px] md:text-sm ${textColor}`}>{description}</p>
              </div>
              <div className='flex flex-col items-start gap-1'>
                <h4 className={`text-[40px] md:text-[72px] font-medium ${textColor}`}>{percentageCharge}</h4>
                <p className={`text-[14px] md:text-[20px] ${textColor}`}>/ {percentageDescription}</p>
              </div>
            </div>
          ))
        }
      </div>
      </div>
      
    </section>
  )
}

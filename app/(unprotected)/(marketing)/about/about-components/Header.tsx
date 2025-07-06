import React from 'react'
import Image from 'next/image'
import styles from '../about-styles/Header.module.css'

export default function Header () {
  return (
    <section className={styles.headerContainer}>
      <div className='gap-4 md:gap-24  flex flex-col items-center md:w-2/3 mx-auto my-0'>
        <span className='flex flex-row items-center border-[1px] border-[#EBECED] rounded-[50px] text-[13px] leading-[20px] px-8 py-4'>
          About Us
        </span>
        <div className="flex flex-col items-center gap-4 md:gap-6">
        <h2 className='text-[32px] md:text-[48px] font-medium text-[#1F2227] leading-[52px] md:leading-[60px] text-center'>
          So…what do we do, exactly?
        </h2>
        <p className='text-[14px] font-normal md:text-[20px] text-center'>
          Our mission is to empower individuals and communities by providing a
          platform that facilitates social good through crowdfunding and
          volunteering.
        </p>
        </div>
       
      </div>
    </section>
  )
}

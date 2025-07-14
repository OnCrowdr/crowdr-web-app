'use client'
import React from 'react'
import styles from "../pricing-styles/Contact.module.css";
import { openEmail } from '../../../../../utils/openEmail';

export default function Contact() {
  return (
    <section className={styles.contact}>
       <h1 className='text-center text-[30px] md:text-[60px] text-[#EBECED] '>Interested in supporting our mission?</h1>
       <button className='btn-primary !w-fit !rounded-[8px] !mt-6' onClick={openEmail}>Schedule a meeting</button>
    </section>
  )
}

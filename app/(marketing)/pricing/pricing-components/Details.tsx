'use client'

import React, { useState } from 'react'
import styles from '../pricing-styles/Details.module.css'
import Image from 'next/image'
import { formatCurrency } from '../../../../utils/seperateText'

export default function Details () {
  const [value, setValue] = useState(1000000)

  const handleChange = (e:any) => {
    setValue(e.target.value)
  }
  return (
    <section className={styles.details}>
      <div className='py-10 flex flex-col items-center justify-center gap-8 md:w-5/6 mx-auto my-0'>
        <p className='text-[24px] leading-[44px] text-[#EBECED] md:text-[32px] text-center'>
          If you raise{' '}
          <input type='number' value={value} name="value" 
           onWheel={(e) => e.currentTarget.blur()}
          onChange={handleChange} className='rounded-[8px] text-[24px] max-w-[200px] bg-[#393E46] border-[1px] border-[#D0D5DD] py-[10px] px-[14px] text-[#EBECED] outline-none focus:outline-none'/> from
          donors. You receive {value > 0 && <span className="font-bold text-[#EBECED]">{formatCurrency(value - (5/100 * value))}</span>}
        </p>
        <p className="text-[24px] leading-[44px] text-[#EBECED] md:text-[32px] text-center mt-2">Transaction fee: {formatCurrency(5/100 *value)}</p>
      </div>
    </section>
  )
}

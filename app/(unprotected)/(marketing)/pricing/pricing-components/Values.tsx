import { useRouter } from 'next/navigation'
import React from "react";
import styles from "../pricing-styles/values.module.css";

export default function Values() {
  const router = useRouter()
  return (
    <section className={styles.value}>
      <div className="py-16 flex flex-col items-center justify-center gap-3 md:w-5/6 mx-auto my-0">
        <h4 className="text-[32px] md:text-[36px] leading-[44px] text-[#E6F8F0] text-center">1 app, 2 goals, endless possibilities</h4>
        <p className="text-[#E6F8F0] text-sm leading-[30px] md:text-[20px] text-center ">Over 350 organizations and individuals use Crowdr. We think you should join them.</p>
        <div className='flex flex-row items-center gap-3 mt-8'>
          <button className="btn-primary !w-[150px] !text-sm"onClick={() => router.push('signup')}>Get started</button>
          <button className="btn-outline !w-[150px] !text-sm"  onClick={() => router.push('about')}>Learn more</button>
        </div>
      </div>
    </section>
  );
}



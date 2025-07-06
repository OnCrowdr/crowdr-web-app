import React from "react";
import styles from "../about-styles/Details.module.css";
import Ada from "@/public/images/team/Ada.jpg";
import Image from "next/image";

export default function Details() {
  return (
    <section className={styles.details}>
      <div className="py-16 flex flex-col items-center justify-center gap-8 md:w-5/6 mx-auto my-0">
        <p className="text-[24px] leading-[44px] text-[#101828] md:text-[36px] text-center">“We were inspired to build Crowdr after witnessing the willpower of Nigerians during the End SARS protests, despite the lack of infrastructure to support a social uprising of this scale. We wanted to build a platform that would empower Nigerians to create positive impact in their communities. The result? Crowdr: a social-good marketplace linking non-profits, volunteers and donors.”</p>
        <div className='flex flex-col items-center justify-center gap-4'>
          <Image
            src={Ada}
            alt='Adaobi Ajegbo'
            className='rounded-[50px] object-cover'
            width={50}
            height={50}
          />
          <div className='flex flex-col items-center justify-center gap-1'>
            <p className='text-[18px] font-semibold text-[#1F2227]'>
              Adaobi Ajegbo
            </p>
            <p className='text-[16px] font-normal text-[#1F2227]'>
              Founder, CEO
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

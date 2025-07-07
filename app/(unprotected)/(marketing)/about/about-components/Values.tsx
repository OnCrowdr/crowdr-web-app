import React from "react";
import styles from "../about-styles/Details.module.css";
import Ada from "@/public/images/team/Ada.jpg";
import Image from "next/image";

export default function Values() {
  return (
    <section className={styles.details}>
      <div className="py-16 flex flex-col items-center justify-center gap-3 md:w-full mx-auto my-0">
        <h4 className="text-sm leading-[44px] text-[#00B964] text-center">Our values</h4>
        <p className="text-[#101828] text-[24px] leading-[44px] md:text-[36px] text-center font-medium">How we work at Crowdr</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16'>
          {
            values.map(({title, icon}) => (
              <div key={title} className='flex flex-col items-center justify-center gap-1'>
                <Image
                  src={`/svg/${icon}.svg`}
                  alt={title}
                  width={50}
                  height={50}
                  className="rounded-[10px] border-[1px] border-[#EAECF0] p-3"
                />
                <p className='text-[17px] font-mediums text-[#1F2227] text-center'>
                  {title}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}


const values = [
    { title: "Excellence", icon: 'excellence',},
    { title: "Integrity", icon: 'integrity' },
    {title: "Continuous Learning & Innovation", icon:'continous-learning' },
    {  title: "Social Impact", icon: 'social-impact' },
]
  
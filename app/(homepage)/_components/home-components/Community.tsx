import React from 'react'
import Image from 'next/image'
import "../home-styles/community.css";
import { useRouter } from 'next/navigation'


type Props = {
  openModal?: () => void
}

export default function Community({openModal} : Props) {
  const router = useRouter()
  return (
       <section className='community'>
        <div className="flex flex-col md:flex-row justify-between w-full ">
          <div className='flex flex-col items-start gap-5 px-4'>
            <h2 className="text-[24px] md:text-[48px] font-medium text-[#EBECED] leading-none">Join our community! </h2>
            <p className="text-sm md:text-[18px] text-[#EBECED]">Get insider access to the Crowdr-verse,<br/> learn about the social-good ecosystem in Africa and more.</p>
            <button onClick={()=> window.open('https://blog.oncrowdr.com/', '_blank')} className="btn-primary !bg-[#F7CE50] !text-[#1F2227] w-full md:!w-[171px]">Sign up</button>
          </div>
          <Image src='/svg/happening-two.svg' alt='community' width={500} height={500} className="mt-8 w-full md:w-[500px]" />
        </div>
     </section>
  )
}

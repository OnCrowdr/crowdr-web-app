'use client'
import React, { useRef, useState } from 'react'
import styles from '../about-styles/Team.module.css'
import Ada from '@/public/images/team/Ada.jpg'
import Tritima from '@/public/images/team/Tritima.jpg'
import Regina from '@/public/images/team/regina.jpeg'
import Rokiat from '@/public/images/team/rokiat.png'
import Mide from '@/public/images/team/mide.png'
import Jerry from '@/public/images/team/Jerry.jpeg'
import Busola from '@/public/images/team/Busola2.jpg'
import Idris from '@/public/images/team/Idris.jpg'
import Tomiwa from '@/public/images/team/Tomiwa.jpg'
import Ade from '@/public/images/team/Ade.jpg'
import Daniel from '@/public/images/team/Daniel2.jpg'
import Image from 'next/image'
import Link from 'next/link'

const fullTeamMembers = [
  {
    name: 'Adaobi Ajegbo',
    position: 'Founder, CEO',
    photo: Ada,
    bio: 'Ex-Orca Live. Product designer with 3+ years of experience.',
    linkedIn: "https://www.linkedin.com/in/adaobiajegbo"
  },
  {
    name: 'Tritima Achigbu',
    position: 'Co-Founder, CMO',
    photo: Tritima,
    bio: 'Finance and marketing professional with 5+ years of experience.',
    linkedIn: "https://www.linkedin.com/in/tritimaachigbu"
  },
  {
    name: 'Daniel Arikawe',
    position: 'Engineering Lead',
    photo: Daniel,
    bio: 'Senior software engineer with 4+ years of experience',
    linkedIn:"https://www.linkedin.com/in/daniel-arikawe-498a1a178/"
  },
  {
    name: 'Rokiat Sulaimon',
    position: 'COO',
    photo: Rokiat,
    bio: 'Project manager with 2+ years of experience.'
  },
  // {
  //   name: 'Regina Richards',
  //   position: 'Project Manager',
  //   photo: Regina,
  //   bio: 'An experienced project manager with 3 years experience.'
  // },
  {
    name: 'Ayomide Yusuf',
    position: 'Product Designer',
    photo: Mide,
    bio: 'Product designer with 3+ years of experience.'
  },
  // {
  //   name: 'Daniel Arikawe',
  //   position: 'Frontend Developer',
  //   photo: Daniel,
  //   bio: 'Senior frontend engineer with 4+ years of experience.'
  // },
 
  {
    name: 'Idris Abdul-Lateef',
    position: 'Frontend Developer',
    photo: Idris,
    bio: 'Frontend Developer with 2+ years experience.'
  },
]

export default function Team() {
  const teamRef = useRef<HTMLDivElement | null>(null);
  const [teamMembers, setTeamMembers] = useState(fullTeamMembers.slice(0, 3))

  const showMoreTeamMembers = () => {
    if (teamMembers.length === fullTeamMembers.length) {
      teamRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
      setTeamMembers(fullTeamMembers.slice(0, 3))
      }, 1000)
    } else {
      setTeamMembers(fullTeamMembers)
    }
  }
  return (
    <section className={styles.team}>
      <h2 className='text-center text-[24px] md:text-[36px] text-[#101828] font-medium leading-[44px]'>
        Meet the Crowdr Clan
      </h2>
      <p className='text-center mx-auto text-sm md:text-[20px] text-[#475467] leading-[30px] mt-5 max-w-[550px]'>
        We’re a curious and diverse team passionate about making it easier for
        people to do good in their communities.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16' id="teamList" ref={teamRef}>
        {teamMembers.map(({ name, photo, position, bio, linkedIn }) => {
          return (
            <div
              className='h-[330px] min-w-[240px] p-6 bg-[#F9FAFB] flex flex-col items-center justify-start'
              key={name}
            >
              <Image
                className={`rounded-full w-[96px] h-[96px] object-cover mb-5`}
                src={photo}
                alt={name}
                width={96}
                height={96}
              />
              <p className='text-[18px] font-medium leading-[28px]'>{name}</p>
              <p className='text-sm font-[300] mt-2 text-center'>{position}</p>
              <p className='text-sm font-[300] mt-2 text-center'>{bio}</p>
              <div className='flex flex-row items-center justify-center gap-4 mt-4'>
                {!!linkedIn &&
                  <Link href={linkedIn}passHref={true} target='_blank'>
                    <Image
                      src='/svg/linkedin-bland.svg'
                      alt={'linkedin'}
                      width={20}
                      height={20}
                    />
                  </Link>
                }
              </div>
            </div>
          )
        })}
      </div>
      {teamMembers.length < fullTeamMembers.length ? (
        <div className='text-center mt-8'>
          <button
            className='btn-primary !rounded-none'
            onClick={showMoreTeamMembers}
          >
            See More
          </button>
        </div>
      ) : (
        <div className='text-center mt-8'>
          <button
            className='btn-primary !rounded-none'
            onClick={showMoreTeamMembers}
          >
            See Less
          </button>
        </div>
      )}
    </section>
  )
}

import React from 'react';
import Image from 'next/image';
import '../home-styles/partners.css';

const Partners = () => {
  const partnerLogos = [
    '/svg/tokan.svg',
    '/svg/foodbank.svg',
    '/svg/lisa.png',
    '/svg/orange-bath.svg',
  ];

  return (
    <section className='partners relative'>
      <h2 className='text-[24px] md:text-[42px] font-medium text-white'>
        Our Partners
      </h2>
      <div className="scroll-container mt-7">
        <div className='scroll-animation'>
          {partnerLogos.map((logo, index) => (
            <div key={index} className="logo-container h-[100px] w-[400px]">
              <Image
                src={logo}
                alt="partner-logo"
                width={300}
                height={300}
                className='h-full w-[300px] max-w-fit'
              />
            </div>
          ))}
          {partnerLogos.map((logo, index) => (
            <div key={`duplicate-${index}`} className="logo-container h-[100px] w-[400px]">
              <Image
                src={logo}
                alt="partner-logo"
                width={300}
                height={300}
                className='h-full w-[300px] max-w-fit'
              />
            </div>
          ))}
          {partnerLogos.map((logo, index) => (
            <div key={`duplicated-${index}`} className="logo-container h-[100px] w-[400px]">
              <Image
                src={logo}
                alt="partner-logo"
                width={300}
                height={300}
                className='h-full w-[300px] max-w-fit'
              />
            </div>
          ))}
        </div>
      </div>
      <Image
        src='/svg/green-leaf.svg'
        width={48}
        height={48}
        alt='decorative-leaf'
        className='absolute bottom-0 right-0'
      />
    </section>
  );
}

export default Partners;

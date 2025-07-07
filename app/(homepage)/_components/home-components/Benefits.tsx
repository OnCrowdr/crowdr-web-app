import React from 'react'
import Image from "next/image";
import "../home-styles/benefits.css";

export default function Benefits() {
  return (
       <section className="benefits">
       <div className="benefits-header">
         <p className="">OUR DIFFERENCE</p>
         <h2 className="">Why Crowdr?</h2>
       </div>

       <div className="benefits-details">
         <div className="benefits-artwork">
           <Image
             src="/svg/volunteering.svg"
             width={200}
             height={200}
             alt="volunteering"
             className=""
           />
         </div>
         <div className="benefits-content">
           <h2 className="">For Individuals</h2>
           <p className="">Fundraisers, volunteers and donors.</p>

           <div className="perks ">
             <div className="card-tile card-tile-active">
               <Image
                 src="/svg/hand-love.svg"
                 width={200}
                 height={200}
                 alt="support community"
                 className=""
               />
               <div className="">
                 <h4 className="">Raise funds</h4>
                 <p className="">
                   Get support from your community, whether for a personal, creative or social-good project.
                 </p>
               </div>
             </div>
             <div className="card-tile">
               <Image
                 src="/svg/heart-paper.svg"
                 width={200}
                 height={200}
                 alt="volunteering resume"
                 className=""
               />
               <div className="">
                 <h4 className="">Build a volunteering resume</h4>
                 <p className="">
                   Boost your résumé with volunteering experience and
                   increase your chances of career success.
                 </p>
               </div>
             </div>
             <div className="card-tile">
               <Image
                 src="/svg/people.svg"
                 width={200}
                 height={200}
                 alt="people"
                 className=""
               />
               <div className="">
                 <h4 className="">Network and make new friends</h4>
                 <p className="">
                   Expand your circle by connecting with other like-minded
                   individuals.
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>

       <div className="benefits-details">
         <div className="benefits-artwork artwork-left">
           <Image
             src="/svg/non-profits.svg"
             alt="non-profits"
             width={200}
             height={200}
             className=""
           />
         </div>
         <div className="benefits-content content-right">
           <h2 className="">For Non-profits</h2>
           <p className="">NGOs, charities and social good companies.</p>

           <div className="perks">
             <div className="card-tile">
               <Image
                 src="/svg/money.svg"
                 alt="receive donations"
                 width={200}
                 height={200}
                 className=""
               />
               <div className="">
                 <h4 className="">Receive donations</h4>
                 <p className="">
                   Use our fundraising tools to meet and exceed your
                   organization’s funding goals!
                 </p>
               </div>
             </div>
             <div className="card-tile card-tile-active">
               <Image
                 src="/svg/user-search.svg"
                 alt="search volunteers"
                 width={200}
                 height={200}
                 className=""
               />
               <div className="">
                 <h4 className="">Source volunteers</h4>
                 <p className="">
                   Find consistent and vetted volunteers to help execute your
                   outreach initiatives.
                 </p>
               </div>
             </div>
             <div className="card-tile">
               <Image
                 src="/svg/chart.svg"
                 alt="access to valuable insights"
                 width={200}
                 height={200}
                 className=""
               />
               <div className="">
                 <h4 className="">Get access to valuable insights</h4>
                 <p className="">
                   Use our CRM and analytics tools to better understand your
                   community and make more effective decisions.
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>

  )
}

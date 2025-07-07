import React from 'react'
import "../home-styles/steps.css";

type Props = {
  openModal : () => void
}

export default function Steps({ openModal} : Props) {
  return (
       <section className="slogan">
       <p className="">STARTING A CAMPAIGN</p>
       <h2 className="">It takes three simple steps...</h2>

       <div className="steps">
         <div className="step">
           <div className="step-stage">
             <div className="">
               <div className="dashed"></div>
             </div>
             <div className="">
               <h1 className="">1</h1>
             </div>
             <div className="">
               <div className="dashed"></div>
             </div>
           </div>
           <h3 className="">Sign up</h3>
           <p className="">It takes just 3 minutes.</p>
         </div>

         <div className="step">
           <div className="step-stage">
             <div className="">
               <div className="dashed"></div>
             </div>
             <div className="">
               <h1 className="">2</h1>
             </div>
             <div className="">
               <div className="dashed"></div>
             </div>
           </div>
           <h3 className="">Create a campaign</h3>
           <p className="">Tell your story.</p>
         </div>
         <div className="step">
           <div className="step-stage">
             <div className="">
               <div className="dashed"></div>
             </div>
             <div className="">
               <h1 className="">3</h1>
             </div>
             <div className="">
               <div className="dashed"></div>
             </div>
           </div>
           <h3 className="">Share your campaign</h3>
           <p className="">Get support from your community and beyond.</p>
         </div>
       </div>
       <div className="slogan-btn"><button className="btn-outline" onClick={openModal}>Join Private Beta</button></div>
     </section>
  )
}

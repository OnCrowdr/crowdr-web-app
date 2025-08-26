const CrowdrFeatures = () => {
  return (
    <section className="bg-[#DFFFE8] px-5 pt-20 pb-[118px]">
      <div className="grid gap-6 w-full max-w-[1053px] m-auto">
        <div className="grid place-items-center gap-2">
          <h3 className="font-medium text-[40px] text-[#393E46] leading-tight mx-auto">
            Features to love on Crowdr
          </h3>
          <p className="text-[#393E46]">Want to know how best Crowdr suites you?</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-2xl border border-black bg-[#C8FFD8] px-6 py-8"
            >
              <feature.icon />
              <p className="font-medium text-[32px] text-[#181A1D]">
                {feature.heading}
              </p>
              <p className="text-[#1F2227]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CrowdrFeatures

const IconUserVoice = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M20 25.3333C20 22.3878 16.4183 20 12 20C7.58172 20 4 22.3878 4 25.3333M22.4375 6.89583C22.9327 7.39108 23.3256 7.97902 23.5936 8.62609C23.8616 9.27316 23.9999 9.96711 23.9999 10.6675C23.9999 11.3679 23.8618 12.06 23.5938 12.707C23.3257 13.3541 22.9327 13.9427 22.4375 14.438M25.3333 4C26.2088 4.87548 26.9033 5.91482 27.3771 7.05869C27.8509 8.20256 28.0958 9.42836 28.0958 10.6665C28.0958 11.9046 27.8514 13.1309 27.3776 14.2747C26.9038 15.4186 26.2088 16.4581 25.3333 17.3335M12 16C9.05448 16 6.66667 13.6122 6.66667 10.6667C6.66667 7.72115 9.05448 5.33333 12 5.33333C14.9455 5.33333 17.3333 7.72115 17.3333 10.6667C17.3333 13.6122 14.9455 16 12 16Z"
        stroke="#079455"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const IconHeart = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M16 10.2584C13.3333 3.99919 4 4.66585 4 12.6659C4 20.6659 16 27.3328 16 27.3328C16 27.3328 28 20.6659 28 12.6659C28 4.66585 18.6667 3.99919 16 10.2584Z"
        stroke="#079455"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const IconTrendingUp = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M26.6672 9.33398L18.8724 17.2507C18.7324 17.3928 18.6616 17.4641 18.5989 17.5202C17.5865 18.4264 16.0554 18.4264 15.0429 17.5202C14.9803 17.4641 14.909 17.3929 14.7689 17.2506C14.6288 17.1084 14.5588 17.0372 14.4961 16.9811C13.4836 16.0749 11.9519 16.0749 10.9395 16.9811C10.8769 17.0371 10.8071 17.108 10.6677 17.2496L5.33331 22.6673M26.6672 9.33398L26.6666 17.334M26.6672 9.33398H18.6666"
        stroke="#079455"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const features = [
  {
    heading: "Reach More Donors",
    description:
      "Crowdr helps your story get seen by more people & organisations who care, so you can focus on making impact.",
    icon: IconUserVoice,
  },
  {
    heading: "Build Trust Instantly",
    description:
      "Crowdr’s verification and secure payment system make it easy for donors to give with confidence.",
    icon: IconHeart,
  },
  {
    heading: "Find & Manage Volunteers",
    description:
      "Crowdr connects you with dedicated volunteers who truly care about your cause.",
    icon: IconTrendingUp,
  },
]

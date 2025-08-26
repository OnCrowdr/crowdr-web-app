import { MdArrowOutward } from "react-icons/md"

const WhyCrowdr = () => {
  return (
    <section className="bg-[#181A1D] px-5 py-20 mb-20">
      <div className="grid gap-6 w-full max-w-[921px] m-auto">
        <div className="grid gap-2 place-items-center mx-auto">
          <h3 className="font-medium text-[40px] text-white">Use Cases</h3>
          <p className="text-white">Want to know how best Crowdr suites you?</p>
        </div>

        <div className="flex flex-col gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-[#8B8B8B] hover:border-[#D1FFEA] bg-[#484848] cursor-default transition-colors px-4 py-5"
            >
              <useCase.icon />

              <p className="text-[28px] text-[#EBECED]">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyCrowdr

const IconGlobe = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M4 16H10.6667M4 16C4 22.6274 9.37258 28 16 28M4 16C4 9.37258 9.37258 4 16 4M10.6667 16H21.3333M10.6667 16C10.6667 22.6274 13.0545 28 16 28M10.6667 16C10.6667 9.37258 13.0545 4 16 4M21.3333 16H28M21.3333 16C21.3333 9.37258 18.9455 4 16 4M21.3333 16C21.3333 22.6274 18.9455 28 16 28M28 16C28 9.37258 22.6274 4 16 4M28 16C28 22.6274 22.6274 28 16 28"
        stroke="white"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const IconShoppingBag = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M12 10.6673C12 12.8765 13.7909 14.6673 16 14.6673C18.2091 14.6673 20 12.8765 20 10.6673M4 22.4009V9.60091C4 8.10744 4 7.36014 4.29065 6.78971C4.54631 6.28795 4.95396 5.8803 5.45573 5.62463C6.02616 5.33398 6.77345 5.33398 8.26693 5.33398H23.7336C25.2271 5.33398 25.9728 5.33398 26.5432 5.62463C27.045 5.8803 27.454 6.28795 27.7096 6.78971C28 7.35959 28 8.10598 28 9.59653V22.4054C28 23.896 28 24.6413 27.7096 25.2112C27.454 25.7129 27.045 26.1213 26.5432 26.377C25.9733 26.6673 25.228 26.6673 23.7375 26.6673H8.26255C6.77199 26.6673 6.0256 26.6673 5.45573 26.377C4.95396 26.1213 4.54631 25.7129 4.29065 25.2112C4 24.6407 4 23.8944 4 22.4009Z"
        stroke="white"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const IconVolumeMax = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M25.0934 6.24805C26.4255 7.49029 27.489 8.99231 28.2183 10.6614C28.9475 12.3306 29.327 14.1314 29.3333 15.9529C29.3397 17.7743 28.9728 19.5778 28.2552 21.252C27.5377 22.9262 26.4847 24.4356 25.1612 25.6871M21.4561 10.1486C22.2554 10.8939 22.8934 11.7952 23.331 12.7966C23.7685 13.7981 23.9962 14.8786 24 15.9715C24.0038 17.0644 23.7837 18.1465 23.3532 19.151C22.9226 20.1555 22.2908 21.0611 21.4968 21.812M9.97381 20.5419L12.2075 23.3061C13.3718 24.747 13.954 25.4675 14.4641 25.5459C14.9057 25.6138 15.3519 25.456 15.6526 25.1257C16.0001 24.7441 16.0001 23.8178 16.0001 21.9652V10.0336C16.0001 8.18105 16.0001 7.25475 15.6526 6.87316C15.3519 6.54283 14.9057 6.38508 14.4641 6.45297C13.954 6.5314 13.3718 7.25186 12.2075 8.6928L9.97381 11.4569C9.73858 11.748 9.62097 11.8936 9.47544 11.9983C9.34651 12.0911 9.20204 12.1601 9.04883 12.2021C8.8759 12.2494 8.68877 12.2494 8.31452 12.2494H6.41675C5.40848 12.2494 4.90434 12.2494 4.49693 12.384C3.69516 12.6489 3.06621 13.2778 2.80134 14.0796C2.66675 14.487 2.66675 14.9912 2.66675 15.9994C2.66675 17.0077 2.66675 17.5118 2.80134 17.9192C3.06621 18.721 3.69516 19.35 4.49693 19.6148C4.90434 19.7494 5.40848 19.7494 6.41675 19.7494H8.31452C8.68877 19.7494 8.8759 19.7494 9.04883 19.7968C9.20204 19.8388 9.34651 19.9078 9.47544 20.0005C9.62097 20.1053 9.73858 20.2508 9.97381 20.5419Z"
        stroke="white"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const useCases = [
  {
    description:
      "Extensive network of vetted NGOs & Individuals for social impact.",
    icon: IconGlobe,
  },
  {
    description: "Commission-based pricing that’s tailored to your budget.",
    icon: IconShoppingBag,
  },
  {
    description: "Dedicated team with experience in impact storytelling & PR.",
    icon: IconVolumeMax,
  },
]

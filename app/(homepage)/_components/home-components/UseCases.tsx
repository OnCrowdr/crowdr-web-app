import Link from "next/link"
import { MdArrowOutward } from "react-icons/md"

const UseCases = () => {
  return (
    <section className="bg-[#181A1D] px-5 py-20 mb-20">
      <div className="grid gap-6 w-full max-w-[921px] m-auto">
        <div className="grid gap-2 place-items-center mx-auto">
          <h3 className="font-medium text-[40px] text-white">
            Use Cases
          </h3>
          <p className="text-white">Want to know how best Crowdr suites you?</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-2xl border border-[#8B8B8B] hover:border-[#D1FFEA] bg-[#484848] transition-colors px-6 pt-8 pb-[18px]"
            >
              <useCase.icon />

              <div className="grid gap-2">
                <p className="font-medium text-[32px] text-[#E6F8F0]">
                  {useCase.heading}
                </p>
                <p className="text-[#EBECED]">{useCase.description}</p>
              </div>

              <Link href={useCase.href} className="flex items-center gap-1 text-[#00B964] cursor-pointer">
                Learn More
                <MdArrowOutward fill="#00B964" className="relative top-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCases

const IconUser = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M26.6667 28C26.6667 24.3181 21.891 21.3333 16 21.3333C10.109 21.3333 5.33334 24.3181 5.33334 28M16 17.3333C12.3181 17.3333 9.33334 14.3486 9.33334 10.6667C9.33334 6.98477 12.3181 4 16 4C19.6819 4 22.6667 6.98477 22.6667 10.6667C22.6667 14.3486 19.6819 17.3333 16 17.3333Z"
        stroke="white"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

const IconUserGroup = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M22.6667 26.666C22.6667 24.4569 19.6819 22.666 16 22.666C12.3181 22.666 9.33333 24.4569 9.33333 26.666M28 22.6665C28 21.0263 26.3545 19.6166 24 18.9993M4 22.6665C4 21.0263 5.64546 19.6166 8 18.9993M24 13.6475C24.8183 12.9151 25.3333 11.8507 25.3333 10.666C25.3333 8.45688 23.5425 6.66602 21.3333 6.66602C20.3089 6.66602 19.3743 7.05115 18.6667 7.68454M8 13.6475C7.18167 12.9151 6.66667 11.8507 6.66667 10.666C6.66667 8.45688 8.45753 6.66602 10.6667 6.66602C11.6911 6.66602 12.6257 7.05115 13.3333 7.68454M16 18.666C13.7909 18.666 12 16.8752 12 14.666C12 12.4569 13.7909 10.666 16 10.666C18.2091 10.666 20 12.4569 20 14.666C20 16.8752 18.2091 18.666 16 18.666Z"
        stroke="white"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

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

const useCases = [
  {
    heading: "For Individuals",
    description:
      "Raise money online for pressing personal needs, from school fees to medical fees.",
    href: "/use-cases/individuals",
    icon: IconUser,
  },
  {
    heading: "For NGOs",
    description:
      "Raise funds for your NGO easily and find volunteers for your next campaign.",
    href: "/use-cases/ngos",
    icon: IconUserGroup,
  },
  {
    heading: "For Organisations",
    description:
      "Launch CSR projects without spending months on research & execution.",
    href: "/use-cases/organisations",
    icon: IconGlobe,
  },
]

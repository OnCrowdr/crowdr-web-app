const CrowdrStats = () => {
  const background = "url('assets/stat-card-pattern.png')"

  return (
    <div className="relative flex items-center justify-center bg-black h-[580px] sm:h-[210px]">
      <div
        style={{ background }}
        className="absolute opacity-[0.06] bg-blend-multiply inset-0"
      />

        <div className="flex flex-col sm:flex-row justify-between gap-12 flex-1 max-w-[964px] z-10 px-[30px]">
          {stats.map((stat, index) => (
            <div key={index} className="grid">
              <p className="font-medium text-[#EBECED] text-7xl">{stat.figure}</p>
              <p className="font-medium text-[#C2C3C6] text-2xl">{stat.description}</p>
            </div>
          ))}
        </div>
    </div>
  )
}

export default CrowdrStats

const stats = [
  {
    figure: "₦50M",
    description: "Raised in just over a year",
  },
  {
    figure: "350+",
    description: "Campaigns",
  },
  {
    figure: "3500+",
    description: "Donors and Campaigners",
  },
]

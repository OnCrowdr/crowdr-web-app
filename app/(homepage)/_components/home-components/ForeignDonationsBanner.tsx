const ForeignDonationsBanner = () => {
  return (
    <div className="bg-[#00CB6E69] text-xl py-4 flex flex-col md:flex-row items-center justify-center border-t border-b border-[#000000] px-3">
      <p className="text-[#000000] text-center font-bold">
        🎉 Now accepting international donations in all major currencies.{" "}
      </p>
      <div className="flex flex-row items-center justify-center">
        <span
          className="text-[#079455] text-xl font-normal italic underline cursor-pointer ml-1"
          onClick={() => {
            window.open(
              "https://blog.oncrowdr.com/how-to-raise-money-from-international-donations-for-your-fundraiser-in-nigeria/",
              "_blank"
            )
          }}
        >
          {" "}
          Powered by Apple Pay
        </span>
      </div>
    </div>
  )
}

export default ForeignDonationsBanner

"use client"

import { useState } from "react"
import { FaWhatsapp } from "react-icons/fa"

const WhatsAppWidget = () => {
  const [isHovered, setIsHovered] = useState(false)
  const phoneNumber = "2349038608688"
  const whatsappUrl = `https://wa.me/${phoneNumber}`

  const handleClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-white" size={32} />
      </button>

      {isHovered && (
        <div className="absolute bottom-16 right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppWidget
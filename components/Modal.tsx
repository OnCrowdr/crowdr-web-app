import { RFC } from "@/types"

// TODO: CHECK OUT WHY THIS ISN'T WORKING BUT SIDEBAR MODAL IS
const Modal: RFC<ModalProps> = ({ id, children, ariaLabel }) => {
  return (
    <div
      id={id}
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-hidden="true"
      className="fixed top-0 left-0 z-40 h-screen w-min overflow-y-auto transition-transform -translate-x-full bg-white"
    >
      {children}
    </div>
  )
}

export default Modal

type ModalProps = {
  id: string
  children: React.ReactNode
  ariaLabel?: string
}

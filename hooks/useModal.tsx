"use client"
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Modal } from "flowbite"

import { RFC } from "@/types"
import type { ModalOptions } from "flowbite"

const ModalContext = createContext({
  show: (modalContent: React.ReactNode) => {},
  hide: () => {},
})

const ModalProvider: RFC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode>()
  const modalOptions = useRef<ModalOptions>(undefined)
  const modal = useRef<Modal>(undefined)
  const modalRef = useRef(null)

  useEffect(() => {
    modal.current = new Modal(modalRef.current, modalOptions.current)
  }, [])

  const show = (content: React.ReactNode, options?: ModalOptions) => {
    if (options) {
      modalOptions.current = options
    }

    setModalContent(content)
    modal.current?.show()
  }

  const hide = () => {
    modal.current?.hide()
    modalOptions.current = undefined
    setModalContent(undefined)
  }

  return (
    <ModalContext.Provider value={{ show, hide }}>
      <Children>{children}</Children>
      <div
        ref={modalRef}
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        {modalContent}
      </div>
    </ModalContext.Provider>
  )
}

export default ModalProvider

type ModalProviderProps = {
  children: React.ReactNode
}

export const useModal = () => {
  const context = useContext(ModalContext)

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }

  return context
}

const Children = memo(({ children }: { children: React.ReactNode }) => (
  <>{children}</>
))

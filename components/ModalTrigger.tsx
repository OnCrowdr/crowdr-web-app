import { useEffect, useRef } from "react"
import { Modal, ModalOptions } from "flowbite"
import { atom, useAtomValue } from "jotai"

import { RFC } from "@/types"

export const modalStoreAtom = atom(new Map<string, Modal>())

const ModalTrigger: RFC<ModalTriggerProps> = ({
  id,
  type = "show",
  options = {},
  children,
  override,
}) => {
  const modalStore = useAtomValue(modalStoreAtom)
  const modal = useRef<Modal>(undefined)

  useEffect(() => {
    if (id) {
      const $modalEl = document.getElementById(id)
      const modalInStore = modalStore.get(id)

      if (modalInStore && modalInStore._targetEl === $modalEl) {
        modal.current = modalInStore
      } else {
        modal.current = modalStore.set(id, new Modal($modalEl, options)).get(id)
      }
    }
  }, [id])

  const trigger = () => {
    if (modal.current) {
      // const $backdropEl = document.querySelector("[modal-backdrop]")
      modal.current[type]()

      // if (type === "show") {
      //   $backdropEl?.classList.remove("hidden")
      //   modalEl.current?.classList.replace("hidden", "flex")
      // } else if (type === "hide") {
      //   $backdropEl?.classList.add("hidden")
      //   modalEl.current?.classList.replace("flex", "hidden")
      // } // TODO: HANDLE TOGGLE CASE
    }
  }

  const props = id ? { onClick: trigger } : {}

  return <span {...props}>{children}</span>
}

export default ModalTrigger

type ModalTriggerProps = {
  id: string
  children: React.ReactNode
  type?: "show" | "hide" | "toggle"
  options?: ModalOptions
  override?: boolean
}

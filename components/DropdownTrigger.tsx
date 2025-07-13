import { useEffect, useRef } from "react"
import { Dropdown, DropdownOptions } from "flowbite"
import { atom, useAtomValue } from "jotai"

import { RFC } from "@/types"

const dropdownStoreAtom = atom(new Map<string, Dropdown>())

const DropdownTrigger: RFC<DropdownTriggerProps> = ({
  triggerId,
  targetId,
  type = "toggle",
  options = {},
  children,
  override,
  className,
}) => {
  const dropdownStore = useAtomValue(dropdownStoreAtom)
  const dropdown = useRef<Dropdown>(undefined)

  useEffect(() => {
    if (triggerId) {
      const $triggerEl = document.getElementById(triggerId)
      const $targetEl = document.getElementById(targetId)
      const dropdownInStore = dropdownStore.get(triggerId)
      
      if (dropdownInStore && dropdownInStore._targetEl === $targetEl) {
        dropdown.current = dropdownInStore
      } else {
        dropdown.current = dropdownStore
          .set(triggerId, new Dropdown($targetEl, $triggerEl, options))
          .get(triggerId)
      }
    }
  }, [triggerId])

  const trigger = () => {
    if (dropdown.current) {
      // dropdown.current[type]()
      const isVisible = dropdown.current.isVisible()
      !isVisible ? dropdown.current.hide() : dropdown.current.show()
    }
  }

  const props = triggerId ? { onClick: trigger } : {}

  return (
    <span id={triggerId} className={className} {...props}>
      {children}
    </span>
  )
}

export default DropdownTrigger

type DropdownTriggerProps = {
  triggerId: string
  targetId: string
  children: React.ReactNode
  type?: "show" | "hide" | "toggle"
  options?: DropdownOptions
  override?: boolean
  className?: string
}

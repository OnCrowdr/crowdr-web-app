import { useEffect, useRef } from "react"
import { Drawer, DrawerOptions } from "flowbite"
import { atom, useAtomValue } from "jotai"

import { RFC } from "@/app/common/types"

const drawerStoreAtom = atom(new Map<string, Drawer>())

const DrawerTrigger: RFC<DrawerTriggerProps> = ({
  id,
  type = "show",
  options = {},
  children,
  override,
}) => {
  const drawerStore = useAtomValue(drawerStoreAtom)
  const drawer = useRef<Drawer>()

  useEffect(() => {
    if (id) {
      const $drawerEl = document.getElementById(id)
      // drawer.current = new Drawer($drawerEl, options)
      
      if (drawerStore.has(id)) {
        drawer.current = drawerStore.get(id)
      } else {
        drawer.current = drawerStore.set(id, new Drawer($drawerEl, options)).get(id)
      }
    }
  }, [id])

  const trigger = () => {
    if (drawer.current) {
      // const $backdropEl = document.querySelector("[drawer-backdrop]")
      drawer.current[type]()

      // if (type === "show") {
      //   $backdropEl?.classList.remove("hidden")
      // } else if (type === "hide") {
      //   $backdropEl?.classList.add("hidden")
      // } // TODO: HANDLE TOGGLE CASE
    }
  }

  const props = id ? { onClick: trigger } : {}

  return <span {...props}>{children}</span>
}

export default DrawerTrigger

type DrawerTriggerProps = {
  id: string
  children: React.ReactNode
  type?: "show" | "hide" | "toggle"
  options?: DrawerOptions
  override?: boolean
}

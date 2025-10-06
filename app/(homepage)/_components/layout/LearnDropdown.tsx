"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RFC } from "@/types"
import Link from "next/link"

const LearnDropdown: RFC = ({ children }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {learnItems.map((useCase, index) => {
          const isExternal = useCase.href.startsWith("http")
          const Anchor = isExternal ? "a" : Link
          const props = { ...(isExternal && { target: "_blank" }) }

          return (
            <Anchor key={index} href={useCase.href} {...props}>
              <DropdownMenuItem>{useCase.label}</DropdownMenuItem>
            </Anchor>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LearnDropdown

export const learnItems = [
  {
    label: "Blog",
    href: "https://blog.oncrowdr.com",
  },
  {
    label: "Case Studies",
    href: "#",
  },
  {
    label: "Pitch Decks",
    href: "#",
  },
  {
    label: "Guides",
    href: "#",
  },
  {
    label: "Video Tutorials",
    href: "#",
  },
]

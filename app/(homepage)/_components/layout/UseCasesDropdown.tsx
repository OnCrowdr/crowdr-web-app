"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RFC } from "@/types"
import Link from "next/link"

const UseCaseDropdown: RFC = ({ children }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {useCases.map((useCase, index) => (
          <Link key={index} href={useCase.href}>
            <DropdownMenuItem>{useCase.label}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UseCaseDropdown

export const useCases = [
  {
    label: "For Organisations (CSR)",
    href: "/use-cases/organisations",
  },
  {
    label: "For NGOs",
    href: "/use-cases/ngos",
  },
  {
    label: "For Individuals",
    href: "/use-cases/individuals",
  },
]

"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { RFC } from "@/types"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const MenuItem: RFC<Props> = ({ item, level = 0, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const router = useRouter()

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    } else {
      if (item.href) {
        item.external
          ? window.open(item.href, item.external)
          : router.push(item.href)
        onLinkClick?.()
      }
    }
  }

  return (
    <div className="w-full">
      {hasChildren ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between text-left text-base font-normal h-auto p-3",
                level > 0 && "pl-6",
                level > 1 && "pl-9",
                "hover:bg-gray-100"
              )}
              onClick={handleClick}
            >
              <div className="flex items-center gap-3">
                {/* {item.icon && <item.icon className="h-4 w-4" />} */}
                <span className="text-black">{item.label}</span>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          {item.children && (
            <CollapsibleContent className="space-y-1">
              {item.children.map((child, index) => (
                <MenuItem key={index} item={child} level={level + 1} />
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left text-base font-normal h-auto p-3",
            level > 0 && "pl-6",
            level > 1 && "pl-9",
            "hover:bg-gray-100"
          )}
          onClick={handleClick}
        >
          <div className="flex items-center gap-3">
            {/* {item.icon && <item.icon className="h-4 w-4" />} */}
            <span className="text-black">{item.label}</span>
          </div>
        </Button>
      )}
    </div>
  )
}

export default MenuItem

interface Props {
  item: Item
  level?: number
  onLinkClick?: () => void
}

interface Item {
  label: string
  href?: string
  external?: "_self" | "_blank"
  children?: Item[]
}

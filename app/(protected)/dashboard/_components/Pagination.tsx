import { useMediaQuery } from "usehooks-ts"
import { WhiteButton } from "../../../../components/Button"
import { RFC } from "@/types"

import ArrowLeftIcon from "@/public/svg/arrow-left.svg"
import ArrowRightIcon from "@/public/svg/arrow-right.svg"

const Pagination: RFC<PaginationProps> = ({
  currentPage,
  perPage: itemsPerPage,
  total: totalNoOfItems,
  onPageChange,
  className,
}) => {
  const isBigScreen = useMediaQuery("(min-width: 768px)")
  const noOfPages = Math.ceil(totalNoOfItems / itemsPerPage)
  let pages: (number | string)[] = Array.from(
    { length: noOfPages },
    (_, index) => index + 1
  )

  if (pages.length > 6) {
    if (currentPage <= 3) {
      pages.splice(3, totalNoOfItems - 6, "...", ...pages.slice(-3))
    } else {
      if (noOfPages - currentPage <= 4) {
        pages.splice(1, totalNoOfItems - 6, "...", ...pages.slice(-5))
      } else if (noOfPages - currentPage > 4) {
        pages.splice(1, totalNoOfItems - 6, ...pages.slice(currentPage - 2, currentPage), "...", ...pages.slice(-3))
      }
    }
  }

  return (
    <div className={"flex justify-between items-center " + className}>
      <WhiteButton
        text={isBigScreen ? "Previous" : ""}
        iconUrl={ArrowLeftIcon}
        outlineColor="#D0D5DD"
        className="font-medium !border !p-2 md:!px-[14px]"
        shadow
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage == 1}
      />
      <div className="hidden md:flex gap-[6px]">
        {pages.map((page) => (
          <Page
            key={page}
            page={page}
            currentPage={currentPage}
            onPageSelect={onPageChange}
          />
        ))}
      </div>
      <div className="md:hidden text-sm font-medium">
        Page {currentPage} of {noOfPages}
      </div>
      <WhiteButton
        text={isBigScreen ? "Next" : ""}
        iconUrl={ArrowRightIcon}
        outlineColor="#D0D5DD"
        iconPosition="right"
        className="font-medium !border !p-2 md:!px-[14px]"
        shadow
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage == noOfPages}
      />
    </div>
  )
}

export default Pagination

export const Page: RFC<PageProps> = ({ page, currentPage, onPageSelect }) => {
  const isPage = typeof page == "number"
  let pageClasses = "grid place-items-center text-sm font-medium rounded-lg w-10 h-10 "

  if (!isPage) {
    pageClasses += "bg-white text-[#667085] cursor-default pointer-events-none"
  } else if (page == currentPage) {
    pageClasses += "bg-primary text-white cursor-pointer"
  } else {
    pageClasses += "hover:bg-[#F8F8F8] text-[#667085] cursor-pointer"
  }

  const props: any = {
    className: pageClasses
  }
  if (isPage) props.onClick = () => onPageSelect(page)

  return <div {...props}>{page}</div>
}

type PaginationProps = {
  currentPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

type PageProps = {
  page: number | string
  currentPage: number
  onPageSelect: (page: number) => void
}

import { WhiteButton } from "../../../../components/Button"
import { RFC } from "@/types"

const Pagination: RFC<PaginationProps> = ({
  currentPage,
  perPage: itemsPerPage,
  total: totalNoOfItems,
  onPageChange,
  className,
}) => {
  const noOfPages = Math.ceil(totalNoOfItems / itemsPerPage)

  return (
    <div className={"flex justify-between items-center px-6 pt-3 pb-4 " + className}>
      <div className="flex gap-3">
        <WhiteButton
          text="Previous"
          outlineColor="#D0D5DD"
          className="text-sm font-semibold !border !h-9 !py-2 !px-3"
          shadow
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage == 1}
        />
        <WhiteButton
          text="Next"
          outlineColor="#D0D5DD"
          iconPosition="right"
          className="text-sm font-semibold !border !h-9 !py-2 !px-3"
          shadow
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage == noOfPages}
        />
      </div>
      
      <p className="text-sm font-medium">
        Page {currentPage} of {noOfPages}
      </p>
    </div>
  )
}

export default Pagination

type PaginationProps = {
  currentPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

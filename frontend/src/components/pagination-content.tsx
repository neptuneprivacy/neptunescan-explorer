import {
  Pagination,
  PaginationContent as PaginationContentWrapper,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationContent({
  total,
  currentPage,
  onchange,
}: {
  total: number;
  currentPage: number;
  onchange: (value: number) => void;
}) {
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  const message = `Showing ${limit * (currentPage - 1) + 1} – ${Math.min(
    total,
    limit * currentPage
  )} of ${total}`;

  return (
    <div className="flex justify-end items-center gap-4">
      <span className="text-sm text-muted-foreground">{message}</span>
      <Pagination className="w-auto mx-0">
        <PaginationContentWrapper>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onchange(currentPage - 1);
              }}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onchange(currentPage + 1);
              }}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContentWrapper>
      </Pagination>
    </div>
  );
}

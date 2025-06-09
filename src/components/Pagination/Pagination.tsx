import ReactPaginate from "react-paginate";
import css from './Pagination.module.css'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  search?: string;
}

export default function Pagination({ currentPage, onPageChange, search = '' }: PaginationProps) {
    const { data } = useQuery({
        queryKey: ['notes', currentPage, search],
        queryFn: () => fetchNotes(search, currentPage),
        enabled: search !== '',
        placeholderData: keepPreviousData
    });

    if (!data || data.totalPages <= 1) {
        return null;
    }

    return (
        <ReactPaginate
            className={css.pagination}
            pageClassName={css.pageItem}
            pageLinkClassName={css.pageLink}
            previousClassName={css.pageItem}
            previousLinkClassName={css.pageLink}
            nextClassName={css.pageItem}
            nextLinkClassName={css.pageLink}
            breakClassName={css.pageItem}
            breakLinkClassName={css.pageLink}
            activeClassName={css.active}
            pageCount={data ? data.totalPages : 0}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            forcePage={currentPage - 1}
            onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
        />
    );
}
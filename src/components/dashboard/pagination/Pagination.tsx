import { useState, useRef, useEffect } from 'react';
import chevronLeftIcon from '@/assets/chevron-left.svg';
import chevronRightIcon from '@/assets/chevron-right.svg';
import chevronDownIcon from '@/assets/chevron-down-line.svg';
import './Pagination.scss';

type PaginationProps = {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    displayedItems?: number;
};

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange,
    displayedItems,
}: PaginationProps) => {
    const [showItemsDropdown, setShowItemsDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const actualDisplayedItems =
        displayedItems ??
        Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowItemsDropdown(false);
            }
        };

        if (showItemsDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showItemsDropdown]);

    const handleItemsPerPageChange = (value: number) => {
        onItemsPerPageChange(value);
        setShowItemsDropdown(false);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    if (totalItems === 0) {
        return null;
    }

    return (
        <div className='pagination'>
            <div className='pagination__info'>
                <span>
                    Showing{' '}
                    <div
                        className='pagination__items-dropdown'
                        ref={dropdownRef}>
                        <button
                            type='button'
                            className='pagination__items-select'
                            onClick={() =>
                                setShowItemsDropdown(!showItemsDropdown)
                            }
                            aria-label='Select items per page'
                            aria-expanded={showItemsDropdown}>
                            <strong>{actualDisplayedItems}</strong>
                            <img src={chevronDownIcon} alt='' />
                        </button>
                        {showItemsDropdown && (
                            <div className='pagination__items-options'>
                                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        type='button'
                                        className={`pagination__items-option ${
                                            itemsPerPage === option
                                                ? 'pagination__items-option--active'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleItemsPerPageChange(option)
                                        }>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>{' '}
                    out of {totalItems}
                </span>
            </div>
            <div className='pagination__controls'>
                <button
                    type='button'
                    className='pagination__btn pagination__btn--nav'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label='Previous page'>
                    <img src={chevronLeftIcon} alt='' />
                </button>
                {getPageNumbers().map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className='pagination__ellipsis'>
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={page}
                            type='button'
                            className={`pagination__btn pagination__btn--page ${
                                currentPage === page
                                    ? 'pagination__btn--active'
                                    : ''
                            }`}
                            onClick={() => handlePageChange(page as number)}
                            aria-label={`Go to page ${page}`}
                            aria-current={
                                currentPage === page ? 'page' : undefined
                            }>
                            {page}
                        </button>
                    );
                })}
                <button
                    type='button'
                    className='pagination__btn pagination__btn--nav'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label='Next page'>
                    <img src={chevronRightIcon} alt='' />
                </button>
            </div>
        </div>
    );
};

export default Pagination;

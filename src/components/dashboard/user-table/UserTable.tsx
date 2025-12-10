import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import filterIcon from '@/assets/filter.svg';
import moreIcon from '@/assets/three-dots.svg';
import type { UserProfile } from '@/types/user.types';
import UserStatusBadge from '../user-status/UserStatusBadge';
import FilterDropdown, {
    type FilterValues,
} from '../filter-dropdown/FilterDropdown';
import ActionsDropdown from '../actions-dropdown/ActionsDropdown';
import EmptyState from '../empty-state/EmptyState';
import './UserTable.scss';

type UserTableProps = {
    users: UserProfile[];
    currentFilters?: FilterValues;
    onFilter?: (filters: FilterValues) => void;
    onResetFilter?: () => void;
};

type Column = {
    key: string;
    label: string;
    filterable?: boolean;
};

const columns: Column[] = [
    { key: 'organization', label: 'Organization', filterable: true },
    { key: 'username', label: 'Username', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'phoneNumber', label: 'Phone number', filterable: true },
    { key: 'dateJoined', label: 'Date joined', filterable: true },
    { key: 'status', label: 'Status', filterable: true },
    { key: 'actions', label: '' },
];

const UserTable = ({
    users,
    currentFilters = {},
    onFilter,
    onResetFilter,
}: UserTableProps) => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
    const [activeActions, setActiveActions] = useState<string | null>(null);
    const [actionsPosition, setActionsPosition] = useState({ top: 0, left: 0 });
    const tableRef = useRef<HTMLDivElement>(null);

    const handleFilterClick = (
        columnKey: string,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const tableRect = tableRef.current?.getBoundingClientRect();

        if (tableRect) {
            const scrollTop = tableRef.current?.scrollTop || 0;
            const scrollLeft = tableRef.current?.scrollLeft || 0;

            let top = rect.bottom - tableRect.top + scrollTop + 8;
            let left = rect.left - tableRect.left + scrollLeft;

            const dropdownWidth = 270;
            if (left + dropdownWidth > tableRect.width + scrollLeft) {
                left = tableRect.width + scrollLeft - dropdownWidth - 10;
            }

            if (left < scrollLeft) {
                left = scrollLeft + 10;
            }

            setFilterPosition({
                top,
                left,
            });
        }

        setActiveFilter(activeFilter === columnKey ? null : columnKey);
    };

    const handleFilter = (filters: FilterValues) => {
        if (onFilter) {
            onFilter(filters);
        }
    };

    const handleReset = () => {
        if (onResetFilter) {
            onResetFilter();
        }
    };

    const handleCloseFilter = () => {
        setActiveFilter(null);
    };

    const handleActionsClick = (
        userId: string,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const tableRect = tableRef.current?.getBoundingClientRect();

        if (tableRect) {
            const scrollTop = tableRef.current?.scrollTop || 0;
            const scrollLeft = tableRef.current?.scrollLeft || 0;

            let top = rect.top - tableRect.top + scrollTop;
            let left = rect.right - tableRect.left + scrollLeft - 180;

            const dropdownWidth = 180;
            if (left + dropdownWidth > tableRect.width + scrollLeft) {
                left = rect.left - tableRect.left + scrollLeft - dropdownWidth;
            }

            if (left < scrollLeft) {
                left = scrollLeft + 10;
            }

            setActionsPosition({
                top,
                left,
            });
        }

        setActiveActions(activeActions === userId ? null : userId);
        setActiveFilter(null);
    };

    const handleCloseActions = () => {
        setActiveActions(null);
    };

    const handleRowClick = (userId: string, event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
            target.closest('.user-table__more') ||
            target.closest('.actions-dropdown')
        ) {
            return;
        }
        const user = users.find((u) => u.id === userId);
        if (user) {
            sessionStorage.setItem(
                `currentUser_${userId}`,
                JSON.stringify(user)
            );
        }
        navigate(`/users/${userId}`);
    };

    return (
        <div className='user-table' ref={tableRef}>
            <div className='user-table__scroll'>
                <table>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>
                                    <div className='user-table__head-cell'>
                                        <span>{column.label}</span>
                                        {column.filterable ? (
                                            <button
                                                type='button'
                                                className={`user-table__column-filter ${
                                                    activeFilter === column.key
                                                        ? 'user-table__column-filter--active'
                                                        : ''
                                                }`}
                                                aria-label={`Filter by ${column.label}`}
                                                onClick={(e) =>
                                                    handleFilterClick(
                                                        column.key,
                                                        e
                                                    )
                                                }>
                                                <img src={filterIcon} alt='' />
                                            </button>
                                        ) : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className='user-table__empty-cell'>
                                    <EmptyState
                                        message='No users found'
                                        description='Try adjusting your filters to see more results.'
                                    />
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className='user-table__row'
                                    onClick={(e) => handleRowClick(user.id, e)}>
                                    <td>{user.organization}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.dateJoined}</td>
                                    <td>
                                        <UserStatusBadge status={user.status} />
                                    </td>
                                    <td className='user-table__actions'>
                                        <button
                                            type='button'
                                            className={`user-table__more ${
                                                activeActions === user.id
                                                    ? 'user-table__more--active'
                                                    : ''
                                            }`}
                                            aria-label='Actions'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionsClick(user.id, e);
                                            }}>
                                            <img src={moreIcon} alt='' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {activeFilter && (
                <FilterDropdown
                    position={filterPosition}
                    currentFilters={currentFilters}
                    onClose={handleCloseFilter}
                    onFilter={handleFilter}
                    onReset={handleReset}
                />
            )}
            {activeActions && (
                <ActionsDropdown
                    userId={activeActions}
                    position={actionsPosition}
                    onClose={handleCloseActions}
                />
            )}
        </div>
    );
};

export default UserTable;

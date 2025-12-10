import { useMemo, useState, useEffect } from 'react';
import SummaryCard from '@/components/dashboard/summary-card/SummaryCard';
import UserTable from '@/components/dashboard/user-table/UserTable';
import Pagination from '@/components/dashboard/pagination/Pagination';
import Spinner from '@/components/common/spinner/Spinner';
import activeUsersIcon from '@/assets/active-users.svg';
import usersWithLoansIcon from '@/assets/users-with-loans.svg';
import usersWithSavingsIcon from '@/assets/users-with-savings.svg';
import numberOfUsersIcon from '@/assets/number-of-users.svg';
import type { UserProfile } from '@/types/user.types';
import type { FilterValues } from '@/components/dashboard/filter-dropdown/FilterDropdown';
import { fetchUsers } from '@/api/users.api';
import { saveAllUsers, getAllUsers } from '@/utils/storage';
import './Dashboard.scss';

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [filters, setFilters] = useState<FilterValues>({});
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const summaryCards = useMemo(() => {
        const activeUsers = users.filter((u) => u.status === 'Active').length;
        const usersWithLoans = users.filter(
            (u) => u.educationAndEmployment.loanRepayment !== '₦0.00'
        ).length;

        return [
            {
                icon: numberOfUsersIcon,
                title: 'Users',
                value: users.length.toLocaleString(),
            },
            {
                icon: activeUsersIcon,
                title: 'Active Users',
                value: activeUsers.toLocaleString(),
            },
            {
                icon: usersWithLoansIcon,
                title: 'Users With Loans',
                value: usersWithLoans.toLocaleString(),
            },
            {
                icon: usersWithSavingsIcon,
                title: 'Users With Savings',
                value: users.length.toLocaleString(),
            },
        ];
    }, [users]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setError(null);
                
                const cachedUsers = await getAllUsers();
                if (cachedUsers.length > 0) {
                    setUsers(cachedUsers);
                    setLoading(false);
                } else {
                    setLoading(true);
                }

                try {
                    const fetchedUsers = await fetchUsers();
                    setUsers(fetchedUsers);
                    await saveAllUsers(fetchedUsers);
                } catch (apiError) {
                    if (cachedUsers.length === 0) {
                        throw apiError;
                    }
                    console.warn('Failed to fetch fresh data from API, using cached data:', apiError);
                }
            } catch (err) {
                setError('Failed to load users. Please try again later.');
                console.error('Error loading users:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        if (Object.keys(filters).length === 0) {
            return users;
        }

        return users.filter((user) => {
            if (
                filters.organization &&
                user.organization !== filters.organization
            ) {
                return false;
            }
            if (
                filters.username &&
                !user.username
                    .toLowerCase()
                    .includes(filters.username.toLowerCase())
            ) {
                return false;
            }
            if (
                filters.email &&
                !user.email.toLowerCase().includes(filters.email.toLowerCase())
            ) {
                return false;
            }
            if (
                filters.phoneNumber &&
                !user.phoneNumber.includes(filters.phoneNumber)
            ) {
                return false;
            }
            if (filters.status && user.status !== filters.status) {
                return false;
            }
            if (filters.dateJoined) {
                const filterDate = new Date(filters.dateJoined);
                const userWithISO = user as UserProfile & {
                    dateJoinedISO?: string;
                };
                const userDate = userWithISO.dateJoinedISO
                    ? new Date(userWithISO.dateJoinedISO)
                    : new Date(user.dateJoined);

                if (
                    isNaN(userDate.getTime()) ||
                    userDate.getDate() !== filterDate.getDate() ||
                    userDate.getMonth() !== filterDate.getMonth() ||
                    userDate.getFullYear() !== filterDate.getFullYear()
                ) {
                    return false;
                }
            }
            return true;
        });
    }, [users, filters]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / itemsPerPage)
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = useMemo(
        () => filteredUsers.slice(startIndex, endIndex),
        [filteredUsers, startIndex, endIndex]
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [filteredUsers.length, currentPage, totalPages, itemsPerPage]);

    const handleFilter = (newFilters: FilterValues) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilters({});
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className='dashboard'>
                <div className='dashboard__header'>
                    <h1 className='dashboard__title'>Users</h1>
                </div>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className='dashboard'>
                <div className='dashboard__header'>
                    <h1 className='dashboard__title'>Users</h1>
                </div>
                <div className='dashboard__error'>{error}</div>
            </div>
        );
    }

    return (
        <div className='dashboard'>
            <div className='dashboard__header'>
                <h1 className='dashboard__title'>Users</h1>
            </div>

            <section className='dashboard__summary'>
                {summaryCards.map((card) => (
                    <SummaryCard
                        key={card.title}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                    />
                ))}
            </section>

            <section className='dashboard__table'>
                <UserTable
                    users={paginatedUsers}
                    currentFilters={filters}
                    onFilter={handleFilter}
                    onResetFilter={handleResetFilter}
                />
            </section>

            <div className='dashboard__pagination'>
                <Pagination
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                    displayedItems={paginatedUsers.length}
                />
            </div>
        </div>
    );
};

export default Dashboard;

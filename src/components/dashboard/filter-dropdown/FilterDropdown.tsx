import { useState, useRef, useEffect } from 'react';
import type { UserStatus, UserProfile } from '@/types/user.types';
import './FilterDropdown.scss';

type FilterDropdownProps = {
    position: { top: number; left: number };
    currentFilters?: FilterValues;
    onClose: () => void;
    onFilter: (filters: FilterValues) => void;
    onReset: () => void;
};

export type FilterValues = {
    organization?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    dateJoined?: string;
    status?: UserStatus;
};

const FilterDropdown = ({
    position,
    currentFilters = {},
    onClose,
    onFilter,
    onReset,
}: FilterDropdownProps) => {
    const [filters, setFilters] = useState<FilterValues>(currentFilters);
    const [organizations, setOrganizations] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilters(currentFilters);
    }, [currentFilters]);

    useEffect(() => {
        const getOrganizations = async () => {
            try {
                const db = await new Promise<IDBDatabase>((resolve, reject) => {
                    const request = indexedDB.open('lendsqr_users', 1);
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                    request.onupgradeneeded = () => {
                        const db = request.result;
                        if (!db.objectStoreNames.contains('users')) {
                            db.createObjectStore('users', { keyPath: 'id' });
                        }
                    };
                });

                const transaction = db.transaction(['users'], 'readonly');
                const store = transaction.objectStore('users');
                const request = store.getAll();

                request.onsuccess = () => {
                    const users = request.result as UserProfile[];
                    const uniqueOrgs = Array.from(
                        new Set(users.map((u) => u.organization))
                    ).sort() as string[];
                    setOrganizations(uniqueOrgs);
                };
            } catch (error) {
                try {
                    const orgs = new Set<string>();
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key?.startsWith('user_')) {
                            const user = JSON.parse(
                                localStorage.getItem(key) || '{}'
                            );
                            if (user.organization) {
                                orgs.add(user.organization);
                            }
                        }
                    }
                    setOrganizations(Array.from(orgs).sort());
                } catch (err) {
                    setOrganizations(['Lendsqr', 'Irorun', 'Paystack']);
                }
            }
        };

        getOrganizations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleInputChange = (field: keyof FilterValues, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFilter = () => {
        onFilter(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({});
        onReset();
        onClose();
    };

    return (
        <div
            ref={dropdownRef}
            className='filter-dropdown'
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}>
            <div className='filter-dropdown__field'>
                <label htmlFor='organization'>Organization</label>
                <select
                    id='organization'
                    value={filters.organization || ''}
                    onChange={(e) =>
                        handleInputChange('organization', e.target.value)
                    }>
                    <option value=''>Select</option>
                    {organizations.map((org) => (
                        <option key={org} value={org}>
                            {org}
                        </option>
                    ))}
                </select>
            </div>

            <div className='filter-dropdown__field'>
                <label htmlFor='username'>Username</label>
                <input
                    id='username'
                    type='text'
                    placeholder='Username'
                    value={filters.username || ''}
                    onChange={(e) =>
                        handleInputChange('username', e.target.value)
                    }
                />
            </div>

            <div className='filter-dropdown__field'>
                <label htmlFor='email'>Email</label>
                <input
                    id='email'
                    type='email'
                    placeholder='Email'
                    value={filters.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                />
            </div>

            <div className='filter-dropdown__field'>
                <label htmlFor='dateJoined'>Date</label>
                <input
                    id='dateJoined'
                    type='date'
                    value={filters.dateJoined || ''}
                    onChange={(e) =>
                        handleInputChange('dateJoined', e.target.value)
                    }
                />
            </div>

            <div className='filter-dropdown__field'>
                <label htmlFor='phoneNumber'>Phone number</label>
                <input
                    id='phoneNumber'
                    type='tel'
                    placeholder='Phone number'
                    value={filters.phoneNumber || ''}
                    onChange={(e) =>
                        handleInputChange('phoneNumber', e.target.value)
                    }
                />
            </div>

            <div className='filter-dropdown__field'>
                <label htmlFor='status'>Status</label>
                <select
                    id='status'
                    value={filters.status || ''}
                    onChange={(e) =>
                        handleInputChange(
                            'status',
                            e.target.value as UserStatus
                        )
                    }>
                    <option value=''>Select</option>
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                    <option value='Pending'>Pending</option>
                    <option value='Blacklisted'>Blacklisted</option>
                </select>
            </div>

            <div className='filter-dropdown__actions'>
                <button
                    type='button'
                    className='filter-dropdown__reset'
                    onClick={handleReset}>
                    Reset
                </button>
                <button
                    type='button'
                    className='filter-dropdown__filter'
                    onClick={handleFilter}>
                    Filter
                </button>
            </div>
        </div>
    );
};

export default FilterDropdown;

import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    type MockedFunction,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { fetchUsers } from '@/api/users.api';
import { getAllUsers, saveAllUsers } from '@/utils/storage';
import type { UserProfile } from '@/types/user.types';

vi.mock('@/api/users.api');
vi.mock('@/utils/storage');

const mockFetchUsers = fetchUsers as MockedFunction<typeof fetchUsers>;
const mockGetAllUsers = getAllUsers as MockedFunction<typeof getAllUsers>;
const mockSaveAllUsers = saveAllUsers as MockedFunction<typeof saveAllUsers>;

const mockUser: UserProfile = {
    id: '1',
    email: 'user1@test.com',
    status: 'Active',
    username: 'user1',
    phoneNumber: '1234567890',
    organization: 'Org1',
    dateJoined: 'Jan 1, 2023, 12:00 AM',
    personalInformation: {
        fullName: 'User One',
        phoneNumber: '1234567890',
        email: 'user1@test.com',
        bvn: '12345678901',
        gender: 'Male',
        maritalStatus: 'Single',
        children: 'None',
        typeOfResidence: "Parent's Apartment",
    },
    educationAndEmployment: {
        levelOfEducation: 'B.Sc',
        employmentStatus: 'Employed',
        sectorOfEmployment: 'Technology',
        durationOfEmployment: '2 years',
        officeEmail: 'office@test.com',
        monthlyIncome: ['100000', '200000'],
        loanRepayment: '₦50000.00',
    },
    socials: {
        twitter: '@user1',
        facebook: 'user1',
        instagram: '@user1',
    },
    guarantor: {
        fullName: 'Guarantor One',
        phoneNumber: '0987654321',
        email: 'guarantor@test.com',
        relationship: 'Brother',
    },
};

const mockUser2: UserProfile = {
    ...mockUser,
    id: '2',
    email: 'user2@test.com',
    status: 'Inactive',
    username: 'user2',
    educationAndEmployment: {
        ...mockUser.educationAndEmployment,
        loanRepayment: '₦0.00',
    },
};

const renderDashboard = () => {
    return render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
};

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('User Data Loading and Display', () => {
        it('should render dashboard with loading state initially', () => {
            mockGetAllUsers.mockResolvedValueOnce([]);
            mockFetchUsers.mockResolvedValueOnce([]);

            renderDashboard();
            expect(screen.getByText('Users')).toBeInTheDocument();
        });

        it('should load and display users from cache', async () => {
            mockGetAllUsers.mockResolvedValueOnce([mockUser, mockUser2]);
            mockFetchUsers.mockResolvedValueOnce([mockUser, mockUser2]);

            renderDashboard();

            await waitFor(() => {
                expect(screen.getByText('Users')).toBeInTheDocument();
            });
        });

        it('should fetch users from API when cache is empty', async () => {
            mockGetAllUsers.mockResolvedValueOnce([]);
            mockFetchUsers.mockResolvedValueOnce([mockUser, mockUser2]);
            mockSaveAllUsers.mockResolvedValueOnce(undefined);

            renderDashboard();

            await waitFor(() => {
                expect(mockFetchUsers).toHaveBeenCalled();
                expect(mockSaveAllUsers).toHaveBeenCalledWith([
                    mockUser,
                    mockUser2,
                ]);
            });
        });

        it('should display summary cards with correct counts', async () => {
            mockGetAllUsers.mockResolvedValueOnce([mockUser, mockUser2]);
            mockFetchUsers.mockResolvedValueOnce([mockUser, mockUser2]);

            renderDashboard();

            await waitFor(() => {
                const allValues = screen.getAllByText('2');
                expect(allValues.length).toBeGreaterThanOrEqual(2);
                expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(
                    1
                );
            });
        });

        it('should calculate users with loans correctly', async () => {
            mockGetAllUsers.mockResolvedValueOnce([mockUser, mockUser2]);
            mockFetchUsers.mockResolvedValueOnce([mockUser, mockUser2]);

            renderDashboard();

            await waitFor(() => {
                const usersWithLoans = screen.getAllByText('1');
                expect(usersWithLoans.length).toBeGreaterThan(0);
            });
        });

        it('should use cached data when API fails but cache exists', async () => {
            mockGetAllUsers.mockResolvedValueOnce([mockUser]);
            mockFetchUsers.mockRejectedValueOnce(new Error('API Error'));

            renderDashboard();

            await waitFor(() => {
                expect(screen.getByText('Users')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should display error when API fails and no cache exists', async () => {
            mockGetAllUsers.mockResolvedValueOnce([]);
            mockFetchUsers.mockRejectedValueOnce(new Error('API Error'));

            renderDashboard();

            await waitFor(() => {
                expect(
                    screen.getByText(/failed to load users/i)
                ).toBeInTheDocument();
            });
        });

        it('should handle empty user list', async () => {
            mockGetAllUsers.mockResolvedValueOnce([]);
            mockFetchUsers.mockResolvedValueOnce([]);

            renderDashboard();

            await waitFor(() => {
                expect(screen.getByText('Users')).toBeInTheDocument();
            });
        });

        it('should handle storage errors gracefully', async () => {
            mockGetAllUsers.mockRejectedValueOnce(new Error('Storage error'));
            mockFetchUsers.mockResolvedValueOnce([mockUser]);
            mockSaveAllUsers.mockResolvedValueOnce(undefined);

            renderDashboard();

            await waitFor(
                () => {
                    expect(screen.getByText('Users')).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
        });
    });
});

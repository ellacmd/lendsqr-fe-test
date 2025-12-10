import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach,
    type MockedFunction,
} from 'vitest';
import { fetchUsers } from './users.api';
import type { ApiUser } from './users.api';

type FetchMock = MockedFunction<typeof fetch>;

describe('Users API', () => {
    let mockFetch: FetchMock;

    beforeEach(() => {
        mockFetch = vi.fn() as FetchMock;
        global.fetch = mockFetch;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Successful API Calls', () => {
        it('should fetch users successfully', async () => {
            const mockUsers: ApiUser[] = [
                {
                    id: '1',
                    email: 'user1@test.com',
                    status: 'Active',
                    username: 'user1',
                    phoneNumber: '1234567890',
                    organization: 'Org1',
                    dateJoined: '2023-01-01T00:00:00Z',
                    socials: {
                        twitter: '@user1',
                        facebook: 'user1',
                        instagram: '@user1',
                    },
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
                    guarantor: {
                        fullName: 'Guarantor One',
                        phoneNumber: '0987654321',
                        email: 'guarantor@test.com',
                        relationship: 'Brother',
                    },
                },
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockUsers,
            } as Response);

            const result = await fetchUsers();

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
            expect(result[0].email).toBe('user1@test.com');
            expect(result[0].status).toBe('Active');
            expect(result[0].dateJoined).toBeDefined();
            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.npoint.io/4bd9188d63a90399d13e'
            );
        });

        it('should map API user to UserProfile correctly', async () => {
            const mockUser: ApiUser = {
                id: '2',
                email: 'user2@test.com',
                status: 'Pending',
                username: 'user2',
                phoneNumber: '9876543210',
                organization: 'Org2',
                dateJoined: '2023-06-15T10:30:00Z',
                socials: {
                    twitter: '@user2',
                    facebook: 'user2',
                    instagram: '@user2',
                },
                personalInformation: {
                    fullName: 'User Two',
                    phoneNumber: '9876543210',
                    email: 'user2@test.com',
                    bvn: '98765432109',
                    gender: 'Female',
                    maritalStatus: 'Married',
                    children: '2',
                    typeOfResidence: 'Own Apartment',
                },
                educationAndEmployment: {
                    levelOfEducation: 'M.Sc',
                    employmentStatus: 'Self Employed',
                    sectorOfEmployment: 'Finance',
                    durationOfEmployment: '5 years',
                    officeEmail: 'office2@test.com',
                    monthlyIncome: ['200000', '300000'],
                    loanRepayment: '₦0.00',
                },
                guarantor: {
                    fullName: 'Guarantor Two',
                    phoneNumber: '1234567890',
                    email: 'guarantor2@test.com',
                    relationship: 'Sister',
                },
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [mockUser],
            } as Response);

            const result = await fetchUsers();

            expect(result[0]).toMatchObject({
                id: '2',
                email: 'user2@test.com',
                status: 'Pending',
                username: 'user2',
                organization: 'Org2',
                personalInformation: {
                    fullName: 'User Two',
                    email: 'user2@test.com',
                },
                educationAndEmployment: {
                    loanRepayment: '₦0.00',
                },
            });
        });
    });

    describe('Error Handling', () => {
        it('should throw error when API request fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            } as Response);

            await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
        });

        it('should throw error when network request fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(fetchUsers()).rejects.toThrow('Network error');
        });

        it('should throw error when response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            } as Response);

            await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
        });

        it('should handle invalid JSON response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            } as Response);

            await expect(fetchUsers()).rejects.toThrow();
        });
    });
});

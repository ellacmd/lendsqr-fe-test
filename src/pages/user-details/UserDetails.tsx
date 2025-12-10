import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import backIcon from '@/assets/back.svg';
import avatarIcon from '@/assets/info-avatar.svg';
import starFilledIcon from '@/assets/star-filled.svg';
import starEmptyIcon from '@/assets/star-empty.svg';
import type { UserProfile } from '@/types/user.types';
import { getUser } from '@/utils/storage';
import './UserDetails.scss';
import Spinner from '@/components/common/spinner/Spinner';

const UserDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!id) {
                setError('User ID not provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const sessionUser = sessionStorage.getItem(`currentUser_${id}`);
                if (sessionUser) {
                    setUser(JSON.parse(sessionUser));
                    setLoading(false);
                    return;
                }

                const storedUser = await getUser(id);
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    setError('User not found');
                }
            } catch (err) {
                setError('Failed to load user details');
                console.error('Error loading user:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    if (loading) {
        return (
            <div className='user-details'>
                <Spinner />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className='user-details'>
                <button
                    type='button'
                    className='user-details__back'
                    onClick={() => navigate('/dashboard')}>
                    <img src={backIcon} alt='' />
                    <span>Back to Users</span>
                </button>
                <div className='user-details__error'>
                    {error || 'User not found'}
                </div>
            </div>
        );
    }

    return (
        <div className='user-details'>
            <button
                type='button'
                className='user-details__back'
                onClick={() => navigate('/dashboard')}>
                <img src={backIcon} alt='' />
                <span>Back to Users</span>
            </button>

            <div className='user-details__header'>
                <div className='user-details__header-content'>
                    <h1 className='user-details__title'>User Details</h1>
                    <div className='user-details__actions'>
                        <button
                            type='button'
                            className='user-details__btn user-details__btn--blacklist'>
                            Blacklist User
                        </button>
                        <button
                            type='button'
                            className='user-details__btn user-details__btn--activate'>
                            Activate User
                        </button>
                    </div>
                </div>
            </div>

            <div className='user-details__user-card'>
                <div className='user-details__user-info'>
                    <div className='user-details__avatar'>
                        <img src={avatarIcon} alt='' />
                    </div>
                    <div className='user-details__user-details'>
                        <h2 className='user-details__user-name'>
                            {user.personalInformation.fullName}
                        </h2>
                        <p className='user-details__user-id'>{user.id}</p>
                    </div>
                    <div className='user-details__user-tier'>
                        <div className='user-details__tier-divider'></div>
                        <div className='user-details__tier-info'>
                            <p className='user-details__tier-label'>
                                User's Tier
                            </p>
                            <div className='user-details__tier-stars'>
                                <img src={starFilledIcon} alt='Filled star' />
                                <img src={starEmptyIcon} alt='Empty star' />
                                <img src={starEmptyIcon} alt='Empty star' />
                            </div>
                        </div>
                    </div>
                    <div className='user-details__user-balance'>
                        <div className='user-details__tier-divider'></div>
                        <div className='user-details__balance-info'>
                            <p className='user-details__balance-label'>
                                ₦200,000.00
                            </p>
                            <p className='user-details__balance-value'>
                                9912345678/Providus Bank
                            </p>
                        </div>
                    </div>
                </div>
                <div className='user-details__tabs'>
                    <button
                        type='button'
                        className='user-details__tab user-details__tab--active'>
                        General Details
                    </button>
                    <button type='button' className='user-details__tab'>
                        Documents
                    </button>
                    <button type='button' className='user-details__tab'>
                        Bank Details
                    </button>
                    <button type='button' className='user-details__tab'>
                        Loans
                    </button>
                    <button type='button' className='user-details__tab'>
                        Savings
                    </button>
                    <button type='button' className='user-details__tab'>
                        App and System
                    </button>
                </div>
            </div>

            <div className='user-details__content-card'>
                <div className='user-details__section'>
                    <h3 className='user-details__section-title'>
                        Personal Information
                    </h3>
                    <div className='user-details__section-grid'>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Full Name
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.fullName}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Phone Number
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.phoneNumber}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Email Address
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.email}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                BVN
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.bvn}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Gender
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.gender}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Marital Status
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.maritalStatus}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Children
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.children}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Type of Residence
                            </label>
                            <p className='user-details__field-value'>
                                {user.personalInformation.typeOfResidence}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='user-details__section'>
                    <h3 className='user-details__section-title'>
                        Education and Employment
                    </h3>
                    <div className='user-details__section-grid'>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Level of Education
                            </label>
                            <p className='user-details__field-value'>
                                {user.educationAndEmployment.levelOfEducation}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Employment Status
                            </label>
                            <p className='user-details__field-value'>
                                {user.educationAndEmployment.employmentStatus}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Sector of Employment
                            </label>
                            <p className='user-details__field-value'>
                                {user.educationAndEmployment.sectorOfEmployment}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Duration of Employment
                            </label>
                            <p className='user-details__field-value'>
                                {
                                    user.educationAndEmployment
                                        .durationOfEmployment
                                }
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Office Email
                            </label>
                            <p className='user-details__field-value'>
                                {user.educationAndEmployment.officeEmail ||
                                    'N/A'}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Monthly Income
                            </label>
                            <p className='user-details__field-value'>
                                {user.educationAndEmployment.monthlyIncome.join(
                                    ' - '
                                )}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Loan Repayment
                            </label>
                            <p className='user-details__field-value'>
                                {user.educationAndEmployment.loanRepayment}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='user-details__section'>
                    <h3 className='user-details__section-title'>Socials</h3>
                    <div className='user-details__section-grid'>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Twitter
                            </label>
                            <p className='user-details__field-value'>
                                {user.socials.twitter}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Facebook
                            </label>
                            <p className='user-details__field-value'>
                                {user.socials.facebook}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Instagram
                            </label>
                            <p className='user-details__field-value'>
                                {user.socials.instagram}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='user-details__section'>
                    <h3 className='user-details__section-title'>Guarantor</h3>
                    <div className='user-details__section-grid'>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Full Name
                            </label>
                            <p className='user-details__field-value'>
                                {user.guarantor.fullName}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Phone Number
                            </label>
                            <p className='user-details__field-value'>
                                {user.guarantor.phoneNumber}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Email Address
                            </label>
                            <p className='user-details__field-value'>
                                {user.guarantor.email}
                            </p>
                        </div>
                        <div className='user-details__field'>
                            <label className='user-details__field-label'>
                                Relationship
                            </label>
                            <p className='user-details__field-value'>
                                {user.guarantor.relationship}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;

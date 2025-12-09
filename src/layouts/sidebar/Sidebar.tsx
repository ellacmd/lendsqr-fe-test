import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import briefcaseIcon from '@/assets/briefcase.svg';
import chevronDownIcon from '@/assets/chevron-down-line.svg';
import dashboardIcon from '@/assets/dashboard.svg';
import usersIcon from '@/assets/users.svg';
import guarantorsIcon from '@/assets/guarantors.svg';
import loansIcon from '@/assets/loans.svg';
import decisionModelIcon from '@/assets/decision-model.svg';
import savingsIcon from '@/assets/savings.svg';
import loanRequestIcon from '@/assets/loan-products.svg';
import whitelistIcon from '@/assets/whitelist.svg';
import karmaIcon from '@/assets/karma.svg';
import organizationIcon from '@/assets/organization.svg';
import loanProductsIcon from '@/assets/loan-products.svg';
import savingsProductsIcon from '@/assets/savings-products.svg';
import feesChargesIcon from '@/assets/fees-and-charges.svg';
import feesPricingIcon from '@/assets/fees-and-pricing.svg';
import transactionsIcon from '@/assets/transactions.svg';
import servicesIcon from '@/assets/services.svg';
import serviceAccountIcon from '@/assets/service-account.svg';
import settlementsIcon from '@/assets/settlements.svg';
import reportsIcon from '@/assets/reports.svg';
import preferencesIcon from '@/assets/preferences.svg';
import auditLogsIcon from '@/assets/audit-logs.svg';
import systemsMessagesIcon from '@/assets/systems-messages.svg';
import logOutIcon from '@/assets/log-out.svg';
import logoSrc from '@/assets/lendsqr-logo.svg';
import './Sidebar.scss';

type NavItem = {
    label: string;
    icon: string;
    to?: string;
};

type NavSection = {
    title?: string;
    items: NavItem[];
};

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const navSections: NavSection[] = [
    {
        title: 'CUSTOMERS',
        items: [
            { label: 'Users', icon: usersIcon, to: '/dashboard' },
            { label: 'Guarantors', icon: guarantorsIcon },
            { label: 'Loans', icon: loansIcon },
            { label: 'Decision Models', icon: decisionModelIcon },
            { label: 'Savings', icon: savingsIcon },
            { label: 'Loan Requests', icon: loanRequestIcon },
            { label: 'Whitelist', icon: whitelistIcon },
            { label: 'Karma', icon: karmaIcon },
        ],
    },
    {
        title: 'BUSINESSES',
        items: [
            { label: 'Organization', icon: briefcaseIcon },
            { label: 'Loan Products', icon: loanProductsIcon },
            { label: 'Savings Products', icon: savingsProductsIcon },
            { label: 'Fees and Charges', icon: feesChargesIcon },
            { label: 'Transactions', icon: transactionsIcon },
            { label: 'Services', icon: servicesIcon },
            { label: 'Service Account', icon: serviceAccountIcon },
            { label: 'Settlements', icon: settlementsIcon },
            { label: 'Reports', icon: reportsIcon },
        ],
    },
    {
        title: 'SETTINGS',
        items: [
            { label: 'Preferences', icon: preferencesIcon },
            { label: 'Fees and Pricing', icon: feesPricingIcon },
            { label: 'Audit Logs', icon: auditLogsIcon },
            { label: 'Systems Messages', icon: systemsMessagesIcon },
        ],
    },
];

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLogout = () => {
        navigate('/');
        if (onClose) {
            onClose();
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            <div className='sidebar__header-mobile'>
                <Link
                    to='/dashboard'
                    className='sidebar__logo-mobile'
                    onClick={onClose}>
                    <img src={logoSrc} alt='Lendsqr' />
                </Link>
            </div>
            <nav className='sidebar__nav'>
                <div className='sidebar__primary'>
                    <button type='button' className='sidebar__switch'>
                        <span className='sidebar__switch-icon'>
                            <img src={organizationIcon} alt='' />
                        </span>
                        Switch Organization
                        <img
                            src={chevronDownIcon}
                            alt=''
                            className='sidebar__switch-caret'
                        />
                    </button>
                    <NavLink end to='/dashboard' className='sidebar__link'>
                        <span className='sidebar__link-icon'>
                            <img src={dashboardIcon} alt='' />
                        </span>
                        Dashboard
                    </NavLink>
                </div>

                {navSections.map((section) => (
                    <div className='sidebar__section' key={section.title}>
                        {section.title ? (
                            <p className='sidebar__section-title'>
                                {section.title}
                            </p>
                        ) : null}

                        {section.items.map((item) =>
                            item.to ? (
                                <NavLink
                                    key={item.label}
                                    to={item.to}
                                    onClick={onClose}
                                    className={({ isActive }) => {
                                        const shouldBeActive =
                                            item.label === 'Users' || isActive;
                                        return `sidebar__link ${
                                            shouldBeActive
                                                ? 'sidebar__link--active'
                                                : ''
                                        }`;
                                    }}>
                                    <span className='sidebar__link-icon'>
                                        <img src={item.icon} alt='' />
                                    </span>
                                    {item.label}
                                </NavLink>
                            ) : (
                                <button
                                    key={item.label}
                                    type='button'
                                    className='sidebar__link sidebar__link--placeholder'
                                    onClick={onClose}>
                                    <span className='sidebar__link-icon'>
                                        <img src={item.icon} alt='' />
                                    </span>
                                    {item.label}
                                </button>
                            )
                        )}
                    </div>
                ))}
            </nav>

            <hr className='sidebar__divider' />

            <button
                type='button'
                className='sidebar__logout'
                onClick={handleLogout}>
                <span className='sidebar__link-icon'>
                    <img src={logOutIcon} alt='' />
                </span>
                Logout
            </button>

            <span className='sidebar__version'>v1.2.0</span>
        </aside>
    );
};

export default Sidebar;

import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eyeIcon from '@/assets/eye-icon.svg';
import blacklistIcon from '@/assets/blacklist.svg';
import activateUserIcon from '@/assets/activate-user.svg';
import './ActionsDropdown.scss';

type ActionsDropdownProps = {
    userId: string;
    position: { top: number; left: number };
    onClose: () => void;
    onViewDetails?: (userId: string) => void;
    onBlacklist?: (userId: string) => void;
    onActivate?: (userId: string) => void;
};

const ActionsDropdown = ({
    userId,
    position,
    onClose,
    onViewDetails,
    onBlacklist,
    onActivate,
}: ActionsDropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(userId);
        } else {
            navigate(`/users/${userId}`);
        }
        onClose();
    };

    const handleBlacklist = () => {
        if (onBlacklist) {
            onBlacklist(userId);
        }
        onClose();
    };

    const handleActivate = () => {
        if (onActivate) {
            onActivate(userId);
        }
        onClose();
    };

    return (
        <div
            ref={dropdownRef}
            className='actions-dropdown'
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}>
            <button
                type='button'
                className='actions-dropdown__item'
                onClick={handleViewDetails}>
                <img src={eyeIcon} alt='' />
                <span>View Details</span>
            </button>
            <button
                type='button'
                className='actions-dropdown__item'
                onClick={handleBlacklist}>
                <img src={blacklistIcon} alt='' />
                <span>Blacklist User</span>
            </button>
            <button
                type='button'
                className='actions-dropdown__item'
                onClick={handleActivate}>
                <img src={activateUserIcon} alt='' />
                <span>Activate User</span>
            </button>
        </div>
    );
};

export default ActionsDropdown;


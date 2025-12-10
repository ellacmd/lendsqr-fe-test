import type { UserStatus } from '@/types/user.types';
import './UserStatusBadge.scss';

type UserStatusBadgeProps = {
    status: UserStatus;
};

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
    return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</span>;
};

export default UserStatusBadge;


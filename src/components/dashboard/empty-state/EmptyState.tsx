import noUsersIcon from '@/assets/no-users.svg';
import './EmptyState.scss';

type EmptyStateProps = {
    message?: string;
    description?: string;
};

const EmptyState = ({
    message = 'No users found',
    description = 'Try adjusting your filters to see more results.',
}: EmptyStateProps) => {
    return (
        <div className='empty-state'>
            <div className='empty-state__icon'>
                <img src={noUsersIcon} alt='' />
            </div>
            <h3 className='empty-state__title'>{message}</h3>
            <p className='empty-state__description'>{description}</p>
        </div>
    );
};

export default EmptyState;


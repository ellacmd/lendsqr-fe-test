import './SummaryCard.scss';

type SummaryCardProps = {
    icon: string;
    title: string;
    value: string;
};

const SummaryCard = ({ icon, title, value }: SummaryCardProps) => {
    return (
        <article className='summary-card'>
            <img src={icon} alt='' className='summary-card__icon' />
            <p className='summary-card__title'>{title}</p>
            <p className='summary-card__value'>{value}</p>
        </article>
    );
};

export default SummaryCard;


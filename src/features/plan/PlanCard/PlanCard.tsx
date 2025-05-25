import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { GoIcon } from '@/icons/icons';
import { cardStyles } from '@/styles';
import { formatFuzzyDuration } from '@/utils';
import styles from './PlanCard.module.css';

interface PlanCardProps {
  className?: string;
  estimatedSeconds: number;
  name: string;
  to: string;
}

export function PlanCard({
  className,
  estimatedSeconds,
  name,
  to,
}: PlanCardProps) {
  return (
    <div className={classNames(styles.planCard, className)}>
      <div className={classNames(styles.title, cardStyles.smallCard)}>
        <Link className={styles.hot} to={to}>
          {name}
          <GoIcon className={styles.goIcon} />
        </Link>
      </div>

      <div className={classNames(styles.time, cardStyles.smallCard)}>
        {formatFuzzyDuration(estimatedSeconds, true)}
      </div>
    </div>
  );
}

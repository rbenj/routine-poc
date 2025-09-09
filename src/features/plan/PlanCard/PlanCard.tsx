import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { GoIcon } from '@/icons/icons';
import { cardStyles } from '@/styles';
import { formatDate, formatFuzzyDuration } from '@/utils';
import styles from './PlanCard.module.css';

interface PlanCardProps {
  className?: string;
  estimatedSeconds: number;
  lastCompletedDate?: Date | null;
  name: string;
  to: string;
}

export function PlanCard({
  className,
  estimatedSeconds,
  lastCompletedDate,
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

      <div className={classNames(styles.meta, cardStyles.smallCard)}>
        <span>
          {formatFuzzyDuration(estimatedSeconds, true)}
        </span>

        {lastCompletedDate && (
          <span>
            ✓
            {formatDate(lastCompletedDate)}
          </span>
        )}
      </div>
    </div>
  );
}

import classNames from 'classnames';
import { formatFuzzyDuration } from '@/utils';
import styles from './PlanCard.module.css';

interface PlanCardProps {
  className?: string;
  estimatedSeconds: number;
  name: string;
}

export function PlanCard({
  className,
  estimatedSeconds,
  name,
}: PlanCardProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.title}>
        {name}
      </div>

      <div className={styles.time}>
        {formatFuzzyDuration(estimatedSeconds)}
      </div>
    </div>
  );
}

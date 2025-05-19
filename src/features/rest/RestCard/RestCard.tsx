import classNames from 'classnames';
import { formatFuzzyDuration } from '@/utils';
import styles from './RestCard.module.css';

interface RestCardProps {
  className?: string;
  durationSeconds: number;
}

export function RestCard({
  className,
  durationSeconds,
}: RestCardProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.title}>
        Rest
      </div>

      <div className={styles.time}>
        {formatFuzzyDuration(durationSeconds)}
      </div>
    </div>
  );
}

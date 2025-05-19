import classNames from 'classnames';
import { formatFuzzyDuration } from '@/utils';
import styles from './RestQueue.module.css';

interface RestQueueProps {
  className?: string;
  durationSeconds: number;
}

export function RestQueue({
  className,
  durationSeconds,
}: RestQueueProps) {
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

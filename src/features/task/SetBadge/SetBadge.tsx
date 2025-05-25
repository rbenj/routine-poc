import classNames from 'classnames';
import styles from './SetBadge.module.css';

interface SetBadgeProps {
  className?: string;
  number: number;
}

export function SetBadge({
  className,
  number,
}: SetBadgeProps) {
  if (number <= 0) {
    return null;
  }

  return (
    <div className={classNames(styles.setBadge, className)}>
      <div className={styles.label}>
        Set
      </div>

      <div className={styles.value}>
        {number}
      </div>
    </div>
  );
}

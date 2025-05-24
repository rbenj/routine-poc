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
    <div className={classNames(styles.restCard, className)}>
      {`Rest for ${formatFuzzyDuration(durationSeconds)}`}
    </div>
  );
}

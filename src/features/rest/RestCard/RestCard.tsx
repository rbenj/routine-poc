import classNames from 'classnames';
import { cardStyles } from '@/styles';
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
    <div className={classNames(styles.restCard, cardStyles.smallCard, className)}>
      {`Rest for ${formatFuzzyDuration(durationSeconds)}`}
    </div>
  );
}

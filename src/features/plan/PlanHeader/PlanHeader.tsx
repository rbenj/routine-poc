import classNames from 'classnames';
import { Button, IconButton } from '@/components';
import { BackIcon } from '@/icons';
import styles from './PlanHeader.module.css';

interface PlanHeaderProps {
  backTo: string;
  className?: string;
  name: string;
  startTo?: string;
  timeText: string;
}

export function PlanHeader({
  backTo,
  className,
  name,
  startTo,
  timeText,
}: PlanHeaderProps) {
  return (
    <div className={classNames(styles.planHeader, className)}>
      <IconButton
        icon={<BackIcon />}
        to={backTo}
      />

      <div className={styles.meta}>
        <h2 className={styles.title}>
          {name}
        </h2>

        <div className={styles.time}>
          {timeText}
        </div>
      </div>

      {startTo && (
        <Button
          className={styles.startButton}
          text="Start"
          to={startTo}
        />
      )}
    </div>
  );
}

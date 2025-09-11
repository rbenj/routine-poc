import classNames from 'classnames';
import { Timer } from '@/components';
import styles from './RestExecute.module.css';

interface RestExecuteProps {
  className?: string;
  durationSeconds: number;
  onClickContinue: () => void;
}

export function RestExecute({
  className,
  durationSeconds,
  onClickContinue,
}: RestExecuteProps) {
  const randomMessage = (): string => {
    const messages = [
      'Stop doing stuff for a spell',
      'Chill out for a bit',
      'Relax, you\'ve earned a break',
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleTimerComplete = () => {
    onClickContinue();
  };

  return (
    <div className={classNames(styles.restExecute, className)}>
      <h2 className={styles.title}>
        Rest
      </h2>

      <div className={styles.description}>
        {randomMessage()}
      </div>

      <Timer
        autoStart
        className={styles.timer}
        durationSeconds={durationSeconds}
        onComplete={handleTimerComplete}
      />
    </div>
  );
}

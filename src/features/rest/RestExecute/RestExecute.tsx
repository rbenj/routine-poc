import classNames from 'classnames';
import { useState } from 'react';
import { Button, Timer } from '@/components';
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
  const [isTimerDone, setIsTimerDone] = useState(false);

  const randomMessage = (): string => {
    const messages = [
      'Stop doing stuff for a spell',
      'Chill out for a bit',
      'Relax, you\'ve earned a break',
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleTimerComplete = () => {
    setIsTimerDone(true);
  };

  const handleContinue = () => {
    onClickContinue();
  };

  return (
    <div className={classNames(styles.restExecute, className)}>
      <div className={styles.title}>
        Rest
      </div>

      <div className={styles.description}>
        {randomMessage()}
      </div>

      <div className={styles.timerOuter}>
        {!isTimerDone && (
          <Timer
            autoStart
            durationSeconds={durationSeconds}
            onComplete={handleTimerComplete}
            stopText="Skip"
          />
        )}

        {isTimerDone && (
          <Button
            className={styles.continueButton}
            onClick={handleContinue}
            text="Continue"
          />
        )}
      </div>
    </div>
  );
}

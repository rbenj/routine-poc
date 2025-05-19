import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTimer } from '@/hooks';
import { formatTimer } from '@/utils';
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
  const [isTimerDone, SetIsTimerDone] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const {
    timerRemainingSeconds,
    timerIsExhausted,
    startTimer,
    pauseTimer,
    stopTimer,
  } = useTimer({ totalSeconds: durationSeconds });

  const handlePause = () => {
    pauseTimer(!isTimerPaused);
    setIsTimerPaused(!isTimerPaused);
  };

  const handleSkip = () => {
    stopTimer();
    SetIsTimerDone(true);
  };

  const handleContinue = () => {
    onClickContinue();
  };

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (timerIsExhausted) {
      SetIsTimerDone(true);
    }
  }, [timerIsExhausted]);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.title}>
        Rest
      </div>

      {!isTimerDone && (
        <div className={styles.timer}>
          <div className={styles.timerValue}>
            {formatTimer(timerRemainingSeconds)}
          </div>

          <button className={styles.pauseButton} onClick={handlePause}>
            {isTimerPaused ? 'Resume' : 'Pause'}
          </button>

          <button className={styles.skipButton} onClick={handleSkip}>
            Skip
          </button>
        </div>
      )}

      {isTimerDone && (
        <button className={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      )}
    </div>
  );
}

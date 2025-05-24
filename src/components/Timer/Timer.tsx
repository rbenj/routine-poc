import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Button } from '@/components';
import { useTimer } from '@/hooks';
import { formatTimer } from '@/utils';
import styles from './Timer.module.css';

interface TimerProps {
  autoStart?: boolean;
  className?: string;
  durationSeconds: number;
  onComplete: () => void;
  stopText?: string;
}

export function Timer({
  autoStart = false,
  className,
  durationSeconds,
  onComplete,
  stopText = 'Stop',
}: TimerProps) {
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const {
    timerRemainingSeconds,
    timerIsExhausted,
    timerIsStarted,
    startTimer,
    pauseTimer,
    stopTimer,
  } = useTimer({ totalSeconds: durationSeconds });

  const handlePause = () => {
    pauseTimer(!isTimerPaused);
    setIsTimerPaused(!isTimerPaused);
  };

  const handleStop = () => {
    stopTimer();
    setIsTimerDone(true);
    onComplete();
  };

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
  }, [autoStart, startTimer]);

  useEffect(() => {
    if (timerIsExhausted) {
      setIsTimerDone(true);
      onComplete();
    }
  }, [timerIsExhausted, onComplete]);

  if (!timerIsStarted && !autoStart) {
    return (
      <Button
        className={styles.startButton}
        onClick={startTimer}
        text="Start"
      />
    );
  }

  if (isTimerDone) {
    return null;
  }

  return (
    <div className={classNames(styles.timer, className)}>
      <div className={styles.timerValue}>
        {formatTimer(timerRemainingSeconds)}
      </div>

      <div className={styles.timerButtons}>
        <Button
          className={styles.pauseButton}
          onClick={handlePause}
          text={isTimerPaused ? 'Resume' : 'Pause'}
        />

        <Button
          className={styles.stopButton}
          onClick={handleStop}
          text={stopText}
        />
      </div>
    </div>
  );
}

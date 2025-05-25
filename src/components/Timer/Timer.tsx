import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Button, IconButton } from '@/components';
import { CloseIcon, PauseIcon, PlayIcon } from '@/icons';
import { useTimer } from '@/hooks';
import { formatTimer } from '@/utils';
import styles from './Timer.module.css';

interface TimerProps {
  autoStart?: boolean;
  className?: string;
  durationSeconds: number;
  onComplete: () => void;
}

export function Timer({
  autoStart = false,
  className,
  durationSeconds,
  onComplete,
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
      <div className={classNames(styles.timer, className)}>
        <Button
          className={styles.startButton}
          onClick={startTimer}
          text="Start"
        />
      </div>
    );
  }

  if (isTimerDone) {
    return null;
  }

  return (
    <div className={classNames(styles.timer, className)}>
      <div className={styles.value}>
        {formatTimer(timerRemainingSeconds)}
      </div>

      <div className={styles.buttons}>
        <IconButton
          className={styles.pauseButton}
          icon={isTimerPaused ? <PlayIcon /> : <PauseIcon />}
          onClick={handlePause}
        />

        <IconButton
          className={styles.stopButton}
          icon={<CloseIcon />}
          onClick={handleStop}
        />
      </div>
    </div>
  );
}

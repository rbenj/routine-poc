import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTimer } from '@/hooks';
import { Field } from '@/models';
import { formatField } from '@/services';
import { formatFuzzyDuration, formatTimer } from '@/utils';
import styles from './TaskExecute.module.css';

interface TaskExecuteProps {
  className?: string;
  estimatedSeconds: number;
  fields: Field[];
  name: string;
  onChangeFieldValue: (field: Field, value: number) => void;
  onClickContinue: () => void;
  setNumber: number;
  timerDurationSeconds: number;
}

export function TaskExecute({
  className,
  estimatedSeconds,
  fields,
  name,
  onChangeFieldValue,
  onClickContinue,
  setNumber,
  timerDurationSeconds,
}: TaskExecuteProps) {
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const {
    timerRemainingSeconds,
    timerIsExhausted,
    timerIsStarted,
    startTimer,
    pauseTimer,
    stopTimer,
  } = useTimer({ totalSeconds: timerDurationSeconds });

  const handleFieldChange = (field: Field, value: string) => {
    onChangeFieldValue(field, parseFloat(value) || 0);
  };

  const handleStartTimer = () => {
    startTimer();
  };

  const handlePauseTimer = () => {
    pauseTimer(!isTimerPaused);
    setIsTimerPaused(!isTimerPaused);
  };

  const handleStopTimer = () => {
    stopTimer();
    setIsTimerDone(true);
  };

  const handleContinue = () => {
    onClickContinue();
  };

  useEffect(() => {
    if (timerIsExhausted) {
      setIsTimerDone(true);
    }
  }, [timerIsExhausted]);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.title}>
        {name}
      </div>

      {setNumber > 0 && (
        <div>
          {`Set: ${setNumber}`}
        </div>
      )}

      {estimatedSeconds > 0 && (
        <div>
          {`About ${formatFuzzyDuration(estimatedSeconds)}`}
        </div>
      )}

      <div className={styles.fields}>
        {fields?.map((field, index) => (
          <div key={index} className={styles.field}>
            <div className={styles.fieldKey}>
              {field.name}
            </div>

            <div className={styles.fieldValue}>
              {field.initialValueSource === 'memory' ? (
                <input
                  className={styles.fieldInput}
                  max={field.maxValue}
                  min={field.minValue}
                  onChange={(event) => {
                    handleFieldChange(field, event.target.value);
                  }}
                  type="number"
                  value={field.value}
                />
              ) : (
                <div className={styles.fieldNumber}>
                  {formatField(field.type, field.value)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {timerDurationSeconds > 0 && !timerIsStarted && (
        <button className={styles.timerStartButton} onClick={handleStartTimer}>
          Start
        </button>
      )}

      {timerDurationSeconds > 0 && timerIsStarted && !isTimerDone && (
        <div className={styles.timer}>
          <div className={styles.timerValue}>
            {formatTimer(timerRemainingSeconds)}
          </div>

          <button className={styles.timerPauseButton} onClick={handlePauseTimer}>
            {isTimerPaused ? 'Resume' : 'Pause'}
          </button>

          <button className={styles.timerStopButton} onClick={handleStopTimer}>
            Stop
          </button>
        </div>
      )}

      {(!timerDurationSeconds || isTimerDone) && (
        <button className={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      )}
    </div>
  );
}

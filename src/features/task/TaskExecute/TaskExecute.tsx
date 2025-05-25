import classNames from 'classnames';
import { useState } from 'react';
import { Button, Timer } from '@/components';
import { FieldEdit, SetBadge } from '@/features/task';
import type { Field } from '@/models';
import { formatField } from '@/services';
import { cardStyles } from '@/styles';
import { formatFuzzyDuration } from '@/utils';
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

  const handleTimerComplete = () => {
    setIsTimerDone(true);
  };

  const handleContinue = () => {
    onClickContinue();
  };

  return (
    <div className={classNames(styles.taskExecute, className)}>
      <div className={styles.title}>
        {name}
      </div>

      {estimatedSeconds > 0 && (
        <div className={styles.description}>
          {`About ${formatFuzzyDuration(estimatedSeconds)} to complete`}
        </div>
      )}

      <div className={styles.fields}>
        <SetBadge
          className={styles.setBadge}
          number={setNumber}
        />

        {fields?.map((field, index) => (
          <div key={index} className={classNames(styles.field, cardStyles.mediumCard)}>
            <div className={styles.fieldKey}>
              {field.name}
            </div>

            <div className={styles.fieldValueOuter}>
              <div className={styles.fieldValue}>
                {formatField(field.type, field.value)}
              </div>

              <FieldEdit
                className={styles.fieldEdit}
                field={field}
                onChangeValue={onChangeFieldValue}
              />
            </div>
          </div>
        ))}
      </div>

      {timerDurationSeconds > 0 && !isTimerDone && (
        <Timer
          className={styles.timer}
          durationSeconds={timerDurationSeconds}
          onComplete={handleTimerComplete}
        />
      )}

      {(!timerDurationSeconds || isTimerDone) && (
        <Button
          className={styles.continueButton}
          onClick={handleContinue}
          text="Continue"
        />
      )}
    </div>
  );
}

import classNames from 'classnames';
import { useState } from 'react';
import { Button, NumberSlider, Timer } from '@/components';
import { FieldEdit, SetBadge } from '@/features/task';
import type { Field } from '@/models';
import { formatField } from '@/services';
import { cardStyles } from '@/styles';
import { formatFuzzyDuration } from '@/utils';
import { RPE_LABELS } from '@/utils/scaleLabels';
import styles from './TaskExecute.module.css';

interface TaskExecuteProps {
  className?: string;
  endFields: Field[];
  estimatedSeconds: number;
  fields: Field[];
  name: string;
  onChangeEndFieldValue: (field: Field, value: number) => void;
  onChangeFieldValue: (field: Field, value: number) => void;
  onClickContinue: () => void;
  setNumber: number;
  timerDurationSeconds: number;
}

export function TaskExecute({
  className,
  endFields,
  estimatedSeconds,
  fields,
  name,
  onChangeEndFieldValue,
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
      <h2 className={styles.title}>
        {name}
      </h2>

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

      {endFields.length > 0 && (!timerDurationSeconds || isTimerDone) && (
        <>
          <div className={styles.endFieldsTitle}>
            Check In
          </div>

          <div className={styles.endFields}>
            {endFields.map((field, index) => (
              <div key={index} className={classNames(styles.endField)}>
                <div className={styles.endFieldKey}>
                  {field.name}
                </div>

                <div className={styles.endFieldValueOuter}>
                  {field.type === 'rpe' ? (
                    <NumberSlider
                      className={styles.numberSlider}
                      fieldName={field.name}
                      formattedValue={formatField(field.type, field.value)}
                      labelMap={RPE_LABELS}
                      max={field.maxValue}
                      min={field.minValue}
                      onChange={value => onChangeEndFieldValue(field, value)}
                      step={1}
                      value={field.value}
                    />
                  ) : (
                    <FieldEdit
                      className={styles.fieldEdit}
                      field={field}
                      onChangeValue={onChangeEndFieldValue}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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

import classNames from 'classnames';
import { FieldEdit } from '@/features/task';
import type { Field } from '@/models';
import { formatField } from '@/services';
import { formatFuzzyDuration } from '@/utils';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  className?: string;
  estimatedSeconds: number;
  fields: Field[];
  name: string;
  onChangeFieldValue: (field: Field, value: number) => void;
  setNumber: number;
}

export function TaskCard({
  className,
  estimatedSeconds,
  fields,
  name,
  onChangeFieldValue,
  setNumber,
}: TaskCardProps) {
  return (
    <div className={classNames(styles.taskCard, className)}>
      {(setNumber < 2) && (
        <div className={styles.title}>
          {name}
        </div>
      )}

      {setNumber > 0 && (
        <div className={styles.set}>
          <div className={styles.setLabel}>
            Set
          </div>

          <div className={styles.setNumber}>
            {`${setNumber}`}
          </div>
        </div>
      )}

      <div className={styles.fields}>
        {fields.map((field, index) => (
          <div key={index} className={styles.field}>
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

        <div className={classNames(styles.field, styles.time)}>
          <div className={styles.fieldKey}>
            Required
          </div>

          <div className={styles.fieldValue}>
            {formatFuzzyDuration(estimatedSeconds, true)}
          </div>
        </div>
      </div>
    </div>
  );
}

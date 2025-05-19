import classNames from 'classnames';
import type { Field } from '@/models';
import { formatField } from '@/services';
import styles from './TaskQueue.module.css';

interface TaskQueueProps {
  className?: string;
  fields: Field[];
  name: string;
  setNumber: number;
}

export function TaskQueue({
  className,
  fields,
  name,
  setNumber,
}: TaskQueueProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.title}>
        {name}
      </div>

      {setNumber > 0 && (
        <div className={styles.setNumber}>
          {`Set: ${setNumber}`}
        </div>
      )}

      <div className={styles.fields}>
        {fields?.map((field, index) => (
          <div key={index} className={styles.field}>
            <div className={styles.fieldKey}>
              {field.name}
            </div>

            <div className={styles.fieldValue}>
              <div className={styles.fieldNumber}>
                {formatField(field.type, field.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div className={classNames(styles.taskqueue, className)}>
      <div className={styles.title}>
        {name}
      </div>

      {setNumber > 0 && (
        <div className={styles.set}>
          {`Set ${setNumber}`}
        </div>
      )}

      {fields.length > 0 && (
        <div className={styles.field}>
          {formatField(fields[0].type, fields[0].value)}
        </div>
      )}
    </div>
  );
}

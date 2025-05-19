import classNames from 'classnames';
import type { Field } from '@/models';
import { formatField } from '@/services';
import { formatFuzzyDuration } from '@/utils';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  className?: string;
  estimatedSeconds: number;
  fields: Field[];
  groupNumber: number;
  isEditing: boolean;
  name: string;
  onChangeFieldValue: (field: Field, value: number) => void;
  onClick: () => void;
  setNumber: number;
}

export function TaskCard({
  className,
  estimatedSeconds,
  fields,
  groupNumber,
  isEditing,
  name,
  onChangeFieldValue,
  onClick,
  setNumber,
}: TaskCardProps) {
  const handleClick = () => {
    onClick();
  };

  const handleFieldChange = (field: Field, value: string) => {
    onChangeFieldValue(field, parseFloat(value) || 0);
  };

  return (
    <div
      className={classNames(
        styles.container,
        styles[`group${groupNumber}`],
        { [styles.isEditing]: isEditing },
        className,
      )}
      onClick={handleClick}
    >
      {(setNumber < 2) && (
        <div className={styles.meta}>
          <div className={styles.title}>
            {name}
          </div>
        </div>
      )}

      <div className={styles.inner}>
        {setNumber > 0 && (
          <div>
            {`Set: ${setNumber}`}
          </div>
        )}

        <div>
          {formatFuzzyDuration(estimatedSeconds)}
        </div>

        <div className={styles.fields}>
          {fields.map((field, index) => (
            <div key={index} className={styles.field}>
              <div className={styles.fieldKey}>
                {field.name}
              </div>

              <div className={styles.fieldValue}>
                {field.initialValueSource === 'memory' && isEditing ? (
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
      </div>
    </div>
  );
}

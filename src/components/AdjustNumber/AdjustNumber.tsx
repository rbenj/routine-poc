import classNames from 'classnames';
import { MinusIcon, PlusIcon } from '@/icons';
import styles from './AdjustNumber.module.css';

interface AdjustNumberProps {
  className?: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  unitLabel: string;
  value: number;
}

export function AdjustNumber({
  className,
  max,
  min,
  onChange,
  unitLabel,
  value,
}: AdjustNumberProps) {
  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    onChange(value - 1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === '') {
      onChange(0);
    } else {
      const number = parseFloat(value) || 0;

      if (typeof max === 'number' && number > max) {
        onChange(max);
      } else if (typeof min === 'number' && number < min) {
        onChange(min);
      } else {
        onChange(number);
      }
    }
  };

  return (
    <div className={classNames(styles.adjustNumber, className)}>
      <div className={styles.field}>
        <button className={styles.upButton} onClick={handleIncrement}>
          <PlusIcon />
        </button>

        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={handleChange}
        />

        <button className={styles.downButton} onClick={handleDecrement}>
          <MinusIcon />
        </button>
      </div>

      {unitLabel && (
        <div className={styles.unit}>
          {unitLabel}
        </div>
      )}
    </div>
  );
}

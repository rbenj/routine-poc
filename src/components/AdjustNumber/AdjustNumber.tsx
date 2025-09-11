import { useId } from 'react';
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
  const stableId = useId();

  const handleIncrement = () => {
    if (typeof max === 'number' && value >= max) {
      onChange(max);
    } else {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (typeof min === 'number' && value <= min) {
      onChange(min);
    } else {
      onChange(value - 1);
    }
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

  const inputId = `adjust-number-value-${stableId}`;

  return (
    <div className={classNames(styles.adjustNumber, className)}>
      <div className={styles.field}>
        <button
          aria-controls={inputId}
          aria-label="Increase value"
          className={styles.upButton}
          onClick={handleIncrement}
          type="button"
        >
          <PlusIcon />
        </button>

        <input
          aria-label="Value"
          className={styles.input}
          id={inputId}
          onChange={handleChange}
          type="text"
          value={value}
        />

        <button
          aria-controls={inputId}
          aria-label="Decrease value"
          className={styles.downButton}
          onClick={handleDecrement}
          type="button"
        >
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

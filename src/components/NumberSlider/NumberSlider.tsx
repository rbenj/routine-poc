import classNames from 'classnames';
import styles from './NumberSlider.module.css';

interface NumberSliderProps {
  className?: string;
  fieldName: string;
  formattedValue: string;
  labelMap?: Record<number, string>;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}

export function NumberSlider({
  className,
  formattedValue,
  labelMap = {},
  max,
  min,
  onChange,
  step = 1,
  value,
}: NumberSliderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(event.target.value, 10));
  };

  return (
    <div className={classNames(styles.numberSlider, className)}>
      <div className={styles.sliderOuter}>
        <input
          className={styles.slider}
          max={max}
          min={min}
          onChange={handleChange}
          step={step}
          type="range"
          value={value}
        />
        <div className={styles.metaOuter}>
          <div className={styles.value}>
            {formattedValue || value}
          </div>
          {labelMap[value] && (
            <div className={styles.label}>
              {labelMap[value]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

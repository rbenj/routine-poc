import classNames from 'classnames';
import styles from './Button.module.css';

interface ButtonProps {
  className: string;
  onClick: () => void;
  text: string;
}

export function Button({
  className,
  onClick,
  text,
}: ButtonProps) {
  <button className={classNames(styles.container, className)} onClick={onClick}>
    {text}
  </button>
}

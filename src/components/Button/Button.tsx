import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './Button.module.css';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  text: string;
  to?: string;
}

export function Button({
  className,
  onClick,
  text,
  to,
}: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button className={classNames(styles.button, className)} onClick={handleClick}>
      {text}
    </button>
  );
}

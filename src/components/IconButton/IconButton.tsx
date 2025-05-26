import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IconButton.module.css';

interface IconButtonProps {
  'aria-label'?: string;
  className?: string;
  icon: ReactNode;
  onClick?: () => void;
  to?: string;
}

export function IconButton({
  'aria-label': ariaLabel,
  className,
  icon,
  onClick,
  to,
}: IconButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      aria-label={ariaLabel}
      className={classNames(styles.iconButton, className)}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
}

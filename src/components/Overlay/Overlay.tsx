import type { ReactNode } from 'react';
import classNames from 'classnames';
import { CloseIcon } from '@/icons';
import { IconButton } from '@/components';
import styles from './Overlay.module.css';

interface OverlayProps {
  children: ReactNode;
  className?: string;
  onClose(): void;
}

export function Overlay({
  children,
  className,
  onClose,
}: OverlayProps) {
  const handleClickBackground = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  }

  return (
    <div className={classNames(styles.overlay, className)} onClick={handleClickBackground}>
      <div className={styles.inner}>
        {children}
      </div>

      <IconButton
        className={styles.closeButton}
        icon={<CloseIcon />}
        onClick={handleClose}
      />
    </div>
  );
}

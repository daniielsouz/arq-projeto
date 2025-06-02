import { useEffect } from 'react';
import style from './toast.module.css';

function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`${style.toast} ${style[type]}`}>
      {message}
    </div>
  );
}

export default Toast;

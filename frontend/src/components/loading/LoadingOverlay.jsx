import style from './LoadingOverlay.module.css';

export default function LoadingOverlay({ message = "Carregando" }) {
  return (
    <div className={style.overlay}>
      <p className={style.loadingText}>
        {message}
        <span className={style.loadingSpan}>.</span>
        <span className={style.loadingSpan}>.</span>
        <span className={style.loadingSpan}>.</span>
      </p>
    </div>
  );
}

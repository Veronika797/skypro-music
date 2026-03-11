import styles from './progressBar.module.css';
import { ChangeEvent } from 'react';

type progressBarProp = {
  max: number;
  value: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function ProgressBar({
  max,
  value,
  step,
  onChange,
  className = '',
}: progressBarProp) {
  return (
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      step={step}
      onChange={onChange}
      className={`${styles.styledProgressInput} ${className}`}
      aria-label="Полоса прогресса воспроизведения"
    />
  );
}

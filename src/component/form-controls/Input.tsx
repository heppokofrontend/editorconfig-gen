import React from 'react';
import styles from './common.module.scss';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {
  label: string,
}> = ({label, ...props}) => {
  return (
    <label className={styles.input}>
      <span className={styles.input__label}>
        {label}
      </span>

      <span className={styles.input__control}>
        <input
          list={label}
          className={styles.input__input}
          {...props}
        />
      </span>
    </label>
  );
};

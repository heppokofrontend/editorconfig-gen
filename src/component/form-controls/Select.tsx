import React from 'react';
import styles from './common.module.scss';

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string,
  options?: React.ReactNode[],
}> = ({label, options, ...props}) => {
  return (
    <label className={styles.input}>
      <span className={styles.input__label}>
        {label}
      </span>

      <span className={styles.input__control}>
        <select
          className={styles.input__select}
          {...props}
        >
          <option value="">none</option>
          {
            options
          }
        </select>
      </span>
    </label>
  );
};

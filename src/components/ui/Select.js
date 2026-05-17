import styles from "./Select.module.css";

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  error,
  required = false,
  ...props
}) {
  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${styles.select} ${error ? styles.selectError : ""}`}
          required={required}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

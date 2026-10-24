import styles from "./Field.module.css";

type FieldProps = {
  label: string;
  /** id des Controls; Fehlertext erhält `${id}-error` */
  id: string;
  required?: boolean;
  optionalLabel?: string;
  error?: string;
  children: React.ReactNode;
};

/** Label + Control + Fehlermeldung. Controls setzen aria-describedby={errorId(id)} und invalid. */
export function Field({ label, id, required, optionalLabel, error, children }: FieldProps) {
  return (
    <div className={error ? `${styles.field} ${styles.invalid}` : styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}{" "}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : (
          optionalLabel && <span className={styles.optional}>{optionalLabel}</span>
        )}
      </label>
      {children}
      {required && (
        <p className={styles.error} id={errorId(id)} hidden={!error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Verknüpft ein Control mit seiner Fehlermeldung */
export function errorId(id: string) {
  return `${id}-error`;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };
export function Input({ invalid, className, ...rest }: InputProps) {
  return <input aria-invalid={invalid} className={[styles.control, className].filter(Boolean).join(" ")} {...rest} />;
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };
export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return <textarea aria-invalid={invalid} className={[styles.control, styles.textarea, className].filter(Boolean).join(" ")} {...rest} />;
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  options: { value: string; label: string }[];
  placeholder: string;
};
export function Select({ invalid, options, placeholder, className, ...rest }: SelectProps) {
  return (
    <div className={styles.select}>
      <select aria-invalid={invalid} className={[styles.control, className].filter(Boolean).join(" ")} {...rest}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

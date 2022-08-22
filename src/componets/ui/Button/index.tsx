import { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";
import { FaSpinner } from "react-icons/fa";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}
export function Button({ children, loading, ...rest }: ButtonProps) {
  return (
    <button className={styles.button} disabled={loading} {...rest}>
      {loading ? (
        <FaSpinner />
      ) : (
        <a className={styles.textButton}>{children}</a>
      )}
    </button>
  );
}

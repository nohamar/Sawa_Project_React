import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import styles from "../css/ErrorPage.module.css";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error happened while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      (error.data as { message?: string })?.message ||
      "The page could not be loaded properly. Please try again.";
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>Oops!</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
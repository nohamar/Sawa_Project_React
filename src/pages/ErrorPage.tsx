import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error happened while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.data?.message ||
      "The page could not be loaded properly. Please try again.";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">{title}</h1>
      <p className="text-gray-700 max-w-md mb-6">{message}</p>
      <Link
        to="/"
        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        Sorry, the page you are trying to open does not exist or may have been moved.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Home
        </Link>

        <Link
          to="/events"
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
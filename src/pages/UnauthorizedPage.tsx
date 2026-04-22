import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600 mb-3">Access Denied</h1>
      <p className="text-gray-700 max-w-md mb-6">
        You do not have permission to access this page.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Home
        </Link>

        <Link
          to="/login"
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
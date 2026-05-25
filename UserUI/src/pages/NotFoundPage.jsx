import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-16 text-center">
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
        Go home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

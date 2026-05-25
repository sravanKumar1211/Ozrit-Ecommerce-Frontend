import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6">
    <div className="rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-soft">
      <h1 className="text-5xl font-semibold text-slate-900">404</h1>
      <p className="mt-4 text-lg text-slate-600">Page not found. The route you followed does not exist.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Go back home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

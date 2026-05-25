import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link to="/dashboard" className="transition hover:text-slate-900">
        Dashboard
      </Link>
      {pathnames.map((part, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={routeTo} className="inline-flex items-center gap-2">
            <span className="text-slate-300">/</span>
            {isLast ? (
              <span className="font-medium text-slate-900">{part.replace(/-/g, " ")}</span>
            ) : (
              <Link to={routeTo} className="transition hover:text-slate-900">
                {part.replace(/-/g, " ")}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;

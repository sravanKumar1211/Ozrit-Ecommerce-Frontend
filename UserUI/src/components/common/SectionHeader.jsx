import { Link } from "react-router-dom";

const SectionHeader = ({ title, subtitle, actionLabel, actionTo }) => (
  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="text-sm font-semibold text-slate-900 hover:text-slate-600">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default SectionHeader;

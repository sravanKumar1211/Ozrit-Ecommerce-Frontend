const StatusBadge = ({ label, className = "", children }) => (
  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}>
    {children || label}
  </span>
);

export default StatusBadge;

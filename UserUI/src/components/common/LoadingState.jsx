const LoadingState = ({ label = "Loading..." }) => (
  <div className="flex min-h-40 items-center justify-center rounded-2xl bg-white text-sm font-medium text-slate-500">
    {label}
  </div>
);

export default LoadingState;

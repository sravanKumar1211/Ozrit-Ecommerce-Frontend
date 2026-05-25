const PlaceholderPage = ({ title }) => (
  <div className="mx-auto max-w-3xl px-4 py-10">
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This protected account area is routed for Stage 1. Full functionality belongs to a later stage.</p>
    </div>
  </div>
);

export default PlaceholderPage;

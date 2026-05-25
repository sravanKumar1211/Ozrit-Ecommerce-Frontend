import { motion } from "framer-motion";

const SmallCard = ({ title, value, children, accent }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-soft ${accent || ""}`}
  >
    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
    <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
    {children}
  </motion.div>
);

export default SmallCard;

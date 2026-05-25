import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { loadDashboard } from "@/state/slices/dashboardSlice";
import { loadOrders } from "@/state/slices/orderSlice";
import SmallCard from "@/components/SmallCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.dashboard);
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(loadDashboard());
    dispatch(loadOrders());
  }, [dispatch]);

  const revenueSeries = stats?.salesHistory || [];

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <div className="grid gap-6 xl:grid-cols-4">
        <SmallCard title="Total Orders" value={stats?.totals?.orders || 0} />
        <SmallCard
          title="Total Products"
          value={stats?.totals?.products || 0}
        />
        <SmallCard
          title="Total Customers"
          value={stats?.totals?.customers || 0}
        />
        <SmallCard
          title="Revenue"
          value={formatCurrency(stats?.totals?.revenue || 0)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Sales Performance
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Monthly revenue and growth overview.
              </p>
            </div>
          </div>

          {/* 2. Change h-[320px] to a fixed height fallback inside the component if needed, or pass an aspect ratio */}
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={revenueSeries}
                margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#475569" }} />
                <YAxis tick={{ fill: "#475569" }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest Orders
            </h2>
            <div className="mt-4 space-y-3">
              {orders?.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.user?.name || "Guest"} •{" "}
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Total: {formatCurrency(order.finalAmount)}
                  </p>
                </div>
              ))}
              {!orders?.length && (
                <p className="text-sm text-slate-500">No recent orders yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">
              Performance summary
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Average order value</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {formatCurrency(stats?.averages?.orderValue || 0)}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Active products</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {stats?.totals?.activeProducts || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

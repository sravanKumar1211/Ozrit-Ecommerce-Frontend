import { Outlet } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const AdminLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  </div>
);

export default AdminLayout;
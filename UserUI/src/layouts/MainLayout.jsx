import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const MainLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

export default MainLayout;

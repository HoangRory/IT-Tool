import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar cố định */}
      {sidebarOpen && <Sidebar />}

       <div className={`flex flex-col flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} bg-green-50 transition-all duration-300`}>
        {/* Navbar cố định */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>

        {/* MainContent sẽ thay đổi khi chuyển trang */}
        <main className="flex-1 p-4 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

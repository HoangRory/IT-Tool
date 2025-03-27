import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar cố định */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Navbar cố định */}
        <Navbar />

        {/* MainContent sẽ thay đổi khi chuyển trang */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

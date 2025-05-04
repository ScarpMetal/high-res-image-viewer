import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 ">
        <main className={`flex-1 relative p-4`}>
          <div className="absolute inset-0 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

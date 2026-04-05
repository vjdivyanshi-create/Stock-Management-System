import { Bell, Search, UserCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-sm">

      {/* LEFT */}
      <h1 className="text-xl font-semibold text-gray-800">
        {title}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />
        </div>

        {/* NOTIFICATION */}
        <div className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
          <Bell size={18} />
        </div>

        {/* PROFILE */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg"
          >
            <UserCircle size={30} className="text-gray-600" />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border p-3 z-50">

              {/* USER INFO */}
              <div className="flex items-center gap-3 p-2 rounded-lg">
                <UserCircle size={40} className="text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t my-3"></div>

              {/* OPTIONS (you can add more later) */}
              <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition">
                👤 My Profile
              </button>

              <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition">
                ⚙ Settings
              </button>

              {/* DIVIDER */}
              <div className="border-t my-3"></div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

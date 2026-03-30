import { Bell, Search, UserCircle } from "lucide-react";

export default function Navbar({ title }) {
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

        {/* USER */}
        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle size={28} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}
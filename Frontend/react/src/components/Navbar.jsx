import { LogOut, Settings, Sparkles, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSessionUser, getSessionUser } from "../lib/session";
import { applyTheme } from "../lib/theme";

export default function Navbar({ title }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getSessionUser();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleLogout = () => {
    clearSessionUser();
    applyTheme("light");
    navigate("/login");
  };

  return (
    <div className="relative z-40 mb-6 flex items-center justify-between rounded-[28px] border border-white/60 bg-white/80 px-6 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition ${
            open
              ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
              : "border-transparent bg-white/50 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 p-2 text-white shadow-lg">
            <UserCircle size={24} />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-800">{user?.name || "User"}</p>
            <p className="max-w-[180px] truncate text-xs text-slate-500">{user?.email || "user@example.com"}</p>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 z-[80] mt-3 w-80 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="rounded-[22px] bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-4">
              <div className="mb-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-500 shadow-sm">
                <Sparkles size={12} className="mr-2" />
                Active Session
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 p-3 text-white shadow-lg">
                  <UserCircle size={30} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-800">{user?.name || "User"}</p>
                  <p className="truncate text-sm text-slate-500">{user?.email || "user@example.com"}</p>
                </div>
              </div>
            </div>

            <div className="my-3 h-px bg-slate-200" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                <Settings size={16} />
              </div>
              <div>
                <p>Settings</p>
                <p className="text-xs font-normal text-slate-500">Profile, alerts, and theme</p>
              </div>
            </button>

            <div className="my-3 h-px bg-slate-200" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <div className="rounded-xl bg-red-50 p-2 text-red-500">
                <LogOut size={16} />
              </div>
              <div>
                <p>Logout</p>
                <p className="text-xs font-normal text-red-400">End this session safely</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { BellRing, Mail, MapPin, Palette, Phone, ShieldCheck, UserRound } from "lucide-react";
import { api } from "../lib/api";
import { getSessionUser, setSessionUser } from "../lib/session";
import { applyTheme } from "../lib/theme";

export default function SettingsPage() {
  const currentUser = getSessionUser();
  const [settings, setSettings] = useState({
    name: currentUser?.name || "Admin",
    email: currentUser?.email || "",
    emailAlert: true,
    lowStockAlert: true,
    theme: "light",
    oldPass: "",
    newPass: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.email) {
      return;
    }

    const loadSettings = async () => {
      try {
        const data = await api.get(`/settings/${encodeURIComponent(currentUser.email)}`);
        setSettings((prev) => ({
          ...prev,
          ...data,
          oldPass: "",
          newPass: "",
        }));
        applyTheme(data.theme || "light");
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    loadSettings();
  }, [currentUser?.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveProfile = async () => {
    try {
      const data = await api.put(`/settings/${encodeURIComponent(currentUser.email)}`, {
        name: settings.name,
      });

      setSessionUser({
        ...(currentUser || {}),
        name: data.name,
        email: currentUser.email,
      });

      setMessage("Profile updated");
      setError("");
    } catch (apiError) {
      setError(apiError.message);
      setMessage("");
    }
  };

  const savePassword = async () => {
    if (!settings.oldPass || !settings.newPass) {
      setError("Please provide both old and new passwords.");
      setMessage("");
      return;
    }

    if (settings.newPass.length < 6) {
      setError("New password must be at least 6 characters long.");
      setMessage("");
      return;
    }

    try {
      const data = await api.put(`/settings/${encodeURIComponent(currentUser.email)}/password`, {
        oldPass: settings.oldPass,
        newPass: settings.newPass,
      });

      setSettings((prev) => ({
        ...prev,
        oldPass: "",
        newPass: "",
      }));
      setMessage(data.message || "Password updated");
      setError("");
    } catch (apiError) {
      setError(apiError.message);
      setMessage("");
    }
  };

  const saveSystem = async () => {
    try {
      await api.put(`/settings/${encodeURIComponent(currentUser.email)}`, {
        name: settings.name,
        emailAlert: settings.emailAlert,
        lowStockAlert: settings.lowStockAlert,
        theme: settings.theme,
      });
      applyTheme(settings.theme);
      setMessage("Settings saved");
      setError("");
    } catch (apiError) {
      setError(apiError.message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-indigo-500">Workspace Settings</p>
          <h2 className="text-3xl font-bold text-gray-800">Customize your account and system preferences</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage your profile, password, notifications, and theme from one clean control center.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SettingsCard
            icon={<UserRound size={20} />}
            iconClass="bg-indigo-100 text-indigo-600"
            title="Profile Settings"
            subtitle="Keep your account details up to date."
          >
            <input
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Full Name"
            />

            <input
              name="email"
              value={settings.email}
              readOnly
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
              placeholder="Email"
            />

            <button onClick={saveProfile} className="rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-blue-700">
              Save Profile
            </button>
          </SettingsCard>

          <SettingsCard
            icon={<ShieldCheck size={20} />}
            iconClass="bg-emerald-100 text-emerald-600"
            title="Change Password"
            subtitle="Use a secure password with at least 6 characters."
          >
            <input
              type="password"
              name="oldPass"
              value={settings.oldPass}
              onChange={handleChange}
              className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="Old Password"
            />

            <input
              type="password"
              name="newPass"
              value={settings.newPass}
              onChange={handleChange}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              placeholder="New Password"
            />

            <button onClick={savePassword} className="rounded-xl bg-green-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-green-700">
              Update Password
            </button>
          </SettingsCard>

          <SettingsCard
            icon={<BellRing size={20} />}
            iconClass="bg-amber-100 text-amber-600"
            title="Notifications"
            subtitle="Choose which updates you want to receive."
          >
            <label className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                name="emailAlert"
                checked={settings.emailAlert}
                onChange={handleChange}
              />
              <span className="text-sm font-medium text-slate-700">Email Alerts</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                name="lowStockAlert"
                checked={settings.lowStockAlert}
                onChange={handleChange}
              />
              <span className="text-sm font-medium text-slate-700">Low Stock Alerts</span>
            </label>
          </SettingsCard>

          <SettingsCard
            icon={<Palette size={20} />}
            iconClass="bg-violet-100 text-violet-600"
            title="System Settings"
            subtitle="Switch the look and save your workspace preferences."
          >
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>

            <button onClick={saveSystem} className="rounded-xl bg-purple-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-purple-700">
              Save Settings
            </button>
          </SettingsCard>
        </div>

        <footer className="settings-contact mt-10 rounded-[32px] border px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="settings-contact-kicker mb-2 text-sm font-semibold uppercase tracking-[0.28em]">Contact Us</p>
              <h3 className="settings-contact-title text-2xl font-semibold">Need help with the inventory system?</h3>
              <p className="settings-contact-copy mt-3 max-w-xl text-sm">
                Reach out to the project contacts below for support, clarification, or coordination.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="settings-contact-card rounded-[24px] border p-5">
                <p className="settings-contact-title text-lg font-semibold">Divyanshi Vijay</p>
                <div className="settings-contact-copy mt-4 space-y-3 text-sm">
                  <p className="flex items-center gap-3"><Mail size={16} className="settings-contact-icon" /> vj.divyanshi@gmail.com</p>
                  <p className="flex items-center gap-3"><Phone size={16} className="settings-contact-icon" /> 9414188311</p>
                </div>
              </div>

              <div className="settings-contact-card rounded-[24px] border p-5">
                <p className="settings-contact-title text-lg font-semibold">Akshika Sharma</p>
                <div className="settings-contact-copy mt-4 space-y-3 text-sm">
                  <p className="flex items-center gap-3"><Mail size={16} className="settings-contact-icon" /> akshikas40@gmail.com</p>
                  <p className="flex items-center gap-3"><Phone size={16} className="settings-contact-icon" /> 8209068661</p>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-contact-card settings-contact-copy mt-6 rounded-[24px] border p-5 text-sm">
            <p className="settings-contact-title mb-2 flex items-center gap-3 font-medium">
              <MapPin size={16} className="settings-contact-icon" />
              Address
            </p>
            <p>SKIT, Ram Nagariya Rd, Shivam Nagar, Jagatpura, Jaipur, Rajasthan 302017</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SettingsCard({ icon, iconClass, title, subtitle, children }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex items-center gap-3">
        <div className={`rounded-2xl p-3 ${iconClass}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

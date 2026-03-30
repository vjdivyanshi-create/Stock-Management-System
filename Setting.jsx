import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "Admin",
    email: "admin@email.com",
    emailAlert: true,
    lowStockAlert: true,
    theme: "light",
    oldPass: "",
    newPass: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setSettings({
      name: "Admin",
      email: "admin@email.com",
      emailAlert: true,
      lowStockAlert: true,
      theme: "light",
      oldPass: "",
      newPass: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveProfile = () => {
    alert("Profile updated");
  };

  const savePassword = () => {
    alert("Password updated");
  };

  const saveSystem = () => {
    alert("Settings saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">

      {/* PAGE TITLE */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>

          <input
            name="name"
            value={settings.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            placeholder="Full Name"
          />

          <input
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            placeholder="Email"
          />

          <button
            onClick={saveProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <input
            type="password"
            name="oldPass"
            value={settings.oldPass}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            placeholder="Old Password"
          />

          <input
            type="password"
            name="newPass"
            value={settings.newPass}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            placeholder="New Password"
          />

          <button
            onClick={savePassword}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Update Password
          </button>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>

          <label className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              name="emailAlert"
              checked={settings.emailAlert}
              onChange={handleChange}
            />
            Email Alerts
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="lowStockAlert"
              checked={settings.lowStockAlert}
              onChange={handleChange}
            />
            Low Stock Alerts
          </label>
        </div>

        {/* SYSTEM */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>

          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>

          <button
            onClick={saveSystem}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
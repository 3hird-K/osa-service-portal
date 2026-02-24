"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface PasswordForm {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<PasswordForm>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePasswordChange = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    if (form.new_password !== form.new_password_confirmation) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(
        "http://localhost:8000/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        setForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      }
    } catch (error) {
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Page Title */}
        <h1 className="text-3xl font-bold">Settings</h1>

        {/* ========================= */}
        {/* Appearance Section */}
        {/* ========================= */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Appearance
          </h2>

          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* ========================= */}
        {/* Change Password Section */}
        {/* ========================= */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Change Password
          </h2>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Current Password"
              required
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
              onChange={(e) =>
                setForm({
                  ...form,
                  current_password: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
              onChange={(e) =>
                setForm({
                  ...form,
                  new_password: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              required
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
              onChange={(e) =>
                setForm({
                  ...form,
                  new_password_confirmation:
                    e.target.value,
                })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

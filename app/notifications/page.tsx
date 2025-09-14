"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  notify_at: string;
  delivered: boolean;
  is_read: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("notify_at", { ascending: false });

    if (error) console.error(error);
    else setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications 📭</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-3 border rounded ${
                n.is_read ? "bg-gray-100" : "bg-yellow-50"
              }`}
            >
              <h2 className="font-semibold">{n.title}</h2>
              <p>{n.message}</p>
              <div className="text-sm text-gray-600">
                {new Date(n.notify_at).toLocaleString()}
              </div>
              {!n.is_read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

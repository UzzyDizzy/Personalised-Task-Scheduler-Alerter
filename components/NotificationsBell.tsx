"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notify_at: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1. Fetch last 20 notifications
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) setNotifications(data);
      setLoading(false);

      // 2. Real-time subscription
      subscription = supabase
        .channel("notifications-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          }
        )
        .subscribe();
    })();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        🔔
        {notifications.some((n) => !n.is_read) && (
          <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg max-h-96 overflow-y-auto z-50">
          <h3 className="px-4 py-2 font-semibold border-b">Notifications</h3>
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            <ul className="divide-y">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    n.is_read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.notify_at ? new Date(n.notify_at).toLocaleString() : "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

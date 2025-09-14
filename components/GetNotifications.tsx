/*
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

export default function GetNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    (async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // 1. Fetch initial notifications
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) setNotifications(data);
      setLoading(false);

      // 2. Subscribe to real-time inserts for this user
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

  if (loading) {
    return <p className="p-4 text-gray-500">Loading notifications...</p>;
  }

  if (notifications.length === 0) {
    return <p className="p-4 text-gray-500">No notifications</p>;
  }

  return (
    <ul className="divide-y border rounded bg-white">
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
            {new Date(n.notify_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
*/

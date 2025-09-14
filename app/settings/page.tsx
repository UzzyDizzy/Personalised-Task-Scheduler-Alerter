"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [notifyType, setNotifyType] = useState("24_1");
  const [customTimes, setCustomTimes] = useState<{ hours: number; minutes: number }[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setNotifyType(data.notify_type);
        setCustomTimes(data.custom_times || []);
      }
    })();
  }, []);

  async function save() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const payload = { user_id: user.id, notify_type: notifyType, custom_times: customTimes };
    const { error } = await supabase.from("settings").upsert(payload, { onConflict: "user_id" });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "✅ Settings saved successfully" });
    }
    setTimeout(() => setMessage(null), 3000); // auto hide
  }

  function updateTime(index: number, field: "hours" | "minutes", value: number) {
    setCustomTimes((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  }

  function removeTime(index: number) {
    setCustomTimes((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={notifyType === "24_1"}
            onChange={() => setNotifyType("24_1")}
          />
          24 hrs & 1 hr before
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={notifyType === "1_hr"}
            onChange={() => setNotifyType("1_hr")}
          />
          1 hr before
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={notifyType === "custom"}
            onChange={() => setNotifyType("custom")}
          />
          Custom
        </label>
      </div>

      {notifyType === "custom" && (
        <div className="mt-4 space-y-3">
          {customTimes.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="number"
                value={c.hours}
                min={0}
                className="border p-1 rounded w-20"
                onChange={(e) => updateTime(i, "hours", Number(e.target.value))}
              />
              <span>hrs</span>
              <input
                type="number"
                value={c.minutes}
                min={0}
                max={59}
                className="border p-1 rounded w-20"
                onChange={(e) => updateTime(i, "minutes", Number(e.target.value))}
              />
              <span>mins before</span>
              <button
                onClick={() => removeTime(i)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                ✖
              </button>
            </div>
          ))}
          <button
            onClick={() => setCustomTimes((t) => [...t, { hours: 0, minutes: 0 }])}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            ➕ Add Time
          </button>
        </div>
      )}

      <button
        onClick={save}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Settings
      </button>
    </div>
  );
}

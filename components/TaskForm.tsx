// components/TaskForm.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TaskType = "one_time" | "custom";
type RepeatDays = { mon:boolean; tue:boolean; wed:boolean; thu:boolean; fri:boolean; sat:boolean; sun:boolean };

const initialRepeatDays: RepeatDays = { mon:false,tue:false,wed:false,thu:false,fri:false,sat:false,sun:false };

export default function TaskForm({ onTaskCreated }: { onTaskCreated: () => void }) {
  const supabase = createClientComponentClient();
  const [type, setType] = useState<TaskType>("one_time");
  const [taskName, setTaskName] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(new Date());
  const [repeatDays, setRepeatDays] = useState<RepeatDays>(initialRepeatDays);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setLoading(false);
      return alert("Login required");
    }

    const payload: any = {
      user_id: user.id, // ✅ fixed
      task_name: taskName.trim(),
      type,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (type === "one_time") {
      if (!dateTime) {
        setLoading(false);
        return alert("Pick a date/time");
      }
      payload.date_time = dateTime.toISOString();
    } else {
      payload.repeat_days = repeatDays;
    }

    const { error } = await supabase.from("tasks").insert(payload);
    setLoading(false);

    if (error) {
      console.error("Error inserting task:", error);
      return alert(error.message);
    }

    // Reset form
    setTaskName("");
    setDateTime(new Date());
    setRepeatDays(initialRepeatDays);

    // Trigger refresh
    onTaskCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border rounded-xl shadow-md space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-black">Create a Task</h2>

      <input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
        className="w-full p-2 border rounded focus:ring focus:ring-blue-300 text-black"
        required
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as TaskType)}
        className="w-full p-2 border rounded text-gray-500"
      >
        <option value="one_time">One Time</option>
        <option value="custom">Custom (repeat)</option>
      </select>

      {type === "one_time" ? (
        <DatePicker
          selected={dateTime}
          onChange={(d) => setDateTime(d)}
          showTimeSelect
          dateFormat="Pp"
          className="w-full p-2 border rounded text-gray-500"
        />
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {Object.keys(repeatDays).map((d) => (
            <label key={d} className="flex flex-col items-center text-sm cursor-pointer text-gray-500">
              <input
                type="checkbox"
                checked={repeatDays[d as keyof RepeatDays]}
                onChange={() =>
                  setRepeatDays((r) => ({ ...r, [d]: !r[d as keyof RepeatDays] }))
                }
              />
              {d.slice(0, 3).toUpperCase()}
            </label>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

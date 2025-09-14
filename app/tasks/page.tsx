// app/tasks/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import TaskForm from "@/components/TaskForm";

export default function TasksPage() {
  const supabase = createClientComponentClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching tasks:", error);
      setLoading(false);
      return;
    }

    const now = new Date();
    const validTasks = (data || []).filter(
      (task) => !(task.type === "one_time" && new Date(task.date_time) < now)
    );

    setTasks(validTasks);
    setLoading(false);
  }

  // ✅ NEW: delete a task
  async function handleDelete(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      console.error("❌ Error deleting task:", error);
      return alert("Failed to delete task");
    }
    // Update local state instantly
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">My Tasks</h1>
      <TaskForm onTaskCreated={fetchTasks} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">
          Current Tasks
        </h2>

        {loading ? (
          <p className="text-white text-center">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-white text-center">No tasks yet. Create one!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 border rounded-lg shadow-md bg-white flex flex-col gap-2"
              >
                <span className="font-medium text-gray-800">{task.task_name}</span>
                <span className="text-sm text-gray-500">
                  {task.type === "one_time"
                    ? new Date(task.date_time).toLocaleString()
                    : "Repeats on: " +
                      Object.entries(task.repeat_days || {})
                        .filter(([_, v]) => v)
                        .map(([d]) => d.slice(0, 3))
                        .join(", ")}
                </span>

                {/* ✅ Delete button */}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="self-end px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

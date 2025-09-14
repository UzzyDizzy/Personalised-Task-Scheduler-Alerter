"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs";
import NotificationBell from "./NotificationsBell";

export default function NavBar() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user on mount
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <div className="flex gap-6 font-bold text-white text-2xl">
        <h1>Personalised Task Scheduler & Alerter</h1>
      </div>
      <div className="flex gap-6 justify-center items-center">
        <Link href="/tasks">Tasks</Link>
        <Link href="/settings">Settings</Link>
        <NotificationBell />
        <button
        onClick={handleAuth}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded"
      >
        {user ? "Sign Out" : "Login"}
      </button>
      </div>
      
    </nav>
  );
}

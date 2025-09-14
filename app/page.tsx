/*
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { Auth } from '@/components/Auth';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  // Redirect once session is ready
  useEffect(() => {
    if (!loading && session?.user) {
      router.push('/tasks');
    }
  }, [loading, session, router]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {loading ? (
        <h1>Loading ...</h1>
      ) : (
        <Auth />
      )}
    </div>
  );
}
*/

'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
//import { Auth } from '@/components/Auth';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  // Redirect logic
  useEffect(() => {
    if (!loading) {
      if (session?.user) {
        router.push('/tasks'); // logged in → go to tasks
      } else {
        router.push('/login'); // not logged in → go to login
      }
    }
  }, [loading, session, router]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {loading ? <h1>Loading ...</h1> : null}
    </div>
  );
}

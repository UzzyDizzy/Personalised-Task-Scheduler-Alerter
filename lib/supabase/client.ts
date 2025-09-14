"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
//import type { Database } from "@/lib/supabase/types"; // optional: if you generated types

// ✅ This is now your one true client for all client-side code
//export const supabase = createClientComponentClient<Database>();
export const supabase = createClientComponentClient();
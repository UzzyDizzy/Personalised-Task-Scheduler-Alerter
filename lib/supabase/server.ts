import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

//export const supabase = createServerComponentClient<Database>({ cookies });
export const supabase = createServerComponentClient({ cookies });
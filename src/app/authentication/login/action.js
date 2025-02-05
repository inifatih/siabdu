"use server"

import { createClient } from "@/lib/supabase/server";


export async function login(FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log("Response data:", data);
  
  const { error } = await supabase.auth.signInWithPassword(data);
  
  console.log("Response error:", error);
  if (error) {
    return { success: false, error: error.message };
  }

  // Tidak menggunakan redirect di sini
  return { success: true };
}

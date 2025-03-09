"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUser({email, password}) {
  const supabase = await createClient();

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi" };
  }

  // Autentikasi menggunakan Supabase Auth
  const { data, error: error } = await supabase.auth.signInWithPassword({ email, password });
  console.log("user:", data)
  if (error) {
    return { success: false, error: "Password salah atau akun tidak valid" };
  }

  return { success: true};
}

export const fetchUserProfile = async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return { success: false, email: null, message: "Gagal mendapatkan informasi pengguna." };
  }

  return { success: true, email: user?.email || "", user_id: user?.id || "" };
};

// Fungsi logout yang mengeluarkan user dari aplikasi
export const logoutUser = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error);
    return { success: false, error: error.message };
  }

  return { success: true, message: "Logout berhasil" };
}

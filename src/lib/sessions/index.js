"use server";

import { createClient } from "../supabase/server";

export async function getLoggedInUser() {
    const supabase = createClient();
  
    // Mendapatkan informasi user saat ini
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("user loggin ",user);
  
    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }
    return user;
}

const user_id = user.id

export async function getUserById(user_id) {
    const supabase = createClient();
  
    // Query tabel Users berdasarkan ID
    const { data, error } = await supabase
      .from('Users')  // Nama tabel yang ingin Anda query
      .select('*')    // Pilih semua kolom yang dibutuhkan
      .eq('id', user_id); // Kondisi pencarian berdasarkan ID
  
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;  // Mengembalikan null jika terjadi error
    }
  
    return data;  // Mengembalikan data pengguna yang ditemukan
  }
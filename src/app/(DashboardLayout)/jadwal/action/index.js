"use server";
import { createClient } from "@/lib/supabase/server";

export const addJadwal = async (user_id, judul, deskripsi, notifikasi, tanggalJadwal) => {
  const supabase = await createClient()

  const { data: jadwal, error: errorJadwal } = await supabase
    .from("jadwal")
    .insert([{ 
      user_id, judul, deskripsi, notifikasi, tanggalJadwal }]);
  if (errorJadwal) throw errorJadwal;
  return data;
};

export const fetchJadwal = async (user_id) => {
  console.log(`Fetching jadwal for user ${user_id}...`);

  const supabase = await createClient();

  const { data: jadwal, error } = await supabase
    .from("jadwal")
    .select("id, created_at, tanggalJadwal, judul, deskripsi, notifikasi")
    .eq("user_id", user_id)
    .order("tanggalJadwal", { ascending: true });

  if (error) {
    console.error("Error fetching jadwal:", error);
    return { success: false, data: [], message: "Gagal mendapatkan data jadwal." };
  }

  return { success: true, data: jadwal || [], message: "Data jadwal berhasil diambil." };
};


export const updateJadwal = async (id, user_id, judul, updates) => {
  const supabase = await createClient()

  const { data: jadwal, error: jadwalError } = await supabase
    .from("jadwal")
    .update({ judul, deskripsi, notifikasi, tanggalJadwal })
    .eq("id", user_id)
    .eq("id", id);
  if (errorJadwal) throw errorJadwal;
  return data;
};

export const deleteJadwal = async (jadwal_id, user_id) => {
  const { error } = await supabase
    .from('jadwal')
    .delete()
    .eq('id', jadwal_id)
    .eq('user_id', user_id);

  if (error) throw error;
};


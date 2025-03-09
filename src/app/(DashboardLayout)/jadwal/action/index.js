"use server";
import { createClient } from "@/lib/supabase/server";

export const addJadwal = async (user_id, title, description, tanggalJadwal) => {
  const supabase = await createClient();
  try {
    const { data: jadwal, error } = await supabase
      .from('jadwal')
      .insert([{ 
        user_id: user_id, 
        judul: title, 
        deskripsi: description, 
        tanggalJadwal: tanggalJadwal 
      }])
      .select(); // Pastikan data dikembalikan

    if (error) {
      console.error("Error inserting jadwal:", error);
      return { success: false, data: [], message: error.message };
    }

    return { success: true, data: jadwal };
  } catch (error) {
    console.error("An error occurred while adding jadwal:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const fetchJadwal = async (user_id) => {

  const supabase = await createClient();

  const { data: jadwal, error } = await supabase
    .from("jadwal")
    .select("id, created_at, tanggalJadwal, judul, deskripsi")
    .eq("user_id", user_id)
    .order("tanggalJadwal", { ascending: true });

  if (error) {
    console.error("Error fetching jadwal:", error);
    return { success: false, data: [], message: error.message };
  }

  return { success: true, data: jadwal || [], message: "Data jadwal berhasil diambil." };
};


export const updateJadwal = async (id, user_id, updates) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("jadwal")
      .update(updates) // Menggunakan `updates` agar fleksibel
      .eq("id", id) // Pastikan hanya update berdasarkan ID
      .eq("user_id", user_id) // Pastikan event milik user yang sesuai
      .select(); // Pastikan hasil update dikembalikan

    if (error) throw error; // Tangani error jika ada

    return { success: true, data }; // Kembalikan data yang diperbarui
  } catch (error) {
    console.error("Error updating jadwal:", error);
    return { success: false, message: error.message };
  }
};

// Fungsi Delete Jadwal
export const deleteJadwal = async (id, user_id) => {
  const supabase = await createClient();
  try {
    // Hapus jadwal berdasarkan id dan user_id
    const { data, error } = await supabase
      .from("jadwal")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id)
      .select(); // Mengembalikan data yang dihapus

    if (error) throw error;

    if (!data || data.length === 0) {
      console.error("Jadwal tidak ditemukan atau sudah dihapus.");
      return { success: false, message: "Jadwal tidak ditemukan atau sudah terhapus." };
    }

    return { success: true, message: "Jadwal berhasil dihapus.", deletedData: data };
  } catch (error) {
    console.error("Error deleting jadwal:", error);
    return { success: false, message: error.message };
  }
};


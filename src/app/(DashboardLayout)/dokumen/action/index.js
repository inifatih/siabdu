"use server";
import { createClient } from "@/lib/supabase/server";

// Fetch data skrining
export const fetchSkriningData = async (pageIndex = 0, pageSize = 10) => {
  const supabase = await createClient();

  // Hitung batas range untuk pagination
  const start = pageIndex * pageSize;
  const end = start + pageSize - 1;

  // Mendapatkan data dari tabel identitasAnak
  const { data: identitasAnak, error: identitasAnakError } = await supabase
    .from("identitasAnak")
    .select(id, namaAnak, namaOrangtua, nomorTelepon, tanggalSkrining, usia, lokasi, ketLokasi)
    .order("created_at", {ascending: false})
    .range(start, end);

  if (identitasAnakError) {
    console.error("Error fetching identitasAnak:", identitasAnakError);
    return { success: false, data: null, message: "Gagal mendapatkan data identitas anak." };
  }

  // Hitung total jumlah data untuk pagination
  const { count, error: countError } = await supabase
    .from("identitasAnak")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Error fetching total count:", countError);
    return { success: false, data: null, message: "Gagal mendapatkan jumlah data." };
  }

  return { success: true, data: identitasAnak, totalCount: count, message: "Data berhasil diambil." };
};

// Mencari berdasarkan nama
export const getSkriningbyName = async (searchQuery, start, end) => {
  const supabase = await createClient();

  const { data: identitasAnak, error: identitasAnakError } = await supabase
    .from("identitasAnak")
    .select(`id, namaAnak, namaOrangtua, nomorTelepon, tanggalSkrining, usia, lokasi, ketLokasi`)
    .order("created_at", {ascending: false})
    .range(start, end)
    .ilike("namaAnak", `%${searchQuery}%`); // Apply filter for child name

  if (identitasAnakError) {
    console.error("Error fetching identitasAnak:", identitasAnakError);
    return { success: false, data: null, message: "Gagal mendapatkan data identitas anak." };
  }

  return { success: true, data: identitasAnak };
}

// Mencari berdasarkan lokasi
export const getSkriningbyLokasi = async (lokasiQuery, start, end) => {
  const supabase = await createClient();

  const { data: identitasAnak, error: identitasAnakError } = await supabase
    .from("identitasAnak")
    .select(`id, namaAnak, namaOrangtua, nomorTelepon, tanggalSkrining, usia, lokasi, ketLokasi`)
    .order("created_at", {ascending: false})
    .range(start, end)
    .ilike("lokasi", `%${lokasiQuery}%`); // Apply filter for lokasi

  if (identitasAnakError) {
    console.error("Error fetching identitasAnak:", identitasAnakError);
    return { success: false, data: null, message: "Gagal mendapatkan data berdasarkan lokasi." };
  }

  return { success: true, data: identitasAnak };
}

"use server";
import { createClient } from "@/lib/supabase/server";

export const fetchSkriningData = async ({
  pageIndex = 0,
  pageSize = 10,
  filter = "all",      // "all", "name", "lokasi", "tanggal"
  searchValue = "",    // untuk filter nama atau lokasi
  startDate = null,    // untuk filter tanggal (rentang: dari tanggal)
  endDate = null,       // untuk filter tanggal (rentang: sampai tanggal)
  lokasiFilter = "all"
} = {}) => {
  const supabase = await createClient();

  // Hitung batas range untuk lazy loading
  const start = pageIndex * pageSize;
  const end = start + pageSize - 1;

  // Buat query dasar dan sertakan opsi count untuk mendapatkan total data sesuai filter
  let query = supabase
    .from("identitasAnak")
    .select(
      `id, namaAnak, namaOrangtua, nomorTelepon, jenisKelamin, tanggalSkrining, usia, lokasi, ketLokasi, tumbuhKembang(Hasil, ketTumbuhKembang)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Terapkan kondisi filtering berdasarkan tipe filter
  if (searchValue) {
    query = query.or(`namaAnak.ilike.%${searchValue}%,lokasi.ilike.%${searchValue}%`);
  }
  
  // (TANGGAL SKRINING) Jika filter "tanggalSkrining", tidak ada tambahan kondisi
  if (startDate && endDate) {
    query = query
      .gte("tanggalSkrining", startDate)  // mulai dari startDate
      .lte("tanggalSkrining", endDate);   // sampai dengan endDate
  }

  // (LOKASI) Jika filter "all", tidak ada tambahan kondisi
  if (lokasiFilter && lokasiFilter !== "all") {
    query = query.eq("lokasi", lokasiFilter);
  }

  // Terapkan lazy loading
  query = query.range(start, end);

  // Eksekusi query
  try {
    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching skrining data:", error);
      return { success: false, data: null, message: "Gagal mendapatkan data skrining." };
    }

    return { success: true, data, totalCount: count };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, data: null, message: "Terjadi kesalahan yang tidak terduga." };
  }
};

export const fetchTumbuhKembang = async () => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("tumbuhKembang")
      .select("created_at, Hasil");

    if (error) {
      console.error("Error fetching tumbuh kembang data:", error);
      return { success: false, data: null, message: "Gagal mendapatkan data tumbuh kembang." };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, data: null, message: "Terjadi kesalahan yang tidak terduga." };
  }
};

export const deleteData = async (id) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("identitasAnak")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting data:", error);
      return { success: false, message: "Gagal menghapus data." };
    }

    return { success: true, message: "Data berhasil dihapus." };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, message: "Terjadi kesalahan yang tidak terduga." };
  }
};


export const fetchNamaAnakById = async (id) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("identitasAnak")
      .select("namaAnak")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching namaAnak:", error);
      return null; // Jika error, kembalikan null
    }

    return data?.namaAnak || null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};


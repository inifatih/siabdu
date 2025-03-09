"use server";
import { createClient } from "@/lib/supabase/server";

// Fungsi untuk mengambil data anak dan hambatan mereka
export async function fetchHambatan() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("assessment_results")
    .select("identitasAnak_id, jenis_hambatan") // Ambil semua kolom dalam tabel assessment_results
    .order("identitasAnak_id");

  if (error) {
    console.error("Error fetching assessment results:", error);
    return { success: false, data: [] };
  }

  return { success: true, data };
}

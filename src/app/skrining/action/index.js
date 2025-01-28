"use server";
import { createClient } from "@/utils/supabase/server";

export const getSkrining = async (data) => {
    const supabase = await createClient();

    // table identitas anak
    const { data: identitasAnak , error: identitasAnakError } = await supabase
    .from("identitasAnak")
    .insert([{
      namaAnak: data.namaAnak, 
      namaOrtu: data.namaOrtu,
      nomorTelepon: data.nomorTelepon,
      tanggalSkrining: data.tanggalSkrining, 
      usia: data.usia,
      lokasi: data.lokasi,
      ketLokasi: data.ketLokasi
    }]);

    if (identitasAnakError) {
      console.error("Error inserting into identitasAnak:", identitasAnakError);
      return { success: false, message: "Gagal menyimpan data identitas anak." }; // Return failure message
    }

    // table tumbuh kembang anak
    const { data: tumbuhKembang , error: tumbuhKembangError } = await supabase
    .from("tumbuhKembang")
    .insert([{
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q5: data.q5,
      q6: data.q6,
      identitasAnakId: identitasAnak.id
    }]);

    if (tumbuhKembangError) {
      console.error("Error inserting into tumbuhKembang:", tumbuhKembangError);
      return { success: false, message: "Gagal menyimpan data tumbuh kembang anak." };
    }
  
    return { success: true, message: "Data Anak Berhasil Disimpan!" }; // Return success message
  }

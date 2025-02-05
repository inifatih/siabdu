"use server";
import { createClient } from "@/lib/supabase/server";

export const getSkrining = async (data) => {
  console.log("tereksekusi")

    const supabase = await createClient();

    // table identitas anak
    const { data: identitasAnak , error: identitasAnakError } = await supabase
    .from("identitasAnak")
    .insert([{
      namaAnak: data.namaAnak, 
      namaOrangtua: data.namaOrangtua,
      jenisKelamin: data.jenisKelamin, 
      usia: data.usia,
      nomorTelepon: data.nomorTelepon,
      tanggalSkrining: data.tanggalSkrining,
      lokasi: data.lokasi,
      ketLokasi: data.ketLokasi
    }])
    .select();


    const identitasAnakId = identitasAnak.id;

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
      identitasAnak_id: identitasAnakId
    }]);

    if (tumbuhKembangError) {
      console.error("Error inserting into tumbuhKembang:", tumbuhKembangError);
      return { success: false, message: "Gagal menyimpan data tumbuh kembang anak." };
    }

    return { success: true, message: "Data Anak Berhasil Disimpan!" }; // Return success message
  }

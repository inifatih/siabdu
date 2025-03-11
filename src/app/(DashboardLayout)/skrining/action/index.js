"use server";
import { createClient } from "@/lib/supabase/server";

export const getSkrining = async (data) => {

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

    const identitasAnakId = identitasAnak?.[0]?.id;

    if (identitasAnakError) {
      console.error("Error inserting into identitasAnak:", identitasAnakError);
      return { success: false, message: "Gagal menyimpan data identitas anak." }; // Return failure message
    }

    // table kondisi pendengaran anak
    const { data: kondisiPendengaran , error: kondisiPendengaranError } = await supabase
    .from("kondisiPendengaran")
    .insert([{
      telingaKanan: data.telingaKanan,
      telingaKiri: data.telingaKiri,
      respon: data.respon,
      ketTelinga:data.ketTelinga,
      identitasAnak_id: identitasAnakId
    }]);

    if( kondisiPendengaranError) {
      console.error("Error inserting into kondisiPendengaran:", kondisiPendengaranError);
      return { success: false, message: "Gagal menyimpan data kondisi pendengaran anak." };
    } 

    // table tumbuh kembang anak
    const { data: tumbuhKembang , error: tumbuhKembangError } = await supabase
    .from("tumbuhKembang")
    .insert([{
      Gerakan_Motorik_Kasar: data.p1,
      Gerakan_Motorik_Halus: data.p2,
      Pengamatan: data.p3,
      Bicara: data.p4,
      Sosialisasi: data.p5,
      Hasil: data.Hasil,
      ketTumbuhKembang: data.ketTumbuhKembang,
      identitasAnak_id: identitasAnakId
    }]);

    if (tumbuhKembangError) {
      console.error("Error inserting into tumbuhKembang:", tumbuhKembangError);
      return { success: false, message: "Gagal menyimpan data tumbuh kembang anak." };
    }

    // // table kebutuhan khusus anak
    // const { data: kebutuhanKhusus , error: kebutuhanKhususError } = await supabase
    // .from("kebutuhanKhusus")
    // .insert([{
    //   k1: data.k1,
    //   k2: data.k2,
    //   k3: data.k3,
    //   k4: data.k4,
    //   k5: data.k5,
    //   k6: data.k6,
    //   identitasAnak_id: identitasAnakId
    // }]);

    // if (kebutuhanKhususError) {
    //   console.error("Error inserting into kebutuhanKhusus:", kebutuhanKhususError);
    //   return { success: false, message: "Gagal menyimpan data kebutuhan khusus anak." };
    // }

  return { success: true, message: "Data Anak Berhasil Disimpan!"}; // Return success message
}

export const fetchSkriningById = async (skriningId) => {
  const supabase = await createClient();

  try {
    // Query data secara paralel
    const [identitasAnakRes, kondisiPendengaranRes, tumbuhKembangRes] = await Promise.all([
      supabase.from("identitasAnak").select("*").eq("id", skriningId).single(),
      supabase.from("kondisiPendengaran").select("*").eq("identitasAnak_id", skriningId).single(),
      supabase.from("tumbuhKembang").select("*").eq("identitasAnak_id", skriningId).single(),
    ]);

    // Jika ada error di salah satu query, kembalikan error
    if (identitasAnakRes.error || kondisiPendengaranRes.error || tumbuhKembangRes.error) {
      console.error("Error fetching data:", {
        identitasAnakError: identitasAnakRes.error,
        kondisiPendengaranError: kondisiPendengaranRes.error,
        tumbuhKembangError: tumbuhKembangRes.error,
      });
      return { success: false, message: "Gagal mengambil data. Pastikan data terkait sudah ada." };
    }

    // Mapping data agar sesuai dengan defaultValues form
    const formData = {
      namaAnak: identitasAnakRes.data?.namaAnak || "",
      namaOrangtua: identitasAnakRes.data?.namaOrangtua || "",
      jenisKelamin: identitasAnakRes.data?.jenisKelamin || "",
      nomorTelepon: identitasAnakRes.data?.nomorTelepon || "",
      usia: identitasAnakRes.data?.usia || "",
      tanggalSkrining: identitasAnakRes.data?.tanggalSkrining || "",
      lokasi: identitasAnakRes.data?.lokasi || "",
      ketLokasi: identitasAnakRes.data?.ketLokasi || "",

      telingaKanan: kondisiPendengaranRes.data?.telingaKanan ?? null,
      telingaKiri: kondisiPendengaranRes.data?.telingaKiri ?? null,
      respon: kondisiPendengaranRes.data?.respon || "",
      ketTelinga: kondisiPendengaranRes.data?.ketTelinga || "",

      p1: tumbuhKembangRes.data?.Gerakan_Motorik_Kasar ?? null,
      p2: tumbuhKembangRes.data?.Gerakan_Motorik_Halus ?? null,
      p3: tumbuhKembangRes.data?.Pengamatan ?? null,
      p4: tumbuhKembangRes.data?.Bicara ?? null,
      p5: tumbuhKembangRes.data?.Sosialisasi ?? null,
      Hasil: tumbuhKembangRes.data?.Hasil || "",
      ketTumbuhKembang: tumbuhKembangRes.data?.ketTumbuhKembang || "",
    };

    return { success: true, data: formData, message: "Data Anak Berhasil Diload!" };
  } catch (error) {
    console.error("Unexpected error fetching skrining data:", error);
    return { success: false, message: "Terjadi kesalahan saat mengambil data skrining." };
  }
};

export const updateSkrining = async (data, skriningId) => {
  // Pastikan data.id tersedia (ID record di tabel identitasAnak)
  const identitasAnakId = skriningId

  if (!identitasAnakId) {
    return { success: false, message: "ID tidak ditemukan untuk update data skrining." };
  }
  
  const supabase = await createClient();

  try {
    // Update tabel identitasAnak
    const { error: errorIdentitas } = await supabase
      .from("identitasAnak")
      .update({
        namaAnak: data.namaAnak,
        namaOrangtua: data.namaOrangtua,
        jenisKelamin: data.jenisKelamin,
        nomorTelepon: data.nomorTelepon,
        usia: data.usia,
        tanggalSkrining: data.tanggalSkrining,
        lokasi: data.lokasi,
        ketLokasi: data.ketLokasi,
      })
      .eq("id", identitasAnakId);

    if (errorIdentitas) {
      console.error("Error updating identitasAnak:", errorIdentitas);
      return { success: false, message: "Gagal mengupdate data identitas anak." };
    }

    // Update tabel kondisiPendengaran (menggunakan foreign key identitas_anak_id)
    const { error: errorKondisi } = await supabase
      .from("kondisiPendengaran")
      .update({
        telingaKanan: data.telingaKanan,
        telingaKiri: data.telingaKiri,
        respon: data.respon,
        ketTelinga: data.ketTelinga,
      })
      .eq("identitasAnak_id", identitasAnakId);

    if (errorKondisi) {
      console.error("Error updating kondisiPendengaran:", errorKondisi);
      return { success: false, message: "Gagal mengupdate data kondisi pendengaran." };
    }

    // Update tabel tumbuhKembang
    const { error: errorTumbuh } = await supabase
      .from("tumbuhKembang")
      .update({
        Gerakan_Motorik_Kasar: data.p1,
        Gerakan_Motorik_Halus: data.p2,
        Pengamatan: data.p3,
        Bicara: data.p4,
        Sosialisasi: data.p5,
        Hasil: data.Hasil,
        ketTumbuhKembang: data.ketTumbuhKembang,
      })
      .eq("identitasAnak_id", identitasAnakId);

    if (errorTumbuh) {
      console.error("Error updating tumbuhKembang:", errorTumbuh);
      return { success: false, message: "Gagal mengupdate data tumbuh kembang." };
    }

    return { success: true, message: "Data skrining berhasil diupdate!" };
  } catch (error) {
    console.error("Unexpected error updating skrining:", error);
    return { success: false, message: "Terjadi kesalahan saat mengupdate data skrining." };
  }
};



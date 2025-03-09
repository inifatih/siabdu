"use server";
import { createClient } from "@/lib/supabase/server";

export const insertPendengaran = async (identitasAnak_id, skor1, skor2) => {
  const supabase = await createClient();

  if (!identitasAnak_id || skor1 === undefined || skor2 === undefined) {
    return { error: "Data tidak lengkap. Mohon pastikan semua data terisi." };
  }

  // Menentukan hasil berdasarkan skor
  const hasil1 = skor1 >= 100 ? "Tunarungu Berat/Menyeluruh" : "Tidak teridentifikasi";
  const hasil2 = skor2 >= 100 ? "Tunarungu Sedang/Sebagian" : "Tidak teridentifikasi";

  try {
    // ✅ Insert ke assessment_categories
    const { data: categoryData, error: categoryError } = await supabase
      .from("assessment_categories")
      .insert([
        { kategori: "Tunarungu Berat/Menyeluruh", hasil: hasil1, skor: skor1 },
        { kategori: "Tunarungu Sedang/Sebagian", hasil: hasil2, skor: skor2 },
      ])
      .select();

    if (categoryError) throw new Error(`Gagal insert assessment_categories: ${categoryError.message}`);

    // ✅ Pastikan categoryData adalah array sebelum memanggil .map()
    if (!categoryData || !Array.isArray(categoryData) || categoryData.length < 2) {
      throw new Error("Gagal mendapatkan ID dari assessment_categories.");
    }

    const categoryIds = categoryData.map((cat) => cat.id);

    // ✅ Insert ke assessment_results
    const { data: resultData, error: resultError } = await supabase
      .from("assessment_results")
      .insert([
        {
          identitasAnak_id,
          jenis_hambatan: "pendengaran",
          hasil: `Tunarungu Berat/Menyeluruh: ${hasil1}, Tunarungu Sedang/Sebagian: ${hasil2}`,
          skor: skor1 + skor2,
        },
      ])
      .select()
      .single();

    if (resultError) throw new Error(`Gagal insert assessment_results: ${resultError.message}`);

    // ✅ Ambil ID hasil assessment_results
    if (!resultData || !resultData.id) {
      throw new Error("Gagal mendapatkan ID dari assessment_results.");
    }

    const resultId = resultData.id;

    // ✅ Insert ke assessment_results_categories
    const relations = categoryIds.map((categoryId) => ({
      assessment_results_id: resultId,
      assessment_categories_id: categoryId,
    }));

    const { error: relationError } = await supabase
      .from("assessment_results_categories")
      .insert(relations);

    if (relationError) throw new Error(`Gagal insert assessment_results_categories: ${relationError.message}`);

    // ⬇️ Tambahkan update assessment_categories untuk menuliskan assessment_results_id
    const { data: updatedCategories, error: updateCatError } = await supabase
      .from("assessment_categories")
      .update({ assessment_results_id: resultId })
      .in("id", categoryIds)
      .select();

    if (updateCatError) {
      throw new Error(`Gagal update assessment_categories: ${updateCatError.message}`);
    }

  return { message: "Data berhasil dimasukkan", resultData };  } catch (err) {
    console.error("Error inserting pendengaran:", err.message);
    return { error: err.message };
  }
};

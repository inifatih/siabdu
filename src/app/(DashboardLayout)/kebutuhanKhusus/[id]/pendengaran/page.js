"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { insertPendengaran } from "./action";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pertanyaanBeratMenyeluruh = [
    { id: "p1", text: "Tidak memahami perintah (bicara sangat keras/teriak)", bobot: 100 },
    { id: "p2", text: "Ucapan kata tidak jelas dan sulit dipahami", bobot: 100 },
  ];
  
const pertanyaanSedangSebagian = [
  { id: "p3", text: "Tidak memahami perintah dalam jarak lebih 1 meter", bobot: 60 },
  { id: "p4", text: "Sering memiringkan kepala dalam usaha mendengar", bobot: 10 },
  { id: "p5", text: "Banyak perhatian terhadap getaran", bobot: 20 },
  { id: "p6", text: "Tidak ada reaksi terhadap bunyi di dekatnya lebih 1 meter", bobot: 60 },
  { id: "p7", text: "Terlambat dalam perkembangan bahasa", bobot: 40 },
  { id: "p8", text: "Sering menggunakan isyarat dalam berkomunikasi", bobot: 40 },
  { id: "p9", text: "Kurang atau tidak tanggap bila diajak bicara", bobot: 20 },
];

export default function FormPendengaran({ params }) {
  const router = useRouter();

  const form = useForm({ 
    defaultValues: pertanyaanBeratMenyeluruh.concat(pertanyaanSedangSebagian).reduce((acc, q) => {
      acc[q.id] = ""; // Default value untuk menghindari null/undefined
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;    

  const [totalBerat, setTotalBerat] = useState(0);
  const [totalSedang, setTotalSedang] = useState(0);
  const [hasilBerat, setHasilBerat] = useState("Tidak teridentifikasi");
  const [hasilSedang, setHasilSedang] = useState("Tidak teridentifikasi");

  // Menghitung hasil berdasarkan pilihan user
  useEffect(() => {
    let sumBerat = pertanyaanBeratMenyeluruh.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
    let sumSedang = pertanyaanSedangSebagian.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
  
    setTotalBerat(sumBerat);
    setTotalSedang(sumSedang);
  
    setHasilBerat(sumBerat >= 100 ? "Tunarungu Berat/Menyeluruh" : "Tidak teridentifikasi");
    setHasilSedang(sumSedang >= 100 ? "Tunarungu Sebagian" : "Tidak teridentifikasi");
  }, [...pertanyaanBeratMenyeluruh.map(q => watch(q.id)), ...pertanyaanSedangSebagian.map(q => watch(q.id))]); 
  // Memastikan useEffect hanya berjalan saat jawaban berubah  

  const onSubmit = async () => {
    const id = Number(params.id);

    // Validasi: Pastikan semua pertanyaan terisi
    const unanswered = pertanyaanBeratMenyeluruh.concat(pertanyaanSedangSebagian).some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }
      
    // Pastikan kita mengambil skor dari state terbaru
    const identitasAnak_id = id;
    const skor1 = totalBerat; // Gunakan state totalBerat
    const skor2 = totalSedang; // Gunakan state totalSedang
  
    if (!identitasAnak_id || skor1 === undefined || skor2 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }
  
    const response = await insertPendengaran(identitasAnak_id, skor1, skor2);
  
    if (response?.resultData) {
      toast.success("Data berhasil dimasukkan", {
        onClose: () => router.push('/kebutuhanKhusus'), // Reload setelah toast ditutup
      });
    } else {
      toast.error(response?.error || "Terjadi kesalahan saat memasukkan data"); // Show error toast
    }
  };  
  
  return (
    <div>
      <Breadcrumb className="pb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/kebutuhanKhusus">Kebutuhan Khusus</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => router.back()} className="cursor-pointer">Pilih Hambatan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hambatan Pendengaran</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Hambatan Pendengaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="font-semibold mb-2">Kategori Buta</h3>
              {pertanyaanBeratMenyeluruh.map((q, index) => (
                <FormField
                  key={q.id}
                  name={q.id}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{index + 1}. {q.text} (Bobot: {q.bobot})</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {["iya", "tidak"].map((value, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={value}
                                className={`w-6 h-6 rounded-full border transition-all duration-200 
                                  ${watch(q.id) === value 
                                    ? value === "iya" 
                                      ? "bg-green-500 hover:bg-gray-500 active:bg-green-600 text-white" 
                                      : "bg-red-500 hover:bg-gray-500 active:bg-red-600 text-white" 
                                    : "bg-gray-200 hover:bg-gray-400"}
                                `}
                              />
                              <FormLabel className="font-normal">{value.charAt(0).toUpperCase() + value.slice(1)}</FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <h3 className="font-semibold mt-4 mb-2">Kategori Low Vision</h3>
              {pertanyaanSedangSebagian.map((q, index) => (
                <FormField
                  key={q.id}
                  name={q.id}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{index + 3}. {q.text} (Bobot: {q.bobot})</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {["iya", "tidak"].map((value, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={value}
                                className={`w-6 h-6 rounded-full border transition-all duration-200 
                                  ${watch(q.id) === value 
                                    ? value === "iya" 
                                      ? "bg-green-500 hover:bg-gray-500 active:bg-green-600 text-white" 
                                      : "bg-red-500 hover:bg-gray-500 active:bg-red-600 text-white" 
                                    : "bg-gray-200 hover:bg-gray-400"}
                                `}
                              />
                              <FormLabel className="font-normal">{value.charAt(0).toUpperCase() + value.slice(1)}</FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                <p className="font-bold">Hasil Akhir:</p>
                <p>Total Bobot Kategori Berat: <span className="font-semibold">{totalBerat}</span></p>
                <p>Status Kategori Berat: <span className="font-semibold text-blue-600">{hasilBerat}</span></p>
                <p>Total Bobot Kategori Sedang: <span className="font-semibold">{totalSedang}</span></p>
                <p>Status Kategori Sedang: <span className="font-semibold text-blue-600">{hasilSedang}</span></p>
              </div>

              <Button type="submit" className="mt-4 bg-blue-500 hover:bg-gray-500 active:bg-blue-700 transition-all duration-200">
                Simpan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ToastContainer/>
    </div>
  );
}
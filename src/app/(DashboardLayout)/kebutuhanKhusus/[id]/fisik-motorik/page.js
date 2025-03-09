"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { insertFisikMotorik } from "./action";

const pertanyaanFisikMotorik = [
    { id: "p1", text: "Anggota gerak tubuh kaku/lemah/lumpuh", bobot: 100 },
    { id: "p2", text: "Terdapat bagian anggota gerak yang berbeda dari biasa (lebih kecil/besar/panjang/pendek)", bobot: 100 },
    { id: "p3", text: "Terdapat anggota tubuh yang tremor/ bergerak-gerak terus menerus tidak terkendali", bobot: 100 },
    { id: "p4", text: "Gangguan koordinasi gerak", bobot: 100 },
    { id: "p5", text: "Kehilangan/ketidaksempuran sebagian anggota tubuh", bobot: 100 }
  ];

export default function FormEmosional({ params }) {
  const router = useRouter();

  const form = useForm({ 
    defaultValues: pertanyaanFisikMotorik.reduce((acc, q) => {
      acc[q.id] = ""; // Default value untuk menghindari null/undefined
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;    

  const [totalFisikMotorik, setTotalFisikMotorik] = useState(0);
  const [hasilFisikMotorik, setHasilFisikMotorik] = useState("Tidak teridentifikasi");

  // Menghitung hasil berdasarkan pilihan user
  useEffect(() => {
    let sum = pertanyaanFisikMotorik.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
  
    setTotalFisikMotorik(sum);
  
    setHasilFisikMotorik(sum >= 100 ? "Diduga Autis" : "Tidak teridentifikasi");
  }, [...pertanyaanFisikMotorik.map(q => watch(q.id))]); 
  // Memastikan useEffect hanya berjalan saat jawaban berubah  

  const onSubmit = async () => {
    const id = Number(params.id);

    // Validasi: Pastikan semua pertanyaan terisi
    const unanswered = pertanyaanFisikMotorik.some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }
      
    // Pastikan kita mengambil skor dari state terbaru
    const identitasAnak_id = id;
    const skor1 = totalFisikMotorik; 
  
    if (!identitasAnak_id || skor1 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }
  
    const response = await insertFisikMotorik(identitasAnak_id, skor1);
  
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
            <BreadcrumbPage>Hambatan Fisik Motorik</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Fisik Motorik</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {pertanyaanFisikMotorik.map((q, index) => (
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

              <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                <p className="font-bold">Hasil Akhir:</p>
                <p>Total Bobot Fisik Motorik: <span className="font-semibold">{totalFisikMotorik}</span></p>
                <p>Status Fisik Motorik: <span className="font-semibold text-blue-600">{hasilFisikMotorik}</span></p>
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
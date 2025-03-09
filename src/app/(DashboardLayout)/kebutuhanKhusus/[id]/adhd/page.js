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
import { insertADHD } from "./action";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pertanyaanADHD = [
    { id: "p1", text: "Tangan dan kaki sering tidak bisa diam", bobot: 10 },
    { id: "p2", text: "Sering meninggalkan tempat duduk", bobot: 17 },
    { id: "p3", text: "Sering berlari atau memanjat berlebihan dalam situasi yang tidak sesuai", bobot: 17 },
    { id: "p4", text: "Sering kesulitan bermain dengan tenang", bobot: 17 },
    { id: "p5", text: `Sering dalam keadaan "siap bergerak"`, bobot: 17 },
    { id: "p6", text: "Sering bicara berlebihan", bobot: 17 },
    { id: "p7", text: "Sering melontarkan jawaban sebelum pertanyaan selesai ditanyakan", bobot: 17 },
    { id: "p8", text: "Sering sulit menunggu antrian", bobot: 17 },
    { id: "p9", text: "Sering menyela atau memaksakan diri terhadap orang lain", bobot: 17 },
    { id: "p10", text: "Sering membuat kesalahan pada hal kecil (ceroboh)", bobot: 17 },
    { id: "p11", text: "Sering sulit mempertahankan perhatian", bobot: 17 },
    { id: "p12", text: "Sering seperti tidak mendengarkan saat diajak bicara langsung", bobot: 17 },
    { id: "p13", text: "Sering gagal menyelesaikan pekerjaan", bobot: 17 },
    { id: "p14", text: "Sering sulit mengatur tugas dan kegiatan", bobot: 17 },
    { id: "p15", text: "Sering enggan terlibat dalam tugas yang memerlukan ketekunan", bobot: 17 },
    { id: "p16", text: "Sering menghilangkan benda yang diperlukan untuk melakukan tugas", bobot: 17 },
    { id: "p17", text: "Sering mudah teralih perhatian oleh rangsangan dari luar", bobot: 17 },
    { id: "p18", text: "Sering lupa dalam kegiatan sehari-hari", bobot: 17 },
  ];

export default function FormPendengaran({ params }) {
  const router = useRouter();

  const form = useForm({ 
    defaultValues: pertanyaanADHD.reduce((acc, q) => {
      acc[q.id] = ""; // Default value untuk menghindari null/undefined
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;    

  const [totalADHD, setTotalADHD] = useState(0);
  const [hasilADHD, setHasilADHD] = useState("Tidak teridentifikasi");

  // Menghitung hasil berdasarkan pilihan user
  useEffect(() => {
    let sum = pertanyaanADHD.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
  
    setTotalADHD(sum);
  
    setHasilADHD(sum >= 100 ? "Diduga ADHD" : "Tidak teridentifikasi");
  }, [...pertanyaanADHD.map(q => watch(q.id))]); 
  // Memastikan useEffect hanya berjalan saat jawaban berubah  

  const onSubmit = async () => {
    const id = Number(params.id);

    // Validasi: Pastikan semua pertanyaan terisi
    const unanswered = pertanyaanADHD.some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }
      
    // Pastikan kita mengambil skor dari state terbaru
    const identitasAnak_id = id;
    const skor1 = totalADHD; 
  
    if (!identitasAnak_id || skor1 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }
  
    const response = await insertADHD(identitasAnak_id, skor1);
  
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
            <BreadcrumbPage>ADHD</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>ADHD</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {pertanyaanADHD.map((q, index) => (
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
                <p>Total Bobot ADHD: <span className="font-semibold">{totalADHD}</span></p>
                <p>Status ADHD: <span className="font-semibold text-blue-600">{hasilADHD}</span></p>
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
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
import { insertIntelektual } from "./action";

const pertanyaanIntelektual = [
    { id: "p1", text: "Tingkat kecerdasan jauh di bawah normal", bobot: 20 },
    { id: "p2", text: "Mengalami kelambatan dalam segala hal kalau dibandingkan dengan anak-anak normal usia sebaya, baik di tinjau dari psikis, sosial, dan kemampuan fisik", bobot: 20 },
    { id: "p3", text: "Tidak dapat konsentrasi terlalu lama (lekas bosan)", bobot: 20 },
    { id: "p4", text: "Daya abstraksi sangat kurang", bobot: 20 },
    { id: "p5", text: "Perbendaharaan kata sangat terbatas", bobot: 20 },
    { id: "p6", text: "Perilakunya kurang luwes/fleksibel", bobot: 20 },
    { id: "p7", text: "Pikiran, ingatan, kemauan, dan sifat-sifat mental lainnya sedemikian terbelakang kalau dibandingkan dengan anak normal sebaya", bobot: 20 },
    { id: "p8", text: "Jari kaki dan tangan pendek tebal", bobot: 5 },
    { id: "p9", text: "Alis tumbuh mengikuti garis ke atas keluar (Epicantus)", bobot: 5 },
    { id: "p10", text: "Mulut membuka", bobot: 15 },
    { id: "p11", text: "Mulut berair liur", bobot: 15 },
    { id: "p12", text: "Suara datar", bobot: 15 },
    { id: "p13", text: "Bibir tebal", bobot: 5 },
    { id: "p14", text: "Mata sipit ", bobot: 5 },
    { id: "p15", text: "Kepala bagian belakang pipih", bobot: 10 },
    { id: "p16", text: "Rambut tegak kaku kasar", bobot: 15 },
  ];

export default function FormIntelektual({ params }) {
  const router = useRouter();

  const form = useForm({ 
    defaultValues: pertanyaanIntelektual.reduce((acc, q) => {
      acc[q.id] = ""; // Default value untuk menghindari null/undefined
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;    

  const [totalIntelektual, setTotalIntelektual] = useState(0);
  const [hasilIntelektual, setHasilIntelektual] = useState("Tidak teridentifikasi");

  // Menghitung hasil berdasarkan pilihan user
  useEffect(() => {
    let sum = pertanyaanIntelektual.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
  
    setTotalIntelektual(sum);
  
    setHasilIntelektual(sum >= 100 ? "Diduga Autis" : "Tidak teridentifikasi");
  }, [...pertanyaanIntelektual.map(q => watch(q.id))]); 
  // Memastikan useEffect hanya berjalan saat jawaban berubah  

  const onSubmit = async () => {
    const id = Number(params.id);

    // Validasi: Pastikan semua pertanyaan terisi
    const unanswered = pertanyaanIntelektual.some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }
      
    // Pastikan kita mengambil skor dari state terbaru
    const identitasAnak_id = id;
    const skor1 = totalIntelektual; 
  
    if (!identitasAnak_id || skor1 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }
  
    const response = await insertIntelektual(identitasAnak_id, skor1);
  
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
            <BreadcrumbPage>Hambatan Intelektual</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Hambatan Intelektual</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {pertanyaanIntelektual.map((q, index) => (
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
                <p>Total Bobot Intelektual: <span className="font-semibold">{totalIntelektual}</span></p>
                <p>Status Intelektual: <span className="font-semibold text-blue-600">{hasilIntelektual}</span></p>
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
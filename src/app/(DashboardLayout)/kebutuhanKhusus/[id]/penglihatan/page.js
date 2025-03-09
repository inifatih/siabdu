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
import { insertPenglihatan } from "./action";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pertanyaanButa = [
    { id: "p1", text: "Tidak dapat melihat tetapi dapat membedakan sumber cahaya", bobot: 100 },
    { id: "p2", text: "Tidak dapat melihat tetapi dapat memahami bayangan benda", bobot: 100 },
    { id: "p3", text: "Tidak dapat melihat tetapi dapat membedakan benda bergerak", bobot: 100 },
    { id: "p4", text: "Hanya dapat membedakan gelap dan terang", bobot: 100 },
    { id: "p5", text: "Tidak dapat membedakan gelap dan terang", bobot: 100 },
  ];
  
const pertanyaanLowVision = [
  { id: "p6", text: "Kurang melihat (Kabur) tidak mampu menghitung jari asesor dalam jarak 1 meter", bobot: 60 },
  { id: "p7", text: "Kesulitan mengambil benda kecil di dekatnya", bobot: 15 },
  { id: "p8", text: "Tidak dapat menulis mengikuti garis lurus", bobot: 15 },
  { id: "p9", text: "Sering meraba dan tersandung waktu berjalan", bobot: 15 },
  { id: "p10", text: "Bagian bola mata yang hitam berwarna keruh/bersisik/kering", bobot: 15 },
  { id: "p11", text: "Mata bergoyang terus (nistagmus)", bobot: 15 },
  { id: "p12", text: "Peradangan hebat pada kedua bola mata", bobot: 15 },
  { id: "p13", text: "Penglihatan periperal (melihat tepi), yang ditandai dengan kemampuan melihat bagian samping tetapi tidak mampu melihat bagian tengah (fokus)", bobot: 20 },
  { id: "p14", text: "Kemampuan melihat seperti orang menggunakan teropong/sempit", bobot: 20 },
];

export default function FormPenglihatan({ params }) {
  const router = useRouter();

  const form = useForm({ 
    defaultValues: pertanyaanButa.concat(pertanyaanLowVision).reduce((acc, q) => {
      acc[q.id] = ""; // Default value untuk menghindari null/undefined
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;

  const [totalButa, setTotalButa] = useState(0);
  const [totalLowVision, setTotalLowVision] = useState(0);
  const [hasilButa, setHasilButa] = useState("Tidak teridentifikasi");
  const [hasilLowVision, setHasilLowVision] = useState("Tidak teridentifikasi");

  // Menghitung hasil berdasarkan pilihan user
  useEffect(() => {
    let sumButa = pertanyaanButa.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
    let sumLowVision = pertanyaanLowVision.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
  
    setTotalButa(sumButa);
    setTotalLowVision(sumLowVision);
  
    setHasilButa(sumButa >= 100 ? "Buta" : "Tidak teridentifikasi");
    setHasilLowVision(sumLowVision >= 100 ? "Low Vision" : "Tidak teridentifikasi");
  }, [...pertanyaanButa.map(q => watch(q.id)), ...pertanyaanLowVision.map(q => watch(q.id))]); 
  // Memastikan useEffect hanya berjalan saat jawaban berubah  

  const onSubmit = async () => {
    const id = Number(params.id);

    // Validasi: Pastikan semua pertanyaan terisi
    const unanswered = pertanyaanButa.concat(pertanyaanLowVision).some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }
      
    // Pastikan kita mengambil skor dari state terbaru
    const identitasAnak_id = id;
    const skor1 = totalButa; // Gunakan state totalButa
    const skor2 = totalLowVision; // Gunakan state totalLowVision
  
    if (!identitasAnak_id || skor1 === undefined || skor2 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }
  
    const response = await insertPenglihatan(identitasAnak_id, skor1, skor2);
  
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
            <BreadcrumbPage>Hambatan Penglihatan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Hambatan Penglihatan</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="font-semibold mb-2">Kategori Buta</h3>
              {pertanyaanButa.map((q, index) => (
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
              {pertanyaanLowVision.map((q, index) => (
                <FormField
                  key={q.id}
                  name={q.id}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{index + 6}. {q.text} (Bobot: {q.bobot})</FormLabel>
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
                <p>Total Bobot Buta: <span className="font-semibold">{totalButa}</span></p>
                <p>Status Buta: <span className="font-semibold text-blue-600">{hasilButa}</span></p>
                <p>Total Bobot Low Vision: <span className="font-semibold">{totalLowVision}</span></p>
                <p>Status Low Vision: <span className="font-semibold text-blue-600">{hasilLowVision}</span></p>
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
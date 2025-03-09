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
import { insertCIBI } from "./action";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


const pertanyaanCIBI = [
    { id: "p1", text: "Membaca pada usia kurang dari 6 tahun", bobot: 10 },
    { id: "p2", text: "Membaca lebih cepat dan lebih banyak", bobot: 10 },
    { id: "p3", text: "Memiliki perbendaharaan kata yang luas", bobot: 10 },
    { id: "p4", text: "Mempunyai rasa ingin tahu yang kuat", bobot: 10 },
    { id: "p5", text: "Mempunyai minat yang luas, juga terhadap masalah orang dewasa", bobot: 10 },
    { id: "p6", text: "Mempunyai inisitif dan dapat bekerja sendiri", bobot: 10 },
    { id: "p7", text: "Menunjukkan kesalahan (orisinalitas) dalam ungkapan verbal", bobot: 10 },
    { id: "p8", text: "Memberi jawaban, jawaban yang baik", bobot: 10 },
    { id: "p9", text: "Dapat memberikan banyak gagasan", bobot: 10 },
    { id: "p10", text: "Luwes dalam berpikir", bobot: 10 },
    { id: "p11", text: "Terbuka terhadap rangsangan-rangsangan dari lingkungan", bobot: 10 },
    { id: "p12", text: "Mempunyai pengamatan yang tajam", bobot: 10 },
    { id: "p13", text: "Dapat Berkonsentrasi dalam jangka waktu yang panjang terutama dalam tugas atau bidang yang minati", bobot: 10 },
    { id: "p14", text: "Berpikir kritis juga terhadap diri sendiri", bobot: 10 },
    { id: "p15", text: "Senang mencoba hal-hal baru", bobot: 10 },
    { id: "p16", text: "Mempunyai daya abstraksi, konseptualisasi dan sintetis yang tinggi", bobot: 10 },
    { id: "p17", text: "Senang terhadap kegiatan intelektual dan pemecahan masalah-masalah", bobot: 10 },
    { id: "p18", text: "Cepat menangkap hubungan sebab akibat", bobot: 10 },
    { id: "p19", text: "Berprilaku terarah terhadap tujuan", bobot: 10 },
    { id: "p20", text: "Mempunyai daya imajinasi yang kuat", bobot: 10 },
    { id: "p21", text: "Mempunyai banyak kegemaran/hobi", bobot: 10 },
    { id: "p22", text: "Mempunyai daya ingat yang kuat", bobot: 10 },
    { id: "p23", text: "Tidak cepat puas dengan prestasinya", bobot: 10 },
    { id: "p24", text: "Peka (sensitif) serta menggunakan firasat (intuisi)", bobot: 10 },
    { id: "p25", text: "Menginginkan kebebasan dalam gerakan dan tindakan", bobot: 10 },
  ];

export default function FormCIBI({ params }) {
  const router = useRouter();

  const form = useForm({ 
    defaultValues: pertanyaanCIBI.reduce((acc, q) => {
      acc[q.id] = ""; // Default value untuk menghindari null/undefined
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;    

  const [totalCIBI, setTotalCIBI] = useState(0);
  const [hasilCIBI, setHasilCIBI] = useState("Tidak teridentifikasi");

  // Menghitung hasil berdasarkan pilihan user
  useEffect(() => {
    let sum = pertanyaanCIBI.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
  
    setTotalCIBI(sum);
  
    setHasilCIBI(sum >= 100 ? "Diduga Autis" : "Tidak teridentifikasi");
  }, [...pertanyaanCIBI.map(q => watch(q.id))]); 
  // Memastikan useEffect hanya berjalan saat jawaban berubah  

  const onSubmit = async () => {
    const id = Number(params.id);

    // Validasi: Pastikan semua pertanyaan terisi
    const unanswered = pertanyaanCIBI.some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }
      
    // Pastikan kita mengambil skor dari state terbaru
    const identitasAnak_id = id;
    const skor1 = totalCIBI; 
  
    if (!identitasAnak_id || skor1 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }
  
    const response = await insertCIBI(identitasAnak_id, skor1);
  
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
            <BreadcrumbPage>CIBI</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>CIBI</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {pertanyaanCIBI.map((q, index) => (
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
                <p>Total Bobot CIBI: <span className="font-semibold">{totalCIBI}</span></p>
                <p>Status CIBI: <span className="font-semibold text-blue-600">{hasilCIBI}</span></p>
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
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
import { insertKesulitanBelajar } from "./action/index";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pertanyaanDisleksia = [
    { id: "p1", text: "Perkembangan kemampuan membaca  terlambat", bobot: 50 },
    { id: "p2", text: "Kemampuan memahami isi bacaan rendah", bobot: 50 },
    { id: "p3", text: "Sering salah membaca huruf b dengan p, p dengan q, v dengan u, 2 dengan 5, 6 dengan 9, dan sebagainya", bobot: 50 },
  ];
  
const pertanyaanDisgrafia = [
  { id: "p4", text: "Kalau menyali tulisan sering terlambat selesai", bobot: 50 },
  { id: "p5", text: "Sering salah menulis huruf b dengan p, p dengan q, v dengan u, 2 dengan 5, 6 dengan 9, dan sebagainya", bobot: 50 },
  { id: "p6", text: "Tulisannya banyak salah/terbalik/huruf hilang", bobot: 50 },
  { id: "p7", text: "Sulit menulis dengan lurus pada kertas bergaris", bobot: 50 },
];

const pertanyaanDiskalkulia = [
  { id: "p8", text: "Sulit membedakan tanda-tanda: +, -, x, :, <, >, =", bobot: 50 },
  { id: "p9", text: "Sulit mengoperasikan hitungan/bilangan", bobot: 50 },
  { id: "p10", text: "Sering salah membilang dengan urut", bobot: 50 },
  { id: "p11", text: "Sering salah membedakan angka 9 dengan huruf 6, 17 dengan 71, 2 dengan 5, 3 dengan 8, dan sebagainya", bobot: 50 },
  { id: "p12", text: "Sulit membedakan bangun geometri", bobot: 50 },
];

export default function FormKesulitanBelajar({ params }) {
  const router = useRouter();

  const pertanyaanSemua = [...pertanyaanDisleksia, ...pertanyaanDisgrafia, ...pertanyaanDiskalkulia];

  const form = useForm({ 
    defaultValues: pertanyaanSemua.reduce((acc, q) => {
      acc[q.id] = "";
      return acc;
    }, {}) 
  });

  const { control, handleSubmit, watch } = form;

  const [totalDisleksia, setTotalDisleksia] = useState(0); 
  const [totalDisgrafia, setTotalDisgrafia] = useState(0); 
  const [totalDiskalkulia, setTotalDiskalkulia] = useState(0); 

  const [hasilDisleksia, setHasilDisleksia] = useState("Tidak teridentifikasi");
  const [hasilDisgrafia, setHasilDisgrafia] = useState("Tidak teridentifikasi");
  const [hasilDiskalkulia, setHasilDiskalkulia] = useState("Tidak teridentifikasi");

  useEffect(() => {
    let sumDisleksia = pertanyaanDisleksia.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
    let sumDisgrafia = pertanyaanDisgrafia.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);
    let sumDiskalkulia = pertanyaanDiskalkulia.reduce((acc, q) => acc + (watch(q.id) === "iya" ? q.bobot : 0), 0);

    setTotalDisleksia(sumDisleksia);
    setTotalDisgrafia(sumDisgrafia);
    setTotalDiskalkulia(sumDiskalkulia);

    setHasilDisleksia(sumDisleksia >= 100 ? "Disleksia" : "Tidak teridentifikasi");
    setHasilDisgrafia(sumDisgrafia >= 100 ? "Disgrafia" : "Tidak teridentifikasi");
    setHasilDiskalkulia(sumDiskalkulia >= 100 ? "Diskalkulia" : "Tidak teridentifikasi");
  }, [...pertanyaanDisleksia.map(q => watch(q.id)), ...pertanyaanDisgrafia.map(q => watch(q.id)), ...pertanyaanDiskalkulia.map(q => watch(q.id))]); 

  const onSubmit = async () => {
    const id = Number(params.id);

    const unanswered = pertanyaanSemua.some(q => !watch(q.id));
    if (unanswered) {
      toast.error("Harap isi semua pertanyaan sebelum mengirimkan formulir.");
      return;
    }

    const identitasAnak_id = id;
    const skor1 = totalDisleksia
    const skor2 = totalDisgrafia;
    const skor3 = totalDiskalkulia;

    if (!identitasAnak_id || skor1 === undefined || skor2 === undefined || skor3 === undefined) {
      toast.error("Data tidak lengkap. Mohon isi semua bidang.");
      return;
    }

    const response = await insertKesulitanBelajar(identitasAnak_id, skor1, skor2, skor3);

    if (response?.resultData) {
      toast.success("Data berhasil dimasukkan", {
        onClose: () => router.push('/kebutuhanKhusus'),
      });
    } else {
      toast.error(response?.error || "Terjadi kesalahan saat memasukkan data");
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
            <BreadcrumbPage>Kesulitan Belajar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Kesulitan Belajar</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="font-semibold mb-2">Kategori Disleksia</h3>
              {pertanyaanDisleksia.map((q, index) => (
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
              <h3 className="font-semibold mb-2">Kategori Disgrafia</h3>
              {pertanyaanDisgrafia.map((q, index) => (
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
              <h3 className="font-semibold mb-2">Kategori Diskalkulia</h3>
              {pertanyaanDiskalkulia.map((q, index) => (
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
                <p>Total Bobot Disleksia: <span className="font-semibold">{totalDisleksia}</span></p>
                <p>Status Disleksia: <span className="font-semibold text-blue-600">{hasilDisleksia}</span></p>
                <p>Total Bobot Disgrafia: <span className="font-semibold">{totalDisgrafia}</span></p>
                <p>Status Disgrafia: <span className="font-semibold text-blue-600">{hasilDisgrafia}</span></p>
                <p>Total Bobot Diskalkulia: <span className="font-semibold">{totalDiskalkulia}</span></p>
                <p>Status Diskalkulia: <span className="font-semibold text-blue-600">{hasilDiskalkulia}</span></p>
              </div>
              <Button type="submit" className="mt-4 bg-blue-500">Simpan</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ToastContainer/>
    </div>
  );
}
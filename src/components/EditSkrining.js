"use client";

// Import Component and Library
import { isValid } from "date-fns";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    Textarea
} from "@/components/ui/textarea";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

// Data pertanyaan tumbuh kembang berdasarkan usia anak
const questionTB = [
  {usia: 4, p1: "Apakah anak mampu menumpu kedua lengan dan berusaha untuk mengangkat kepala?", p2: "Apakah anak mampu bermain-main dengan kedua tangannya?", p3: "Apakah anak mampu mengamati mainan?", p4: "Apakah anak mampu mendengar suara dan bermain bibir sambil mengeluarkan air liur?", p5: "Apakah anak mampu tersenyum pada ibu?"},
  {usia: 8, p1: "Apakah anak mampu duduk sendiri kemudian mengambil posisi angkang-angkang sambil bertahan sebentar?", p2: "Apakah anak mampu menggenggam mainan dengan seluruh permukaan tangan?", p3: "Apakah anak mampu memperhatikan dan mencari mainan yang jauh?", p4: "Apakah anak mampu mengeluarkan suara: ma... ma... da... da...?", p5: "Apakah anak mampu bermain ciluk ba...?"},
  {usia: 12, p1: "Apakah anak mampu berdiri sendiri dan berjalan sambil berpegangan?", p2: "Apakah anak mampu mengambil benda kecil dengan ujung ibu jari dan jari telunjuk?", p3: "Apakah anak mampu melihat mainan saat digerakkan?", p4: "Apakah anak mampu mengucapkan satu kata atau lebih dan tahu artinya?", p5: "Apakah anak mampu memberikan mainan pada orang lain? Misalnya: ibu dan bapak"},
  {usia: 18, p1: "Apakah anak mampu berdiri tanpa terjatuh?", p2: "Apakah anak mampu menyusun tiga kota mainan?", p3: "Apakah anak mampu menutup gelas atau meletakkan sesuatu sesuai dengan bentuknya?", p4: "Apakah anak mampu mengucapkan 10 kata atau lebih dan tahu artinya?", p5: "Apakah anak mampu menyebutkan namanya jika ditanya?"},
  {usia: 24, p1: "Apakah anak mampu melompat dengan dua kaki sekaligus?", p2: "Apakah anak mampu membuka botol dengan memutar tutupnya?", p3: "Apakah anak mampu menyebutkan 6 bagian tubuh?", p4: "Apakah anak mampu menjawab dan berbicara dengan dua kalimat?", p5: "Apakah anak mampu meniru kegiatan atau gerakan orang lain?"},
  {usia: 36, p1: "Apakah anak mampu turun tangga dengan kaki bergantian tanpa berpegangan?", p2: "Apakah anak mampu meniru garis tegak, garis datar dan lingkaran?", p3: "Apakah anak mampu menyebut tiga warna?", p4: "Apakah anak mampu bertanya dengan memakai kata apa, siapa dimana?", p5: "Apakah anak mampu bermain bersama dengan teman?"},
  {usia: 48, p1: "Apakah anak mampu melompat dengan dua kaki di tempat?", p2: "Apakah anak mampu memegang pensil dengan ujung jari?", p3: "Apakah anak mampu menghitung tiga balok mainan dengan cara menunjuk?", p4: "Apakah anak mampu menggunakan kalimat lengkap?", p5: "Apakah anak mampu bermain bersama dengan teman dalam satu permainan?"},
  {usia: 60, p1: "Apakah anak mampu melompat satu kaki ke arah depan?", p2: "Apakah anak mampu menirukan tanda "+" atau bentuk dasar seperti lingkaran dan kotak?", p3: "Apakah anak mampu menggambar orang?", p4: "Apakah anak mampu bercerita dan bermakna?", p5: "Apakah anak mampu bermain bersama dengan teman dan mengikuti aturan permainan?"},
];

// Final schema using Zod
const formSchema = z.object({
  namaAnak: z.string().nonempty("Nama anak tidak boleh kosong."),
  namaOrangtua: z.string().nonempty("Nama orang tua tidak boleh kosong."),
  jenisKelamin: z.boolean("Jenis kelamin tidak boleh kosong."),
  nomorTelepon: z.string().nonempty("Nomor telepon tidak boleh kosong."),
  usia: z.number().multipleOf(0.01).positive("Usia harus bilangan positif.").nonnegative(),
  tanggalSkrining: z.date({ local: true }),
  lokasi: z.string().nonempty("Lokasi tidak boleh kosong."),
  ketLokasi: z
    .string()
    .max(200, {
      message: "Keterangan lokasi terlalu panjang.",
    }),
  telingaKanan: z.boolean(),
  telingaKiri: z.boolean(),
  ketTelinga: z.string(),
  p1: z.boolean(),
  p2: z.boolean(),
  p3: z.boolean(),
  p4: z.boolean(),
  p5: z.boolean(),
  
  k1: z.boolean().optional(),
  k2: z.boolean().optional(),
  k3: z.boolean().optional(),
  k4: z.boolean().optional(),
  k5: z.boolean().optional(),
  k6: z.boolean().optional(),
})
.superRefine((data, ctx) => {
  const questionKeys = ["p1", "p2", "p3", "p4", "p5"];

  const trueAnswers = questionKeys.filter(key => data[key] === true).length;

  // Jika tumbuh kembang tidak sesuai (jawaban true < 4),
  // maka field k1–k6 wajib diisi.
  if (trueAnswers < 4) {
    ["k1", "k2", "k3", "k4", "k5", "k6"].forEach((key) => {
      if (data[key] === undefined) {
        ctx.addIssue({
          code: "custom",
          // path: [key],
          // message: "Field ini wajib diisi karena tumbuh kembang tidak sesuai.",
        });
      }
    });
  }
});

export default function EditSkrining({ getSkrining }) {

  const [isFormValid, setIsFormValid] = useState(false);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Awalnya hanya tombol cek jawaban yang muncul

  // Validasi form menggunakan variabel methods
  const methods = useForm({
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
    defaultValues: {
      namaAnak: "",
      namaOrangtua: "",
      jenisKelamin:"",
      nomorTelepon: "",
      usia:"",
      tanggalSkrining: "",
      lokasi: "",
      ketLokasi: "",
      telingaKanan: undefined,
      telingaKiri: undefined,
      ketTelinga: "",
      p1: undefined,
      p2: undefined,
      p3: undefined,
      p4: undefined,
      p5: undefined,
      k1: undefined,
      k2: undefined,
      k3: undefined,
      k4: undefined,
      k5: undefined,
      k6: undefined
    },
    
    onError: (errors) => {
    // Handle validation errors
      console.log("Form submission failed with errors: ", errors);
    
      // You can display a toast or alert to the user, or handle the errors in any way
      toast.error("Please fix the errors before submitting.");
    },
  });

  const [selectedAge, setSelectedAge] = useState(4);
  const currentQuestionSet = questionTB.find(
    (question) => question.usia === Number(selectedAge)
  );
  const questionKeys = ["p1", "p2", "p3", "p4", "p5"];

  const handleValidation = () => {
    const answers = methods.getValues();
  
    // Daftar field wajib yang harus diisi
    const requiredFields = [
      "namaAnak",
      "namaOrangtua",
      "jenisKelamin",
      "nomorTelepon",
      "usia",
      "tanggalSkrining",
      "lokasi",
      "ketLokasi",
      "p1",
      "p2",
      "p3",
      "p4",
      "p5"
    ];
  
    // Cek apakah ada field yang belum diisi (null, undefined, atau string kosong)
    const hasNullValues = requiredFields.some(field => {
      const value = answers[field];
      return value === null || value === undefined || value === "";
    });
  
    // Jika ada field yang belum terisi, jangan lakukan pengecekan lanjutan
    if (hasNullValues) {
      setShowAdditionalForm(false);
      toast.error("Silakan lengkapi semua field yang wajib diisi!");
      // Tidak menampilkan toast apapun
      return;
    }
  
    // Jika semua field sudah terisi, lanjutkan pengecekan terhadap 5 pertanyaan tumbuh kembang
    const trueAnswers = questionKeys.filter(key => answers[key] === true).length;
  
    if (trueAnswers >= 4) {
      setIsFormValid(true);
      setShowAdditionalForm(false); // Tidak perlu form tambahan
      toast.success("Tumbuh kembang anak sudah sesuai, bisa langsung disubmit!");
    } else {
      setIsFormValid(false);
      setShowAdditionalForm(true); // Tampilkan form tambahan
      toast.error("Tumbuh kembang anak tidak sesuai, silahkan lengkapi form tambahan!");
    }
    
    setIsChecking(false);
  };
  
  // Submit data melalui form ke dalam tablenya masing-masing
  const onSubmit = async () => {
    const data = methods.getValues();
    const response = await getSkrining(data); // Call the server-side function

    if (response.success) {
      const toastId = toast.success(response.message, {
        onClose: () => window.location.reload(), // Reload setelah toast ditutup
      });

    } else {
      toast.error(response.message); // Show error toast
    }
    console.log(data)
  };

  return (
    <div className="flex-auto h-full">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Identitas Anak */}
          <h2 className="font-bold text-black mb-2">Identitas Anak</h2>
          
          {/* Identitas baris 1 */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="namaAnak"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-gray-600">Nama Anak</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama anak" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="namaOrangtua"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-gray-600">Nama Orang Tua</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama orang tua anak" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Identitas baris 2 */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 py-4">

            {/* Sisi Kiri */}
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                name="jenisKelamin"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-600">Jenis Kelamin</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={String(field.value)}> 
                        <SelectTrigger>
                          <SelectValue placeholder="L/P"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Laki-laki</SelectItem>
                          <SelectItem value="false">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="usia"
                control={methods.control}
                render={({ field }) => (    
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-600">Usia (Bulan)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Usia anak"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="nomorTelepon"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-600">Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="Nomor telepon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sisi Kanan */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="tanggalSkrining"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-600">Tanggal Skrining</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "flex pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <span>
                              {field.value
                                ? format(field.value, "dd/MM/yyyy", { locale:id })
                                : "Pilih tanggal"}
                            </span>
                            <CalendarIcon className="ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={id}
                          selected={field.value}
                          onSelect={(value) => {                      
                            if (value) {
                              const selectedDate = new Date(value);
                              selectedDate.setHours(12, 0, 0, 0); // Set ke 12:00 siang
                              field.onChange(selectedDate);
                              console.log(selectedDate); // Cek apakah masih berubah setelah ini
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lokasi"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-600">Lokasi</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}> 
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Kecamatan A</SelectLabel>
                            <SelectItem value="Buduran">BUDURAN</SelectItem>
                            <SelectItem value="Medaeng">MEDAENG</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan B</SelectLabel>
                            <SelectItem value="Sekardangan">SEKARDANGAN</SelectItem>
                            <SelectItem value="Gedangan">GEDANGAN</SelectItem>
                            <SelectItem value="Ganting">GANTING</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan C</SelectLabel>
                            <SelectItem value="Tanggulangin">TANGGULANGIN</SelectItem>
                            <SelectItem value="Candi">CANDI</SelectItem>
                            <SelectItem value="Sidodadi">SIDODADI</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan D</SelectLabel>
                            <SelectItem value="Sidoarjo">SIDOARJO</SelectItem>
                            <SelectItem value="Urangagung">URANGAGUNG 1</SelectItem>
                            <SelectItem value="Urangagung">URANGAGUNG 2</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan E</SelectLabel>
                            <SelectItem value="Tarik 1">TARIK 1</SelectItem>
                            <SelectItem value="Tarik 2">TARIK 2</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan F</SelectLabel>
                            <SelectItem value="Sedati">SEDATI</SelectItem>
                            <SelectItem value="Tambakrejo">TAMBAKREJO</SelectItem>
                            <SelectItem value="Waru">WARU</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan G</SelectLabel>
                            <SelectItem value="Balongbendo">BALONGBENDO</SelectItem>
                            <SelectItem value="Trosobo">TROSOBO</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan H</SelectLabel>
                            <SelectItem value="Wonokasian">WONOKASIAN</SelectItem>
                            <SelectItem value="Wonoayu">WONOAYU</SelectItem>
                            <SelectItem value="Tulangan">TULANGAN</SelectItem>  
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan I</SelectLabel>
                            <SelectItem value="Kepadangan">KEPADANGAN</SelectItem>
                            <SelectItem value="Prambon">PRAMBON</SelectItem>
                            <SelectItem value="Krembung">KREMBUNG</SelectItem>  
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan J</SelectLabel>
                            <SelectItem value="Krian">KRIAN</SelectItem>
                            <SelectItem value="Barengkrajan">BARENGKRAJAN</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan K</SelectLabel>
                            <SelectItem value="Jabon">JABON</SelectItem>
                            <SelectItem value="Poron">PORON</SelectItem>
                            <SelectItem value="Kedungsolo">KEDUNGSOLO</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Kecamatan L</SelectLabel>
                            <SelectItem value="Sukodono">SUKODONO</SelectItem>
                            <SelectItem value="Taman">TAMAN</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Baris Ketiga */}
          <FormField
            name="ketLokasi"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-sm text-gray-600">Keterangan Lokasi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Keterangan lokasi"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kondisi Pendengaran */}
          <div className="space-y-4 mt-8">
            <h2 className="font-bold text-black pt-8 border-t">Kondisi Pendengaran</h2>

            <FormField
              name="telingaKanan"
              control={methods.control}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Telinga Kiri Bersih?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value)=> field.onChange(value === "iya")}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {/* Opsi 1 */}
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="iya" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Iya
                        </FormLabel>
                      </FormItem>
                      {/* Opsi 2 */}
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tidak" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Tidak
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="telingaKiri"
              control={methods.control}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Telinga Kanan Bersih?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value)=> field.onChange(value === "iya")}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {/* Opsi 1 */}
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="iya" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Iya
                        </FormLabel>
                      </FormItem>
                      {/* Opsi 2 */}
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tidak" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Tidak
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ketTelinga"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-black">Keterangan Kebersihan Telinga</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Keterangan kebersihan telinga"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />            
          </div>

          {/* Dropdown untuk memilih usia anak */}
          <h2 className="font-bold text-black mt-8 border-t pt-8">Pertanyaan Tumbuh Kembang</h2>
          <div className="mt-4">
            <Select onValueChange={(value) => setSelectedAge(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Usia Anak" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Usia anak</SelectLabel>
                  <SelectItem value="4">4 Bulan</SelectItem>
                  <SelectItem value="8">8 Bulan</SelectItem>
                  <SelectItem value="12">12 Bulan</SelectItem>
                  <SelectItem value="18">18 Bulan</SelectItem>
                  <SelectItem value="24">24 Bulan</SelectItem>
                  <SelectItem value="36">36 Bulan</SelectItem>
                  <SelectItem value="48">48 Bulan</SelectItem>
                  <SelectItem value="60">60 Bulan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tampilkan usia yang dipilih */}
          {selectedAge && (
            <p className="mt-4 mb-2 font-semibold text-indigo-600">
              Usia anak yang dipilih: <strong className="font-bold">{selectedAge} Bulan</strong>
            </p>
          )}
          {/* Mapping Pertanyaan berdasarkan usia anak */}
          {/* Tumbuh Kembang */}
          <div className="gap-y-4 space-y-4">
          {currentQuestionSet &&
            questionKeys.map((key, index) => (
              <FormField
                key={index}
                name={key}  // misalnya "p1", "p2", dsb.
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    {/* FormLabel dinamis berdasarkan pertanyaan dari currentQuestionSet */}
                    <FormLabel>{currentQuestionSet[key]}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">Iya</FormLabel>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">Tidak</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))
          }
          </div>          

          {/* Form Kebutuhan Khusus */}
          {showAdditionalForm && (
            <div className="mt-4 space-y-4">
              <p className="text-indigo-600">Kondisi Tumbuh Kembang Anak tidak sesuai, silahkan lanjut mengisi formulir di bawah:</p>
              <h2 className="font-semibold">Skrining Kebutuhan Khusus</h2>   
              <FormField
                name="k1"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pertanyaan 1</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value)=> field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Opsi 1 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iya
                          </FormLabel>
                        </FormItem>
                        {/* Opsi 2 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="k2"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pertanyaan 2</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value)=> field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Opsi 1 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iya
                          </FormLabel>
                        </FormItem>
                        {/* Opsi 2 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="k3"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pertanyaan 3</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value)=> field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Opsi 1 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iya
                          </FormLabel>
                        </FormItem>
                        {/* Opsi 2 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="k4"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pertanyaan 4</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value)=> field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Opsi 1 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iya
                          </FormLabel>
                        </FormItem>
                        {/* Opsi 2 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="k5"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pertanyaan 5</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value)=> field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Opsi 1 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iya
                          </FormLabel>
                        </FormItem>
                        {/* Opsi 2 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="k6"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pertanyaan 6</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value)=> field.onChange(value === "iya")}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Opsi 1 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iya" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iya
                          </FormLabel>
                        </FormItem>
                        {/* Opsi 2 */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tidak" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>            
          )}

          {/* Tombol Cek dan Submit Jawaban (Bergantian) */}
          {isChecking ? (
            // Tombol Cek Jawaban
            <div className="mt-4">
              <Button 
                type="button" 
                onClick={handleValidation}
              >
                Simpan
              </Button>           
            </div>
          ) :  (
            // Tombol Submit
            <div className="mt-4">
              <Button 
                type="submit"
              >
                Simpan
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
      <ToastContainer />
    </div>
  );
};
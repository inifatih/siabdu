"use client";

// Import Component and Library
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

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";


// Final schema using Zod
const formSchema = z.object({
  namaAnak: z.string().nonempty("Nama anak tidak boleh kosong"),
  namaOrangtua: z.string().nonempty("Nama orang tua tidak boleh kosong"),
  nomorTelepon: z.string().nonempty("Nomor telepon tidak boleh kosong"),
  tanggalSkrining: z.string(),
  usia: z.number().int().positive("Usia harus bilangan positif"),
  lokasi: z.string().nonempty("Lokasi tidak boleh kosong"),
  ketLokasi: z.string().nonempty("Keterangan lokasi tidak boleh kosong"),
  q1: z.boolean(),
  q2: z.boolean(),
  q3: z.boolean(),
  q4: z.boolean(),
  q5: z.boolean(),
  q6: z.boolean(),
});

export default function FormSkrining({ getSkrining }) {

  // Validasi form menggunakan variabel methods
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaAnak: "",
      namaOrangtua: "",
      nomorTelepon: "",
      tanggalSkrining: format(new Date(), "PPP"),
      usia:"",
      lokasi: "",
      ketLokasi: "",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
    },
    
    onError: (errors) => {
    // Handle validation errors
      console.log("Form submission failed with errors: ", errors);
    
      // You can display a toast or alert to the user, or handle the errors in any way
      toast.error("Please fix the errors before submitting.");
    },
  });


  // Submit data melalui form ke dalam tablenya masing-masing
  const onSubmit = async () => {
    const data = methods.getValues();
    const response = await getSkrining(data); // Call the server-side function

    if (response.success) {
      toast.success(response.message); // Show success toast
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
          <h1 className="font-semibold mb-2">Form Skrining Tumbuh Kembang</h1>
          <h2 className="font-semibold text-gray-600 mb-2">Identitas Anak</h2>
          
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
          <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-4 py-4">
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
                            "flex pl-3 text-left text-gray-600 font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span>{field.value.toString() || "Pilih Tanggal"}</span>
                          {/* {field.value ? (
                            format(new Date(field.value), "yyyy-MM-dd")
                          ) : (
                            <span>Pilih Tanggal</span>
                          )} */}
                          <CalendarIcon className="ml-auto opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(value) => {
                          const nextDay = new Date(value);
                          nextDay.setDate(nextDay.getDate());
                          const date = format(nextDay, "PPP");
                          
                          field.onChange(date);
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
                          <SelectItem value="aa">Desa A</SelectItem>
                          <SelectItem value="ab">Desa B</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Kecamatan B</SelectLabel>
                          <SelectItem value="ba">Desa A</SelectItem>
                          <SelectItem value="bb">Desa B</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Kecamatan C</SelectLabel>
                          <SelectItem value="ca">Desa A</SelectItem>
                          <SelectItem value="cb">Desa B</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="ketLokasi"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-gray-600">Keterangan Lokasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Ket lokasi (nama desa)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Identitas Baris ke 3 */}
          {/* Tumbuh Kembang */}
          <div className="gap-y-4 space-y-4">
            <h2 className="font-semibold text-gray-600 mt-6 mb-4 py-2">
              Skrining Tumbuh Kembang Anak Usia 4 Bulan
            </h2>

            {/* Pertanyaan 1 */}
            <FormField
              name="q1"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pertanyaan 2 */}
            <FormField
              name="q2"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pertanyaan 3 */}
            <FormField
              name="q3"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pertanyaan 4 */}
            <FormField
              name="q4"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pertanyaan 5 */}
            <FormField
              name="q5"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pertanyaan 6 */}
            <FormField
              name="q6"
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tombol Submit */}
          <div className="mt-4">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </FormProvider>
      <ToastContainer />
    </div>
  );
};
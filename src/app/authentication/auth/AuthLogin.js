"use client"

import { getUser } from "@/app/authentication/login/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});

export default function LoginPage() {  
  const [loading, setLoading] = useState(false); // State untuk loading
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const router = useRouter(); // Inisialisasi useRouter untuk navigasi

  const onSubmit = async () => {
    setLoading(true); // Set loading ke true sebelum memulai proses login
    const data = methods.getValues();
    const response = await getUser(data); // Panggil function login dari action.js

    setLoading(false); // Set loading ke false setelah mendapatkan response

    if (response.success) {
      toast.success(response.message); // Show success toast
      methods.reset();
      router.push("/");
    } else {
      toast.error(response.message); // Show error toast
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-md flex flex-col items-center">
            <div className="loader mb-2 border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
            <p className="text-sm font-medium text-gray-700">Memproses login...</p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md p-6 m-2">
        <CardContent>

          {/* Barisan logo */}
          <div className="flex p-2 items-center justify-center">
            {/* Logo UPTD */}
            <Image
              src="/LOGO_UPTD_LD.png"
              width={40} // Tentukan width
              height={40} // Tentukan height
              alt="Logo UPTD LD Sidoarjo"
            />
            {/* Logo Kabupaten Sidoarjo */}
            <Image
              src="/KAB_SIDOARJO.png"
              width={40} // Tentukan width
              height={40} // Tentukan height
              alt="Logo Kabupaten Sidoarjo"
            />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-1">Selamat Datang di Si-Tia Dansa</h2>
          <p className="text-m font-semibold text-center mb-4">Sistem Identifikasi Anak Penyandang Disabilitas</p>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="py-2">
                {/* Input Email */}
                <FormField
                  name="email"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email:</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>  
                {/* Input Password */}
              <div className="py-2">
                <FormField
                  name="password"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password:</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          required
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Tombol Submit */}
              <Button type="submit" className="w-full my-4">
                Login
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  );
}

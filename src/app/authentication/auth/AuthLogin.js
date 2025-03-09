"use client"

import { getUser } from "@/app/authentication/login/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    onError: (errors) => {
      console.log("Login submission failed with errors:", errors);
    }
  });

  const router = useRouter(); // Inisialisasi useRouter untuk navigasi

  const onSubmit = async () => {
    const data = methods.getValues();
    const response = await getUser(data); // Panggil function login dari action.js

    if (response.success) {
      toast.success(response.message); // Show success toast
      methods.reset();
      router.push("/");
    } else {
      toast.error(response.message); // Show error toast
    }
    console.log(data)
  };

  return (
    <Card className="w-full max-w-md p-6">
      <CardContent>
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

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
  );
}

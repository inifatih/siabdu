"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  passwrod: z.string().min(6, "Password minimal 6 karakter")
});

export default function LoginPage({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
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

  const onSubmit = async () => {
    const data = methods.getValues();
    const response = await login(data); // Panggil function login dari action.js

    if (response.success) {
      toast.success(response.message); // Show success toast
      methods.reset();
    } else {
      toast.error(response.message); // Show error toast
    }
    console.log(data)
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
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
              {/* Input Email */}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-3"
              />
              {/* Input Password */}
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-3"
              />
              {/* Tombol Submit */}
              <Button type="submit" className="w-full" disabled={methods.formState.isSubmitting}>
                {methods.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

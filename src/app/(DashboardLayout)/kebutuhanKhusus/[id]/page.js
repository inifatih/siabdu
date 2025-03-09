"use client";
import { fetchNamaAnakById } from "@/app/(DashboardLayout)/dokumen/action"; // Sesuaikan path impor
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PilihHambatan() {
  const router = useRouter();
  const { id } = useParams(); // Ambil ID anak dari URL
  const [namaAnak, setNamaAnak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNamaAnak() {
      if (!id) return;
      setLoading(true);
      const result = await fetchNamaAnakById(id);
      setNamaAnak(result);
      setLoading(false);
    }

    getNamaAnak();
  }, [id]);

  const hambatanList = [
    { name: "Hambatan Penglihatan", path: "penglihatan" },
    { name: "Hambatan Pendengaran", path: "pendengaran" },
    { name: "Hambatan Intelektual", path: "intelektual" },
    { name: "Hambatan Fisik Motorik", path: "fisik-motorik" },
    { name: "Hambatan Emosional", path: "emosional" },
    { name: "Autism", path: "autism" },
    { name: "ADHD", path: "adhd" },
    { name: "Slow Learner", path: "slow-learner" },
    { name: "Kesulitan Belajar", path: "kesulitan-belajar" },
    { name: "CIBI", path: "cibi" },
  ];

  return (
    <>
    <Breadcrumb className="pb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => router.back()} className="cursor-pointer">Kebutuhan Khusus</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Pilih Hambatan</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Card>
      <CardHeader className="flex flex-col gap-2">
        {/* Judul */}
        {!loading && namaAnak ? (
          <CardTitle>Pilih Hambatan untuk Anak {namaAnak}</CardTitle>
        ) : (
          <CardTitle className="text-gray-400">Memuat data anak...</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {hambatanList.map((hambatan) => (
            <Button
              key={hambatan.path}
              variant="outline"
              onClick={() => router.push(`/kebutuhanKhusus/${id}/${hambatan.path}`)}
            >
              {hambatan.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
    </>
  );
}

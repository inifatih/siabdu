"use client";
import { fetchSkriningData } from "@/app/(DashboardLayout)/dokumen/action";
import { fetchHambatan } from "@/app/(DashboardLayout)/kebutuhanKhusus/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListAnakSkrining() {
  const [anakData, setAnakData] = useState([]);
  const [hambatanData, setHambatanData] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Ambil data skrining anak
        const responseSkrining = await fetchSkriningData();
        // Ambil data hambatan
        const responseHambatan = await fetchHambatan();
  
        if (responseSkrining.success && Array.isArray(responseSkrining.data)) {
          // Filter hanya anak dengan hasil tumbuh kembang = false
          const filteredData = responseSkrining.data.filter(
            (item) => item.tumbuhKembang?.length > 0 && item.tumbuhKembang[0].Hasil === false
          );
  
          if (responseHambatan.success && Array.isArray(responseHambatan.data)) {
            // Gabungkan data skrining dengan data hambatan berdasarkan identitasAnak_id
            const mergedData = filteredData.map((anak) => {
              const hambatanAnak = responseHambatan.data.filter(
                (h) => h.identitasAnak_id === anak.id
              );
  
              return {
                ...anak,
                hambatan: hambatanAnak.map((h) => h.jenis_hambatan), // Simpan jenis hambatan dalam array
                maxHambatanReached: hambatanAnak.length >= 2, // True jika sudah 2 hambatan
              };
            });
  
            setAnakData(mergedData);
          } else {
            setAnakData(filteredData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Anak dengan Indikasi Gangguan Tumbuh Kembang</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : anakData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Anak</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Tanggal Skrining</TableHead>
                <TableHead>Perkiraan Lanjutan</TableHead>
                <TableHead>Jenis Hambatan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anakData.map((anak) => {
                // Konversi tanggal skrining dan hitung tanggal lanjutan (1 bulan setelah)
                const skriningDate = new Date(anak.tanggalSkrining);
                const lanjutanDate = new Date(skriningDate);
                lanjutanDate.setMonth(lanjutanDate.getMonth() + 1);

                // Hitung selisih waktu dalam milidetik
                const now = new Date();
                const diffInMs = lanjutanDate - now;
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                // Tentukan warna teks: merah jika kurang dari 7 hari, hijau jika lebih dari 7 hari
                const textColor = diffInDays < 7 ? "text-red-500" : "text-green-500";

                return (
                  <TableRow key={anak.id}>
                    <TableCell>{anak.namaAnak}</TableCell>
                    <TableCell>{anak.usia} bulan</TableCell>
                    <TableCell>{anak.jenisKelamin ? "Laki-laki" : "Perempuan"}</TableCell>
                    <TableCell>{format(anak.tanggalSkrining, "PPP", {locale:id})}</TableCell>
                    <TableCell className={textColor}>
                      {format(lanjutanDate, "PPP", {locale:id})}
                    </TableCell>
                    <TableCell>
                    {anak.hambatan.length > 0 ? (
                      <ul>
                        {anak.hambatan.map((hambatan, index) => (
                          <li className="capitalize" key={index}>{hambatan}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">Tidak ada hambatan</span>
                    )}
                    {anak.maxHambatanReached && (
                      <p className="text-red-500 font-semibold mt-1">Maksimal 2 hambatan tercapai</p>
                    )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/kebutuhanKhusus/${anak.id}`)}
                        disabled={anak.maxHambatanReached} // Disabled jika sudah 2 hambatan
                      >
                        Pilih Hambatan
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-600">
            Tidak ada data anak dengan indikasi gangguan tumbuh kembang.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

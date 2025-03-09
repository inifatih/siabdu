"use client";
import { fetchJadwal } from "@/app/(DashboardLayout)/jadwal/action/index"; // Pastikan path impor sesuai
import { fetchUserProfile, logoutUser } from "@/app/authentication/login/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Bell, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-toastify";

const formatPageName = (slug) => {
  return slug
    .replace(/-/g, " ") // Ganti tanda "-" dengan spasi jika ada
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Pisahkan camelCase menjadi kata-kata
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Kapitalisasi setiap kata
};

export default function Header() {
  // State untuk mengontrol tampilan dialog
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  // State untuk menyimpan nama halaman dan data jadwal
  const [pageName, setPageName] = useState("Dashboard");
  const [jadwal, setJadwal] = useState([]);
  const [hasJadwal, setHasJadwal] = useState(false); // Untuk indikator notifikasi aktif
  // State untuk menyimpan user_id yang sedang login
  const pathname = usePathname();
  const [currentId, setCurrentId] = useState(null);

  // Ambil data user (misalnya, user_id) saat komponen dipasang
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const dataUser = await fetchUserProfile();
  
        // Pastikan dataUser tidak undefined atau null sebelum mengakses propertinya
        if (!dataUser || typeof dataUser !== "object") {
          throw new Error("Invalid user data received");
        }
  
        const userId = dataUser?.user_id; // Gunakan optional chaining untuk menghindari error
        if (!userId) {
          throw new Error("User ID not found");
        }
  
        setCurrentId(userId);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
  
    loadUserData();
  }, []);
  

  // Ambil data jadwal ketika currentId sudah tersedia
  useEffect(() => {
    if (!currentId) return;
  
    const interval = setInterval(() => {
      loadJadwal();
    }, 5000); // Fetch ulang setiap 5 detik
  
    return () => clearInterval(interval); // Hentikan interval saat komponen unmount
  }, [currentId]);  

  const loadJadwal = async () => {
    try {
      const response = await fetchJadwal(currentId);
      if (response.success) {
        const sortedData = response.data.sort((a, b) => new Date(a.tanggalJadwal) - new Date(b.tanggalJadwal));
        setJadwal(sortedData);
        setHasJadwal(response.data.length > 0); // Cek apakah ada jadwal
      } else {
        toast.error(response?.error || "Gagal Fetching Daftar Jadwal");
      }
    } catch {
      toast.error(response?.error || "Gagal Fetching Daftar Jadwal");
    }
  };

  // Update nama halaman berdasarkan route
  useEffect(() => {
    const paths = pathname.split("/").filter(Boolean);

    let currentPage = paths.length ? formatPageName(paths[paths.length - 1]) : "Dashboard";

    // Jika halaman memiliki ID (misal: `/kebutuhanKhusus/123`), sembunyikan teks header
    if (paths.length > 1 && !isNaN(Number(paths[1]))) {
      setPageName(""); // Bisa disesuaikan, misalnya "Detail Anak"
    } else {
      setPageName(currentPage);
    }
  }, [pathname]);
  

  // Fungsi untuk menjalankan proses logout
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        window.location.href = "/login";
      } else {
        toast.error(result.error || "Logout gagal");
      }
    } catch (error) {
      toast.error("Logout gagal");
    }
  };

  const getNotificationText = (event) => {
    const now = new Date();
    const eventDate = new Date(event.tanggalJadwal);
    const selisihMs = eventDate - now;
    const selisihHari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));
  
    if (selisihHari >= 7) {
      return { text: "1 Minggu", color: "text-green-500", title: event.title, description: event.description };
    } else if (selisihHari >= 1) {
      return { text: "24 Jam", color: "text-yellow-500", title: event.title, description: event.description };
    } else {
      return { text: "Segera", color: "text-red-500 font-bold", title: event.title, description: event.description };
    }
  };

  return (
    <header className="flex justify-between items-center p-3 bg-white shadow-sm">
      <h1 className="font-semibold ml-3">{pageName}</h1>
      <div className="flex items-center gap-2 px-2">
        {/* Tombol Notifikasi */}
        <Button
          variant="outline"
          size="sm"
          className="relative flex items-center gap-1"
          onClick={() => setIsNotifOpen(true)}
        >
          <Bell size={16} />
          {hasJadwal && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
        {/* Tombol Logout */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsLogoutOpen(true)}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>

      {/* Dialog Notifikasi (Popup Jadwal) */}
      <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
        <DialogContent>
          <DialogHeader className="font-semibold text-lg">Jadwal Saya</DialogHeader>
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
          {jadwal.length > 0 ? (
              jadwal.map((item) => {
                const { text, color } = getNotificationText(item);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col border-b hover:bg-indigo-50 rounded-md p-2 mb-2"
                  >
                    <span className={`font-semibold ${color}`}>{text}</span>
                    <span className="font-semibold">{item.judul}</span>
                    <span className="text-sm font-medium">{item.tanggalJadwal}</span>
                  </div>
                );
              })
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada jadwal</p>
          )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/jadwal">
              <Button variant="link" onClick={() => setIsNotifOpen(false)}>
                <Calendar size={16} />
                Lihat Semua Jadwal
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Logout */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            Apakah Anda yakin untuk keluar dari akun ini?
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

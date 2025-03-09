import GlobalStyleWrapper from "@/components/GlobalStyleWrapper";
import { FontSizeProvider } from "@/context/FontSizeContext.js";
import { createClient } from "@/lib/supabase/server";
import { Baby, Calendar, CircleHelp, Files, LayoutDashboard, MapPin, Settings, Stethoscope } from "lucide-react";
import { headers } from "next/headers";
import Header from "../../components/Header.js";
import Sidebar, { SidebarItem } from "../../components/Sidebar.js";
import "../globals.css";


export const metadata = {
  title: "SI ABDU",
  description: "Aplikasi Skrining Anak Berkebutuhan Khusus",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    // Ambil data pengguna dari tabel custom_users
    const { data, error } = await supabase
      .from("custom_users")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (data) {
      isAdmin = data.is_admin;
    }
  }

  const pathname = headers().get("next-url") || "";
  const isAuthPage = pathname.startsWith("/authentication");

  return (
    <html lang="en">
      <body>
        <FontSizeProvider>
          <GlobalStyleWrapper>
          {isAuthPage ? (
            <>{children}</>
          ) : (
            <div className="flex">
              <div className="h-screen sticky top-0">
                {/* Sidebar */}
                <Sidebar>
                  {isAdmin ? (
                    // Sidebar Admin
                    <>
                      <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        text="Dashboard"
                        href="/"
                      />
                      <SidebarItem icon={<Baby size={20} />} text="Skrining Anak" href="/skrining" />
                      <SidebarItem icon={<Stethoscope size={20} />} text="Kebutuhan Khusus" href="/kebutuhanKhusus" />
                      <SidebarItem icon={<Files size={20} />} text="Dokumen" href="/dokumen" />
                      {/* <SidebarItem icon={<MapPin size={20} />} text="Lokasi" href="/lokasi" /> */}
                      <SidebarItem icon={<Calendar size={20} />} text="Jadwal" href="/jadwal" />
                      <hr className="my-3" />
                      <SidebarItem icon={<Settings size={20} />} text="Pengaturan" href="/pengaturan" />
                      <SidebarItem icon={<CircleHelp size={20} />} text="Bantuan" href="/bantuan" />
                    </>
                  ) : (
                    // Sidebar User
                    <>
                      <SidebarItem icon={<Baby size={20} />} text="Skrining Anak" href="/skrining" />
                      <SidebarItem icon={<Stethoscope size={20} />} text="Kebutuhan Khusus" href="/kebutuhanKhusus" />
                      <SidebarItem icon={<Calendar size={20} />} text="Jadwal" href="/jadwal" />
                      <hr className="my-3" />
                      <SidebarItem icon={<Settings size={20} />} text="Pengaturan" href="/pengaturan" />
                      <SidebarItem icon={<CircleHelp size={20} />} text="Bantuan" href="/bantuan" />
                    </>
                  )}
                </Sidebar>
              </div>

              {/* Main content area */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header/>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-50 justify-between">
                  {children}
                </main>
              </div>
            </div>
          )}
          </GlobalStyleWrapper>
        </FontSizeProvider>
      </body>
    </html>
  );
}

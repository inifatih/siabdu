import GlobalStyleWrapper from "@/components/GlobalStyleWrapper";
import { FontSizeProvider } from "@/context/FontSizeContext.js";
import { Baby, Calendar, CircleHelp, Files, LayoutDashboard, MapPin, Settings, Stethoscope } from "lucide-react";
import Header from "../components/Header.js";
import Sidebar, { SidebarItem } from "../components/Sidebar.js";
import './globals.css';

export const metadata = {
  title: 'SI ABDU',
  description: 'Aplikasi Skrining Anak Berkebutuhan Khusus',
}


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <FontSizeProvider>
          <GlobalStyleWrapper>
            <div className="flex h-screen">
              {/* Sidebar */}
              <Sidebar>
                <SidebarItem
                  icon={<LayoutDashboard size={20} />}
                  text="Dashboard"
                  alert
                  href="/dashboard"
                />
                <SidebarItem icon={<Baby size={20} />} text="Skrining Tumbuh Kembang" href="/tumbuh-kembang" />
                <SidebarItem icon={<Stethoscope size={20} />} text="Skrining Kebutuhan Khusus" href="/kebutuhan-khusus" />
                <SidebarItem icon={<Files size={20} />} text="Dokumen" href="/dokumen" />
                {/* <SidebarItem icon={<MapPin size={20} />} text="Lokasi" href="/lokasi" /> */}
                <SidebarItem icon={<Calendar size={20} />} text="Jadwal" href="/jadwal" />
                <hr className="my-3" />
                <SidebarItem icon={<Settings size={20} />} text="Pengaturan" href="/pengaturan" />
                <SidebarItem icon={<CircleHelp size={20} />} text="Bantuan" href="/bantuan" />
              </Sidebar>


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
          </GlobalStyleWrapper>
        </FontSizeProvider>
      </body>
    </html>
  )
}

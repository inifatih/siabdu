"use client";
import { fetchUserProfile } from "@/app/authentication/login/action";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userEmail, setUserEmail] = useState("Loading...");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1080) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getUserEmail = async () => {
      const { success, email } = await fetchUserProfile();
      if (success) {
        setUserEmail(email);
      } 
    };
    getUserEmail();
  }, []);
  
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 flex justify-between items-center">
          <Image
            src="/LOGO_UPTD_LD.png"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            width={240} // Tentukan width
            height={240} // Tentukan height
            alt="Logo SI ABDU"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-indigo-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-48" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="text-xs text-gray-600">{userEmail}</h4>
            </div>
            <button>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, alert, href }) {
  const { expanded } = useContext(SidebarContext);
  const pathname = usePathname();
  const isActive = pathname === href;

  // const handleClick = () => {
  //   setActive(true);

  //   // Set timeout untuk mengatur kembali active ke false setelah 2 detik
  //   const timer = setTimeout(() => {
  //     setActive(false);
  //   }, 1000);

  //   // Bersihkan timeout saat komponen di-unmount atau saat aktif lagi
  //   return () => clearTimeout(timer);
  // };

  return (
    <Link href={href} passHref>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
          ${isActive ? "bg-indigo-50 text-indigo-600" : "hover:bg-indigo-50 text-black-600"}
        `}
      >
        {icon}
        <span className={`overflow-hidden transition-all h-7 ${expanded ? "w-auto ml-3" : "w-0"}`}>
          {text}
        </span>

        {alert && (
          <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
        )}

        {!expanded && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
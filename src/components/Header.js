"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation"; // import usePathname from next/navigation
import { useEffect, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageName, setPageName] = useState('Dashboard'); // State for storing page name
  const pathname = usePathname(); // usePathname to get the current route

  useEffect(() => {
    // Set the page name when pathname changes
    const currentPage = pathname.split('/').pop() || 'Dashboard';
    setPageName(currentPage.charAt(0).toUpperCase() + currentPage.slice(1)); // Capitalize the first letter
  }, [pathname]); // Only re-run effect if pathname changes

  return (
    <header className="flex justify-between items-center p-3 bg-white shadow-sm">
      <h1 className="font-semibold ml-3">{pageName}</h1> {/* Display the page name */}
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsOpen(true)}>
        <LogOut size={16} />
        Logout
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>Apakah Anda yakin untuk keluar dari akun ini?</DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm">Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

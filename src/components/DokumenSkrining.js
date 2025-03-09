"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  globalFilter,
  setGlobalFilter,
  useReactTable
} from "@tanstack/react-table";

import React, {
  useEffect,
  useState
} from "react";

import {
  CircleX,
  MoreHorizontal,
} from "lucide-react";

import {
  Button
} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Input
} from "@/components/ui/input";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteData } from "@/app/(DashboardLayout)/dokumen/action";
import { useRouter } from 'next/navigation';


export default function DokumenSkrining({ fetchSkriningData }) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [globalFilter, setGlobalFilter] = useState("");
  const [lokasiFilter, setLokasiFilter] = useState("all"); // State to hold selected lokasi filter
  const [startDate, setStartDate] = useState(null); // State to hold start date filter
  const [endDate, setEndDate] = useState(null); // State to hold end date filter

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Set jumlah data per halaman
  const pageCount = Math.ceil(totalCount / pageSize);

  // Ambil data setiap kali pageIndex, pageSize atau filter berubah
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetchSkriningData({
        pageIndex,
        pageSize,
        searchValue: globalFilter, 
        lokasiFilter: lokasiFilter !== "all" ? lokasiFilter : "",
        startDate: startDate || null,
        endDate: endDate || null,
      });
  
      if (response.success) {
        setData(response.data);
        setTotalCount(response.totalCount);
      } else {
        console.error(response.message);
      }
      setLoading(false);
    };
  
    fetchData();
  }, [pageIndex, pageSize, globalFilter, lokasiFilter, startDate, endDate]); // Pastikan globalFilter masuk dalam dependency
  

  // Ubah nilai filter dan reset ke halaman pertama
  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value);
    setPageIndex(0);
  };

  // Ubah nilai filter lokasi dan reset ke halaman pertama
  const handleLokasiChange = (value) => {
    setLokasiFilter(value);
    setPageIndex(0);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setPageIndex(0);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setPageIndex(0);
  };
  
  // Ubah halaman dan jumlah data per halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPageIndex(newPage);
    }
  };

  const handlePageSizeChange = (value) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setPageIndex(0);
    table.setPageSize(newPageSize);
  };

  const handleDeleteData = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
  
    const response = await deleteData(id);
  
    if (response.success) {
      alert(response.message);
      // Perbarui state atau fetch ulang data tabel setelah penghapusan
      window.location.reload(); // Bisa diganti dengan metode fetch ulang data
    } else {
      alert(response.message);
    }
  };

  // Bersihkan semua filter
  const clearFilters = () => {
    setGlobalFilter("");
    setLokasiFilter("all");
    setStartDate("");
    setEndDate("");
    setPageIndex(0);
  };

  const columns = [
    { 
      accessorKey: "no", 
      header: "No.",
      cell: ({ table, row }) => table.getSortedRowModel().rows.findIndex(r => r.id === row.id) + 1
    },
    { accessorKey: "namaAnak", header: "Nama Anak" },
    { accessorKey: "namaOrangtua", header: "Nama Orang Tua" },
    { 
      accessorKey: "usia", 
      header: "Usia", 
      cell: ({ row }) => `${row.getValue("usia")} bulan`
    },
    { 
      accessorKey: "jenisKelamin", 
      header: "Jenis Kelamin",
      cell: ({ row }) => row.getValue("jenisKelamin") ? "Laki-laki" : "Perempuan"
    },
    { accessorKey: "nomorTelepon", header: "No. Telepon" },
    { accessorKey: "tanggalSkrining", header: "Tanggal Skrining" },
    { accessorKey: "lokasi", header: "Lokasi" },
    { accessorKey: "ketLokasi", header: "Ket. Lokasi" },
    { 
      accessorKey: "tumbuhKembang", 
      header: "Hasil",
      cell: ({ row }) => {
        const hasil = row.getValue("tumbuhKembang");
        // Cek apakah tumbuhKembang memiliki data dan ambil nilai Hasil dari objek pertama dalam array
        return hasil && hasil.length > 0 ? (hasil[0]?.Hasil ? "Tidak Terindikasi" : "Terindikasi") : "";
      }
    },
    {
      accessorKey: "ketTumbuhKembang",
      header: "Ket. Tumbuh Kembang",
      cell: ({ row }) => {
        const hasil = row.getValue("tumbuhKembang");
        // Cek apakah tumbuhKembang memiliki data dan ambil nilai ketTumbuhKembang dari objek pertama dalam array
        return hasil && hasil.length > 0 ? hasil[0]?.ketTumbuhKembang : "";
      }
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex">
            <Button
              className="bg-indigo-600 hover:bg-slate-600"
              onClick={() => router.push(`/skrining/${row.original.id}`)}
            >
              Ubah
            </Button>
            <Button className="bg-red-600 hover:bg-slate-600" onClick={() => handleDeleteData(row.original.id)}>Hapus</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
    manualPagination: true, // Pagination di-*handle* secara manual
    pageCount: -1, // -1 karena jumlah halaman diambil secara dinamis berdasarkan totalCount
  });

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex-auto h-full">
      {/* Filters */}
      <div className="flex justify-between items-center">
        {/* Search Form */}
        <div className="flex items-center pb-2">
          <Input
            placeholder="Cari Anak..."
            value={globalFilter}
            onChange={handleSearchChange}
            className="w-56"
          />
        </div>

        {/* Filter lainnya */}
        <div className="flex items-center pb-2">
          {/* Lokasi */}
          <Select
            onValueChange={handleLokasiChange} // Apply the filter on value change
            value={lokasiFilter}
          >
            <SelectTrigger className="w-1/8">
              <SelectValue placeholder="Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Desa</SelectItem>
              <SelectItem value="Buduran">BUDURAN</SelectItem>
              <SelectItem value="Medaeng">MEDAENG</SelectItem>
              <SelectItem value="Sekardangan">SEKARDANGAN</SelectItem>
              <SelectItem value="Gedangan">GEDANGAN</SelectItem>
              <SelectItem value="Ganting">GANTING</SelectItem>
              <SelectItem value="Tanggulangin">TANGGULANGIN</SelectItem>
              <SelectItem value="Candi">CANDI</SelectItem>
              <SelectItem value="Sidodadi">SIDODADI</SelectItem>
              <SelectItem value="Sidoarjo">SIDOARJO</SelectItem>
              <SelectItem value="Urangagung">URANGAGUNG 1</SelectItem>
              <SelectItem value="Urangagung">URANGAGUNG 2</SelectItem>
              <SelectItem value="Tarik 1">TARIK 1</SelectItem>
              <SelectItem value="Tarik 2">TARIK 2</SelectItem>
              <SelectItem value="Sedati">SEDATI</SelectItem>
              <SelectItem value="Tambakrejo">TAMBAKREJO</SelectItem>
              <SelectItem value="Waru">WARU</SelectItem>
              <SelectItem value="Balongbendo">BALONGBENDO</SelectItem>
              <SelectItem value="Trosobo">TROSOBO</SelectItem>
              <SelectItem value="Wonokasian">WONOKASIAN</SelectItem>
              <SelectItem value="Wonoayu">WONOAYU</SelectItem>
              <SelectItem value="Tulangan">TULANGAN</SelectItem>
              <SelectItem value="Kepadangan">KEPADANGAN</SelectItem>
              <SelectItem value="Prambon">PRAMBON</SelectItem>
              <SelectItem value="Krembung">KREMBUNG</SelectItem>
              <SelectItem value="Krian">KRIAN</SelectItem>
              <SelectItem value="Barengkrajan">BARENGKRAJAN</SelectItem>
              <SelectItem value="Jabon">JABON</SelectItem>
              <SelectItem value="Poron">PORON</SelectItem>
              <SelectItem value="Kedungsolo">KEDUNGSOLO</SelectItem>
              <SelectItem value="Sukodono">SUKODONO</SelectItem>
              <SelectItem value="Taman">TAMAN</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Filter Tanggal */}
          <div className="flex items-center ml-2">
            <Input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-fit"
              placeholder="Tanggal mulai"
            />
            <Input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-fit ml-2"
              placeholder="Tanggal akhir"
            />
          </div>

          {/* Jumlah data per halaman */}
          <Select onValueChange={handlePageSizeChange} value={String(pageSize)}>
            <SelectTrigger className="w-1/8 ml-2">
              <div className="mr-1">Jumlah Data Tampil: </div>
              <SelectValue placeholder="Jumlah Data Tampil" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Hasil Skrining */}
          {/* <Select
            onValueChange={(value) => 
              table.getColumn("hasilskrining")?.setFilterValue(value === "all" ? undefined : value)
            }
            value={
              table.getState().columnFilters.find((filter) => filter.id === "hasilskrining")?.value || "all"
            }
          >
            <SelectTrigger className="w-1/8 ml-2">
              <SelectValue placeholder="Hasil Skrining" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Hasil Skrining</SelectItem>
              <SelectItem value="Hambatan Mental">Hambatan Mental</SelectItem>
              <SelectItem value="Hambatan Sensori">Hambatan Sensori</SelectItem>
            </SelectContent>
          </Select> */}

          {/* Tombol Clear Filter */}
          <Button
            onClick={clearFilters}
            variant="ghost"
            className="ml-2 p-2"
          >
            <CircleX/>
          </Button>
        </div>
      </div>
  
      {/* Table Data Anak */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-900 bg-gray-200">
                    {flexRender(
                      header.column.columnDef.header, 
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow 
                  key={row.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="px-4 py-2 text-left"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {/* Tombol */}
      <div className="flex justify-between mt-4 items-center">
        <Pagination>
          <PaginationContent>

            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="cursor-pointer hover:text-blue-500 hover:bg-gray-200"
              />
            </PaginationItem>

            {/* Mengaktifkan Page yg sedang dibuka */}
            {Array.from({ length: pageCount }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index)}
                  isActive={pageIndex === index}
                  className="cursor-pointer hover:text-blue-500 hover:bg-gray-200"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Ellipsis jika halaman banyak */}
            {pageCount > 4 && (
              <>
                {/* Halaman pertama selalu muncul */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(0)}
                    isActive={pageIndex === 0}
                    className="cursor-pointer hover:text-blue-500 hover:bg-gray-200"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Tampilkan ellipsis jika user berada di halaman jauh dari awal */}
                {pageIndex > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Menampilkan halaman sekitar halaman aktif */}
                {Array.from({ length: pageCount }, (_, index) => {
                  if (
                    index === 0 || // Halaman pertama
                    index === pageCount - 1 || // Halaman terakhir
                    (index >= pageIndex - 1 && index <= pageIndex + 1) // 2 halaman sebelum & sesudah aktif
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index)}
                          isActive={pageIndex === index}
                          className="cursor-pointer hover:text-blue-500 hover:bg-gray-200"
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {/* Halaman terakhir selalu muncul */}
                {pageIndex < pageCount - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(pageCount - 1)}
                      isActive={pageIndex === pageCount - 1}
                      className="cursor-pointer hover:text-blue-500 hover:bg-gray-200"
                    >
                      {pageCount}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </>
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1}
                className="cursor-pointer hover:text-blue-500 hover:bg-gray-200"
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
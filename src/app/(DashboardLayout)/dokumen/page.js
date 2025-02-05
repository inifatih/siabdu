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

import { getSkriningbyLokasi, getSkriningbyName } from "@/app/dokumen/action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectLabel } from "@radix-ui/react-select";


export default function DokumenSkrining({ fetchSkriningData }) {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [globalFilter, setGlobalFilter] = useState("");
  const [lokasiFilter, setLokasiFilter] = useState("all"); // State to hold selected lokasi filter
  const [columnFilters, setColumnFilters] = useState([]);

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Set jumlah data per halaman
  const totalPages = Math.ceil(totalCount / pageSize);

  const [start, setStart] = useState(0); // Pagination start
  const [end, setEnd] = useState(10); // Pagination end

  const [results, setResults] = useState([]); // To store search results

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetchSkriningData(pageIndex, pageSize);
      if (response.success) {
        setData(response.data);
        setTotalCount(response.totalCount); // Update total data
      } else {
        console.error(response.message);
      }
      setLoading(false);
    };
  
    fetchData();
  }, [pageIndex, pageSize]);

  // Search by Name
  const handleSearch = async () => {
    const response = await getSkriningbyName(globalFilter, start, end);
    if (response.success) {
      setResults(response.data);
    } else {
      console.error(response.message);
    }
  }
  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value);
    handleSearch();
  };

  // Filter by Lokasi
  const handleFilterChange = async (value) => {
    setLokasiFilter(value); // Update lokasi filter state

    // Fetch data based on the selected location filter
    const response = await getSkriningbyLokasi(value, start, end);

    if (response.success) {
      setResults(response.data); // Set the filtered results
    } else {
      console.error(response.message); // Handle error case
    }

    // Apply the filter to the table
    table.setColumnFilters((prev) => [
      ...prev.filter((f) => f.id !== "lokasi"), // Remove previous lokasi filter if any
      ...(value === "all" ? [] : [{ id: "lokasi", value }]), // Add new filter if not "all"
    ]);
  };

  const pageCount = Math.ceil(totalCount / pageSize);
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPageIndex(newPage);
    }
  };
  const handlePageSizeChange = (value) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);  // Set page size baru
    table.setPageSize(newPageSize); // Menyesuaikan jumlah data per halaman pada tabel
  };

  const columns = [
    { accessorKey: "id", header: "ID Pasien" },
    { accessorKey: "namaAnak", header: "Nama Pasien" },
    { accessorKey: "namaOrangtua", header: "Nama Orang Tua" },
    { accessorKey: "nomorTelepon", header: "No. Telepon" },
    { accessorKey: "tanggalSkrining", header: "Tanggal Skrining" },
    { accessorKey: "usia", header: "Usia" },
    { accessorKey: "lokasi", header: "Lokasi" },
    { accessorKey: "ketLokasi", header: "Keterangan Lokasi" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
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
    // Filter dokumen
    onColumnFiltersChange: (updater) => {
      setColumnFilters((prevFilters) => {
        const newFilters = typeof updater === "function" ? updater(prevFilters) : updater;
        const lokasiFilter = newFilters.find(f => f.id === "lokasi")?.value || "all";
        setLokasiFilter(lokasiFilter);
        return newFilters;
      });
    },
    state: {
      globalFilter,
      columnFilters,
    },

    // Data per halaman
    initialState: { pageSize, pageIndex },
    // Pagination
    manualPagination: true, // Aktifkan pagination manual
    pageCount: -1, // -1 untuk pagination dinamis
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-auto h-full">
      {/* Filters */}
      <div className="flex justify-between items-center">
        {/* Search Form */}
        <div className="flex items-center py-2">
          <Input
            placeholder="Cari Pasien..."
            value={globalFilter}
            onChange={handleSearchChange}
            className="w-56"
          />
        </div>

        {/* Dropdown Filter */}
        <div className="flex items-center pb-2">

          {/* Lokasi */}
          <Select
            onValueChange={handleFilterChange} // Apply the filter on value change
            value={lokasiFilter}
          >
            <SelectTrigger className="w-1/8">
              <SelectValue placeholder="Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Desa</SelectItem>
              <SelectItem value="Desa AA">Desa AA</SelectItem>
              <SelectItem value="Desa AB">Desa AB</SelectItem>
              <SelectItem value="Desa BA">Desa BA</SelectItem>
              <SelectItem value="Desa BB">Desa BB</SelectItem>
              <SelectItem value="Desa CA">Desa CA</SelectItem>
              <SelectItem value="Desa CB">Desa CB</SelectItem>
            </SelectContent>
          </Select>

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
            onClick={() => setColumnFilters([])}
            variant="ghost"
            className="ml-2 p-2"
          >
            <CircleX/>
          </Button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : null}

      {/* Table Data Anak */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow 
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className="text-gray-900 bg-gray-200"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                  className={["hover:bg-indigo-100", index % 2 === 0 ? "bg-white" : "bg-gray-50"].join(" ")}
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
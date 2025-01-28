"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";

import { ArrowUpDown, ChevronDown, MoreHorizontal, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
  
const dataPasien = [
  {
    id: "728ed52f",
    pasienname: "vincent",
    ortuname: "sukaesih",
    telp: 6281234567890,
    tglskrining: "01-12-2024",
    usia: 2,
    lokasi: "Desa A",
    ketlokasi: "Puskesmas A",
    hasilskrining: "Hambatan Mental",
  },
  {
    id: "728ed53f",
    pasienname: "jeksen",
    ortuname: "durianti",
    telp: 6289876543210,
    tglskrining: "01-12-2024",
    usia: 1,
    lokasi: "Desa A",
    ketlokasi: "Puskesmas A",
    hasilskrining: "Hambatan Mental",
  },
  {
    id: "728ed54f",
    pasienname: "elgato",
    ortuname: "miaumiau",
    telp: 6289876543210,
    tglskrining: "01-12-2024",
    usia: 1,
    lokasi: "Desa B",
    ketlokasi: "Puskesmas B",
    hasilskrining: "Hambatan Sensori",
  },
  // ...
];

export default function Dokumen() {
  const [data, setData] = useState(dataPasien);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = [
    {
      accessorKey: "id",
      header: "ID Pasien",
    },
    {
      accessorKey: "pasienname",
      header: "Nama Pasien",
    },
    {
      accessorKey: "ortuname",
      header: "Nama Orang Tua Pasien",
    },
    {
      accessorKey: "telp",
      header: "No. Telepon",
    },
    {
      accessorKey: "tglskrining",
      header: "Tanggal Skrining",
    },
    {
      accessorKey: "usia",
      header: "Usia",
    },
    {
      accessorKey: "lokasi",
      header: "Lokasi",
    },
    {
      accessorKey: "ketlokasi",
      header: "Keterangan Lokasi",
    },
    {
      accessorKey: "hasilskrining",
      header: "Hasil Skrining",
    },
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
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex-auto h-full">
      <h1 className="font-semibold">Dokumen</h1>
      <div className="block items-center py-4">
        <div className="flex items-center py-2">
          <Input
            placeholder="Cari Pasien..."
            value={
              table.getState().columnFilters.find((filter) => filter.id === "pasienname")?.value || ""
            }
            onChange={(event) =>
              table.getColumn("pasienname")?.setFilterValue(event.target.value)
            }
            className="w-1/4"
          />
          <Button
            onClick={() => table.getColumn("pasienname")?.setFilterValue("")}
            variant="ghost"
            className="ml-2 p-2"
          >
            <RefreshCcw/>
          </Button>
        </div>
        <div className="flex items-center py-2">
          {/* Dropdown Filter untuk Hasil Skrining */}
                    
          {/* Lokasi */}
          <Select
            onValueChange={(value) => 
              table.getColumn("lokasi")?.setFilterValue(value === "all" ? undefined : value)
            }
            value={
              table.getState().columnFilters.find((filter) => filter.id === "lokasi")?.value || "all"
            }
          >
            <SelectTrigger className="w-1/8">
              <SelectValue placeholder="Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Desa</SelectItem>
              <SelectItem value="Desa A">Desa A</SelectItem>
              <SelectItem value="Desa B">Desa B</SelectItem>
            </SelectContent>
          </Select>

          {/* Keterangan Lokasi */}
          <Select
            onValueChange={(value) => 
              table.getColumn("ketlokasi")?.setFilterValue(value === "all" ? undefined : value)
            }
            value={
              table.getState().columnFilters.find((filter) => filter.id === "ketlokasi")?.value || "all"
            }
          >
            <SelectTrigger className="w-1/8 ml-2">
              <SelectValue placeholder="Keterangan Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Puskesmas</SelectItem>
              <SelectItem value="Puskesmas A">Puskesmas A</SelectItem>
              <SelectItem value="Puskesmas B">Puskesmas B</SelectItem>
            </SelectContent>
          </Select>

          {/* Hasil Skrining */}
          <Select
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
          </Select>
                    
          <Button
            onClick={() => {
              setColumnFilters([]);
              table.resetColumnFilters();
            }}
            variant="outline"
            className="ml-2 font-normal"
          >
            Clear Filters <RefreshCcw/>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  ); 
}
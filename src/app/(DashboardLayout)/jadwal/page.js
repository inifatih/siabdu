"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { fetchUserProfile } from "@/app/authentication/login/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CircleXIcon, PencilIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import { addJadwal, deleteJadwal, fetchJadwal, updateJadwal } from "./action/index";

const jadwalSchema = z.object({
  tanggalJadwal: z.string(),
  title: z.string(),
  description: z.string(),
  notification: z.string()
})

export default function Jadwal() {
  const form = useForm({
    resolver: zodResolver(jadwalSchema),
    defaultValues: {
      tanggalJadwal: null,
      title: "",
      description: "",
      notification: ""
    }
  });

  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [newEvent, setNewEvent] = useState([]);
  const now = new Date();

  // Untuk Mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const dataUser = await fetchUserProfile(); // Wait for the Promise to resolve
        const userId = dataUser.user_id; // Access the user_id after Promise resolves
        setCurrentId(userId); // Set currentId state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    loadUserData(); // Call the async function to load user data
  }, []);

  // This effect will run whenever currentId changes
  useEffect(() => {
    if (currentId) {
      loadJadwal(currentId); // Load jadwal when currentId is set
    }
  }, [currentId]); // Only re-run when currentId changes

  const loadJadwal = async () => {
    try {
      const { success, data } = await fetchJadwal(currentId); // Ganti dengan user_id yang sesuai
      if (success) {
        const sortedData = data.sort((a, b) => new Date(a.tanggalJadwal) - new Date(b.tanggalJadwal));
        setEvents(sortedData);
      } else {
        toast.error("Gagal Menampilkan Daftar Jadwal");
      }
    } catch (error) {
      toast.error("Gagal Fetching Daftar Jadwal");
    }
  };

  // Handle adding new event
  const [loading, setLoading] = useState(false); // Tambahkan state untuk mencegah double request

  const handleAddEvent = async (e) => {
    if (e) e.preventDefault(); // Pastikan event form tidak trigger ulang

    if (loading) return; // Cegah double-click atau re-render memanggil dua kali
    setLoading(true);

    if (date && newEvent.title) {
      try {
        const response = await addJadwal(
          currentId,
          newEvent.title,
          newEvent.description,
          newEvent.tanggalJadwal
        );

        if (!response.success) {
          throw new Error(response.message || "Gagal menambahkan event.");
        }

        // Reset form setelah sukses
        form.reset();
        setEvents([...events, response.data]); // Pastikan hanya menambahkan 1 kali
        toast.success(`Event "${newEvent.title}" berhasil ditambahkan!`, {
          onClose: () => window.location.reload(), // Reload setelah toast ditutup
        });

        setNewEvent({
          tanggalJadwal: "",
          title: "",
          description: "",
        });

      } catch (error) {
        console.error("Error adding event:", error);
        toast.error("Gagal menambahkan jadwal.");
      } finally {
        setLoading(false); // Kembalikan loading setelah proses selesai
      }
    } else {
      toast.error("Pastikan semua kolom terisi dengan benar");
      setLoading(false);
    }
  };


  // Handle edit event
  const handleEditEvent = (index) => {
    const eventToEdit = events[index];
    setNewEvent({
      id: eventToEdit.id,
      tanggalJadwal: eventToEdit.tanggalJadwal,
      title: eventToEdit.title,
      description: eventToEdit.description,
    });
    setDate(eventToEdit.tanggalJadwal ? new Date(eventToEdit.tanggalJadwal) : null); // Pastikan format tanggal sesuai
    setIsEditing(true);
    setEditingIndex(index);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false); // Keluar dari mode edit
    setEditingIndex(null); // Hapus indeks event yang sedang diedit
    setNewEvent({ id: id, title: "", description: "", tanggalJadwal: "" }); // Reset form
    setDate(null);
  };

  // Handle update event
  const handleUpdateEvent = async () => {
    if (editingIndex !== null) {
      // Validasi input sebelum update
      if (!newEvent.title || !newEvent.description || !date) {
        toast.error("Judul, deskripsi, dan tanggal tidak boleh kosong");
        return;
      }

      const updatedEvent = {
        judul: newEvent.title, // Sesuaikan dengan nama kolom di database
        deskripsi: newEvent.description,
        // notifikasi: newEvent.notification || "none", // Default "none" jika kosong
        tanggalJadwal: date ? format(date, "PPP", { locale: id }) : "",
      };

      try {
        // Cek apakah ada perubahan data sebelum update state
        const existingEvent = events[editingIndex];
        const isDataChanged =
          existingEvent.judul !== updatedEvent.judul ||
          existingEvent.deskripsi !== updatedEvent.deskripsi ||
          existingEvent.tanggalJadwal !== updatedEvent.tanggalJadwal;

        if (!isDataChanged) {
          toast.success("Tidak ada perubahan data yang dilakukan");
          return;
        }

        // Panggil updateJadwal untuk update ke Supabase
        const result = await updateJadwal(newEvent.id, currentId, updatedEvent);

        if (!result.success) {
          toast.error("Gagal memperbarui jadwal di database: " + result.message);
          return;
        } else {
          toast.success("Jadwal berhasil diperbarui!");
        }

        // Update state setelah sukses di Supabase
        const updatedEvents = events.map((event, index) =>
          index === editingIndex ? { id: newEvent.id, ...updatedEvent } : event
        );

        setEvents(updatedEvents);

        // Fetch data terbaru setelah update berhasil
        await fetchJadwal(); // <<--- Tambahkan ini

        // Reset form setelah update berhasil
        setIsEditing(false);
        setEditingIndex(null);
        setNewEvent({ id: null, title: "", description: "", tanggalJadwal: "" });
        setDate(null);
        toast({
          open: true,
          title: "Berhasil",
          description: `Event "${newEvent.title}" berhasil diperbarui!`,
        });
      } catch (error) {
        toast.error("Terjadi kesalahan saat memperbarui event");
      }
    } else {
      toast.error("Pastikan semua kolom terisi dengan benar");
    }
  };

  // Handle delete event dengan debugging
  const handleDeleteEvent = async (id, currentId, index) => {
    if (!id || !currentId) {
      toast.error("ID Jadwal dan ID pengguna tidak ditemukan atau tidak sesuai");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        const response = await deleteJadwal(id, currentId);

        if (response.success) {
          const updatedEvents = events.filter((_, i) => i !== index);
          setEvents(updatedEvents);
          toast.success({open: true, title: "Berhasil", description: "Jadwal berhasil dihapus!"});
        } else {
          toast.error("Gagal menghapus event: " + response.message);
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menghapus event");
      }
    }
  };

  const getNotificationText = (event) => {
    const now = new Date();
    const eventDate = new Date(event.tanggalJadwal);
    const selisihMs = eventDate - now;
    const selisihHari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));
  
    if (selisihHari >= 7) {
      return { text: "1 Minggu", color: "text-green-500" };
    } else if (selisihHari >= 1) {
      return { text: "24 Jam", color: "text-red-500" };
    } else {
      return { text: "Sudah Berlalu", color: "text-red-700 font-bold" };
    }
  };  

  return (
    <div className="flex-auto h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddEvent)}>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">

            {/* Kolom 1 */}
            {/* Komponen Pilih Tanggal */}
            <div>
              <h2 className="font-semibold text-gray-600 mb-2">
                Kalender
              </h2>
              <div className="w-full d-flex justify-center">
                <FormField
                  name="tanggalJadwal"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Tanggal Jadwal</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={date}
                          locale={id} // Kalender Indonesia
                          onSelect={(value) => {
                            if (value) {
                              const formattedDate = format(value, "PPP", { locale: id }); // Format Indonesia
                              
                              setDate(value); // Simpan sebagai Date object di state
                              setNewEvent({
                                ...newEvent,
                                tanggalJadwal: formattedDate, // Simpan dalam format string "dd-MM-yyyy"
                              });
                
                              field.onChange(formattedDate); // Sync dengan form
                            }
                          }}
                          className="rounded-md border"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Kolom 2 */}
            {/* Komponen Tambah Event */}
            <div>
              <h2
                className={`font-semibold mb-2 ${
                  isEditing ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {isEditing ? "Edit Jadwal" : "Tambah Jadwal"}
              </h2>

              {isEditing && (
                <p className="text-blue-500 mb-2">
                  Anda sedang mengedit jadwal: <strong>{events.title}</strong>
                </p>
              )}

              <div className="space-y-4">
                {/* Judul Jadwal */}
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Jadwal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Judul Jadwal"
                          value={newEvent.title}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, title: e.target.value })
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Deskripsi Jadwal */}
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Jadwal</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Deskripsi Jadwal"
                          value={newEvent.description}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              description: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Atur Notifikasi */}
                {/* <FormField
                  name="notification"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notifikasi</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            setNewEvent({ ...newEvent, notification: value })
                          }
                          value={newEvent.notification}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Atur Notifikasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Tidak Ada</SelectItem>
                            <SelectItem value="1w">1 Minggu Sebelum</SelectItem>
                            <SelectItem value="1d">1 Hari Sebelum</SelectItem>
                            <SelectItem value="0d">Hari H</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Tombol Tambah Event dan Update Event */}
                <Button
                  onClick={isEditing ? handleUpdateEvent : handleAddEvent}
                  className={isEditing ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  {isEditing ? "Update Event" : "Tambah Event"}
                </Button>

                {/* Ketika dalam proses Edit Event */}
                {isEditing && (
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-800 ml-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Komponen Daftar Jadwal */}
            <div className="mb-3">
              <h2 className="font-semibold text-gray-600 mb-4">Daftar Jadwal</h2>
              {events.length === 0 ? (
                <p className="text-gray-400">Belum ada jadwal.</p>
              ) : (
                <ul className="space-y-2">
                  {events.map((event, index) => {
                    const { text, color } = getNotificationText(event);
                    return (
                      <li key={index} className="bg-white border p-4 rounded-md shadow-sm">
                        <h2 className={`text-2xl font-bold ${color}`}>{event.tanggalJadwal}</h2>
                        <p className="text-sm border-b pb-2">{text}</p>
                        <h2 className="text-xl font-semibold text-gray-800">{event.judul}</h2>
                        <p className="text-gray-600">{event.deskripsi}</p>
                        <div className="mt-2 flex gap-2">
                          <Button onClick={() => handleEditEvent(index)} size="sm" variant="outline">
                            <PencilIcon />
                          </Button>
                          <Button onClick={() => handleDeleteEvent(event.id, currentId, index)} size="sm" variant="destructive">
                            <CircleXIcon />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </form>
      </Form>
      <ToastContainer/>
    </div>
  );
}

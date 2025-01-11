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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { format } from "date-fns";
import { id } from "date-fns/locale";



export default function Jadwal() {
  const form = useForm(); // Inisialisasi useForm
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    notification: "none", 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Handle adding new event
  const handleAddEvent = () => {
    if (date && newEvent.title) {
      setEvents([
        ...events,
        { date: format(date, "EEEE, dd MMMM yyyy", { locale: id }), ...newEvent},
      ]);
      alert(`Event "${newEvent.title}" berhasil ditambahkan!`);
      setNewEvent({ title: "", description: "", notification: "none" });
    } else {
      alert("Harap isi semua data sebelum menambahkan event!");
    }
  };

  // Handle edit event
  const handleEditEvent = (index) => {
    const eventToEdit = events[index];
    setNewEvent({
      title: eventToEdit.title,
      description: eventToEdit.description,
      notification: eventToEdit.notification,
    });
    setDate(new Date(eventToEdit.date)); // Pastikan format tanggal sesuai
    setIsEditing(true);
    setEditingIndex(index);
  };

  // Handle update event
  const handleUpdateEvent = () => {
    if (editingIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editingIndex] = {
        date: format(date, "EEEE, dd MMMM yyyy", { locale: id }),
        ...newEvent,
      };
      setEvents(updatedEvents);
      setIsEditing(false);
      setEditingIndex(null);
      alert(`Event "${newEvent.title}" berhasil diperbarui!`);
      setNewEvent({ title: "", description: "", notification: "none" });
    }
  };

  // Handle delete event
  const handleDeleteEvent = (index) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
      alert("Event berhasil dihapus!");
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false); // Keluar dari mode edit
    setEditingIndex(null); // Hapus indeks event yang sedang diedit
    setNewEvent({ title: "", description: "", notification: "none" }); // Reset form
  };

  return (
    <div className="flex-auto h-full">
      <h1 className="font-semibold mb-2">Jadwal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Komponen Pilih Tanggal */}
        <div>
          <h2 className="font-semibold text-gray-600 mb-2">Pilih Tanggal</h2>
          <div className="w-full d-flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={id} // kalender indonesia
            className="rounded-md border"
          />
          </div>
        </div>

        {/* Komponen Tambah Event */}
        <div>

          <h2
            className={`font-semibold mb-2 ${
              isEditing ? "text-blue-600" : "text-gray-600"
            }`}
            >
            {isEditing ? "Edit Event" : "Tambah Event"}
          </h2>

          {isEditing && (
            <p className="text-blue-500 mb-2">
              Anda sedang mengedit event: <strong>{newEvent.title}</strong>
            </p>
          )}     

          <Form {...form}>
            <div className="space-y-4">
              {/* Judul Event */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Event</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Judul Event"
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deskripsi Event */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Event</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Deskripsi Event"
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, description: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Atur Notifikasi */}
              <FormField
                control={form.control}
                name="notification"
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
              />

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
          </Form>
        </div>

        {/* Komponen Daftar Event */}
        <div>
          <h2 className="font-semibold text-gray-600 mb-4">Daftar Event</h2>
          {events.length === 0 ? (
            <p className="text-gray-400">Belum ada event.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li key={index} className="bg-white border p-4 rounded-md">
                  <h1 className="font-semibold text-black">
                    {event.title}
                  </h1>
                  <p className="mb-2">{event.date}</p>
                  <p className="mt-2 border-t">{event.description}</p>
                  <p>
                    <em>
                      Notifikasi:{" "}
                      {event.notification
                        .replace("1w", "1 Minggu Sebelum")
                        .replace("1d", "1 Hari Sebelum")
                        .replace("0d", "Hari H")}
                    </em>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      onClick={() => handleEditEvent(index)}
                      size="sm"
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteEvent(index)}
                      size="sm"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Calendar, Calender } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addJadwal, deleteJadwal, fetchJadwal, updateJadwal } from "./action";

const formSchema = z.object({
  tanggalJadwal: z.date(),
  judul: z.string().nonempty("Judul tidak boleh kosong."),
  deskripsi: z.string().nonempty("Deskripsi tidak boleh kosong."),
  notifikasi: z.date()
});

export default function Jadwal({ user_id }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggalJadwal: new Date(),
      judul: "",
      deskripsi: "",
      notifikasi: new Date(),
    }
  });

  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", notification: "none" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      const result = await fetchJadwal(user_id);
      const formattedEvents = result.data.map(event => ({
        ...event,
        tanggalJadwal: format(new Date(event.date), "PPP", { locale: id }) // Format ke PPP
      }));
      setEvents(formattedEvents || []); // Pastikan nilai default adalah array kosong
    }
    loadEvents();
  }, [user_id]);
  

  const handleSubmit = async (event) => {

    // cek submit add jadwal
    console.log("Submitting event:", {
      isEditing,
      user_id,
      title: newEvent.title,
      date,
      description: newEvent.description,
      notification: newEvent.notification,
    });

    event.preventDefault();
    if (isEditing) {
      await updateJadwal(editingEvent.id, user_id, newEvent.title, date, newEvent.description, newEvent.notification);
    } else {
      await addJadwal(user_id, newEvent.title, date, newEvent.description, newEvent.notification);
    }
    setNewEvent({ title: "", description: "", notification: "none" });
    setIsEditing(false);
    setEditingEvent(null);

    const updatedEvents = await fetchJadwal(user_id);
    console.log("Updated events after submit:", updatedEvents);
    setEvents(await fetchJadwal(user_id));
  };

  const handleEditEvent = (event) => {
    setNewEvent({ title: event.title, description: event.description, notification: event.notification });
    setDate(new Date(event.date));
    setIsEditing(true);
    setEditingEvent(event);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      await deleteJadwal(id);
      setEvents(await fetchJadwal(user_id));
    }
  };

  return (
    <div className="flex-auto h-full">
      <h2 className="font-semibold text-black mb-2">
        {isEditing ? "Ubah Jadwal" : "Tambah Jadwal"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Form {...form} onSubmit={handleSubmit}>
        {/* Kolom 1 */}
        <div>
          <h3 className="font-semibold mb-2">Pilih Tanggal</h3>
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate} 
            locale={id} 
            className="rounded-md border" 
          />
        </div>

        {/* Kolom 2 */}
        <div className="gap-y-4">
          <h2 className={`font-semibold mb-2 ${isEditing ? "text-blue-600" : "text-gray-600"}`}>
          </h2>
          {/* Form Add Jadwal */}
            {/* Judul */}
            <div className="pb-4">
              <FormField 
                name="judul" 
                control={form.control} 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Event</FormLabel>
                    <FormControl>
                      <Input {...field} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            <div className="pb-4">
              {/* Deskripsi */}
              <FormField 
                name="deskripsi" 
                control={form.control} 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Event</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            <div className="pb-4">
              {/* Notifikasi */}
              <FormField
                name="notifikasi"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-600">Tanggal Notifikasi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "flex pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <span>{field.value ? format(field.value, "PPP", { locale: id }) : "Pilih Tanggal"}</span>
                            <CalendarIcon className="ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={id}
                          selected={field.value}
                          onSelect={(value) => field.onChange(value)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button 
                type="submit" 
                className={
                  isEditing ? "bg-blue-500 hover:bg-blue-600" : ""}>
                  {isEditing ? "Update Event" : "Tambah Event"}
              </Button>
            </div>
        </div>
      </Form>

        {/* Kolom 3 */}
        <div>
          {/* Daftar Jadwal */}
          <h2 className="font-semibold text-gray-600 mb-4">Daftar Event</h2>
          {events.length === 0 ? <p className="text-gray-400">Belum ada event.</p> : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="bg-white border p-4 rounded-md">
                  <h1 className="font-semibold text-black">{event.title}</h1>
                  <p>{event.date}</p>
                  <p className="mt-2 border-t">{event.description}</p>
                  <p><em>Notifikasi: {event.notification}</em></p>
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => handleEditEvent(event)} size="sm" variant="outline">Edit</Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} size="sm" variant="destructive">Delete</Button>
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

"use client"

// Import Form Component
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Import Calendar and Popover Component
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
 
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Import Select Component
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
    namaanak: z.string().min(2).max(50),
    namaorangtua: z.string().min(2).max(50),
    nomortelepon: z
    .string()
    .regex(/^[0-9]*$/, 'Nomor telepon hanya boleh berisi angka')
    .max(13, 'Nomor telepon tidak boleh lebih dari 13 karakter')
    .min(1, 'Nomor telepon tidak boleh kosong'),
    usia: z.number()
  })

export default function KebutuhanKhusus() {
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaanak: "",
            namaorangtua: "",
            nomortelepon: "",
            usia: "",
        },
    });

    const [date, setDate] = React.useState(null)

    const questions = [
        { id: "q1", text: "Apakah anak mampu menumpu kedua lengan dan berusaha untuk mengangkat kepala?" },
        { id: "q2", text: "Apakah anak dapat berbalik badan?" },
        { id: "q3", text: "Apakah anak dapat meraih benda dengan kedua tangan?" },
        { id: "q4", text: "Apakah anak mampu mendengar suara dan bermain bibir sambil mengeluarkan air liur?" },
        { id: "q5", text: "Apakah anak dapat duduk tanpa dukungan?" },
        { id: "q6", text: "Apakah anak dapat berjalan dengan bantuan?" },
        { id: "q7", text: "Apakah anak dapat mengucapkan kata-kata?" },
        { id: "q8", text: "Apakah anak dapat berlari tanpa jatuh?" }
      ];

    const options = [
        { id: "o1", value: "yes" },
        { id: "o2", value: "no" }
    ]

    const answer = [
        { id: " ", questions_id: " ", options_id: " " }
    ]

    function onSubmit(values) {
        console.log(values)
    }
    
    return (
        <div className="flex-auto h-full">
            <h1 className="font-semibold mb-2">Form Skrining Kebutuhan Khusus</h1>
            <h2 className="font-semibold text-gray-600 mb-2">Identitas Anak</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Identitas baris 1 */}
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="namaanak"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Nama Anak</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama anak" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="namaorangtua"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Nama Orang Tua</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama orang tua anak" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Identitas baris 2 */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nomortelepon"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Nomor Telepon</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text" // Gunakan type="text" untuk membolehkan regex
                                        {...field}
                                        placeholder="Nomor telepon"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Tanggal Skrining</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                    {date ? format(date, "PPP") : (<span>Tanggal</span>)}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid sm:grid-cols-3 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (    
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Usia</FormLabel>
                                <FormControl>
                                    <Input
                                    type="number"
                                    id="age"
                                    placeholder="Usia anak"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Lokasi</FormLabel>
                                <FormControl>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Lokasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Kecamatan A</SelectLabel>
                                            <SelectItem value="aa">Desa A</SelectItem>
                                            <SelectItem value="ab">Desa B</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                            <SelectLabel>Kecamatan B</SelectLabel>
                                            <SelectItem value="ba">Desa A</SelectItem>
                                            <SelectItem value="bb">Desa B</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                            <SelectLabel>Kecamatan C</SelectLabel>
                                            <SelectItem value="ca">Desa A</SelectItem>
                                            <SelectItem value="cb">Desa B</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ketlokasi"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="font-semibold text-sm text-gray-600">Keterangan Lokasi</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ket lokasi (nama desa)" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    
                    {/* Skrining Kebutuhan Khusus Anak */}
                    <div className="gap-y-4">

                        <h2 className="font-semibold text-gray-600 mt-6 mb-2">Skrining Kebutuhan Khusus Anak Usia 4 Bulan</h2>
                        {/* Pertanyaan 1 */}
                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-600">1. Apakah anak mampu menumpu kedua lengan dan berusaha untuk mengangkat kepala?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">2. Apakah anak mampu bermain-main dengan kedua tangannya?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p3"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">3. Apakah anak mampu mengamati mainan?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p4"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">4. Apakah anak mampu mendengar suara dan bermain bibir sambil mengeluarkan air liur?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p5"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">5. Apakah anak mampu tersenyum pada ibu?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p6"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">6. Kebersihan telinga?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p7"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">7. Apakah anak mampu menumpu kedua lengan dan berusaha untuk mengangkat kepala?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-2">
                            <FormField
                                control={form.control}
                                name="p8"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-sm text-gray-600">8. Apakah anak mampu menumpu kedua lengan dan berusaha untuk mengangkat kepala?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                className="flex space-x-4 mt-2"
                                            >
                                                <RadioGroupItem value="ya" id="option-ya" />
                                                <FormLabel htmlFor="option-ya" className="text-gray-600">Iya</FormLabel>
                                                
                                                <RadioGroupItem value="tidak" id="option-tidak" />
                                                <FormLabel htmlFor="option-tidak" className="text-gray-600">Tidak</FormLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="py-4">
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </Form>
        </div>   
    )
}
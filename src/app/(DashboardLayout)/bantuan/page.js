import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
  


export default function Bantuan() {
    return (
        <div>
            <h1 className="font-semibold mb-2">Cara Penggunaan</h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Cara Melakukan Skrining Anak Berkebutuhan Khusus</AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <Image alt="cara melakukan skrining anak berkebutuan khusus" src="/bantuan_kebutuhanKhusus.png" width="500" height="300"/>
                        </div>
                    1. Masuk ke menu Kebutuhan Khusus. <br/>
                    2. Klik pilih hambatan pada anak yang ingin diskrining. <br/>
                    3. Klik hambatan yang ingin dilakukan. <br/>
                    4. Isi formulir berbentuk pertanyaan, lalu simpan. <br/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Cara Melakukan Skrining Tumbuh Kembang</AccordionTrigger>
                    <AccordionContent>
                    <div>
                        <Image alt="cara melakukan skrining" src="/bantuan_skrining.png" width="500" height="300"/>
                    </div>
                    1. Masuk ke menu Skrining Anak. <br/>
                    2. Isi formulir identitas anak. <br/>
                    3. Isi formulir kondisi kesehatan telinga. <br/>
                    4. Isi formulir tumbuh kembang. <br/>
                    5. Simpan, maka sistem akan menghitung hasil skrining dan menyimpannya. <br/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Cara Membuat Agenda di Jadwal</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Cara Menghapus Agenda</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Cara Mengubah Agenda di Jadwal</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger>Cara Melihat Laporan Dokumen Pasien</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger>Cara Menghapus Dokumen Pasien</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger>Cara Mengubah Dokumen Pasien</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                    <AccordionTrigger>Cara Keluar dari Akun</AccordionTrigger>
                    <AccordionContent>
                    Test
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
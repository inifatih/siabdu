import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function Bantuan() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;

    if (user) { 
        const { data } = await supabase
        .from("custom_users")
        .select("is_admin")
        .eq("id", user.id)
        .single();
        if (data) isAdmin = data.is_admin;
    }

    return (
        <div>
            <h1 className="font-semibold mb-2">Cara Penggunaan</h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Cara Melakukan Skrining Anak Berkebutuhan Khusus</AccordionTrigger>
                    <AccordionContent>
                    1. Masuk ke menu Kebutuhan Khusus. <br/>
                    2. Pada daftar anak yang terindikasi, klik <strong>Pilih Hambatan</strong> pada anak yang ingin diskrining. <br/>
                        <div>
                            <Image alt="cara melakukan skrining anak berkebutuan khusus" src="/bantuan/skriningKK.png" width="500" height="300"/>
                        </div>
                    3. Pilih jenis hambatan. <br/>
                        <div>
                            <Image alt="cara melakukan skrining anak berkebutuhan khusus 2" src="/bantuan/skriningKK2.png" width="500" height="300"/>
                        </div>
                    4. Isi formulir berbentuk pertanyaan dengan bobot skor, lalu simpan. <br/>
                        <div>
                            <Image alt="cara melakukan skrining anak berkebutuhan khusus 3" src="/bantuan/skriningKK3.png" width="500" height="300"/>
                        </div>
                        <div>
                            <Image alt="cara melakukan skrining anak berkebutuhan khusus 4" src="/bantuan/skriningKK4.png" width="500" height="300"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Cara Melakukan Skrining Tumbuh Kembang</AccordionTrigger>
                    <AccordionContent>
                    1. Masuk ke menu Skrining Anak. <br/>
                        <div>
                            <Image alt="cara melakukan skrining" src="/bantuan/skriningTK.png" width="500" height="300"/>
                        </div>
                    2. Isi formulir identitas anak. <br/>
                        <div>
                            <Image alt="cara melakukan skrining 2" src="/bantuan/skriningTK2.png" width="500" height="300"/>
                        </div>
                    3. Isi formulir kondisi kesehatan telinga. <br/>
                        <div>
                            <Image alt="cara melakukan skrining 3" src="/bantuan/skriningTK3.png" width="500" height="300"/>
                        </div>
                    4. Isi formulir tumbuh kembang. <br/>
                        <div>
                            <Image alt="cara melakukan skrining 4" src="/bantuan/skriningTK4.png" width="500" height="300"/>
                        </div>
                    5. Simpan untuk menghitung hasil skrining tumbuh kembang. <br/>
                    6. Hasil skrining tumbuh kembang akan ditampilkan dan berhasil disimpan. <br/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Cara Membuat Agenda di Jadwal</AccordionTrigger>
                    <AccordionContent>
                    1. Menuju ke bagian daftar jadwal pada halaman Jadwal.<br/>
                        <div>
                            <Image alt="cara membuat agenda" src="/bantuan/membuatJadwal.png" width="500" height="300"/>
                        </div>
                    2. Isi formulir jadwal untuk membuat agenda yang diinginkan.<br/>
                    3. Simpan formulir yang telah diisi.<br/>
                        <div>
                            <Image alt="cara melakukan skrining" src="/bantuan/membuatJadwal2.png" width="500" height="300"/>
                        </div>
                    3. Agenda berhasil ditambahkan dan tampil pada Daftar Jadwal. <br/>
                        <div>
                            <Image alt="cara melakukan skrining" src="/bantuan/membuatJadwal3.png" width="500" height="300"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Cara Menghapus Agenda</AccordionTrigger>
                    <AccordionContent>
                    1. Menuju ke bagian daftar jadwal pada halaman Jadwal. <br/>
                        <div>
                            <Image alt="cara menghapus agenda 1" src="/bantuan/menghapusJadwal.png" width="300" height="100"/>
                        </div>
                    2. Klik tombol hapus pada agenda yang ingin dihapus. <br/>
                        <div>
                            <Image alt="cara menghapus agenda 2" src="/bantuan/menghapusJadwal2.png" width="300" height="100"/>
                        </div>
                    3. Konfirmasi penghapusan dengan mengklik tombol hapus pada pop up konfirmasi. <br/>
                        <div>
                            <Image alt="cara menghapus agenda 3" src="/bantuan/menghapusJadwal3.png" width="300" height="100"/>
                        </div>
                    4. Agenda berhasil dihapus. <br/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Cara Mengubah Agenda di Jadwal</AccordionTrigger>
                    <AccordionContent>
                    1. Menuju ke bagian daftar jadwal pada halaman Jadwal. <br/>
                        <div>
                            <Image alt="cara mengubah agenda 1" src="/bantuan/mengubahJadwal.png" width="300" height="100"/>
                        </div>
                    2. Klik tombol edit dengan <i>icon</i> pensil pada agenda yang ingin diubah. <br/>
                        <div>
                            <Image alt="cara mengubah agenda 2" src="/bantuan/mengubahJadwal2.png" width="500" height="300"/>
                        </div>
                    3. Ubah data yang ingin diubah pada formulir yang muncul. <br/>
                    4. Klik tombol simpan untuk menyimpan perubahan. <br/>
                        <div>
                            <Image alt="cara mengubah agenda 3" src="/bantuan/mengubahJadwal3.png" width="300" height="100"/>
                        </div>
                    5. Agenda berhasil diubah. <br/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Cara Keluar dari Akun</AccordionTrigger>
                    <AccordionContent>
                    1. Klik tombol <strong>Logout</strong> pada bagian atas halaman. <br/>
                        <div className="my-2">
                            <Image alt="cara keluar dari akun" src="/bantuan/logout.png" width="500" height="300"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* Khusus Admin */}
                {isAdmin && (
                    <>
                        <AccordionItem value="item-7">
                            <AccordionTrigger>Cara Melihat Laporan Dokumen anak</AccordionTrigger>
                            <AccordionContent>
                            1. Masuk ke menu Dokumen. <br/>
                                <div>
                                    <Image alt="cara melihat dokumen" src="/bantuan/melihatDokumen.png" width="500" height="300"/>
                                </div>
                            2. Tuliskan nama anak yang dicari pada kolom pencarian. <br/>
                                <div>
                                    <Image alt="cara melihat dokumen 2" src="/bantuan/melihatDokumen2.png" width="500" height="300"/>
                                </div>
                            3. Gunakan bantuan filter lokasi untuk memperingkas data yang tampil. <br/>
                                <div>
                                    <Image alt="cara melihat dokumen" src="/bantuan/melihatDokumen3.png" width="500" height="300"/>
                                </div>
                            4. Gunakan bantuan filter rentang tanggal untuk memperingkas data yang tampil. <br/>
                                <div>
                                    <Image alt="cara melihat dokumen" src="/bantuan/melihatDokumen4.png" width="500" height="300"/>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-8">
                            <AccordionTrigger>Cara Menghapus Dokumen Anak</AccordionTrigger>
                            <AccordionContent>
                            1. Pada daftar dokumen anak, klik tombol titik tiga di kolom aksi. <br/>
                            2. Klik tombol hapus pada dokumen anak yang ingin dihapus. <br/>
                                <div className="my-2">
                                    <Image alt="cara menghapus dokumen anak" src="/bantuan/menghapusDokumen.png" width="500" height="300"/>
                                </div>
                            3. Konfirmasi penghapusan dengan mengklik tombol hapus pada pop up konfirmasi. <br/>
                                <div className="my-2">
                                    <Image alt="cara menghapus dokumen anak 2" src="/bantuan/menghapusDokumen2.png" width="500" height="300"/>
                                </div>
                            4. Dokumen anak berhasil dihapus. <br/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-9">
                            <AccordionTrigger>Cara Mengubah Dokumen Anak</AccordionTrigger>
                            <AccordionContent>
                            1. Pada daftar dokumen anak, klik tombol titik tiga di kolom aksi. <br/>
                            2. Klik tombol ubah pada dokumen anak yang ingin diubah. <br/>
                                <div className="my-2">
                                    <Image alt="cara mengubah dokumen anak" src="/bantuan/mengubahDokumen.png" width="500" height="300"/>
                                </div>
                            3. Ubah data yang ingin diubah pada formulir yang muncul. <br/>
                                <div className="my-2">
                                    <Image alt="cara mengubah dokumen anak 2" src="/bantuan/mengubahDokumen2.png" width="500" height="300"/>
                                </div>
                                <div className="my-2">
                                    <Image alt="cara mengubah dokumen anak 3" src="/bantuan/mengubahDokumen3.png" width="500" height="300"/>
                                </div>
                                <div>
                                    <Image alt="cara mengubah dokumen anak 4" src="/bantuan/mengubahDokumen4.png" width="500" height="300"/>
                                </div>
                            4. Klik tombol simpan untuk menyimpan perubahan. <br/>
                                <div className="my-2">
                                    <Image alt="cara mengubah dokumen anak 5" src="/bantuan/mengubahDokumen5.png" width="500" height="300"/>
                                </div>
                            5. Dokumen anak berhasil diubah. <br/>
                            </AccordionContent>
                        </AccordionItem>
                    </>
                )}
            </Accordion>
        </div>
    )
}
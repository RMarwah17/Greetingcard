# RAZ Project Structure - Greetingcard2

## Pohon Direktori
```text
Greetingcard2/
├── assets/                 # Aset gambar, ikon, dan logo
│   └── images/             # Template kartu dan logo RAZ
├── backup/                 # Penyimpanan file cadangan (Backup)
├── css/
│   └── style.css           # Styling utama (Layout, Theme, Animasi)
├── js/
│   ├── cards-data.js       # Database template kartu dan pesan default
│   ├── editor.js           # Logika pengolah kartu (Preview, Download, Upload)
│   └── main.js             # Entry point, galeri, dan filter kategori
├── index.html              # Struktur utama aplikasi
├── RAZGuide.md             # Panduan penggunaan bagi pengguna/pengembang
├── RAZImplementation.md    # Detail teknis implementasi kode
├── RAZProjectPlan.md       # Rencana pengembangan proyek
├── RAZProjectStructure.md  # (File ini) Dokumentasi struktur proyek
└── RAZUpdateHistory_*.md   # Riwayat pembaruan harian
```

## Deskripsi Komponen
- **index.html**: Pusat navigasi dan container utama untuk galeri serta modal editor.
- **js/cards-data.js**: Berisi array objek `CARDS_DATA` yang mendefinisikan properti tiap kartu (warna, teks, gambar).
- **js/editor.js**: Menggunakan `html2canvas` untuk mengubah elemen DOM menjadi gambar. Menangani upload logo pengguna.
- **css/style.css**: Mengimplementasikan desain modern dengan variabel CSS untuk tema (light/dark) dan warna aksen.

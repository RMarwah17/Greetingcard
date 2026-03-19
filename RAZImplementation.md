# RAZ Implementation Detail - Greetingcard2

## Teknologi yang Digunakan
- **HTML5 & CSS3**: Menggunakan CSS Variables untuk manajemen tema dinamis.
- **Vanilla JavaScript**: Pendekatan modular tanpa framework (React/Vue) untuk menjaga performa tetap ringan.
- **html2canvas (v1.4.1)**: Pustaka utama untuk merender elemen HTML menjadi objek Canvas dan akhirnya file gambar (PNG).

## Alur Capture Gambar
Implementasi capture gambar dilakukan di dalam `js/editor.js` fungsi `downloadCard()`:
1. **Font Readiness**: Memastikan font Google (Plus Jakarta Sans) sudah terunduh sepenuhnya menggunakan `document.fonts.ready`.
2. **Off-screen Rendering**: Membuat elemen `div` sementara yang diletakkan di luar layar (`left: -9999px`) agar capture tidak mengganggu tampilan pengguna.
3. **Image to DataURL**: Mengonversi gambar latar belakang template menjadi DataURL untuk menghindari masalah CORS saat capture di browser tertentu.
4. **Scaling**: Menggunakan faktor skala untuk memastikan hasil unduhan memiliki lebar konsisten (1080px) meskipun ukuran preview di layar berbeda-hui.

## Manajemen Kategori
Sistem kategori diatur di `js/main.js` dan disaring melalui fungsi `renderGallery()`. Setiap kartu memiliki properti `category` yang cocok dengan data atribut pada tombol filter.

## Standar Desain
- **Tipografi**: Menggunakan `Playfair Display` untuk judul besar (estetika Islami) dan `Plus Jakarta Sans` untuk teks konten (keterbacaan modern).
- **Aksen**: Setiap template memiliki `accentColor` unik yang diaplikasikan pada elemen tertentu untuk menjaga harmoni visual.

---
*Dokumen ini dibuat bertahap seiring berjalannya pengembangan proyek.*

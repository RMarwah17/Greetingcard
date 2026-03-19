# RAZ Guide - Greetingcard2

## Cara Penggunaan (Bagi Pengguna)

### 1. Memilih Template
- Scroll ke bawah pada halaman utama untuk melihat galeri kartu.
- Gunakan filter kategori (Ramadan, Idul Fitri, Idul Adha) untuk mempersempit pilihan.
- Klik tombol **"Personalisasi Kartu"** pada template yang Anda sukai.

### 2. Mengedit Kartu (Editor)
- **Pesan / Caption**: Ubah teks ucapan sesuai keinginan Anda di kolom yang tersedia.
- **Acak Pesan**: Jika bingung, klik tombol 🎲 **"Acak Pesan Ucapan"** untuk mendapatkan inspirasi otomatis.
- **Nama Pengirim & Penerima**: Isi kolom "Dari" dan "Untuk" agar kartu lebih personal.
- **Unggah Logo**: Anda bisa mengunggah logo perusahaan atau foto profil kecil untuk ditampilkan di pojok bawah kartu.

### 3. Menyimpan & Berbagi
- Klik **"Unduh PNG"** untuk memproses kartu menjadi gambar. Setelah preview muncul, klik **"Simpan ke Perangkat"**.
- Gunakan tombol **"Bagikan"** untuk mengirim teks caption ke platform lain.
- Klik **"Salin Teks"** untuk menyalin pesan yang sudah dibuat.

---

## Panduan Pengembang

### Nama File
Selalu gunakan prefix `RAZ` untuk file baru yang bersifat global atau administratif. Contoh: `RAZMainStyles.css`.

### Penambahan Template Baru
Untuk menambah template, buka `js/cards-data.js` dan tambahkan objek baru ke dalam array `CARDS_DATA` dengan mengikuti skema yang sudah ada. Jangan lupa simpan aset gambar di `assets/images/`.

### Kode Descriptions
Gunakan komentar bahasa Indonesia pada setiap fungsi atau blok kode penting untuk memudahkan pembelajaran.

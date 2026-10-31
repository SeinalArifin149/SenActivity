# SenActivity

SenActivity adalah aplikasi manajemen keuangan pribadi tanpa autentikasi untuk mencatat pemasukan, pengeluaran, melihat dashboard, dan mengekspor laporan.

## Teknologi

- **Client:** React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide React
- **Server:** Node.js, Express, Prisma ORM, SQLite (default lokal), Zod, Helmet, CORS, rate limiting

## Menjalankan lokal

Deployment menggunakan PostgreSQL karena filesystem serverless Vercel tidak persisten. Siapkan database PostgreSQL lokal atau hosted terlebih dahulu.

```bash
npm install
cp server/.env.example server/.env
npm run prisma:generate
npm run prisma:deploy --workspace server
npm run dev
```

Client tersedia di `http://localhost:5173`, API di `http://localhost:4000`.

## Deploy ke Vercel

1. Push repository ke GitHub dan import repository tersebut ke Vercel.
2. Biarkan **Root Directory** di root repository dan gunakan konfigurasi `vercel.json` yang sudah tersedia.
3. Tambahkan environment variable `DATABASE_URL` berisi connection string PostgreSQL production.
4. Tambahkan `CLIENT_ORIGIN` berisi URL deployment Vercel, misalnya `https://senactivity.vercel.app`.
5. Deploy. Build Vercel akan membangun client, sedangkan `/api/*` dilayani oleh Express serverless function.
6. Jalankan migrasi production dari lingkungan yang memiliki akses ke database:

```bash
npm run prisma:deploy --workspace server
```

`VITE_API_URL` tidak wajib di production karena client otomatis menggunakan `/api`. Isi variable tersebut hanya jika API dideploy pada origin berbeda.

## Catatan keamanan

API menggunakan validasi Zod, Prisma parameterized queries, Helmet, CORS terbatas, rate limiting, pembatasan body, dan error handler tanpa stack trace ke client. Karena autentikasi belum dibuat, data belum memiliki perlindungan kepemilikan per pengguna. Jangan mengekspos API ke internet publik tanpa autentikasi dan pembatasan jaringan tambahan. Gunakan HTTPS pada deployment produksi.

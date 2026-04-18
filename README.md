# NusantaraGuide AI 🌿✨

> **Jelajahi Jiwa Budaya Nusantara Melalui Lensa Kecerdasan Buatan.**
>
> Proyek yang diajukan untuk **Dicoding Hackathon** — *Tema No. 23: Digitalisasi Pariwisata*.

![Deploy to Azure](https://img.shields.io/badge/Deploy_to-Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) 

NusantaraGuide AI mengubah interaksi pariwisata pasif menjadi eksplorasi budaya interaktif. Dibekali dengan kecerdasan buatan, web app ini mampu bertindak sebagai pendamping ahli warisan dan sejarawan yang menceritakan makna mendalam dari setiap destinasi wisata di Indonesia. Terdapat lebih dari sekadar ensiklopedia; platform ini membawamu menyelami filosofi candi, upacara adat, dan kearifan lokal.

🌍 **Live Demo:** [Tautan Azure Static Web Apps - *Akan di-update*]  
📖 **Proposal Draft:** [PROPOSAL_DRAFT.md](./PROPOSAL_DRAFT.md)

---

## 🎯 Mengapa NusantaraGuide AI? (Dampak Sosial)
1. **Mendekatkan Milenial/Gen-Z pada Sejarah**: Lewat antarmuka Chat AI yang kasual namun mendalam.
2. **Pariwisata Berkualitas (Quality Tourism)**: Meningkatkan literasi wisatawan tentang *konteks* destinasi, tidak hanya *spot* foto.
3. **Mendorong UMKM**: Dengan Itinerary pintar yang dibangun AI, rute turis akan teregang ke desa-desa wisata (seperti Wae Rebo/Penglipuran).

## 🚀 Fitur Utama
- **AI Cultural Expert Chat**: Ngobrol layaknya dengan ahli sejarah langsung dari widget melayang.
- **Dynamic Heritage Map**: Rute wisata berbasis Web Share API, JSON-LD Schema (SEO), dan integrasi Azure.
- **Smart Itinerary Builder**: Bikin daftar perjalanan secara intuitif lewat format *Drag-and-Drop* timeline yang terautomasi optimal.
- **Presentation Demo Mode**: Dirancang 100% *crash-proof* untuk dewan juri tanpa perlu memasukkan API Key.

---

## 💻 Tech Stack
- **Frontend Core**: Next.js 14 (App Router) + React 19 + TypeScript
- **Styling & UX**: Tailwind CSS (Native Config) + Framer Motion + `lucide-react`
- **Data Handling**: Zustand (via custom React Context/Store) + `@dnd-kit` untuk animasi layout.
- **Infrastruktur & Cloud**: Microsoft Azure Static Web Apps, GitHub Actions CI/CD.

---

## 🛠 Panduan Instalasi Lokal (Setup Guide)

Ikuti langkah-langkah mudah di bawah ini untuk menjalankan NusantaraGuide AI di mesin lokal.

1. **Clone Repository**
   \`\`\`bash
   git clone https://github.com/USERNAME/NusantaraGuide-AI.git
   cd NusantaraGuide-AI
   \`\`\`

2. **Install Dependensi**
   \`\`\`bash
   npm ci
   \`\`\`

3. **Konfigurasi Environment Variables**
   Salin `.env.example` ke `.env` (jika ada) atau buat file `.env` di *root* dan isi:
   \`\`\`env
   AZURE_LANGUAGE_KEY="KUNCI_AZURE_KEY"
   AZURE_LANGUAGE_ENDPOINT="ENDPOINT_AZURE"
   GEMINI_API_KEY="KUNCI_GEMINI"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   \`\`\`

4. **Jalankan Aplikasi**
   \`\`\`bash
   npm run dev
   \`\`\`
   Aplikasi berjalan pada `http://localhost:3000`

> 💡 **Tip untuk Juri Hackathon:**
> Jika Anda hanya ingin mengevaluasi UI dan respons lokal tanpa *API Key*, jalankan aplikasi lalu tambahkan mode presentasi di akhir URL: `http://localhost:3000?demo=true`. Seluruh percakapan AI akan distimulasi oleh *Mock Streaming* pintar dari pustaka demo bawaan!

---

## ☁️ Deployment Guide (Azure Static Web Apps)

Repositori ini sudah dioptimalkan otomatis untuk `Azure Static Web Apps`. File konfigurasi telah ditanam pada folder `azure-deploy` dan `.github/workflows`.

1. Masuk ke portal Azure dan buat **Static Web App** baru.
2. Hubungkan ke repository GitHub Anda.
3. Atur *Build Preset* ke **Next.js**.
4. Set App Location: `/`, Output Location: `.next`.
5. Jangan lupa menambahkan setelan environment: `AZURE_OPENAI_KEY` pada menu *Configuration* di panel Azure.
6. Push kode ke main branch. GitHub Actions akan mendeploy rilis baru dalam hitungan menit! 🚀

---
*Dibuat untuk mendorong Digitalisasi Pariwisata Indonesia.* 🇮🇩

# Vistara — Cultural Intelligence Tourism Platform 🌿✨

> **"Dari sekadar destinasi, menjadi pengalaman jiwa."**
>
> Pemenang tantangan **Dicoding Hackathon** — *Tema No. 23: Digitalisasi Pariwisata*.

![Deploy to Azure](https://img.shields.io/badge/Deploy_to-Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) 

Vistara adalah platform *Smart Tourism* masa depan yang mengubah cara kita berwisata di Indonesia. Menggunakan kecerdasan buatan dari Microsoft Azure, Vistara menceritakan makna mendalam di balik setiap relief candi, ritual adat, dan kearifan lokal yang sering kali luput dari pandangan wisatawan biasa.

🌍 **Live Demo:** [https://vistara-culture.azurewebsites.net](https://vistara-culture.azurewebsites.net)  
📖 **Proposal Final:** [PROPOSAL_DRAFT.md](./PROPOSAL_DRAFT.md)

---

## 🚀 Kriteria Kompetisi (Highlight)

### 🧩 Inovasi: Intelligence over Information
Berbeda dengan aplikasi direktori travel biasa, Vistara tidak hanya menampilkan data statis. Vistara menggunakan **Contextual AI Assistant** yang mampu melakukan dialog mendalam tentang filosofi dan sejarah peninggalan Nusantara layaknya seorang sejarawan ahli yang mendampingi perjalanan Anda.

### ☁️ Integrasi Azure
Kami memanfaatkan ekosistem Microsoft untuk performa skala global:
- **Azure Static Web Apps**: Deployment aplikasi Next.js 14 yang super cepat dan handal.
- **Azure AI Language**: Fitur analisis teks dan pemahaman bahasa untuk asisten budaya.
- **Azure Search & Schema**: Integrasi JSON-LD TouristAttraction untuk optimasi SEO kelas dunia.

### 📈 Dampak Nyata
Vistara mengatasi kesenjangan antara "pariwisata massal" dan "literasi budaya", membantu melestarikan narasi luhur Indonesia kepada generasi Gen-Z dan wisatawan internasional.

---

## ✨ Fitur Unggulan
- **AI Cultural Expert Chat**: Ngobrol mendalam tentang filosofi tempat wisata secara real-time.
- **Smart Itinerary Builder**: Timeline jalan-jalan intuitif dengan fitur *Drag-and-Drop*.
- **Deep Cultural Context**: Database 12+ destinasi utama dengan narasi sejarah yang telah dikurasi.
- **Presentation Mode**: Akses simulasi AI instan (`?demo=true`) untuk keperluan presentasi tanpa API Key.

---

## 💻 Tech Stack
- **Framework**: Next.js 14 (App Router, Standalone Mode)
- **Styling**: Vanilla Tailwind CSS + Framer Motion (Premium Animations)
- **Data Flow**: Context API + Custom Hooks
- **Cloud**: Azure Static Web Apps + GitHub Actions CI/CD

---

## 🛠 Panduan Jalankan Lokal

1. **Clone & Install**
   ```bash
   git clone https://github.com/Maverick-list/vistara_culture.git
   cd vistara_culture
   npm install
   ```

2. **Setup Env** (Lihat `.env.example`)
   ```env
   AZURE_LANGUAGE_KEY="xxx"
   AZURE_LANGUAGE_ENDPOINT="xxx"
   GEMINI_API_KEY="xxx"
   ```

3. **Run**
   ```bash
   npm run dev
   ```

---
*Dibuat dengan cinta untuk Indonesia dan kemajuan Digitalisasi Pariwisata Nusantara.* 🇮🇩

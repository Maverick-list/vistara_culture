// ── NusantaraGuide AI — Data Layer ──────────────────────────────────────

export type Pulau =
  | "Jawa"
  | "Bali"
  | "Sumatera"
  | "Kalimantan"
  | "Sulawesi"
  | "Nusa Tenggara"
  | "Papua"
  | "Maluku";

export type Kategori =
  | "Candi & Pura"
  | "Alam & Lanskap"
  | "Desa Budaya"
  | "Situs Sejarah"
  | "Upacara & Tradisi"
  | "Kuliner Heritage";

export interface Koordinat {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  nama: string;
  lokasi: string;
  provinsi: string;
  pulau: Pulau;
  kategori: Kategori;
  deskripsi_singkat: string;
  konteks_budaya: string;
  filosofi: string;
  tips_kunjungan: string[];
  waktu_terbaik: string;
  foto_url: [string, string, string];
  rating: number;
  koordinat: Koordinat;
}

// ── 12 Destinasi Wisata Budaya Nusantara ────────────────────────────────

export const destinations: Destination[] = [
  {
    id: "borobudur",
    nama: "Candi Borobudur",
    lokasi: "Magelang",
    provinsi: "Jawa Tengah",
    pulau: "Jawa",
    kategori: "Candi & Pura",
    deskripsi_singkat:
      "Candi Buddha terbesar di dunia, warisan UNESCO yang megah dengan 2.672 panel relief dan 504 arca Buddha.",
    konteks_budaya:
      "Dibangun pada abad ke-9 oleh Dinasti Syailendra, Borobudur merupakan mahakarya arsitektur Buddha Mahayana. Strukturnya menggambarkan kosmologi Buddha dengan tiga tingkat: Kamadhatu (dunia nafsu), Rupadhatu (dunia bentuk), dan Arupadhatu (dunia tanpa bentuk).",
    filosofi:
      "Borobudur melambangkan perjalanan spiritual menuju pencerahan — dari kegelapan menuju cahaya kebijaksanaan. Setiap tingkatnya mengajarkan bahwa manusia dapat melampaui keduniawian melalui kesadaran dan kebajikan.",
    tips_kunjungan: [
      "Datang saat sunrise (04:30) untuk pengalaman mistis terbaik",
      "Gunakan pemandu lokal berlisensi untuk memahami relief",
      "Bawa air minum dan topi, area candi sangat terbuka",
      "Hindari weekend dan libur nasional untuk menghindari keramaian",
    ],
    waktu_terbaik: "April–Oktober (musim kering)",
    foto_url: [
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80",
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80",
    ],
    rating: 4.9,
    koordinat: { lat: -7.6079, lng: 110.2038 },
  },
  {
    id: "pura-besakih",
    nama: "Pura Besakih",
    lokasi: "Karangasem",
    provinsi: "Bali",
    pulau: "Bali",
    kategori: "Candi & Pura",
    deskripsi_singkat:
      "Pura terbesar dan terpenting di Bali, dikenal sebagai 'Pura Ibu' yang terletak di lereng Gunung Agung.",
    konteks_budaya:
      "Besakih telah menjadi pusat keagamaan Hindu Bali selama lebih dari seribu tahun. Kompleks ini terdiri dari 23 pura terpisah yang mengikuti lereng Gunung Agung, gunung tertinggi dan paling sakral di Bali.",
    filosofi:
      "Pura Besakih mencerminkan konsep Tri Murti dalam Hindu — Brahma (pencipta), Wisnu (pemelihara), dan Siwa (pelebur). Lokasinya di lereng gunung melambangkan koneksi langsung antara manusia dan alam semesta.",
    tips_kunjungan: [
      "Kenakan sarung dan selendang (bisa disewa di lokasi)",
      "Tolak secara sopan jika ada 'pemandu' tidak resmi yang memaksa",
      "Kunjungi pagi hari untuk cuaca cerah dan pemandangan Gunung Agung",
      "Hormati area suci yang tertutup untuk pengunjung non-Hindu",
    ],
    waktu_terbaik: "April–September",
    foto_url: [
      "https://images.unsplash.com/photo-1604922824961-87cefb2e4b07?w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    ],
    rating: 4.7,
    koordinat: { lat: -8.3742, lng: 115.4511 },
  },
  {
    id: "tana-toraja",
    nama: "Tana Toraja",
    lokasi: "Toraja Utara",
    provinsi: "Sulawesi Selatan",
    pulau: "Sulawesi",
    kategori: "Desa Budaya",
    deskripsi_singkat:
      "Tanah adat Toraja yang terkenal dengan upacara pemakaman megah, rumah tongkonan, dan pemandangan alam spektakuler.",
    konteks_budaya:
      "Suku Toraja memiliki tradisi pemakaman unik bernama Rambu Solo', di mana upacara berlangsung berhari-hari sebagai bentuk penghormatan tertinggi kepada almarhum. Rumah adat Tongkonan dengan atap melengkung khas menjadi simbol identitas budaya Toraja.",
    filosofi:
      "Bagi Toraja, kematian bukanlah akhir melainkan perjalanan menuju Puya (alam baka). Upacara pemakaman adalah ungkapan cinta dan rasa hormat, memastikan arwah dapat mencapai kedamaian abadi.",
    tips_kunjungan: [
      "Hormati upacara pemakaman — minta izin sebelum memotret",
      "Kunjungi Kete Kesu dan Lemo untuk melihat kuburan batu",
      "Cicipi kopi Toraja langsung dari petani lokal",
      "Sewa motor untuk menjelajahi desa-desa terpencil",
    ],
    waktu_terbaik: "Juni–September (musim upacara)",
    foto_url: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1592364395653-83e648b20cc2?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
    ],
    rating: 4.8,
    koordinat: { lat: -2.9748, lng: 119.8935 },
  },
  {
    id: "danau-toba",
    nama: "Danau Toba",
    lokasi: "Samosir",
    provinsi: "Sumatera Utara",
    pulau: "Sumatera",
    kategori: "Alam & Lanskap",
    deskripsi_singkat:
      "Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya — jantung budaya Batak Toba.",
    konteks_budaya:
      "Danau Toba adalah pusat peradaban Batak. Pulau Samosir menyimpan warisan budaya berupa rumah adat Batak (Gorga), tarian Tor-Tor, dan kain ulos yang ditenun secara tradisional. Setiap marga Batak dapat menelusuri asal-usulnya ke daerah sekitar danau ini.",
    filosofi:
      "Dalam mitologi Batak, Danau Toba lahir dari legenda Toba dan ikan emas. Danau ini melambangkan keseimbangan antara kekuatan alam dan kerendahan hati manusia — peringatan bahwa janji harus ditepati.",
    tips_kunjungan: [
      "Menginap di Tuk Tuk Siadong, Samosir, untuk suasana paling otentik",
      "Kunjungi Museum Batak dan makam Raja Sidabutar",
      "Coba panggang ikan mas khas Danau Toba",
      "Sewa sepeda untuk keliling Pulau Samosir",
    ],
    waktu_terbaik: "Mei–September",
    foto_url: [
      "https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80",
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80",
    ],
    rating: 4.7,
    koordinat: { lat: 2.6845, lng: 98.8588 },
  },
  {
    id: "prambanan",
    nama: "Candi Prambanan",
    lokasi: "Sleman",
    provinsi: "DI Yogyakarta",
    pulau: "Jawa",
    kategori: "Candi & Pura",
    deskripsi_singkat:
      "Kompleks candi Hindu terbesar di Indonesia, mahakarya abad ke-9 yang mendedikasikan tiga candi utama untuk Trimurti.",
    konteks_budaya:
      "Prambanan dibangun oleh Rakai Pikatan dari Dinasti Sanjaya sekitar 850 M. Candi ini menjadi simbol kejayaan Hindu di Jawa Tengah, dengan 240 candi perwara yang mengelilingi tiga candi utama.",
    filosofi:
      "Relief Ramayana di dinding candi mengajarkan tentang dharma (kebenaran), kesetiaan, dan pengorbanan. Arsitektur menjulang melambangkan Gunung Meru — pusat alam semesta dalam kosmologi Hindu.",
    tips_kunjungan: [
      "Saksikan Sendratari Ramayana saat malam bulan purnama (Mei–Oktober)",
      "Gunakan guide untuk memahami cerita relief Ramayana",
      "Kunjungi sore hari untuk foto sunset terbaik",
      "Jelajahi juga Candi Sewu dan Candi Plaosan di sekitarnya",
    ],
    waktu_terbaik: "Mei–Oktober",
    foto_url: [
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
      "https://images.unsplash.com/photo-1565018054866-968e244671af?w=800&q=80",
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80",
    ],
    rating: 4.8,
    koordinat: { lat: -7.752, lng: 110.4914 },
  },
  {
    id: "raja-ampat",
    nama: "Raja Ampat",
    lokasi: "Raja Ampat",
    provinsi: "Papua Barat Daya",
    pulau: "Papua",
    kategori: "Alam & Lanskap",
    deskripsi_singkat:
      "Surga bawah laut dengan keanekaragaman hayati laut tertinggi di planet Bumi — 75% spesies karang dunia ada di sini.",
    konteks_budaya:
      "Nama 'Raja Ampat' berasal dari legenda empat raja yang lahir dari empat telur naga. Masyarakat adat setempat mempraktikkan sistem Sasi — hukum adat pelarangan sementara pengambilan hasil laut untuk menjaga keberlanjutan ekosistem.",
    filosofi:
      "Sistem Sasi mencerminkan kearifan lokal bahwa manusia adalah penjaga, bukan pemilik alam. Keseimbangan antara mengambil dan memberi kembali kepada laut adalah inti filosofi masyarakat Raja Ampat.",
    tips_kunjungan: [
      "Siapkan budget lebih — akomodasi dan transportasi cukup mahal",
      "Bawa peralatan snorkeling sendiri untuk kualitas terbaik",
      "Kunjungi Pianemo untuk foto ikonik karst dari ketinggian",
      "Bayar Conservation Fee (Rp1.000.000) yang berlaku 1 tahun",
    ],
    waktu_terbaik: "Oktober–April (laut paling tenang)",
    foto_url: [
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&q=80",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
    ],
    rating: 4.9,
    koordinat: { lat: -1.0586, lng: 130.8781 },
  },
  {
    id: "ubud",
    nama: "Ubud — Jantung Budaya Bali",
    lokasi: "Gianyar",
    provinsi: "Bali",
    pulau: "Bali",
    kategori: "Desa Budaya",
    deskripsi_singkat:
      "Pusat seni dan budaya Bali yang dikelilingi sawah terasering, galeri seni, dan pertunjukan tari tradisional setiap malam.",
    konteks_budaya:
      "Ubud telah menjadi magnet bagi seniman sejak tahun 1930-an ketika pelukis Jerman Walter Spies menetap di sini. Kini, Ubud adalah rumah bagi Puri Lukisan, Sanggar Tari Legong, dan ekosistem kreatif yang memadukan tradisi Bali dengan seni kontemporer.",
    filosofi:
      "Konsep Tri Hita Karana — harmoni antara manusia dengan Tuhan, sesama manusia, dan alam — tercermin dalam setiap aspek kehidupan Ubud: dari tata letak sawah hingga upacara persembahan harian.",
    tips_kunjungan: [
      "Saksikan Tari Kecak di Pura Dalem setiap malam",
      "Jalan kaki melalui Campuhan Ridge Walk saat pagi",
      "Kunjungi Tegallalang Rice Terrace untuk foto sawah ikonik",
      "Hindari area Monkey Forest jika membawa makanan terbuka",
    ],
    waktu_terbaik: "April–Oktober",
    foto_url: [
      "https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    ],
    rating: 4.8,
    koordinat: { lat: -8.5069, lng: 115.2624 },
  },
  {
    id: "komodo",
    nama: "Taman Nasional Komodo",
    lokasi: "Manggarai Barat",
    provinsi: "Nusa Tenggara Timur",
    pulau: "Nusa Tenggara",
    kategori: "Alam & Lanskap",
    deskripsi_singkat:
      "Habitat asli komodo, kadal terbesar di dunia — dengan pantai pink, savana emas, dan perairan biru kristal.",
    konteks_budaya:
      "Masyarakat lokal Ata Modo hidup berdampingan dengan komodo selama berabad-abad. Mereka menyebut komodo sebagai 'sebae' (kakek) — refleksi kepercayaan bahwa manusia dan komodo adalah saudara yang lahir dari nenek moyang yang sama.",
    filosofi:
      "Legenda Putri Naga mengajarkan bahwa komodo dan manusia memiliki asal yang sama. Filosofi ini mendorong koeksistensi harmonis — manusia tidak memburu komodo, dan komodo dihormati sebagai bagian dari keluarga.",
    tips_kunjungan: [
      "Selalu didampingi ranger taman nasional saat trekking",
      "Kunjungi Padar Island untuk panorama tiga pantai berbeda warna",
      "Bawa sunscreen dan topi — cuaca sangat panas dan kering",
      "Snorkeling di Pink Beach untuk terumbu karang spektakuler",
    ],
    waktu_terbaik: "April–Juni & September–November",
    foto_url: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1571366343168-631c5bcebe24?w=800&q=80",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
    ],
    rating: 4.8,
    koordinat: { lat: -8.5502, lng: 119.4977 },
  },
  {
    id: "keraton-yogyakarta",
    nama: "Keraton Yogyakarta",
    lokasi: "Yogyakarta",
    provinsi: "DI Yogyakarta",
    pulau: "Jawa",
    kategori: "Situs Sejarah",
    deskripsi_singkat:
      "Istana resmi Kesultanan Yogyakarta yang masih berfungsi — pusat budaya Jawa yang hidup dan bernapas hingga hari ini.",
    konteks_budaya:
      "Keraton Yogyakarta didirikan oleh Sultan Hamengkubuwono I pada 1755. Hingga kini, keraton tetap menjadi pusat kehidupan budaya Jawa, menyelenggarakan upacara Garebeg, pertunjukan wayang kulit, dan melestarikan tradisi gamelan dan batik.",
    filosofi:
      "Tata letak keraton mengikuti sumbu kosmologis Jawa: Gunung Merapi (utara) — Keraton — Laut Selatan. Ini melambangkan keseimbangan antara kekuatan langit dan bumi, dengan sultan sebagai 'paku' (poros) yang menjaga harmoni.",
    tips_kunjungan: [
      "Datang pagi untuk menyaksikan latihan gamelan abdi dalem",
      "Kunjungi Taman Sari setelah dari keraton",
      "Beli batik tulis asli di Kampung Batik Kauman",
      "Ikuti tur gratis oleh mahasiswa UGM di akhir pekan",
    ],
    waktu_terbaik: "Sepanjang tahun (indoor)",
    foto_url: [
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80",
      "https://images.unsplash.com/photo-1565018054866-968e244671af?w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    ],
    rating: 4.6,
    koordinat: { lat: -7.8052, lng: 110.3641 },
  },
  {
    id: "wae-rebo",
    nama: "Desa Wae Rebo",
    lokasi: "Manggarai",
    provinsi: "Nusa Tenggara Timur",
    pulau: "Nusa Tenggara",
    kategori: "Desa Budaya",
    deskripsi_singkat:
      "Desa adat di atas awan dengan tujuh rumah adat Mbaru Niang berbentuk kerucut — pemenang UNESCO Asia-Pacific Heritage Award.",
    konteks_budaya:
      "Wae Rebo adalah desa tua suku Manggarai yang tersembunyi di ketinggian 1.100 mdpl. Tujuh rumah adat Mbaru Niang dibangun tanpa paku, setiap tingkat memiliki fungsi tertentu dan dihuni oleh keluarga besar sesuai hierarki adat.",
    filosofi:
      "Angka tujuh melambangkan tujuh arah mata angin versi Manggarai. Setiap rumah adat adalah miniatur kosmos — atap menjulang ke langit (alam atas), lantai menancap ke bumi (alam bawah), dan manusia hidup di tengah.",
    tips_kunjungan: [
      "Trek 3-4 jam dari Denge — siapkan fisik dan sepatu trekking",
      "Menginap semalam untuk upacara sambutan dan kopi pagi bersama warga",
      "Bawa oleh-oleh (beras, gula, kopi) sebagai tanda terima kasih",
      "Jangan terbang drone tanpa izin tetua adat",
    ],
    waktu_terbaik: "April–November (trail lebih kering)",
    foto_url: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1592364395653-83e648b20cc2?w=800&q=80",
    ],
    rating: 4.9,
    koordinat: { lat: -8.7684, lng: 120.3018 },
  },
  {
    id: "benteng-rotterdam",
    nama: "Benteng Fort Rotterdam",
    lokasi: "Makassar",
    provinsi: "Sulawesi Selatan",
    pulau: "Sulawesi",
    kategori: "Situs Sejarah",
    deskripsi_singkat:
      "Benteng peninggalan Kerajaan Gowa-Tallo abad ke-17 yang kini menjadi museum dan pusat budaya Makassar.",
    konteks_budaya:
      "Awalnya bernama Benteng Ujung Pandang, dibangun oleh Raja Gowa ke-9. Setelah jatuh ke tangan VOC pada 1669, benteng ini dinamai Fort Rotterdam. Kini menjadi museum yang menyimpan naskah kuno La Galigo — epos sastra terpanjang di dunia.",
    filosofi:
      "Benteng berbentuk penyu melambangkan filosofi Bugis-Makassar: penyu hidup di darat dan laut, simbol adaptasi dan ketahanan. Seperti penyu, bangsa Bugis berlayar ke mana-mana namun selalu pulang ke kampung halaman.",
    tips_kunjungan: [
      "Kunjungi Museum La Galigo di dalam benteng",
      "Datang sore hari untuk sunset spektakuler dari luar benteng",
      "Nikmati pisang epe dan coto Makassar di warung sekitar",
      "Sering ada pameran seni dan pertunjukan gratis di halaman benteng",
    ],
    waktu_terbaik: "Sepanjang tahun",
    foto_url: [
      "https://images.unsplash.com/photo-1592364395653-83e648b20cc2?w=800&q=80",
      "https://images.unsplash.com/photo-1571366343168-631c5bcebe24?w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    ],
    rating: 4.5,
    koordinat: { lat: -5.1343, lng: 119.4029 },
  },
  {
    id: "desa-penglipuran",
    nama: "Desa Penglipuran",
    lokasi: "Bangli",
    provinsi: "Bali",
    pulau: "Bali",
    kategori: "Desa Budaya",
    deskripsi_singkat:
      "Salah satu desa terbersih di dunia — desa adat Bali yang menjaga tata ruang dan tradisi leluhur secara utuh.",
    konteks_budaya:
      "Penglipuran adalah contoh hidup bagaimana masyarakat Bali menjaga keseimbangan antara modernisasi dan tradisi. Tata letak desa mengikuti konsep Tri Mandala (tiga zona suci) dengan jalan utama lurus dari pura di utara ke kuburan di selatan.",
    filosofi:
      "Konsep Tri Mandala membagi ruang menjadi Utama (suci/pura), Madya (tempat tinggal), dan Nista (profan/kuburan). Ini mengajarkan bahwa kehidupan manusia berada di antara yang sakral dan yang duniawi.",
    tips_kunjungan: [
      "Bayar tiket masuk yang langsung mendukung ekonomi desa",
      "Coba arak Bali dan jajan tradisional buatan warga",
      "Jangan memasuki rumah warga tanpa diundang",
      "Kunjungi hutan bambu di belakang desa untuk suasana tenang",
    ],
    waktu_terbaik: "April–Oktober",
    foto_url: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
      "https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80",
      "https://images.unsplash.com/photo-1604922824961-87cefb2e4b07?w=800&q=80",
    ],
    rating: 4.7,
    koordinat: { lat: -8.4217, lng: 115.357 },
  },
];

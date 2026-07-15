export interface InternetPlan {
  id: string;
  name: string;
  speed: number; // in Mbps
  price: number; // in IDR
  originalPrice?: number; // for displaying discounts
  isPopular: boolean;
  category: 'home' | 'gamer' | 'business';
  features: string[];
  bestFor: string[];
}

export interface BandungArea {
  name: string;
  subdistrict: string;
  status: 'covered' | 'partial' | 'upcoming';
  notes: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  whatsapp: string;
  subdistrict: string;
  address: string;
  selectedPlanId: string;
  selectedPlanName: string;
  status: 'Baru' | 'Dihubungi' | 'Terpasang';
  createdAt: string;
}

export const INTERNET_PLANS: InternetPlan[] = [
  {
    id: 'mnet-hemat',
    name: 'MNET HEMAT',
    speed: 20,
    price: 165000,
    originalPrice: 199000,
    isPopular: false,
    category: 'home',
    features: [
      'Kecepatan s/d 20 Mbps',
      'Kuota Unlimited tanpa batas FUP',
      'Teknologi 100% Fiber Optic',
      'Cocok untuk 1 - 3 Perangkat',
      'Gratis Biaya Pemasangan',
      'Layanan Pengaduan IT 24 Jam'
    ],
    bestFor: ['Jualan Online (OLShop)', 'Belajar / Home Schooling']
  },
  {
    id: 'mnet-populer',
    name: 'MNET POPULER',
    speed: 50,
    price: 275000,
    originalPrice: 349000,
    isPopular: true,
    category: 'home',
    features: [
      'Kecepatan s/d 50 Mbps (Simetris 1:1)',
      'Kuota Unlimited tanpa batas FUP',
      'Teknologi 100% Fiber Optic',
      'Cocok untuk 4 - 8 Perangkat',
      'Gratis Biaya Pemasangan',
      'Prioritas Bandwidth & IT 24 Jam',
      'Stabil di segala cuaca'
    ],
    bestFor: ['Streaming HD/4K', 'Gaming', 'Wargi Bandung Serba Bisa']
  },
  {
    id: 'mnet-gamer',
    name: 'MNET GAMER PRO',
    speed: 100,
    price: 399000,
    originalPrice: 499000,
    isPopular: false,
    category: 'gamer',
    features: [
      'Kecepatan s/d 100 Mbps (Murni 1:1)',
      'Ping Rendah (Low Latency) & No Packet Loss',
      'Kuota Unlimited tanpa batas FUP',
      'Teknologi 100% Fiber Optic',
      'Cocok untuk 8 - 15 Perangkat',
      'Gratis Biaya Pemasangan',
      'Layanan Pengaduan IT 24 Jam VIP'
    ],
    bestFor: ['Gaming Kompetitif', 'Live Streaming/Youtube', 'Selebgram & Influencer']
  },
  {
    id: 'mnet-business',
    name: 'MNET ULTRA BIZ',
    speed: 200,
    price: 699000,
    originalPrice: 899000,
    isPopular: false,
    category: 'business',
    features: [
      'Kecepatan s/d 200 Mbps (Simetris 1:1)',
      'IP Dynamic / IP Static (opsional)',
      'Kuota Unlimited tanpa batas FUP',
      'SLA Jaminan Koneksi 99.9%',
      'Cocok untuk Kantor, Cafe, Coworking',
      'Gratis Biaya Pemasangan',
      'Dukungan Tim IT Standby 24 Jam VIP'
    ],
    bestFor: ['Kantor / UMKM', 'Cafe & Resto', 'Multitasking Skala Besar']
  }
];

export const BANDUNG_AREAS: BandungArea[] = [
  { name: 'Dago', subdistrict: 'Coblong', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  { name: 'Dipatiukur', subdistrict: 'Coblong', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  { name: 'Sekeloa', subdistrict: 'Coblong', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  { name: 'Antapani', subdistrict: 'Antapani', status: 'covered', notes: 'Jaringan Utama Aktif, slot tiang melimpah.' },
  { name: 'Buahbatu', subdistrict: 'Buahbatu', status: 'covered', notes: 'Sudah tercover penuh hingga perumahan.' },
  { name: 'Turangga', subdistrict: 'Lengkong', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  { name: 'Cijagra', subdistrict: 'Lengkong', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  { name: 'Sukajadi', subdistrict: 'Sukajadi', status: 'covered', notes: 'Coverage penuh area pertokoan dan kos-kosan.' },
  { name: 'Gegerkalong', subdistrict: 'Sukasari', status: 'covered', notes: 'Coverage penuh area dekat universitas.' },
  { name: 'Pasteur', subdistrict: 'Cicendo', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  { name: 'Cihampelas', subdistrict: 'Bandung Wetan', status: 'covered', notes: 'Jaringan Fiber Optic 100% Aktif & Siap Pasang.' },
  
  { name: 'Kiaracondong', subdistrict: 'Kiaracondong', status: 'partial', notes: 'Sebagian jalan tercover. Isi formulir untuk cek jarak tiang terdekat.' },
  { name: 'Babakan Surabaya', subdistrict: 'Kiaracondong', status: 'partial', notes: 'Sebagian jalan tercover. Isi formulir untuk cek jarak tiang terdekat.' },
  { name: 'Cibaduyut', subdistrict: 'Bojongloa Kidul', status: 'partial', notes: 'Tersedia di beberapa komplek utama. Harap hubungi admin untuk cek tiang.' },
  { name: 'Ujungberung', subdistrict: 'Ujungberung', status: 'partial', notes: 'Jaringan sedang diperluas. Silakan isi alamat lengkap.' },
  { name: 'Arcamanik', subdistrict: 'Arcamanik', status: 'partial', notes: 'Tersedia di jalan raya utama dan beberapa kluster.' },
  
  { name: 'Cigondewah', subdistrict: 'Bandung Kulon', status: 'upcoming', notes: 'Masuk dalam rencana ekspansi bulan depan. Daftar untuk booking promo!' },
  { name: 'Jatinangor', subdistrict: 'Sumedang/Perbatasan', status: 'upcoming', notes: 'Rencana ekspansi kuartal ini. Kumpulkan dukungan warga agar cepat ditarik kabel.' },
  { name: 'Rancaekek', subdistrict: 'Bandung Timur', status: 'upcoming', notes: 'Daftar minat sekarang untuk mempercepat instalasi di wilayah Anda.' },
  { name: 'Soreang', subdistrict: 'Kabupaten Bandung', status: 'upcoming', notes: 'Daftar minat sekarang untuk prioritas instalasi.' }
];

export const ADVANTAGES = [
  {
    title: 'INTERNET STABIL',
    description: 'Koneksi konstan tanpa drop kencang di segala cuaca, baik hujan deras maupun panas terik.',
    icon: 'Activity'
  },
  {
    title: 'FIBER OPTIC 100%',
    description: 'Menggunakan kabel serat optik murni dari pusat server hingga ke dalam rumah Anda.',
    icon: 'Cable'
  },
  {
    title: 'SPEED 1:1',
    description: 'Kecepatan upload sama cepat dengan download. Sempurna untuk video call tanpa delay dan upload konten.',
    icon: 'Zap'
  },
  {
    title: 'KUOTA UNLIMITED TANPA BATAS',
    description: 'Bebas internetan tanpa FUP (Fair Usage Policy). Kecepatan tidak akan turun walau pakai ratusan gigabyte.',
    icon: 'Infinity'
  },
  {
    title: 'HARGA TERJANGKAU',
    description: 'Tarif berlangganan flat, hemat, ramah di kantong wargi Bandung dengan jaminan kualitas terbaik.',
    icon: 'TrendingDown'
  },
  {
    title: 'GRATIS BIAYA PEMASANGAN',
    description: 'Hemat biaya awal hingga ratusan ribu rupiah! Kami pasang sampai aktif secara gratis.',
    icon: 'CheckCircle'
  },
  {
    title: 'LAYANAN PENGADUAN IT 24 JAM',
    description: 'Kendala internet? Tim IT handal kami siap merespons laporan Anda kapan saja selama 24 jam penuh.',
    icon: 'PhoneCall'
  }
];

export const USE_CASES = [
  {
    title: 'JUALAN ONLINE (OLSHOP)',
    description: 'Upload produk massal, balas chat instan, dan live streaming jualan mulus tanpa putus-putus guna melipatgandakan omset toko online Anda.',
    badge: 'OMSET MELESIT',
    icon: 'ShoppingBag'
  },
  {
    title: 'BELAJAR (HOME SCHOOLING)',
    description: 'Ujian online, kelas video Zoom/Meet, dan unduh materi belajar berat lancar tanpa diskoneksi mendadak.',
    badge: 'PRESTASI LANCAR',
    icon: 'GraduationCap'
  },
  {
    title: 'GAMING',
    description: 'Bermain game kompetitif Mobile Legends, Valorant, PUBG dengan ping ultra-rendah, stabil, bebas lag, dan nol packet loss.',
    badge: 'PING HIJAU',
    icon: 'Gamepad2'
  },
  {
    title: 'STREAMING',
    description: 'Nonton tayangan Netflix, YouTube, Disney+ kualitas 4K HDR tanpa buffering, bisa diakses banyak TV & HP sekaligus.',
    badge: 'BEBAS BUFFER',
    icon: 'Tv'
  },
  {
    title: 'SELEBGRAM / INFLUENCER, DLL',
    description: 'Live streaming resolusi tinggi, unggah video reels/Tiktok ukuran besar hitungan detik, serta kelola banyak akun sosial media dengan responsif.',
    badge: 'KONTEN VIRAL',
    icon: 'Users'
  }
];

export const FAQS = [
  {
    question: 'Apakah harga bulanan MNET FIBER bersifat flat (tetap)?',
    answer: 'Ya! Harga langganan MNET FIBER bersifat FLAT setiap bulan. Tidak ada biaya tersembunyi atau kenaikan harga tiba-tiba di pertengahan masa langganan.'
  },
  {
    question: 'Apa maksud dari Gratis Biaya Pemasangan?',
    answer: 'Artinya Anda tidak perlu membayar biaya instalasi kabel fiber, modem/ONT, dan konfigurasi wifi router sebesar Rp500.000. Seluruh pemasangan gratis hingga internet aktif di rumah Anda!'
  },
  {
    question: 'Berapa lama proses pemasangan internet setelah mendaftar?',
    answer: 'Proses pemasangan standar berkisar antara 1 - 2 hari kerja setelah pendaftaran divalidasi oleh tim teknis kami, tergantung ketersediaan slot jadwal dan kondisi lapangan.'
  },
  {
    question: 'Apakah MNET FIBER benar-benar tanpa batas kuota (unlimited)?',
    answer: 'Sangat benar! Kami menawarkan jaringan TRUE UNLIMITED tanpa FUP (Fair Usage Policy). Anda bebas mengunduh dan mengunggah data sepuasnya tanpa takut kecepatan diturunkan karena melampaui batas tertentu.'
  },
  {
    question: 'Bagaimana jika terjadi kendala pada koneksi internet saya?',
    answer: 'MNET menyediakan tim CS dan Teknisi IT yang siaga 24 jam penuh. Anda bisa langsung menghubungi nomor WhatsApp Pengaduan IT 24 Jam kami, dan tim kami akan segera memandu pemecahan masalah atau menjadwalkan kunjungan teknisi ke lokasi.'
  }
];

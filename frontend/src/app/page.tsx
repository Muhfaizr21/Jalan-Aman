import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hyperspeed from "@/components/reactbits/Hyperspeed";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import BlurText from "@/components/reactbits/BlurText";
import TiltedCard from "@/components/reactbits/TiltedCard";
import RouteVisualizer from "@/components/RouteVisualizer";
import {
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Smartphone,
  AlertTriangle,
  Lightbulb,
  Building2,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  Car,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[85vh] w-full flex flex-col items-center justify-center pt-32 pb-16 px-4 overflow-hidden">
          {/* Hyperspeed Night Highway 3D Canvas Background */}
          <Hyperspeed className="z-0 opacity-75" speed={1.3} />

          {/* Ambient Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

          {/* Hero Content - Zero AI Slop, Direct & Grounded */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* BlurText Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 max-w-4xl">
              <BlurText
                text="Pulang Malam Lebih Aman. Hindari Jalur Rawan Begal dan Jalan Gelap."
                delay={45}
                animateBy="words"
                className="justify-center"
              />
            </h1>

            {/* Subtitle explaining the real intent */}
            <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Aplikasi navigasi biasa hanya mencari jalan paling cepat tanpa peduli jalan itu sepi atau rawan kejahatan. <strong>JalanAman</strong> memilihkan rute dengan penerangan terbaik, ramai kendaraan, dan bebas dari titik rawan kriminalitas.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                href="#mobile"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>Unduh Aplikasi Mobile</span>
              </Link>

              <Link
                href="#rute"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900/80 backdrop-blur-md text-zinc-200 font-semibold text-sm hover:bg-zinc-800 hover:text-white transition-all"
              >
                <span>Coba Simulasi Rute</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= MASALAH NYATA vs SOLUSI JALANAMAN ================= */}
        <section className="py-20 px-4 max-w-6xl mx-auto relative z-10 border-t border-zinc-800/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kenapa Sistem JalanAman Ini Dibutuhkan?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2">
              Kondisi riil yang sering dialami pengendara motor, pekerja lembur, dan wanita saat pulang di malam hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-3">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Bahaya Peta Konvensional</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Diarahkan ke Gang Sunyi demi Hemat 2 Menit
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Peta biasa hanya menghitung efisiensi waktu perjalanan, tanpa memeriksa apakah jalanan itu gelap gulita atau sepi warga. Di malam hari, rute &quot;tercepat&quot; justru kerap membawa pengendara ke titik paling rentan tindak kejahatan.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-start gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-zinc-300">
                  <strong>Solusi JalanAman:</strong> Memprioritaskan jalan protokol berpenerangan lampu jalan (PJU) aktif dan ramai lalu lintas meski sedikit memutar.
                </span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-3">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Informasi Kejahatan Tertutup</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Tidak Tahu Titik yang Sering Terjadi Pembegalan
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pengendara tidak memiliki data riwayat kriminalitas di ruas jalan tertentu. Kasus pembegalan, penodongan, atau aksi kekerasan biasanya baru diketahui masyarakat setelah peristiwa menelan korban.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-start gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-zinc-300">
                  <strong>Solusi JalanAman:</strong> Menandai zona merah kriminalitas secara visual dan memberi peringatan suara otomatis sebelum pengendara melintas.
                </span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-3">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Situasi Darurat di Perjalanan</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Panik & Bingung Saat Merasa Dibuntuti
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ketika ada pengendara mencurigakan membuntuti di jalan sepi, korban kerap panik dan tidak mengetahui lokasi pos polisi, pos satpam, atau tempat umum yang aman untuk berlindung.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-start gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-zinc-300">
                  <strong>Solusi JalanAman:</strong> Tombol SOS satu sentuhan yang langsung membagikan koordinat GPS presisi ke keluarga dan mengarahkan ke pos pengamanan aktif terdekat.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAKSUD & 4 TUJUAN UTAMA SISTEM ================= */}
        <section id="alur" className="py-20 px-4 bg-zinc-900/40 border-y border-zinc-800/80 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Misi Perlindungan Warga
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                Maksud & 4 Pilar Perlindungan JalanAman
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mt-2">
                Menghubungkan masyarakat, navigasi protektif, dan respon aparat untuk memastikan setiap warga pulang ke rumah dengan selamat tanpa rasa takut.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tujuan 1 */}
              <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    1. Menentukan Rute Berdasarkan Indeks Keamanan
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Sistem menganalisis 4 variabel keselamatan di malam hari: ketersediaan lampu penerangan jalan umum (PJU), deretan pertokoan dan fasilitas 24 jam, kepadatan lalu lintas, serta jarak aman menuju pos polisi terdekat.
                  </p>
                </div>
              </div>

              {/* Tujuan 2 */}
              <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    2. Memetakan Zona Merah Begal & Kriminalitas Jalanan
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Mengagregasi data riwayat kriminalitas jalanan yang terverifikasi agar pengguna dapat proaktif menghindari blackspot kejahatan, terutama pada jam-jam paling rawan (pukul 22.00 hingga 04.30).
                  </p>
                </div>
              </div>

              {/* Tujuan 3 */}
              <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    3. Respon Cepat Saat Menghadapi Ancaman di Jalan
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Menyediakan tombol darurat instan di ponsel yang langsung mentransmisikan lokasi GPS presisi ke lingkaran keluarga dan secara otomatis memandu pengendara menuju titik pengamanan terdekat.
                  </p>
                </div>
              </div>

              {/* Tujuan 4 */}
              <div className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    4. Mendukung Penentuan Rute Patroli Presisi Kepolisian
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Melalui integrasi data spasial pemetaan terpusat, aparat kepolisian dan petugas keamanan dapat memantau sebaran titik rawan dan lampu padam untuk mengarahkan patroli secara terfokus ke lokasi yang membutuhkan penjagaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SIMULASI RUTE NYATA ================= */}
        <section id="rute" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Simulasi Navigasi: Rute Biasa vs Rute JalanAman
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Bandingkan bagaimana JalanAman memprioritaskan keselamatan jiwa Anda di atas sekadar selisih waktu beberapa menit.
            </p>
          </div>

          <RouteVisualizer />
        </section>

        {/* ================= FITUR UNTUK WARGA & PENGENDARA (BENTO SPOTLIGHT) ================= */}
        <section id="fitur" className="py-20 px-4 max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Fitur Utama Proteksi JalanAman
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Teknologi terintegrasi untuk mewujudkan perjalanan malam yang tenang dan terlindungi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Navigasi Rute Aman */}
            <SpotlightCard className="md:col-span-2 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Navigasi Berdasarkan Tingkat Penerangan & Keramaian
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Aplikasi mobile memandu Anda secara otomatis memilih ruas jalan protokol yang memiliki lampu penerangan jalan umum aktif, fasilitas publik 24 jam, dan volume arus lalu lintas yang hidup.
              </p>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  Mendeteksi Jalan Gelap & Menyarankan Jalur Alternatif
                </span>
                <span className="text-emerald-400 font-semibold">Otomatis Aktif</span>
              </div>
            </SpotlightCard>

            {/* Card 2: Peringatan Titik Rawan */}
            <SpotlightCard className="group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Peringatan Dini Zona Rawan Begal</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Peringatan suara dan notifikasi instan langsung aktif saat kendaraan Anda mendekati perimeter 500 meter dari area dengan riwayat insiden kriminalitas malam.
              </p>
              <div className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                <span>Alert Otomatis Saat Berkendara</span>
              </div>
            </SpotlightCard>

            {/* Card 3: Tombol SOS */}
            <SpotlightCard className="group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tombol SOS & Lokasi Darurat</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Cukup tekan dan tahan tombol darurat di ponsel saat merasa terancam untuk menyiarkan koordinat GPS langsung ke keluarga serta mencari shelter terdekat.
              </p>
              <div className="text-xs text-amber-400 font-semibold">
                Langsung Kirim Lokasi Real-Time
              </div>
            </SpotlightCard>

            {/* Card 4: Pemetaan Pos Pengamanan & Shelter Evakuasi */}
            <SpotlightCard className="md:col-span-2 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Pemetaan Pos Pengamanan & Shelter Evakuasi 24 Jam
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Aplikasi memetakan keberadaan pos polisi, pos jaga swakarsa, kantor pemadam kebakaran, serta pertokoan 24 jam yang dapat dijadikan shelter perlindungan darurat ketika Anda membutuhkan pertolongan seketika saat berkendara di malam hari.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <span className="text-zinc-400">
                  Jaringan shelter terverifikasi aktif di sepanjang koridor perjalanan Anda.
                </span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  Shelter Aman Terverifikasi
                </span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* ================= SIAPA YANG PALING TERBANTU ================= */}
        <section id="statistik" className="py-20 px-4 bg-zinc-900/30 border-t border-zinc-800/80 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Siapa yang Dilindungi oleh JalanAman?
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                JalanAman dirancang untuk melindungi setiap warga yang harus berhadapan dengan resiko perjalanan di malam hari.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">Pekerja Shift Malam & Lembur</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tenaga kesehatan, staf industri manufaktur, dan pekerja retail yang rutin melintasi jalan raya saat tengah malam atau dini hari.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">Wanita & Pengendara Sendiri</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Memberikan rasa aman ekstra lewat rute yang selalu ramai dan terpantau, menghindari risiko pelecehan dan pemalakan di jalan sunyi.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">Pengemudi Ojek Online</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Membantu pengemudi memilih rute antar yang terverifikasi aman dari tindak begal saat melayani pesanan pelanggan di kawasan asing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">Aparat & Petugas Patroli</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Memperoleh data titik rawan kriminalitas dan lampu PJU padam yang valid langsung dari warga untuk mengefektifkan rute patroli malam.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MOBILE APP SHOWCASE DENGAN TILTEDCARD ================= */}
        <section id="mobile" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-zinc-900/80 p-8 sm:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Lindungi Diri Anda & Keluarga Malam Ini
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base mt-4 leading-relaxed">
                Unduh aplikasi JalanAman di smartphone Anda. Jadikan setiap kepulangan kerja larut malam atau perjalanan di area baru terasa lebih tenang dan terpantau aman.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <button className="px-6 py-3.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                  Unduh APK Android
                </button>
                <button className="px-6 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 font-semibold text-xs sm:text-sm hover:bg-zinc-800 transition-all">
                  iOS (Segera Hadir)
                </button>
              </div>
            </div>

            {/* 3D Tilted Card Preview of the Android Mobile Interface */}
            <div className="w-full max-w-sm flex justify-center">
              <TiltedCard className="relative group cursor-pointer max-w-[320px]">
                {/* Glowing Ambient Behind Device */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/25 via-teal-500/15 to-transparent blur-2xl rounded-[3rem] opacity-70 group-hover:opacity-100 transition-opacity" />

                {/* Smartphone Shell with Generated Mockup */}
                <div className="relative rounded-[2.5rem] p-1.5 bg-zinc-900 border border-zinc-700/80 shadow-2xl shadow-emerald-500/15 overflow-hidden">
                  <Image
                    src="/android-mockup.jpg"
                    alt="Visualisasi Aplikasi Android JalanAman - Navigasi Rute Teraman dari Kriminalitas"
                    width={360}
                    height={640}
                    className="rounded-[2.1rem] w-full h-auto object-cover block"
                    priority
                  />
                </div>

                {/* Floating Highlight Badges */}
                <div className="absolute -left-6 top-16 hidden sm:flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/90 border border-emerald-500/30 backdrop-blur-md shadow-xl text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Rute Lampu Terang</span>
                </div>

                <div className="absolute -right-6 bottom-28 hidden sm:flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/90 border border-rose-500/30 backdrop-blur-md shadow-xl text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="font-semibold text-rose-300">Zona Bahaya Terhindari</span>
                </div>
              </TiltedCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

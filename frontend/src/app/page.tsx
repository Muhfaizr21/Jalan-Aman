import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hyperspeed from "@/components/reactbits/Hyperspeed";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import BlurText from "@/components/reactbits/BlurText";
import TiltedCard from "@/components/reactbits/TiltedCard";
import GridPattern from "@/components/reactbits/GridPattern";
import RouteVisualizer from "@/components/RouteVisualizer";
import { AppStoreButton, GalaxyStoreButton, GooglePlayButton } from "@/components/base/buttons/app-store-buttons";
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
  Car,
  Zap,
  Radio,
  Eye,
  Lock,
  Siren,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-neutral-950 selection:text-white font-sans">
      <Navbar />

       <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[85vh] w-full flex flex-col items-center justify-center pt-32 pb-16 px-4 overflow-hidden">
          <Hyperspeed className="z-0 opacity-70" speed={1.3} theme="light" />
          <div className="absolute top-0 inset-x-0 h-[640px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04),transparent_70%)] pointer-events-none z-0" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[320px] bg-gradient-to-tr from-neutral-200/40 via-slate-100/25 to-neutral-200/30 blur-[120px] rounded-full pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_75%)] pointer-events-none z-0" />

          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.1] mb-6 max-w-4xl">
              <BlurText
                text="Pulang Malam Tanpa Takut. Pilih Jalan Terang, Bukan Sekadar Jalan Pintas."
                delay={45}
                animateBy="words"
                className="justify-center text-neutral-950"
              />
            </h1>
            <p className="text-base sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Peta biasa mengarahkan Anda ke gang gelap hanya demi hemat 2 menit. <strong className="text-neutral-950 font-semibold">JalanAman</strong> memprioritaskan lampu jalan aktif, jalan ramai, dan pos jaga agar Anda pulang selamat sampai rumah.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                href="#mobile"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-neutral-950 text-white font-bold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-md shadow-neutral-950/10 border border-neutral-800"
              >
                <Smartphone className="w-4 h-4" />
                <span>Unduh Aplikasi Mobile</span>
              </Link>
              <Link
                href="#rute"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-neutral-300 bg-white/95 backdrop-blur-md text-neutral-800 font-semibold text-sm hover:bg-neutral-50 hover:text-neutral-950 hover:border-neutral-400 shadow-2xs transition-all"
              >
                <span>Lihat Simulasi Rute</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= STATISTIK OPERASIONAL ================= */}
        <section className="py-4 sm:py-8 px-3 sm:px-4 max-w-6xl mx-auto relative z-10">
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] p-4 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
              <div className="flex flex-col items-center p-1 sm:p-0">
                <div className="text-3xl sm:text-5xl font-black text-neutral-950 font-mono tracking-tight flex items-center justify-center">
                  14.300+
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2.5 font-bold text-[11px] sm:text-xs text-neutral-900">
                  <span className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse shrink-0" />
                  <span className="truncate">Koridor Terang Terverifikasi</span>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 max-w-[140px] sm:max-w-[170px] leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Jalan protokol dengan lampu PJU menyala aktif yang tercatat dalam database kota.
                </p>
              </div>
              <div className="flex flex-col items-center p-1 sm:p-0">
                <div className="text-3xl sm:text-5xl font-black text-neutral-950 font-mono tracking-tight flex items-center justify-center">
                  327
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2.5 font-bold text-[11px] sm:text-xs text-neutral-900">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="truncate">Zona Rawan Teridentifikasi</span>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 max-w-[140px] sm:max-w-[170px] leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Titik rawan kriminalitas jalanan yang dihindari secara aktif oleh algoritma.
                </p>
              </div>
              <div className="flex flex-col items-center pt-3 sm:pt-0 p-1 sm:p-0">
                <div className="text-3xl sm:text-5xl font-black text-neutral-950 font-mono tracking-tight flex items-center justify-center">
                  1.840
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2.5 font-bold text-[11px] sm:text-xs text-neutral-900">
                  <span className="w-2 h-2 rounded-full bg-neutral-950 shrink-0" />
                  <span className="truncate">Shelter & Pos Evakuasi</span>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 max-w-[140px] sm:max-w-[170px] leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Pos polisi, pos satpam, dan minimarket 24 jam yang terintegrasi dalam sistem.
                </p>
              </div>
              <div className="flex flex-col items-center pt-3 sm:pt-0 p-1 sm:p-0">
                <div className="text-3xl sm:text-5xl font-black text-neutral-950 font-mono tracking-tight flex items-center justify-center">
                  &lt;3s
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2.5 font-bold text-[11px] sm:text-xs text-neutral-900">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="truncate">Respon SOS</span>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 max-w-[140px] sm:max-w-[170px] leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Satu klik, koordinat GPS dikirim ke kontak darurat dalam waktu kurang dari 3 detik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LOGIKA PENENTUAN RUTE ================= */}
        <section id="arsitektur" className="py-10 sm:py-24 px-3 sm:px-4 bg-neutral-50/70 border-y border-neutral-200/80 relative z-10 overflow-hidden">
          <GridPattern className="opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neutral-300/20 blur-[140px] rounded-full pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] sm:text-xs mb-3 sm:mb-4 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse" />
                <span className="font-mono font-bold text-neutral-900 tracking-wide">
                  ARSITEKTUR MULTI-FAKTOR
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mt-1 sm:mt-2 tracking-tight">
                Logika Keselamatan di Balik Setiap Rute
              </h2>
              <p className="text-slate-600 text-xs sm:text-base mt-2 sm:mt-3">
                JalanAman bukan sekadar peta penunjuk arah. Algoritma protektif bekerja dengan mengevaluasi empat parameter keselamatan secara simultan sebelum merekomendasikan rute optimal.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.05)" className="p-3 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-start">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-900 shrink-0 shadow-xs">
                    <Lightbulb className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                      <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 sm:px-2.5 rounded border border-slate-200">
                        FAKTOR 01
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-lg font-bold text-slate-950 mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                      Indeks Penerangan PJU
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      Setiap rute dihitung berdasarkan persentase lampu jalan umum (PJU) yang menyala. Rute dengan penerangan tinggi diprioritaskan secara absolut.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-3 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-start">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
                    <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                      <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 sm:px-2.5 rounded border border-slate-200">
                        FAKTOR 02
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-lg font-bold text-slate-950 mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                      Peta Titik Rawan Kriminalitas
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      Data spasial kejadian kriminalitas jalanan dari sumber terverifikasi diproses untuk menghindari radius rawan secara proaktif.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.12)" className="p-3 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-start">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                    <Radio className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                      <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 sm:px-2.5 rounded border border-slate-200">
                        FAKTOR 03
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-lg font-bold text-slate-950 mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                      Koridor Aktif 24 Jam
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      Preferensi diberikan pada jalan dengan volume kendaraan dan pejalan kaki tinggi, yang berfungsi sebagai pengawal alami keselamatan malam.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.12)" className="p-3 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-start">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-sky-600 shrink-0 shadow-xs">
                    <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                      <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 sm:px-2.5 rounded border border-slate-200">
                        FAKTOR 04
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-lg font-bold text-slate-950 mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                      Jarak Shelter Terdekat
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      Rute dioptimalkan agar selalu berada dalam radius jangkauan pos kepolisian, pos satpam, atau fasilitas pelayanan 24 jam lainnya.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= SIMULASI RUTE NYATA ================= */}
        <section id="rute" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Hemat 3 Menit atau Pulang Selamat?
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Bandingkan cara navigasi biasa yang sering menjebak ke jalan gelap dengan algoritma protektif JalanAman.
            </p>
          </div>
          <RouteVisualizer />
        </section>

        {/* ================= PROTOKOL DARURAT SOS ================= */}
        <section id="protokol" className="py-10 sm:py-24 px-3 sm:px-4 bg-neutral-50/70 border-y border-neutral-200/80 relative z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs mb-3 sm:mb-4 text-slate-800 shadow-xs">
                <Siren className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-mono font-bold tracking-wide">PROTOKOL DARURAT SOS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mt-1 sm:mt-2 tracking-tight">
                Apa yang Terjadi Saat Tombol SOS Ditekan?
              </h2>
              <p className="text-slate-600 text-xs sm:text-base mt-2 sm:mt-3">
                Setiap detik sangat berharga. Protokol ini dirancang untuk mengirimkan sinyal darurat tanpa bergantung pada aplikasi yang terbuka atau koneksi suara aktif.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.08)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3 sm:mb-6 shadow-xs">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-950 mb-1.5 sm:mb-2">1. Enkripsi & Pengiriman Instan</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Koordinat GPS terenkripsi dikirim via jaringan data ke server darurat dan kontak yang telah ditentukan pengguna, tanpa memerlukan aplikasi lain.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.08)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3 sm:mb-6 shadow-xs">
                    <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-950 mb-1.5 sm:mb-2">2. Panggilan Otomatis ke Kontak</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Sistem melakukan panggilan suara ke daftar kontak darurat pengguna, menyampaikan tautan lokasi real-time agar keluarga bisa merespons segera.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.08)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3 sm:mb-6 shadow-xs">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-950 mb-1.5 sm:mb-2">3. Peta Pelacakan Real-Time</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Kontak darurat dan pihak berwenang yang diberi akses dapat melacak pergerakan pengguna pada peta interaktif hingga situasi teratasi.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= FITUR UNTUK WARGA & PENGENDARA ================= */}
        <section id="fitur" className="py-10 sm:py-20 px-3 sm:px-4 max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Fitur Cerdas untuk Pengendara Malam
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 sm:mt-2">
              Didesain khusus untuk melindungi pengendara motor, ojek online, dan pejalan kaki saat jalanan mulai sepi.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
            <SpotlightCard className="col-span-2 md:col-span-2 p-3.5 sm:p-7 group bg-white border border-slate-200 shadow-sm hover:shadow-md">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 sm:mb-6 text-neutral-900">
                <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-950 mb-1.5 sm:mb-2">
                Peta yang Mengutamakan Penerangan & Keramaian
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-6">
                Tidak ada lagi diarahkan ke kuburan, kebun kosong, atau kolong jembatan gelap. Algoritma cerdas otomatis memilih jalur utama yang berlampu terang dan ramai kendaraan.
              </p>
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] sm:text-xs text-slate-700">
                <span className="flex items-center gap-1.5 sm:gap-2 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900 shrink-0" />
                  <span>Deteksi Otomatis Lampu PJU & Jalur Hidup</span>
                </span>
                <span className="text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 shrink-0">Otomatis</span>
              </div>
            </SpotlightCard>
            <SpotlightCard className="col-span-1 md:col-span-1 p-3 sm:p-6 group bg-white border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-2.5 sm:mb-6 text-rose-600">
                  <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-slate-950 mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                  Radar Titik Rawan
                </h3>
                <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3 sm:line-clamp-none">
                  Alert suara seketika sebelum Anda memasuki radius 500m dari titik rawan kejahatan.
                </p>
              </div>
              <div className="text-[10px] sm:text-xs text-slate-800 font-semibold flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">Alert Otomatis</span>
              </div>
            </SpotlightCard>
            <SpotlightCard className="col-span-1 md:col-span-1 p-3 sm:p-6 group bg-white border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-2.5 sm:mb-6 text-amber-600">
                  <PhoneCall className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-slate-950 mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                  Sinyal SOS & GPS
                </h3>
                <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3 sm:line-clamp-none">
                  Cukup 1 sentuhan untuk membagikan telemetri posisi real-time ke kontak keluarga.
                </p>
              </div>
              <div className="text-[10px] sm:text-xs text-slate-800 font-semibold flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">GPS Real-Time</span>
              </div>
            </SpotlightCard>
            <SpotlightCard className="col-span-2 md:col-span-2 p-3.5 sm:p-7 group bg-white border border-slate-200 shadow-sm hover:shadow-md">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 sm:mb-6 text-sky-600">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-950 mb-1.5 sm:mb-2">
                Jaringan Shelter & Pos Polisi 24 Jam Terdekat
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-6">
                Peta terintegrasi langsung menampilkan titik aman terdekat-pos polisi, pos satpam komplek, dan minimarket 24 jam-sebagai tempat berlindung saat situasi darurat.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] sm:text-xs">
                <span className="text-slate-600">
                  Jaringan shelter terverifikasi aktif dan siap evakuasi di sepanjang rute.
                </span>
                <span className="text-slate-800 font-semibold flex items-center gap-1.5 shrink-0 bg-slate-100 px-2 py-1 sm:px-2.5 rounded-lg border border-slate-200 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900" />
                  Shelter Terverifikasi
                </span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* ================= SIAPA YANG PALING TERBANTU ================= */}
        <section id="statistik" className="py-10 sm:py-24 px-3 sm:px-4 bg-slate-100/60 border-t border-slate-200 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                Dirancang untuk Mereka yang Pulang Larut
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 sm:mt-2">
                Setiap orang yang berjuang hingga larut malam berhak menempuh perjalanan pulang dengan tenang dan selamat.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:text-neutral-950 mb-2.5 sm:mb-4 transition-colors">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Pekerja Shift Malam</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Tenaga medis, karyawan pabrik, dan staf ritel yang pulang saat jalanan mulai sepi.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:text-neutral-950 mb-2.5 sm:mb-4 transition-colors">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Pengendara Solo & Wanita</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Jaminan rute terang yang selalu ramai orang, bebas dari risiko terjebak di lorong sunyi.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:text-neutral-950 mb-2.5 sm:mb-4 transition-colors">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Driver Ojek Online</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Antar penumpang atau pesanan larut malam dengan tenang tanpa khawatir masuk jebakan begal.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:text-neutral-950 mb-2.5 sm:mb-4 transition-colors">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Petugas Patroli & Warga</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Peta sebaran titik rawan untuk memfokuskan pos pantau dan mobil patroli malam lebih presisi.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= MOBILE APP SHOWCASE ================= */}
        <section id="mobile" className="py-10 sm:py-24 px-3 sm:px-4 max-w-7xl mx-auto relative z-10">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-14 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-neutral-200/40 blur-[90px] rounded-full pointer-events-none" />
            <div className="max-w-xl text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-800 mb-3 sm:mb-4">
                <span className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse" />
                <span>APLIKASI GRATIS UNTUK PUBLIK</span>
              </div>
              <h2 className="text-2xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Perjalanan Pulang Tenang Dimulai Malam Ini
              </h2>
              <p className="text-slate-600 text-xs sm:text-base mt-2.5 sm:mt-4 leading-relaxed">
                Pasang JalanAman di smartphone Anda dan keluarga. Pastikan setiap perjalanan larut malam selalu dipandu oleh rute paling aman dan terpantau aktif.
              </p>
              <div className="flex flex-col items-start gap-3 md:flex-row mt-6 sm:mt-8">
                <GooglePlayButton size="md" />
                <AppStoreButton size="md" />
                <GalaxyStoreButton size="md" />
              </div>
            </div>
            <div className="w-full max-w-sm flex justify-center relative z-10">
              <TiltedCard className="relative group cursor-pointer max-w-[260px] sm:max-w-[320px]">
                <div className="absolute -inset-3 bg-neutral-950/5 blur-2xl rounded-[3rem] opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="relative rounded-[2.5rem] p-1.5 bg-slate-900 border-4 border-slate-800 shadow-2xl overflow-hidden">
                  <Image
                    src="/android-mockup.jpg"
                    alt="Visualisasi Aplikasi Android JalanAman - Navigasi Rute Teraman dari Kriminalitas"
                    width={360}
                    height={640}
                    className="rounded-[2.1rem] w-full h-auto object-cover block"
                    priority
                  />
                </div>
                <div className="absolute -left-4 sm:-left-6 top-16 hidden sm:flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 backdrop-blur-md shadow-xl text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 animate-pulse" />
                  <span className="font-semibold text-slate-900">Rute Lampu Terang</span>
                </div>
                <div className="absolute -right-4 sm:-right-6 bottom-28 hidden sm:flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 backdrop-blur-md shadow-xl text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-900">Zona Bahaya Terhindari</span>
                </div>
              </TiltedCard>
            </div>
          </div>
        </section>

        {/* ================= FAQ KHUSUS ================= */}
        <section id="faq" className="py-10 sm:py-24 px-3 sm:px-4 bg-neutral-50/70 border-y border-neutral-200/80 relative z-10 overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mt-1 sm:mt-2 tracking-tight">
                Pertanyaan Umum & Transparansi Data
              </h2>
              <p className="text-slate-600 text-xs sm:text-base mt-2 sm:mt-3">
                Kami menjawab kekhawatiran terpenting seputar privasi, akurasi, dan teknis penggunaan JalanAman.
              </p>
            </div>
            <div className="space-y-4">
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-950 mb-1.5">Bagaimana data zona rawan kejahatan diperoleh?</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Data diolah dari laporan resmi kepolisian, data spasial kejadian kriminalitas yang bersifat publik, dan verifikasi komunitas warga setempat. Data ini diperbarui secara berkala setiap 48 jam untuk memastikan akurasi terbaru.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-950 mb-1.5">Apa yang terjadi dengan data lokasi saya?</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lokasi Anda hanya digunakan saat fitur pelacakan aktif dan tidak disimpan di server setelah sesi berakhir. Data GPS dikirim secara terenkripsi hanya ke kontak darurat yang Anda tetapkan sendiri. Kami tidak pernah membagikan data lokasi ke pihak ketiga tanpa izin eksplisit.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-950 mb-1.5">Apakah aplikasi ini tetap berfungsi tanpa sinyal internet?</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Fitur navigasi dasar dan peta offline akan tetap berfungsi. Namun, fitur SOS dan pelacakan real-time memerlukan koneksi data aktif. Jika sinyal hilang di tengah penggunaan, aplikasi akan menyimpan koordinat terakhir dan mengirimkannya saat koneksi kembali.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-950 mb-1.5">Berapa baterai yang dikonsumsi saat menggunakan fitur pelacakan?</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Penggunaan GPS terus-menerus dengan layar menyala dapat menguras baterai sekitar 15-25% per jam. Disarankan untuk menggunakan mode hemat baterai dan membawa power bank saat perjalanan malam berkepanjangan.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-950 mb-1.5">Apakah JalanAman menggantikan aplikasi navigasi seperti Google Maps?</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tidak. JalanAman berfungsi sebagai lapisan keamanan tambahan yang mengoreksi dan memodifikasi rute yang diberikan oleh navigator lain berdasarkan parameter keselamatan. Kami menyarankan penggunaan bersamaan dengan aplikasi navigasi yang sudah Anda kenal.
                </p>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= PENGUATAN KEPERCAYAAN PUBLIK ================= */}
        <section id="transparansi" className="py-10 sm:py-24 px-3 sm:px-4 bg-neutral-50/70 border-t border-slate-200 relative z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs mb-3 sm:mb-4 text-slate-800 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
                <span className="font-mono font-bold tracking-wide">TRANSPARANSI & AKUNTABILITAS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mt-1 sm:mt-2 tracking-tight">
                Komitmen Publik Kami
              </h2>
              <p className="text-slate-600 text-xs sm:text-base mt-2 sm:mt-3">
                JalanAman adalah inisiatif keselamatan publik berbasis komunitas. Semua data dan keputusan algoritma dapat diaudit dan diverifikasi oleh siapapun.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-950 shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-slate-950 mb-1.5">Audit Data Terbuka</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Dataset zona rawan dan koreksi rute tersedia dalam format terbuka untuk ditinjau oleh pihak berwenang dan peneliti keselamatan publik.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.04)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-950 shrink-0 shadow-xs">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-slate-950 mb-1.5">Privasi Tanpa Kompromi</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Tanpa registrasi wajib, tanpa profil sosial, tanpa pelacakan latar belakang. Koneksi ke sistem bersifat anonim dan terenkripsi end-to-end.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

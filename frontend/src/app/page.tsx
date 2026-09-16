import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MoltenMetal from "@/components/reactbits/MoltenMetal";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import BlurText from "@/components/reactbits/BlurText";
import GridPattern from "@/components/reactbits/GridPattern";
import RouteVisualizer from "@/components/RouteVisualizer";
import FAQAccordion from "@/components/FAQAccordion";
import GradientWaves from "@/components/reactbits/GradientWaves";
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
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Activity,
  Database,
  Target,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col selection:bg-white selection:text-neutral-950 font-sans">
      <Navbar />

       <main className="flex-1">
        {/* ================= HERO SECTION (FULL-SCREEN 100VH) ================= */}
        <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <MoltenMetal
              color1="#0f172a"
              color2="#38bdf8"
              color3="#ffffff"
              backgroundColor="#050505"
              lightMode={false}
              speed={0.25}
              scale={3.5}
              detail={2.5}
              glow={1.4}
              coreSize={0.08}
              swirl={0.8}
              fold={-0.18}
              blackPoint={0.05}
              brightness={1.25}
              colorMode="frost"
              grain={false}
              grainIntensity={0.0}
              mouseInteraction={false}
              mouseStrength={0.2}
              opacity={0.75}
            />
          </div>
          <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.06),transparent_75%)] pointer-events-none z-0" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-full h-[400px] bg-gradient-to-tr from-sky-950/20 via-neutral-900/20 to-neutral-950/40 blur-[130px] rounded-full pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)] pointer-events-none z-0" />

          {/* Bottom Feathering Transition to next section (Smooth blending) */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent pointer-events-none z-10" />

          {/* Center Hero Content */}
          <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center my-auto py-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.15] mb-4 sm:mb-5 max-w-3xl">
              <BlurText
                text="Pulang Larut Tanpa Cemas. Pilih Rute Terang, Bukan Sekadar Rute Tercepat."
                delay={45}
                animateBy="words"
                className="justify-center text-white"
              />
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal">
              Aplikasi navigasi konvensional buta terhadap ancaman kriminalitas—mengorbankan nyawa demi hemat 2 menit di gang gelap. <strong className="text-white font-semibold">JalanAman</strong> memadukan machine learning spasial dan data riil untuk memandu Anda melalui koridor lampu aktif, jalan ramai, dan jangkauan pos pengamanan.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center">
              <Link
                href="#mobile"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs sm:text-sm hover:bg-neutral-200 active:scale-95 transition-all shadow-lg shadow-white/10 border border-white"
              >
                <Smartphone className="w-4 h-4" />
                <span>Unduh Aplikasi Mobile</span>
              </Link>
              <Link
                href="#rute"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md text-neutral-200 font-semibold text-xs sm:text-sm hover:bg-white/[0.12] hover:text-white hover:border-white/30 transition-all"
              >
                <span>Eksplorasi Simulasi Rute</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= URGENSI & STATISTIK KRISIS ================= */}
        <section id="urgensi" className="py-14 sm:py-24 px-4 bg-[#050505] border-b border-white/[0.06] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Kolom Kiri: Narasi Masalah */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-1 rounded-lg inline-block">
                  Data Pusiknas Bareskrim Polri 2024
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Ancaman Nyata di Jam Sunyi. Kebutaan Peta Konvensional.
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Pencurian dengan kekerasan dan begal jalanan terkonsentrasi pada dini hari saat patroli aparat terbatas dan penerangan minim. Aplikasi navigasi standar secara mekanis hanya menghitung jarak geografis terpendek, mengarahkan pengendara ke gang sepi tanpa lampu demi memangkas 2 menit perjalanan.
                </p>
                <div className="pt-2">
                  <p className="text-xs text-neutral-500 italic">
                    Sumber data: Laporan Statistik Kriminal Pusiknas Bareskrim Polri dan Publikasi Ditreskrimum Polda Metro Jaya (2024).
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: 3 Metrik Fakta Terverifikasi */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900/70 border border-rose-500/20 flex flex-col justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">00&ndash;05</span>
                  <span className="text-xs font-bold text-white mt-2">WIB Jam Puncak Rawan</span>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                    Rentang waktu dengan frekuensi kejahatan jalanan tertinggi menurut data kepolisian.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/70 border border-white/[0.08] flex flex-col justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">25 Kasus</span>
                  <span className="text-xs font-bold text-white mt-2">Dalam 15 Hari</span>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                    Catatan insiden begal dan curas pada rentang awal Mei 2024 di wilayah Jabodetabek.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/70 border border-white/[0.08] flex flex-col justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">3,1 Juta</span>
                  <span className="text-xs font-bold text-white mt-2">Pekerja Mobilitas Malam</span>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                    Mitra logistik dan tenaga shift yang beroperasi menembus area rawan tanpa proteksi rute.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LOGIKA PENENTUAN RUTE ================= */}
        <section id="arsitektur" className="py-10 sm:py-24 px-3 sm:px-4 bg-[#080808] border-b border-white/[0.06] relative z-10 overflow-hidden">
          <GridPattern className="opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-950/20 blur-[140px] rounded-full pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Logika Keselamatan di Balik Setiap Rekomendasi Rute
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
                JalanAman merekayasa ulang algoritma navigasi. Melalui kombinasi <strong className="text-neutral-200">DBSCAN Spatial Clustering</strong>, <strong className="text-neutral-200">Random Forest Risk Scoring</strong>, dan <strong className="text-neutral-200">Modified A* Pathfinding</strong>, sistem menghitung trade-off matematis demi memastikan Anda melintasi koridor dengan tingkat eksposur bahaya paling minim.
              </p>
            </div>

            {/* 2x2 Bento Grid - Clean, Professional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Faktor 01 */}
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shadow-xs">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs font-medium text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                      Bobot 35%
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
                    Indeks Penerangan Lampu PJU
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Setiap ruas jalan dievaluasi berdasarkan densitas penerangan jalan umum (PJU) aktif. Algoritma Modified A* menolak rute pintas minim cahaya dan memprioritaskan koridor benderang secara absolut.
                  </p>
                </div>
              </SpotlightCard>

              {/* Faktor 02 */}
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.1)" className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-center text-rose-400 shadow-xs">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs font-medium text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-800/50">
                      Bobot 30%
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
                    DBSCAN Dynamic Crime Clustering
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Data spasial kejahatan jalanan (begal, curas) dari Bareskrim Polri dan laporan terverifikasi dikelompokkan secara dinamis tanpa batasan administratif kaku, membentuk perimeter bahaya yang dihindari 100%.
                  </p>
                </div>
              </SpotlightCard>

              {/* Faktor 03 */}
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shadow-xs">
                      <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs font-medium text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                      Bobot 20%
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
                    Koridor Arteri & Jalur Hidup 24 Jam
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Preferensi rute dialirkan ke jalan protokol dengan volume lalu lintas malam dan deretan etalase usaha 24 jam yang berfungsi sebagai &apos;natural surveillance&apos; pelindung perjalanan Anda.
                  </p>
                </div>
              </SpotlightCard>

              {/* Faktor 04 */}
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shadow-xs">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs font-medium text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                      Bobot 15%
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
                    Radius Evakuasi Shelter 24 Jam
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Rute dikalibrasi secara ketat agar Anda selalu berada dalam perimeter aman (&lt;350m) ke pos kepolisian, pos satpam aktif, atau minimarket 24 jam saat terjadi indikasi ancaman.
                  </p>
                </div>
              </SpotlightCard>
            </div>

            {/* Pipeline Arsitektur Diagram Visual */}
            <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-white/[0.1] shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
                <div>
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Arsitektur Pipeline 4 Lapis</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    Alur Pengolahan Spasial Menuju Rekomendasi Rute
                  </h3>
                </div>
                <div className="text-xs text-neutral-400 font-mono bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08] shrink-0">
                  Decoupled Pipeline Architecture
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-neutral-500">Tahap 01</span>
                    <h4 className="text-sm font-bold text-white mt-1 mb-2">Agregasi Multi Sumber</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Kombinasi data laporan warga, titik PJU OpenStreetMap, koridor 24 jam, dan arsip kejahatan kepolisian.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-neutral-400 font-mono">
                    Input: Koordinat Spasial
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-sky-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-sky-400">Tahap 02</span>
                    <h4 className="text-sm font-bold text-white mt-1 mb-2">DBSCAN Spatial Clustering</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Mengelompokkan titik rawan secara organik mengikuti kontur jalan tanpa batasan administratif kaku dan mengisolasi noise.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-sky-300 font-mono">
                    Output: Perimeter Bahaya
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.06] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-neutral-500">Tahap 03</span>
                    <h4 className="text-sm font-bold text-white mt-1 mb-2">Random Forest Risk Scoring</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Menghitung probabilitas risiko pada setiap segmen jalan berdasarkan densitas lampu, jam tempuh, dan histori insiden.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-neutral-400 font-mono">
                    Output: Nilai Risiko [0.0 - 1.0]
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-emerald-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-400">Tahap 04</span>
                    <h4 className="text-sm font-bold text-white mt-1 mb-2">Modified A* Pathfinding</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Mengalikan bobot jarak dengan penalti risiko keamanan sehingga graf jalan otomatis memilih koridor benderang.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] text-emerald-300 font-mono">
                    Cost = Jarak x (1 + alpha x Risk)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SIMULASI RUTE NYATA ================= */}
        <section id="rute" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Hemat 3 Menit atau Tiba di Rumah dengan Selamat?
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              Bandingkan logika navigasi biasa yang sering menjerumuskan ke lorong sunyi demi efisiensi jarak semu, berbanding terbalik dengan algoritma protektif JalanAman.
            </p>
          </div>
          <RouteVisualizer />
        </section>

        {/* ================= SKENARIO PENGGUNAAN NYATA ================= */}
        <section id="skenario" className="py-14 sm:py-24 px-4 bg-[#080808] border-b border-white/[0.06] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Skenario Penyelamatan di Lapangan
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2">
                Bagaimana algoritma JalanAman bekerja saat menghadapi situasi rute berisiko tinggi di kota perkotaan Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Kasus 1 */}
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 mb-3 border-b border-white/[0.06]">
                    <span className="font-semibold text-white">Tenaga Medis Shift Malam</span>
                    <span className="font-mono text-[11px] text-sky-400">02.15 WIB</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Perjalanan Pulang RSUD Tangerang ke Ciledug
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Navigasi biasa mengarahkan ke bantaran kali sunyi tanpa lampu jalan untuk menghemat 3 menit. JalanAman membelokkan rute ke Jalan Daan Mogot yang memiliki deretan pos patroli aktif dan lampu PJU 100% menyala.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Hasil: Terhindar dari 2 klaster rawan begal aktif</span>
                </div>
              </div>

              {/* Kasus 2 */}
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 mb-3 border-b border-white/[0.06]">
                    <span className="font-semibold text-white">Mitra Logistik dan Kurir</span>
                    <span className="font-mono text-[11px] text-sky-400">23.45 WIB</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Pengantaran Paket Kawasan Industri Cakung
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Pengendara melintasi area yang belum pernah dilewati. Radar Geofence memberikan peringatan audio 500 meter sebelum jalan lingkar sepi, mengarahkan ke koridor arteri 24 jam dengan akses minimarket terbuka.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Hasil: Radius shelter darurat selalu di bawah 300 meter</span>
                </div>
              </div>

              {/* Kasus 3 */}
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 mb-3 border-b border-white/[0.06]">
                    <span className="font-semibold text-white">Mahasiswa dan Komuter Mandiri</span>
                    <span className="font-mono text-[11px] text-sky-400">01.10 WIB</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Perjalanan Kampus Depok ke Pasar Minggu
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Saat motor mengalami kendala di titik sepi, tombol SOS sekali sentuh langsung menyiarkan posisi koordinat terenkripsi ke kontak darurat keluarga tanpa perlu membuka banyak menu aplikasi.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Hasil: Telemetri lokasi tersiarkan secara instan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROTOKOL DARURAT SOS ================= */}
        <section id="protokol" className="py-10 sm:py-24 px-3 sm:px-4 bg-[#080808] border-y border-white/[0.06] relative z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 sm:mt-2 tracking-tight">
                Satu Ketukan di Detik Kritis. Sinyal Pertahanan Terpancar Seketika.
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2 sm:mt-3">
                Dalam situasi genting, Anda tidak punya waktu untuk membuka banyak menu. Protokol darurat JalanAman dirancang untuk menyiarkan telemetri pertahanan instan tanpa hambatan interaksi.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-3 sm:mb-6 shadow-xs">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">1. Enkripsi & Pancaran Telemetri GPS</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Koordinat satelit presisi tinggi langsung dipancarkan ke server tanggap darurat dan jaringan kontak prioritas melalui kanal aman terenkripsi end-to-end.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-3 sm:mb-6 shadow-xs">
                    <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">2. Panggilan Otomatis & Silent Broadcast</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Sistem mengeksekusi panggilan suara darurat dan mengirimkan tautan pelacakan langsung ke keluarga tanpa mengharuskan Anda bersuara di situasi genting.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-3 sm:mb-6 shadow-xs">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">3. Peta Pantau Real-Time Multi-Akses</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Keluarga dan pihak keamanan terpercaya dapat memantau pergerakan dinamis Anda detik demi detik hingga Anda tiba di shelter aman terdekat.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= FITUR UNTUK WARGA & PENGENDARA ================= */}
        <section id="fitur" className="py-10 sm:py-20 px-3 sm:px-4 max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rekayasa Fitur Khusus Menghadapi Realitas Jalanan Indonesia
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
              Dirancang secara spesifik dari analisis empiris risiko malam hari untuk melindungi pengendara motor, mitra ojek online, dan komuter mandiri.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="col-span-2 md:col-span-2 p-3.5 sm:p-7 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center mb-3 sm:mb-6 text-white">
                <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                Navigasi Berbasis Koridor Terang & Jalan Hidup
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-6">
                Hilangkan ketakutan diarahkan ke gang sempit gelap, kebun kosong, atau kolong jembatan rawan. Algoritma otomatis memprioritaskan jalan utama yang benderang dan ramai kendaraan.
              </p>
              <div className="text-xs text-neutral-400 flex items-center gap-2 pt-4 border-t border-white/[0.06]">
                <Lightbulb className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Sinkronisasi otomatis dengan data penerangan jalan umum dan koridor arteri 24 jam.</span>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="col-span-1 md:col-span-1 p-3 sm:p-6 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 flex flex-col justify-between backdrop-blur-md">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center mb-2.5 sm:mb-6 text-rose-400">
                  <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                  Radar Geofence Titik Rawan
                </h3>
                <p className="text-[11px] sm:text-sm text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Peringatan audio proaktif seketika sebelum Anda memasuki radius 500 meter dari klaster rawan begal aktif.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.12)" className="col-span-1 md:col-span-1 p-3 sm:p-6 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-amber-500/30 flex flex-col justify-between backdrop-blur-md">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center mb-2.5 sm:mb-6 text-amber-400">
                  <PhoneCall className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                  Sinyal SOS & GPS Telemetri
                </h3>
                <p className="text-[11px] sm:text-sm text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Cukup 1 sentuhan cepat untuk membagikan telemetri posisi real-time terverifikasi langsung ke kontak keluarga.
                </p>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.12)" className="col-span-2 md:col-span-2 p-3.5 sm:p-7 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-sky-500/30 backdrop-blur-md">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-sky-950/40 border border-sky-800/40 flex items-center justify-center mb-3 sm:mb-6 text-sky-400">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                Jaringan Safe-Haven & Shelter 24 Jam Terdekat
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-6">
                Peta interaktif terhubung langsung ke direktori pos polisi, pos satpam terpadu, dan minimarket 24 jam sebagai tempat evakuasi darurat yang siap siaga.
              </p>
              <div className="text-xs text-neutral-400 flex items-center gap-2 pt-4 border-t border-white/[0.06]">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Terhubung langsung ke direktori pos polisi, pos satpam aktif, dan minimarket 24 jam di sepanjang rute.</span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* ================= SIAPA YANG PALING TERBANTU ================= */}
        <section id="statistik" className="py-10 sm:py-24 px-3 sm:px-4 bg-[#080808] border-t border-white/[0.06] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Mobilitas Malam Hari yang Aman adalah Hak Setiap Warga
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
                Setiap individu yang bekerja keras hingga larut malam berhak menempuh perjalanan pulang dengan tenang, percaya diri, dan terlindungi.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Pekerja Shift & Medis</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Dokter, perawat, karyawan industri, dan staf ritel yang menembus malam pada jam paling rawan (00.00–04.59 WIB).
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Komuter Wanita & Solo</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Jaminan kepastian rute terang yang ramai orang, menghapus rasa cemas dan risiko intimidasi saat berkendara mandiri.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Driver Ojol & Kurir</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Menjaga pahlawan logistik malam saat mengantar pesanan agar terhindar dari jebakan begal di area yang belum dikenal.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Satgas & Patroli Warga</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Pemanfaatan intelijen spasial untuk memetakan pos pantau dan mobil patroli presisi pada titik dengan kerawanan tertinggi.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= ROADMAP PENGEMBANGAN SISTEM ================= */}
        <section id="roadmap" className="py-14 sm:py-24 px-4 bg-[#050505] border-t border-white/[0.06] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Fase Riset dan Eksekusi Lapangan
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2">
                Peta jalan pengembangan teknologi dari tahap validasi algoritma hingga integrasi layanan darurat publik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Fase 1 */}
              <div className="p-5 rounded-2xl bg-neutral-900/50 border border-white/[0.08] relative">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                  Fase 1: Selesai
                </span>
                <h3 className="text-base font-bold text-white mt-4 mb-2">Validasi Model AI dan Algoritma</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pengembangan model DBSCAN spasial, klasifikasi risiko Random Forest berakurasi 89,7%, dan simulasi Modified A* graf jalan.
                </p>
              </div>

              {/* Fase 2 */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-sky-500/30 relative shadow-lg">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2.5 py-1 rounded-md">
                  Fase 2: Berjalan
                </span>
                <h3 className="text-base font-bold text-white mt-4 mb-2">Uji Coba Lapangan Jabodetabek</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Peluncuran aplikasi mobile React Native beta untuk pekerja malam, kalibrasi radar geofence, dan kurasi direktori shelter 24 jam.
                </p>
              </div>

              {/* Fase 3 */}
              <div className="p-5 rounded-2xl bg-neutral-900/50 border border-white/[0.08] relative">
                <span className="text-xs font-mono font-bold text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-md">
                  Fase 3: Q3 2026
                </span>
                <h3 className="text-base font-bold text-white mt-4 mb-2">Ekspansi Kota Metropolitan</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pemetaan koridor penerangan dan integrasi data tindak kriminal di Bandung Raya, Surabaya, Medan, dan Makassar.
                </p>
              </div>

              {/* Fase 4 */}
              <div className="p-5 rounded-2xl bg-neutral-900/50 border border-white/[0.08] relative">
                <span className="text-xs font-mono font-bold text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-md">
                  Fase 4: Q4 2026
                </span>
                <h3 className="text-base font-bold text-white mt-4 mb-2">Integrasi Command Center Publik</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Jalur siaran langsung telemetri darurat ke dashboard kepolisian wilayah dan integrasi sistem aduan transportasi publik resmi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ KHUSUS ================= */}
        <section id="faq" className="py-12 sm:py-24 px-3 sm:px-6 bg-[#080808] border-t border-white/[0.06] relative z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <FAQAccordion />
          </div>
        </section>

        {/* ================= PENGUATAN KEPERCAYAAN PUBLIK ================= */}
        <section id="transparansi" className="py-10 sm:py-24 px-3 sm:px-4 bg-[#050505] border-t border-white/[0.06] relative z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 sm:mt-2 tracking-tight">
                Komitmen Etika & Transparansi Data Publik
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2 sm:mt-3">
                Keselamatan publik menuntut kepercayaan mutlak. JalanAman beroperasi dengan prinsip sains data terbuka, perlindungan privasi tanpa kompromi, dan non-komersialisasi data pergerakan.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5">Audit Sains Data & Algoritma Terbuka</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      Metodologi klasterisasi spasial dan model prediksi risiko dirancang secara transparan agar dapat diaudit oleh akademisi, pemerhati keselamatan masyarakat, dan aparat penegak hukum.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5">Privasi Tanpa Kompromi (Zero Tracking)</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      Bebas dari pelacakan latar belakang pasif saat tidak bernavigasi. Tanpa profiling iklan komersial. Data telemetri darurat diproteksi enkripsi tingkat tinggi demi keamanan personal.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= MOBILE APP SHOWCASE (FULL WIDTH SEBELUM FOOTER) ================= */}
        <section id="mobile" className="w-full relative overflow-hidden bg-[#050505] pt-16 sm:pt-28 pb-16 sm:pb-24">
          {/* Animated 3D GradientWaves Background Canvas from React Bits */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <GradientWaves
              horizonColor="#0369a1"
              waveColor="#38bdf8"
              crestColor="#FFFFFF"
              speed={0.35}
              amplitude={2.4}
              waveScale={0.6}
              waveRatio={0.9}
              swell={32}
              turbulence={18}
              tilt={1.11}
              zoom={1.0}
              height={5.5}
              fogDepth={22}
              detail="low"
              brightness={1.05}
              opacity={0.95}
              mouseInteraction={false}
              parallaxStrength={0}
              grain={false}
              grainIntensity={0.0}
            />
            {/* Top and bottom subtle feathering masks for perfect harmony */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none" />
            {/* Soft directional darkening mask on left for maximum text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/50 to-transparent pointer-events-none" />
          </div>

          {/* Inner Content Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-16">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Pastikan Anda & Keluarga Tiba Selamat Malam Ini
              </h2>
              <p className="text-neutral-300 text-xs sm:text-base mt-3 sm:mt-4 leading-relaxed max-w-lg">
                Pasang JalanAman sekarang di ponsel cerdas Anda. Gantikan rasa waswas dengan kepastian rute paling terang, terpantau, dan terlindungi di setiap perjalanan pulang.
              </p>
              <div className="flex flex-col items-start gap-3 md:flex-row mt-6 sm:mt-8">
                <GooglePlayButton size="md" />
                <AppStoreButton size="md" />
                <GalaxyStoreButton size="md" />
              </div>
            </div>

            <div className="w-full max-w-sm flex justify-center relative z-10">
              <div className="relative max-w-[260px] sm:max-w-[320px]">
                <div className="absolute -inset-3 bg-sky-500/20 blur-3xl rounded-[3rem] opacity-70" />
                <div className="relative rounded-[2.5rem] p-1.5 bg-neutral-950 border-4 border-neutral-800 shadow-2xl overflow-hidden">
                  <Image
                    src="/android-mockup.jpg"
                    alt="Visualisasi Aplikasi Android JalanAman - Navigasi Rute Teraman dari Kriminalitas"
                    width={360}
                    height={640}
                    className="rounded-[2.1rem] w-full h-auto object-cover block"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

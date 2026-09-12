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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.15] mb-4 sm:mb-5 max-w-3xl">
              <BlurText
                text="Pulang Malam Tanpa Takut. Pilih Jalan Terang, Bukan Sekadar Jalan Pintas."
                delay={45}
                animateBy="words"
                className="justify-center text-white"
              />
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal">
              Peta biasa mengarahkan Anda ke gang gelap hanya demi hemat 2 menit. <strong className="text-white font-semibold">JalanAman</strong> memprioritaskan lampu jalan aktif, jalan ramai, dan pos jaga agar Anda pulang selamat sampai rumah.
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
                <span>Lihat Simulasi Rute</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
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
                Logika Keselamatan di Balik Setiap Rute
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
                JalanAman memproses empat lapisan telemetri keselamatan secara simultan sebelum merekomendasikan rute. Bukan sekadar mencari jarak terpendek, melainkan koridor dengan eksposur risiko paling minim.
              </p>
            </div>

            {/* 2x2 Bento Grid with Rich Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Faktor 01 */}
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-5 sm:p-7 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shadow-xs">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 bg-white/[0.06] px-2 py-1 rounded border border-white/10">
                        FAKTOR 01
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-950 bg-white px-2 py-1 rounded border border-white">
                        BOBOT 35%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                    Indeks Penerangan Lampu PJU
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Setiap segmen jalan dinilai berdasarkan densitas lampu penerangan jalan umum (PJU) yang menyala aktif. Algoritma menolak jalan pintas yang minim cahaya dan memprioritaskan koridor terang secara absolut.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      Cakupan Penerangan Rute
                    </span>
                    <span className="font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/10">
                      94% Terang
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex p-0.5 border border-white/5">
                    <div className="h-full bg-white rounded-full w-[94%]" />
                  </div>
                </div>
              </SpotlightCard>

              {/* Faktor 02 */}
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.1)" className="p-5 sm:p-7 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-center text-rose-400 shadow-xs">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 bg-white/[0.06] px-2 py-1 rounded border border-white/10">
                        FAKTOR 02
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-950 bg-white px-2 py-1 rounded border border-white">
                        BOBOT 30%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                    Peta Titik Rawan Kriminalitas
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Data spasial riwayat begal, penjambretan, dan kejahatan jalanan dari kepolisian dan laporan terverifikasi dipetakan sebagai zona eksklusi bahaya yang wajib dihindari oleh sistem.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Perimeter Bahaya Dilalui
                    </span>
                    <span className="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">
                      0 Titik (100% Dihindari)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex p-0.5 border border-white/5">
                    <div className="h-full bg-rose-500 rounded-full w-full" />
                  </div>
                </div>
              </SpotlightCard>

              {/* Faktor 03 */}
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-5 sm:p-7 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shadow-xs">
                      <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 bg-white/[0.06] px-2 py-1 rounded border border-white/10">
                        FAKTOR 03
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-950 bg-white px-2 py-1 rounded border border-white">
                        BOBOT 20%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                    Koridor Ramai & Jalur Hidup 24 Jam
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Preferensi diberikan pada jalan protokol dengan volume kendaraan malam dan deretan tempat usaha buka 24 jam yang berfungsi sebagai pengawal alami perjalanan Anda.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      Densitas Keramaian Jalur
                    </span>
                    <span className="font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/10">
                      Tinggi (Jalan Protokol)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex p-0.5 border border-white/5">
                    <div className="h-full bg-white rounded-full w-[85%]" />
                  </div>
                </div>
              </SpotlightCard>

              {/* Faktor 04 */}
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-5 sm:p-7 rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shadow-xs">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 bg-white/[0.06] px-2 py-1 rounded border border-white/10">
                        FAKTOR 04
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-950 bg-white px-2 py-1 rounded border border-white">
                        BOBOT 15%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                    Jarak Jangkauan Shelter Terdekat
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Rute dioptimalkan agar Anda selalu berada dalam radius evakuasi cepat ke pos kepolisian, pos satpam komplek, atau minimarket 24 jam bila terdeteksi indikasi ancaman.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      Radius Evakuasi Cepat
                    </span>
                    <span className="font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/10">
                      &lt; 350m ke Pos Polisi
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex p-0.5 border border-white/5">
                    <div className="h-full bg-white rounded-full w-[78%]" />
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* ================= SIMULASI RUTE NYATA ================= */}
        <section id="rute" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Hemat 3 Menit atau Pulang Selamat?
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              Bandingkan cara navigasi biasa yang sering menjebak ke jalan gelap dengan algoritma protektif JalanAman.
            </p>
          </div>
          <RouteVisualizer />
        </section>

        {/* ================= PROTOKOL DARURAT SOS ================= */}
        <section id="protokol" className="py-10 sm:py-24 px-3 sm:px-4 bg-[#080808] border-y border-white/[0.06] relative z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-neutral-900/80 border border-rose-500/30 text-[11px] sm:text-xs mb-3 sm:mb-4 text-rose-300 shadow-xs">
                <Siren className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-mono font-bold tracking-wide">PROTOKOL DARURAT SOS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 sm:mt-2 tracking-tight">
                Apa yang Terjadi Saat Tombol SOS Ditekan?
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2 sm:mt-3">
                Setiap detik sangat berharga. Protokol ini dirancang untuk mengirimkan sinyal darurat tanpa bergantung pada aplikasi yang terbuka atau koneksi suara aktif.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-3 sm:mb-6 shadow-xs">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">1. Enkripsi & Pengiriman Instan</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Koordinat GPS terenkripsi dikirim via jaringan data ke server darurat dan kontak yang telah ditentukan pengguna, tanpa memerlukan aplikasi lain.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-3 sm:mb-6 shadow-xs">
                    <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">2. Panggilan Otomatis ke Kontak</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Sistem melakukan panggilan suara ke daftar kontak darurat pengguna, menyampaikan tautan lokasi real-time agar keluarga bisa merespons segera.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 transition-all flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-3 sm:mb-6 shadow-xs">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5 sm:mb-2">3. Peta Pelacakan Real-Time</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Fitur Cerdas untuk Pengendara Malam
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
              Didesain khusus untuk melindungi pengendara motor, ojek online, dan pejalan kaki saat jalanan mulai sepi.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="col-span-2 md:col-span-2 p-3.5 sm:p-7 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center mb-3 sm:mb-6 text-white">
                <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                Peta yang Mengutamakan Penerangan & Keramaian
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-6">
                Tidak ada lagi diarahkan ke kuburan, kebun kosong, atau kolong jembatan gelap. Algoritma cerdas otomatis memilih jalur utama yang berlampu terang dan ramai kendaraan.
              </p>
              <div className="p-3 sm:p-4 rounded-xl bg-neutral-950/60 border border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs text-neutral-300">
                <span className="flex items-center gap-1.5 sm:gap-2 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
                  <span>Deteksi Otomatis Lampu PJU & Jalur Hidup</span>
                </span>
                <span className="text-white font-semibold bg-white/[0.08] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10 shrink-0">Otomatis</span>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.12)" className="col-span-1 md:col-span-1 p-3 sm:p-6 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-rose-500/30 flex flex-col justify-between backdrop-blur-md">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center mb-2.5 sm:mb-6 text-rose-400">
                  <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                  Radar Titik Rawan
                </h3>
                <p className="text-[11px] sm:text-sm text-neutral-400 leading-relaxed mb-3 line-clamp-3 sm:line-clamp-none">
                  Alert suara seketika sebelum Anda memasuki radius 500m dari titik rawan kejahatan.
                </p>
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-300 font-semibold flex items-center gap-1 sm:gap-1.5 bg-neutral-950/60 px-2 py-1 rounded-lg border border-white/[0.08] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">Alert Otomatis</span>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.12)" className="col-span-1 md:col-span-1 p-3 sm:p-6 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-amber-500/30 flex flex-col justify-between backdrop-blur-md">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center mb-2.5 sm:mb-6 text-amber-400">
                  <PhoneCall className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                  Sinyal SOS & GPS
                </h3>
                <p className="text-[11px] sm:text-sm text-neutral-400 leading-relaxed mb-3 line-clamp-3 sm:line-clamp-none">
                  Cukup 1 sentuhan untuk membagikan telemetri posisi real-time ke kontak keluarga.
                </p>
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-300 font-semibold flex items-center gap-1 sm:gap-1.5 bg-neutral-950/60 px-2 py-1 rounded-lg border border-white/[0.08] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">GPS Real-Time</span>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(56, 189, 248, 0.12)" className="col-span-2 md:col-span-2 p-3.5 sm:p-7 group bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-sky-500/30 backdrop-blur-md">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-sky-950/40 border border-sky-800/40 flex items-center justify-center mb-3 sm:mb-6 text-sky-400">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                Jaringan Shelter & Pos Polisi 24 Jam Terdekat
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-6">
                Peta terintegrasi langsung menampilkan titik aman terdekat—pos polisi, pos satpam komplek, dan minimarket 24 jam—sebagai tempat berlindung saat situasi darurat.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 rounded-xl bg-neutral-950/60 border border-white/[0.08] text-[11px] sm:text-xs">
                <span className="text-neutral-400">
                  Jaringan shelter terverifikasi aktif dan siap evakuasi di sepanjang rute.
                </span>
                <span className="text-sky-300 font-semibold flex items-center gap-1.5 shrink-0 bg-sky-950/50 px-2 py-1 sm:px-2.5 rounded-lg border border-sky-800/40 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
                  Shelter Terverifikasi
                </span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* ================= SIAPA YANG PALING TERBANTU ================= */}
        <section id="statistik" className="py-10 sm:py-24 px-3 sm:px-4 bg-[#080808] border-t border-white/[0.06] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Dirancang untuk Mereka yang Pulang Larut
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
                Setiap orang yang berjuang hingga larut malam berhak menempuh perjalanan pulang dengan tenang dan selamat.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Pekerja Shift Malam</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Tenaga medis, karyawan pabrik, dan staf ritel yang pulang saat jalanan mulai sepi.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Pengendara Solo & Wanita</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Jaminan rute terang yang selalu ramai orang, bebas dari risiko terjebak di lorong sunyi.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Driver Ojek Online</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Antar penumpang atau pesanan larut malam dengan tenang tanpa khawatir masuk jebakan begal.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all group flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-white mb-2.5 sm:mb-4 transition-colors">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-base mb-1 line-clamp-1 sm:line-clamp-none">Petugas Patroli & Warga</h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    Peta sebaran titik rawan untuk memfokuskan pos pantau dan mobil patroli malam lebih presisi.
                  </p>
                </div>
              </SpotlightCard>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-neutral-900/80 border border-white/10 text-[11px] sm:text-xs mb-3 sm:mb-4 text-neutral-300 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="font-mono font-bold tracking-wide">TRANSPARANSI & AKUNTABILITAS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 sm:mt-2 tracking-tight">
                Komitmen Publik Kami
              </h2>
              <p className="text-neutral-400 text-xs sm:text-base mt-2 sm:mt-3">
                JalanAman adalah inisiatif keselamatan publik berbasis komunitas. Semua data dan keputusan algoritma dapat diaudit dan diverifikasi oleh siapapun.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.08)" className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-neutral-900/60 border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5">Audit Data Terbuka</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      Dataset zona rawan dan koreksi rute tersedia dalam format terbuka untuk ditinjau oleh pihak berwenang dan peneliti keselamatan publik.
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
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5">Privasi Tanpa Kompromi</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      Tanpa registrasi wajib, tanpa profil sosial, tanpa pelacakan latar belakang. Koneksi ke sistem bersifat anonim dan terenkripsi end-to-end.
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-xs font-mono font-semibold text-neutral-300 mb-3 sm:mb-4 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>APLIKASI GRATIS UNTUK PUBLIK</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Perjalanan Pulang Tenang Dimulai Malam Ini
              </h2>
              <p className="text-neutral-300 text-xs sm:text-base mt-3 sm:mt-4 leading-relaxed max-w-lg">
                Pasang JalanAman di smartphone Anda dan keluarga. Pastikan setiap perjalanan larut malam selalu dipandu oleh rute paling aman dan terpantau aktif.
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
                <div className="absolute -left-4 sm:-left-6 top-16 hidden sm:flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-neutral-950/90 border border-white/15 backdrop-blur-md shadow-xl text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="font-semibold text-white">Rute Lampu Terang</span>
                </div>
                <div className="absolute -right-4 sm:-right-6 bottom-28 hidden sm:flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-neutral-950/90 border border-white/15 backdrop-blur-md shadow-xl text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-white">Zona Bahaya Terhindari</span>
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

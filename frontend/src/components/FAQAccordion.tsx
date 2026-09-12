"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, Lock, Radio, HelpCircle, ArrowUpRight } from "lucide-react";

interface FAQItem {
  id: string;
  tag: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "data-source",
    tag: "Akurasi Data",
    question: "Bagaimana data zona rawan kejahatan diperoleh?",
    answer:
      "Data diolah dari laporan resmi kepolisian, data spasial kejadian kriminalitas yang bersifat publik, dan verifikasi komunitas warga setempat. Data ini diperbarui secara berkala setiap 48 jam untuk memastikan akurasi terbaru.",
  },
  {
    id: "privacy-location",
    tag: "Privasi & GPS",
    question: "Apa yang terjadi dengan data lokasi saya?",
    answer:
      "Lokasi Anda hanya digunakan saat fitur pelacakan aktif dan tidak disimpan di server setelah sesi berakhir. Data GPS dikirim secara terenkripsi hanya ke kontak darurat yang Anda tetapkan sendiri. Kami tidak pernah membagikan data lokasi ke pihak ketiga tanpa izin eksplisit.",
  },
  {
    id: "offline-mode",
    tag: "Konektivitas",
    question: "Apakah aplikasi ini tetap berfungsi tanpa sinyal internet?",
    answer:
      "Fitur navigasi dasar dan peta offline akan tetap berfungsi. Namun, fitur SOS dan pelacakan real-time memerlukan koneksi data aktif. Jika sinyal hilang di tengah penggunaan, aplikasi akan menyimpan koordinat terakhir dan mengirimkannya saat koneksi kembali.",
  },
  {
    id: "battery-usage",
    tag: "Efisiensi Daya",
    question: "Berapa baterai yang dikonsumsi saat menggunakan fitur pelacakan?",
    answer:
      "Penggunaan GPS terus-menerus dengan layar menyala dapat menguras baterai sekitar 15-25% per jam. Disarankan untuk menggunakan mode hemat baterai dan membawa power bank saat perjalanan malam berkepanjangan.",
  },
  {
    id: "google-maps-integration",
    tag: "Integrasi Navigasi",
    question: "Apakah JalanAman menggantikan aplikasi navigasi seperti Google Maps?",
    answer:
      "Tidak. JalanAman berfungsi sebagai lapisan keamanan tambahan yang mengoreksi dan memodifikasi rute yang diberikan oleh navigator lain berdasarkan parameter keselamatan. Kami menyarankan penggunaan bersamaan dengan aplikasi navigasi yang sudah Anda kenal.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Context & Summary */}
      <div className="lg:col-span-5 lg:sticky lg:top-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-[11px] sm:text-xs mb-3 font-mono font-semibold text-neutral-300 shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
          <span>PUSAT INFORMASI</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4">
          Pertanyaan Umum & Transparansi Data
        </h2>
        <p className="text-neutral-400 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
          Kami menjawab pertanyaan penting seputar privasi data GPS, akurasi rute malam, dan cara kerja teknis sistem JalanAman secara terbuka.
        </p>

        {/* Quick Highlights Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-white/[0.08] shadow-xl space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Privasi Tanpa Kompromi</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400">Data GPS terenkripsi end-to-end</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Audit Terbuka Berkala</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400">Sinkronisasi data kejahatan setiap 48 jam</p>
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-neutral-300">
            <span className="text-neutral-500">Butuh bantuan lain?</span>
            <a href="#mobile" className="inline-flex items-center gap-1 text-white hover:underline">
              <span>Unduh Aplikasi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Accordion List */}
      <div className="lg:col-span-7 space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const itemNumber = (index + 1).toString().padStart(2, "0");

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-neutral-900/80 border-white/20 ring-1 ring-white/10 shadow-xl"
                  : "bg-neutral-900/40 border-white/[0.08] hover:border-white/20 hover:bg-neutral-900/70"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 select-none group"
                aria-expanded={isOpen}
              >
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5">
                  <span className="font-mono text-xs font-bold text-neutral-500 shrink-0 mt-0.5 sm:mt-0">
                    {itemNumber}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-neutral-200 transition-colors pr-2">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isOpen
                      ? "bg-white border-white text-neutral-950 rotate-180"
                      : "bg-white/[0.06] border-white/[0.1] text-neutral-400 group-hover:bg-white/[0.1] group-hover:text-white"
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 px-4 sm:px-5 pb-4 sm:pb-5" : "grid-rows-[0fr] opacity-0 px-4 sm:px-5 pb-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-2 border-t border-white/[0.08]">
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

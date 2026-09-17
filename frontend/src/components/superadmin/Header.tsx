'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Ringkasan Eksekutif',
  '/dashboard/incidents': 'Manajemen Insiden',
  '/dashboard/clusters': 'Peta Klaster DBSCAN',
  '/dashboard/model': 'Model AI & Risk Scoring',
  '/dashboard/users': 'Manajemen Pengguna',
  '/dashboard/analytics': 'Statistik & Analytics',
  '/dashboard/master': 'Konten Master & Konfigurasi Sistem',
  '/dashboard/moderation': 'Moderasi Konten Laporan & Redaksi Publik',
  '/dashboard/integrations': 'Manajemen Integrasi Eksternal & API Partner',
  '/dashboard/notifications': 'Konfigurasi Notifikasi Real-Time',
  '/dashboard/monitoring': 'Sistem Monitoring & Job Queue',
  '/dashboard/feedback': 'Feedback Loop Rating Rute & Anomali',
  '/dashboard/privacy': 'Data Export & Kepatuhan Privasi (UU PDP)',
  '/dashboard/audit': 'Audit Log',
};

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const currentTitle = routeTitles[pathname] || 'Dashboard Command Center';

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-3.5 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Breadcrumb / Mobile Title */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 min-w-0">
          <span className="hidden md:inline">Superadmin</span>
          <span className="hidden md:inline text-zinc-600">/</span>
          <span className="text-white font-medium truncate">{currentTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Cari data..."
            className="bg-black/50 border border-white/[0.08] rounded-lg pl-9 pr-4 py-1.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors w-48 lg:w-64"
          />
        </div>

        <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0a0a0a]"></span>
        </button>
      </div>
    </header>
  );
}

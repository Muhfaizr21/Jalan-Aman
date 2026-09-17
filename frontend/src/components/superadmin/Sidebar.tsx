'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Map, 
  BrainCircuit, 
  Users, 
  BarChart3, 
  SlidersHorizontal, 
  EyeOff, 
  Network, 
  Bell, 
  Activity, 
  MessageSquare, 
  ShieldCheck, 
  FileText,
  X,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, clearAuthSession, AuthUser } from '@/lib/auth';

interface NavGroup {
  groupName: string;
  badge?: string;
  items: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

// Urutan menu dari yang paling sering digunakan (harian/operasional utama) 
// hingga yang paling jarang digunakan (pengaturan/konfigurasi sistem berkala)
const navGroups: NavGroup[] = [
  {
    groupName: 'Operasional Utama (Sangat Sering)',
    items: [
      { name: 'Ringkasan', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Insiden', path: '/dashboard/incidents', icon: AlertTriangle },
      { name: 'Moderasi Konten', path: '/dashboard/moderation', icon: EyeOff },
      { name: 'Feedback Rute', path: '/dashboard/feedback', icon: MessageSquare },
      { name: 'Peta Klaster', path: '/dashboard/clusters', icon: Map },
    ],
  },
  {
    groupName: 'Intelijen & Monitoring (Sering / Analitik)',
    items: [
      { name: 'Statistik', path: '/dashboard/analytics', icon: BarChart3 },
      { name: 'Monitoring Job', path: '/dashboard/monitoring', icon: Activity },
      { name: 'Model AI', path: '/dashboard/model', icon: BrainCircuit },
      { name: 'Pengguna', path: '/dashboard/users', icon: Users },
    ],
  },
  {
    groupName: 'Pengaturan & Tata Kelola (Jarang / Berkala)',
    items: [
      { name: 'Notifikasi', path: '/dashboard/notifications', icon: Bell },
      { name: 'Integrasi API', path: '/dashboard/integrations', icon: Network },
      { name: 'Konten Master', path: '/dashboard/master', icon: SlidersHorizontal },
      { name: 'Ekspor & Privasi', path: '/dashboard/privacy', icon: ShieldCheck },
      { name: 'Audit Log', path: '/dashboard/audit', icon: FileText },
    ],
  },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      await fetch(`${apiUrl}/api/v1/auth/logout`, { method: 'POST' });
    } catch {
      // ignore
    }
    clearAuthSession();
    router.push('/login');
    router.refresh();
  };

  const renderNavContent = () => (
    <>
      {/* Scrollable Nav Items */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {group.groupName}
              </span>
            </div>

            {group.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => onCloseMobile?.()}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-white/10 text-white font-semibold shadow-sm' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-white/[0.08] bg-[#080808]">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-white/[0.03] transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'SA'}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-semibold text-white truncate">
                {currentUser?.name || 'Superadmin Utama'}
              </span>
              <span className="text-[10px] text-zinc-400 truncate font-mono">
                {currentUser?.email || 'admin@gmail.com'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            aria-label="Logout"
            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#050505] hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Jalan<span className="text-white/50">Aman</span>
            </h1>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white/10 text-zinc-400">
              PRO
            </span>
          </Link>
        </div>
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" 
            onClick={onCloseMobile}
          />
          
          {/* Drawer */}
          <aside className="relative z-50 w-72 max-w-[80vw] h-full bg-[#070707] border-r border-white/[0.12] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.08]">
              <Link href="/dashboard" onClick={onCloseMobile} className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Jalan<span className="text-white/50">Aman</span>
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white/10 text-zinc-400">
                  PRO
                </span>
              </Link>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavContent()}
          </aside>
        </div>
      )}
    </>
  );
}

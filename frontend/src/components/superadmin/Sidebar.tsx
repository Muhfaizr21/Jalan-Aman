'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Map, 
  BrainCircuit, 
  Users, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Ringkasan', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Insiden', path: '/dashboard/incidents', icon: AlertTriangle },
  { name: 'Peta Klaster', path: '/dashboard/clusters', icon: Map },
  { name: 'Model AI', path: '/dashboard/model', icon: BrainCircuit },
  { name: 'Pengguna', path: '/dashboard/users', icon: Users },
  { name: 'Audit Log', path: '/dashboard/audit', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#050505] hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Jalan<span className="text-white/50">Aman</span>
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-white">
            SA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Superadmin</span>
            <span className="text-xs text-zinc-500">System Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

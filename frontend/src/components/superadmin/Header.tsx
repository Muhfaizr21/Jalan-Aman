'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-zinc-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400">
          <span>Admin</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white">Dashboard Overview</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Cari data..."
            className="bg-black/50 border border-white/[0.08] rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors w-64"
          />
        </div>

        <button className="relative text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0a0a0a]"></span>
        </button>
      </div>
    </header>
  );
}

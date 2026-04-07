import React from 'react';
import { Search, Settings, Moon, User } from 'lucide-react';

interface TopBarProps {
  onSearch: (query: string) => void;
}

export default function TopBar({ onSearch }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 glass-effect flex items-center justify-between px-8 z-40 border-b border-outline-variant">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="搜索音乐、艺术家、专辑..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-surface border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-white transition-colors">
          <Moon size={20} />
        </button>
        <button className="text-on-surface-variant hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant">
          <User size={16} className="text-on-surface-variant" />
        </div>
      </div>
    </header>
  );
}

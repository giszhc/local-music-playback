import React from 'react';
import { Home, Library, Folder, ListMusic, Search, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: '主页' },
    { id: 'library', icon: Library, label: '音乐库' },
    { id: 'folders', icon: Folder, label: '文件夹' },
    { id: 'playlists', icon: ListMusic, label: '播放列表' },
    { id: 'search', icon: Search, label: '搜索' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-effect flex flex-col p-6 z-50 border-r border-outline-variant">
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary-dim flex items-center justify-center shadow-lg shadow-primary/20">
          <ListMusic className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">声音工坊</h1>
          <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">数字琴师</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              activeTab === item.id 
                ? "text-primary font-bold bg-primary/10 border-r-2 border-primary-dim" 
                : "text-on-surface-variant hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn(activeTab === item.id ? "text-primary" : "text-on-surface-variant group-hover:text-white")} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="mt-auto mb-4 py-3 px-4 rounded-xl bg-surface-container text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 active:scale-95">
        <Plus size={18} />
        <span>创建新列表</span>
      </button>
    </aside>
  );
}

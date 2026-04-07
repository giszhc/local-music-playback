import React from 'react';
import { ListMusic, Play, MoreHorizontal, Clock, Heart } from 'lucide-react';

export default function PlaylistsView() {
  const playlists = [
    { id: '1', name: '我喜欢的音乐', count: 128, cover: 'https://picsum.photos/seed/fav/400/400' },
    { id: '2', name: '深夜漫步', count: 45, cover: 'https://picsum.photos/seed/night/400/400' },
    { id: '3', name: '工作专注', count: 32, cover: 'https://picsum.photos/seed/work/400/400' },
    { id: '4', name: '复古流行', count: 89, cover: 'https://picsum.photos/seed/retro/400/400' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">播放列表</h2>
        <p className="text-on-surface-variant mt-2 text-sm">管理你的个性化音乐集。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="group cursor-pointer">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-container mb-4 shadow-xl">
              <img 
                src={playlist.cover} 
                alt={playlist.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
            </div>
            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{playlist.name}</h4>
            <p className="text-on-surface-variant text-sm">{playlist.count} 首歌曲</p>
          </div>
        ))}
        
        <div className="aspect-square rounded-3xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ListMusic size={32} />
          </div>
          <span className="font-bold">创建新列表</span>
        </div>
      </div>
    </div>
  );
}

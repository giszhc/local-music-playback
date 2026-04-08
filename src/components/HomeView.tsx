import React from 'react';
import { Sparkles, Play, Heart, Music } from 'lucide-react';
import { Song } from '../types';

interface HomeViewProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
}

export default function HomeView({ songs, onPlaySong }: HomeViewProps) {
  const recommendation = songs.length > 0 ? songs[Math.floor(Math.random() * songs.length)] : null;
  const recentSongs = [...songs].sort((a, b) => b.addedAt - a.addedAt).slice(0, 5);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-on-surface-variant">
        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-8">
          <Music size={48} className="text-white/10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">欢迎来到声音工坊</h2>
        <p className="text-lg opacity-60 max-w-md text-center">
          你的音乐库目前是空的。请前往“文件夹”标签页添加本地音乐目录，开启你的私人音乐之旅。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero: Today's Recommendation */}
      {recommendation && (
        <section className="relative group">
          <div className="relative h-[420px] rounded-[2rem] overflow-hidden flex items-end p-12 bg-surface-container shadow-2xl">
            <img 
              src={recommendation.cover || "https://picsum.photos/seed/vibe/1200/600"} 
              alt="今日推荐" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                <Sparkles size={12} fill="currentColor" />
                <span>今日推荐</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {recommendation.title}<br /><span className="text-primary">{recommendation.artist}</span>
              </h2>
              <p className="text-on-surface-variant text-lg max-w-md font-medium">
                从你的收藏中为你精选。再次感受这首动人的旋律。
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => onPlaySong(recommendation)}
                  className="px-8 py-4 bg-gradient-to-br from-primary to-primary-dim rounded-2xl text-white font-bold flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Play size={20} fill="currentColor" />
                  <span>立即播放</span>
                </button>
                <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/5">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recently Played Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">最近添加</h3>
          <button className="text-sm text-primary font-bold hover:underline">查看全部</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {recentSongs.map((song) => (
            <div key={song.id} className="group cursor-pointer" onClick={() => onPlaySong(song)}>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-container mb-4">
                <img 
                  src={song.cover || `https://picsum.photos/seed/${song.id}/400/400`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{song.title}</h4>
              <p className="text-on-surface-variant text-sm truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

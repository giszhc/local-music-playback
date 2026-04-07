import React from 'react';
import { Sparkles, Play, Heart } from 'lucide-react';

export default function HomeView() {
  return (
    <div className="space-y-12">
      {/* Hero: Today's Recommendation */}
      <section className="relative group">
        <div className="relative h-[420px] rounded-[2rem] overflow-hidden flex items-end p-12 bg-surface-container shadow-2xl">
          <img 
            src="https://picsum.photos/seed/vibe/1200/600" 
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
              寂静之声：<br /><span className="text-primary">午夜漫步</span>
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md font-medium">
              为你精选 24 首最适合独处时刻的氛围电音，从清冷极简到深邃共鸣。
            </p>
            <div className="flex items-center gap-4 pt-4">
              <button className="px-8 py-4 bg-gradient-to-br from-primary to-primary-dim rounded-2xl text-white font-bold flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
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

      {/* Recently Played Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">最近播放</h3>
          <button className="text-sm text-primary font-bold hover:underline">查看全部</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-container mb-4">
                <img 
                  src={`https://picsum.photos/seed/album${i}/400/400`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-lg group-hover:text-primary transition-colors">氛围曲目 {i}</h4>
              <p className="text-on-surface-variant text-sm">艺术家 {i}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

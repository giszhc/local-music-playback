import React from 'react';
import { Search as SearchIcon, Music, User, Disc, Play } from 'lucide-react';

interface SearchViewProps {
  searchQuery: string;
}

export default function SearchView({ searchQuery }: SearchViewProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">搜索结果</h2>
        <p className="text-on-surface-variant mt-2 text-sm">
          {searchQuery ? `关于 "${searchQuery}" 的搜索结果` : '输入关键词开始搜索'}
        </p>
      </div>

      {!searchQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <SearchIcon size={64} className="mb-6 opacity-20" />
          <p className="text-lg font-medium">发现你喜爱的音乐、艺术家和专辑</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Best Match */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              最佳匹配
            </h3>
            <div className="bg-surface-container p-8 rounded-[2rem] flex items-center gap-8 group cursor-pointer hover:bg-surface-bright transition-all max-w-2xl">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/match/300/300" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-3xl font-bold mb-1">{searchQuery}</h4>
                <p className="text-on-surface-variant font-medium">艺术家 • 流行</p>
                <div className="flex gap-4 mt-6">
                  <button className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                    <Play size={16} fill="currentColor" />
                    播放
                  </button>
                  <button className="px-6 py-2 bg-white/5 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                    关注
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Music size={20} className="text-primary" />
                歌曲
              </h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group">
                    <div className="w-10 h-10 rounded bg-surface-container overflow-hidden">
                      <img src={`https://picsum.photos/seed/s${i}/100/100`} alt="" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm truncate">{searchQuery} 的单曲 {i}</p>
                      <p className="text-xs text-on-surface-variant truncate">艺术家 {i}</p>
                    </div>
                    <Play size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User size={20} className="text-primary" />
                艺术家
              </h3>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden">
                      <img src={`https://picsum.photos/seed/a${i}/100/100`} alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{searchQuery} 乐队 {i}</p>
                      <p className="text-xs text-on-surface-variant">2.4M 粉丝</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Disc size={20} className="text-primary" />
                专辑
              </h3>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden">
                      <img src={`https://picsum.photos/seed/alb${i}/100/100`} alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{searchQuery} 专辑 {i}</p>
                      <p className="text-xs text-on-surface-variant">2024 • 12 首歌曲</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

import { Sparkles } from 'lucide-react';

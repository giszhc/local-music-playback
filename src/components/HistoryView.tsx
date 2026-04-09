import React from 'react';
import { Play, Clock, Music, Trash2 } from 'lucide-react';
import { Song } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HistoryViewProps {
  history: { song: Song; playedAt: number }[];
  onPlaySong: (song: Song) => void;
  onClearHistory: () => void;
  currentSong: Song | null;
}

export default function HistoryView({ history, onPlaySong, onClearHistory, currentSong }: HistoryViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">播放历史</h2>
          <p className="text-on-surface-variant mt-2 text-sm">你最近听过的歌曲都在这里。</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-bold"
          >
            <Trash2 size={16} />
            清空历史
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant py-20">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
            <Clock size={40} className="text-white/20" />
          </div>
          <p className="text-lg font-medium mb-2">暂无播放历史</p>
          <p className="text-sm opacity-60">开始播放音乐，记录你的听歌足迹</p>
        </div>
      ) : (
        <div className="bg-surface-container rounded-3xl overflow-hidden border border-outline-variant shadow-2xl">
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-outline-variant text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
            <div className="w-10">#</div>
            <div>标题</div>
            <div>播放时间</div>
            <div className="w-10 text-right">操作</div>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {history.map((item, index) => (
              <div 
                key={`${item.song.id}-${item.playedAt}`}
                className={cn(
                  "grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-4 items-center group hover:bg-white/5 transition-all cursor-pointer",
                  currentSong?.id === item.song.id && "bg-primary/5"
                )}
                onClick={() => onPlaySong(item.song)}
              >
                <div className="w-10 text-xs font-mono text-on-surface-variant/40 group-hover:hidden">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="w-10 hidden group-hover:flex items-center justify-center text-primary">
                  <Play size={14} fill="currentColor" />
                </div>
                
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-bright shrink-0 shadow-lg">
                    <img src={item.song.cover} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-sm font-bold truncate",
                      currentSong?.id === item.song.id ? "text-primary" : "text-white"
                    )}>
                      {item.song.title}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">{item.song.artist}</p>
                  </div>
                </div>

                <div className="text-xs text-on-surface-variant/60 font-medium">
                  {formatDistanceToNow(item.playedAt, { addSuffix: true, locale: zhCN })}
                </div>

                <div className="w-10 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-white transition-all">
                    <Music size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

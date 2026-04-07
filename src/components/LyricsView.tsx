import React from 'react';
import { ChevronDown, Sparkles, Heart, Share2, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ListMusic, Mic2 } from 'lucide-react';
import { Song } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface LyricsViewProps {
  song: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onClose: () => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

export default function LyricsView({
  song,
  isPlaying,
  progress,
  duration,
  onClose,
  onPlayPause,
  onSeek
}: LyricsViewProps) {
  // Mock lyrics for demo
  const lyrics = [
    { time: 0, text: "为你弹奏肖邦的夜曲" },
    { time: 5, text: "纪念我死去的爱情" },
    { time: 10, text: "而我为你隐姓埋名" },
    { time: 15, text: "在月光下弹琴" },
    { time: 20, text: "为你弹奏肖邦的夜曲" },
    { time: 25, text: "纪念我死去的爱情" },
    { time: 30, text: "而我为你隐姓埋名" },
    { time: 35, text: "在月光下弹琴" },
    { time: 40, text: "为你弹奏肖邦的夜曲" },
    { time: 45, text: "纪念我死去的爱情" },
    { time: 50, text: "而我为你隐姓埋名" },
    { time: 55, text: "在月光下弹琴" },
    { time: 60, text: "为你弹奏肖邦的夜曲" },
    { time: 65, text: "纪念我死去的爱情" },
    { time: 70, text: "而我为你隐姓埋名" },
    { time: 75, text: "在月光下弹琴" },
  ];

  const currentLyricIndex = lyrics.findIndex((l, i) => {
    const next = lyrics[i + 1];
    return progress >= l.time && (!next || progress < next.time);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[100px] saturate-150 opacity-40"
          style={{ backgroundImage: `url(${song?.cover || 'https://picsum.photos/seed/music/1920/1080'})` }}
        />
      </div>

      {/* Top Nav */}
      <nav className="relative z-10 h-16 flex items-center justify-between px-8 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronDown className="text-white/60" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">正在播放</span>
            <span className="text-xs text-white/40">{song?.title} - {song?.artist}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-medium text-sm">
            <Sparkles size={14} />
            <span>一键匹配封面和歌词</span>
          </button>
          <div className="flex items-center gap-3 ml-4">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">
              <Heart size={18} className="text-white/60" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">
              <Share2 size={18} className="text-white/60" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">
              <MoreHorizontal size={18} className="text-white/60" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-12 gap-20 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Left: Album Art */}
        <section className="flex-1 flex flex-col items-end justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-[480px] h-[480px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 bg-surface-container">
              <img 
                src={song?.cover || 'https://picsum.photos/seed/music/800/800'} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </div>
          <div className="mt-12 text-right w-[480px]">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{song?.title}</h1>
            <p className="text-xl text-white/60 font-medium">{song?.artist} — {song?.album || '未知专辑'}</p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-white/5 text-white/40 uppercase">Lossless</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-white/5 text-white/40 uppercase">24-bit / 192kHz</span>
            </div>
          </div>
        </section>

        {/* Right: Lyrics */}
        <section className="flex-1 h-full flex flex-col justify-center">
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar pr-12 space-y-8 mask-gradient py-40">
            {lyrics.map((line, i) => (
              <p 
                key={i}
                className={cn(
                  "transition-all duration-500 cursor-pointer",
                  currentLyricIndex === i 
                    ? "text-4xl font-bold text-primary transform scale-105 origin-left" 
                    : "text-2xl font-semibold text-white/20 hover:text-white/40"
                )}
                onClick={() => onSeek(line.time)}
              >
                {line.text}
              </p>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Controls */}
      <footer className="relative z-10 h-32 px-12 bg-background/60 backdrop-blur-2xl flex flex-col items-center justify-center">
        <div className="w-full max-w-[1200px] flex items-center gap-4 mb-4">
          <span className="text-[10px] font-bold text-white/40 font-mono w-10">{formatTime(progress)}</span>
          <div 
            className="flex-1 h-[3px] bg-white/5 rounded-full relative group cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              onSeek((x / rect.width) * duration);
            }}
          >
            <div 
              className="absolute h-full bg-primary rounded-full" 
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            <div 
              className="absolute h-3 w-3 bg-white border-2 border-primary rounded-full -top-[4px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              style={{ left: `${(progress / duration) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white/40 font-mono w-10">{formatTime(duration)}</span>
        </div>

        <div className="w-full max-w-[1200px] flex items-center justify-between">
          <div className="flex items-center gap-6 w-1/3">
            <button className="text-white/60 hover:text-primary transition-colors"><Shuffle size={20} /></button>
            <button className="text-white/60 hover:text-primary transition-colors"><Repeat size={20} /></button>
          </div>
          <div className="flex items-center gap-10">
            <button className="hover:scale-110 transition-transform"><SkipBack size={32} fill="currentColor" className="text-white" /></button>
            <button 
              onClick={onPlayPause}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button className="hover:scale-110 transition-transform"><SkipForward size={32} fill="currentColor" className="text-white" /></button>
          </div>
          <div className="flex items-center justify-end gap-6 w-1/3">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-white/60" />
              <div className="w-24 h-[3px] bg-white/5 rounded-full relative">
                <div className="absolute h-full w-[70%] bg-white/40 rounded-full" />
              </div>
            </div>
            <button className="text-white/60 hover:text-primary transition-colors"><ListMusic size={20} /></button>
            <button className="text-white/60 hover:text-primary transition-colors"><Mic2 size={20} /></button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

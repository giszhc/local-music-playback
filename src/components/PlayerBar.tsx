import React, { useState } from 'react';
import { 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Repeat, 
  Mic2, 
  ListMusic, 
  Volume2, 
  Heart,
  ChevronDown,
  X
} from 'lucide-react';
import { Song } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: Song[];
  playMode: 'list' | 'random' | 'single';
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleLyrics: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlayMode: () => void;
  onPlaySong: (song: Song) => void;
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  progress,
  duration,
  volume,
  queue,
  playMode,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleLyrics,
  onNext,
  onPrev,
  onTogglePlayMode,
  onPlaySong
}: PlayerBarProps) {
  const [showQueue, setShowQueue] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full h-24 z-50 glass-effect flex items-center justify-between px-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-outline-variant">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container shadow-lg group relative cursor-pointer" onClick={onToggleLyrics}>
          {currentSong?.cover ? (
            <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              <ListMusic size={24} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <ChevronDown className="text-white rotate-180" size={20} />
          </div>
        </div>
        <div className="overflow-hidden">
          <h5 className="font-bold text-sm text-white truncate">{currentSong?.title || '未在播放'}</h5>
          <p className="text-on-surface-variant text-[10px] truncate">{currentSong?.artist || '未知艺术家'}</p>
        </div>
        {currentSong && (
          <button className="ml-2 text-primary hover:scale-110 transition-transform">
            <Heart size={16} fill="currentColor" />
          </button>
        )}
      </div>

      {/* Playback Controls Center */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
        <div className="flex items-center gap-8">
          <button 
            onClick={onTogglePlayMode}
            className={cn(
              "transition-all",
              playMode === 'random' ? "text-primary" : "text-on-surface-variant hover:text-white"
            )}
            title="随机播放"
          >
            <Shuffle size={18} />
          </button>
          <button 
            onClick={onPrev}
            className="text-on-surface-variant hover:text-white transition-all"
          >
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button 
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-white text-background flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={onNext}
            className="text-on-surface-variant hover:text-white transition-all"
          >
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button 
            onClick={onTogglePlayMode}
            className={cn(
              "transition-all relative",
              playMode !== 'random' ? "text-primary" : "text-on-surface-variant hover:text-white"
            )}
            title={playMode === 'single' ? "单曲循环" : "列表循环"}
          >
            <Repeat size={18} />
            {playMode === 'single' && (
              <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-primary text-white w-3 h-3 rounded-full flex items-center justify-center">1</span>
            )}
          </button>
        </div>
        
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] text-on-surface-variant w-8 text-right font-manrope">{formatTime(progress)}</span>
          <div 
            className="flex-1 h-1 bg-surface-container rounded-full relative group cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = x / rect.width;
              onSeek(pct * duration);
            }}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-primary rounded-full" 
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(progress / (duration || 1)) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-on-surface-variant w-8 font-manrope">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Actions */}
      <div className="flex items-center justify-end gap-6 w-1/4">
        <button 
          onClick={onToggleLyrics}
          className="text-on-surface-variant hover:text-primary transition-all"
          title="歌词"
        >
          <Mic2 size={18} />
        </button>
        
        <div className="relative group">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={cn(
              "transition-colors",
              showQueue ? "text-primary" : "text-on-surface-variant hover:text-primary"
            )}
            title="播放队列"
          >
            <ListMusic size={20} />
          </button>
          
          <AnimatePresence>
            {showQueue && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-12 right-0 w-80 max-h-[400px] bg-surface-container rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col z-50"
              >
                <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
                  <h6 className="font-bold text-sm">播放队列 ({queue.length})</h6>
                  <button onClick={() => setShowQueue(false)} className="text-on-surface-variant hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 hide-scrollbar">
                  {queue.map((song) => (
                    <div 
                      key={song.id}
                      onClick={() => onPlaySong(song)}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all group",
                        currentSong?.id === song.id ? "bg-primary/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="w-8 h-8 rounded bg-surface-container overflow-hidden flex-shrink-0">
                        <img src={song.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-xs font-bold truncate",
                          currentSong?.id === song.id ? "text-primary" : "text-white"
                        )}>{song.title}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">{song.artist}</p>
                      </div>
                      {currentSong?.id === song.id && isPlaying && (
                        <div className="flex gap-0.5 items-end h-3">
                          <div className="w-0.5 bg-primary animate-music-bar-1" />
                          <div className="w-0.5 bg-primary animate-music-bar-2" />
                          <div className="w-0.5 bg-primary animate-music-bar-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 w-32 group">
          <Volume2 size={18} className="text-on-surface-variant group-hover:text-white" />
          <div 
            className="flex-1 h-1 bg-surface-container rounded-full relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              onVolumeChange(Math.max(0, Math.min(1, x / rect.width)));
            }}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white/40 rounded-full group-hover:bg-primary" 
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

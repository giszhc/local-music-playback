import React from 'react';
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
  Heart 
} from 'lucide-react';
import { Song } from '../types';
import { cn } from '../lib/utils';

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleLyrics: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  progress,
  duration,
  volume,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleLyrics,
  onNext,
  onPrev
}: PlayerBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full h-24 z-50 glass-effect flex items-center justify-between px-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-outline-variant">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container shadow-lg">
          {currentSong?.cover ? (
            <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              <ListMusic size={24} />
            </div>
          )}
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
          <button className="text-on-surface-variant hover:text-white transition-all">
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
          <button className="text-on-surface-variant hover:text-white transition-all">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] text-on-surface-variant w-8 text-right">{formatTime(progress)}</span>
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
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(progress / duration) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-on-surface-variant w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Actions */}
      <div className="flex items-center justify-end gap-6 w-1/4">
        <button 
          onClick={onToggleLyrics}
          className="text-on-surface-variant hover:text-primary transition-all"
        >
          <Mic2 size={18} />
        </button>
        <button className="text-on-surface-variant hover:text-white transition-all">
          <ListMusic size={18} />
        </button>
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

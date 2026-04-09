import React, { useMemo, useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Heart, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ListMusic, Mic2, X, Music } from 'lucide-react';
import { Song } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { matchMetadata, METADATA_SOURCES, getSearchUrl } from '../services/musicService';

interface LyricsViewProps {
  song: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onClose: () => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlayMode: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleLike: (songId: string) => void;
  likedSongIds: Set<string>;
  onPlaySong: (song: Song) => void;
  queue: Song[];
  playMode: 'list' | 'random' | 'single';
  volume: number;
  onUpdateSong?: (songId: string, updates: Partial<Song>) => void;
}

interface LyricLine {
  time: number;
  text: string;
}

export default function LyricsView({
  song,
  isPlaying,
  progress,
  duration,
  onClose,
  onPlayPause,
  onSeek,
  onNext,
  onPrev,
  onTogglePlayMode,
  onVolumeChange,
  onToggleLike,
  likedSongIds,
  onPlaySong,
  queue,
  playMode,
  volume,
  onUpdateSong
}: LyricsViewProps) {
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  // Parse LRC lyrics
  const parsedLyrics = useMemo<LyricLine[]>(() => {
    if (!song?.lyrics) return [];
    
    const lines = song.lyrics.split('\n');
    const result: LyricLine[] = [];
    // Support formats like [00:00.00], [00:00:00], [00:00], [0:00.00], etc.
    const timeRegex = /\[(\d{1,3}):(\d{1,2})(?:[:.](\d{1,3}))?\]/g;

    lines.forEach(line => {
      let match;
      const timestamps: number[] = [];
      let lastIndex = 0;

      // Find all timestamps in the line
      while ((match = timeRegex.exec(line)) !== null) {
        const mins = parseInt(match[1]);
        const secs = parseInt(match[2]);
        const msStr = match[3] || '0';
        const ms = parseInt(msStr);
        
        // Calculate time in seconds
        // If ms is 2 digits, it's centiseconds (1/100), if 3 digits it's milliseconds (1/1000)
        const msFactor = msStr.length === 3 ? 1000 : 100;
        const time = mins * 60 + secs + ms / msFactor;
        
        timestamps.push(time);
        lastIndex = timeRegex.lastIndex;
      }

      // The text is what remains after all timestamps
      const text = line.substring(lastIndex).trim();
      
      if (text) {
        timestamps.forEach(time => {
          result.push({ time, text });
        });
      }
    });

    return result.sort((a, b) => a.time - b.time);
  }, [song?.lyrics]);

  // Auto-fetch lyrics if missing
  useEffect(() => {
    const autoFetch = async () => {
      if (song && !song.lyrics && !isAutoMatching && onUpdateSong) {
        setIsAutoMatching(true);
        try {
          const match = await matchMetadata(song);
          if (match.lyrics) {
            onUpdateSong(song.id, match);
          }
        } catch (error) {
          console.error('Auto-fetch lyrics failed:', error);
        } finally {
          setIsAutoMatching(false);
        }
      }
    };
    autoFetch();
  }, [song?.id, song?.lyrics, onUpdateSong]);

  const currentLyricIndex = parsedLyrics.findIndex((l, i) => {
    const next = parsedLyrics[i + 1];
    return progress >= l.time && (!next || progress < next.time);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualMatch = async () => {
    if (!song || !onUpdateSong) return;
    setIsAutoMatching(true);
    const match = await matchMetadata(song);
    onUpdateSong(song.id, match);
    setIsAutoMatching(false);
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
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[100px] saturate-150 opacity-40 transition-all duration-1000"
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
          <button 
            onClick={handleManualMatch}
            disabled={isAutoMatching}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-medium text-sm disabled:opacity-50"
          >
            {isAutoMatching ? (
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>{isAutoMatching ? '正在匹配...' : '一键匹配封面和歌词'}</span>
          </button>
          <div className="flex items-center gap-3 ml-4">
            <button 
              onClick={() => song && onToggleLike(song.id)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"
            >
              <Heart 
                size={18} 
                className={cn(song && likedSongIds.has(song.id) ? "text-primary fill-primary" : "text-white/60")} 
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">
              <MoreHorizontal size={18} className="text-white/60" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-12 gap-16 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Left: Album Art */}
        <section className="w-[400px] flex flex-col items-center justify-center shrink-0">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-surface-container">
              <img 
                src={song?.cover || 'https://picsum.photos/seed/music/800/800'} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </div>
          <div className="mt-10 text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tighter leading-none">{song?.title}</h1>
            <p className="text-lg text-white/50 font-semibold">{song?.artist}</p>
            <p className="text-sm text-white/30 font-medium">{song?.album || '未知专辑'}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-widest bg-white/5 text-white/30 uppercase border border-white/5">Lossless</span>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-widest bg-white/5 text-white/30 uppercase border border-white/5">Hi-Res</span>
            </div>
          </div>
        </section>

        {/* Right: Lyrics */}
        <section className="flex-1 h-full flex flex-col justify-center min-w-0">
          <div className="max-h-[500px] overflow-y-auto hide-scrollbar pr-12 space-y-6 mask-gradient py-32 scroll-smooth">
            {parsedLyrics.length > 0 ? (
              parsedLyrics.map((line, i) => (
                <p 
                  key={i}
                  className={cn(
                    "transition-all duration-700 cursor-pointer leading-tight",
                    currentLyricIndex === i 
                      ? "text-4xl font-black text-primary transform scale-105 origin-left tracking-tight" 
                      : "text-2xl font-bold text-white/15 hover:text-white/30 tracking-tight"
                  )}
                  onClick={() => onSeek(line.time)}
                >
                  {line.text}
                </p>
              ))
            ) : (
              <div className="h-full flex flex-col items-start justify-center gap-8">
                <div className="space-y-2">
                  <p className="text-5xl font-black text-white/10 tracking-tighter">暂无歌词</p>
                  <p className="text-lg text-white/5 font-medium">未能在云端找到匹配的歌词文件</p>
                </div>
                
                <div className="space-y-4 w-full max-w-md">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleManualMatch}
                      disabled={isAutoMatching}
                      className="px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-all font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {isAutoMatching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={16} />
                      )}
                      {isAutoMatching ? '正在重试...' : '重新自动匹配'}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">手动前往外部网站搜索</p>
                    <div className="grid grid-cols-2 gap-2">
                      {METADATA_SOURCES.filter(s => s.type === 'search').slice(0, 6).map(source => (
                        <a
                          key={source.name}
                          href={song ? getSearchUrl(source.name, song.title, song.artist) || '#' : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold text-white/40 hover:text-white"
                        >
                          <Music size={12} />
                          {source.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            <button 
              onClick={onTogglePlayMode}
              className={cn(
                "transition-colors",
                playMode === 'random' ? "text-primary" : "text-white/60 hover:text-primary"
              )}
            >
              <Shuffle size={20} />
            </button>
            <button 
              onClick={onTogglePlayMode}
              className={cn(
                "transition-colors relative",
                playMode !== 'random' ? "text-primary" : "text-white/60 hover:text-primary"
              )}
            >
              <Repeat size={20} />
              {playMode === 'single' && (
                <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-primary text-white w-3 h-3 rounded-full flex items-center justify-center">1</span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-10">
            <button 
              onClick={onPrev}
              className="hover:scale-110 transition-transform"
            >
              <SkipBack size={32} fill="currentColor" className="text-white" />
            </button>
            <button 
              onClick={onPlayPause}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={onNext}
              className="hover:scale-110 transition-transform"
            >
              <SkipForward size={32} fill="currentColor" className="text-white" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-6 w-1/3">
            <div className="flex items-center gap-3 w-40 group relative">
              <Volume2 size={20} className="text-white/60 group-hover:text-white shrink-0" />
              <div 
                className="flex-1 h-[3px] bg-white/5 rounded-full relative cursor-pointer"
                onMouseDown={(e) => {
                  const container = e.currentTarget;
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const rect = container.getBoundingClientRect();
                    const x = moveEvent.clientX - rect.left;
                    const newVolume = Math.max(0, Math.min(1, x / rect.width));
                    onVolumeChange(newVolume);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  onVolumeChange(Math.max(0, Math.min(1, x / rect.width)));
                }}
              >
                <div 
                  className="absolute h-full bg-white/40 rounded-full group-hover:bg-primary" 
                  style={{ width: `${volume * 100}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${volume * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-white/40 w-8 font-mono font-bold">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <button 
              onClick={() => setShowQueue(!showQueue)}
              className={cn(
                "transition-colors",
                showQueue ? "text-primary" : "text-white/60 hover:text-primary"
              )}
            >
              <ListMusic size={20} />
            </button>
            <button className="text-white/60 hover:text-primary transition-colors"><Mic2 size={20} /></button>
          </div>
        </div>
      </footer>

      {/* Queue Overlay */}
      <AnimatePresence>
        {showQueue && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQueue(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-96 bg-surface-container/90 backdrop-blur-3xl z-[120] border-l border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold">播放队列</h3>
                <button onClick={() => setShowQueue(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
                {queue.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => onPlaySong(s)}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all group",
                      song?.id === s.id ? "bg-primary/10" : "hover:bg-white/5"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={s.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-bold truncate",
                        song?.id === s.id ? "text-primary" : "text-white"
                      )}>{s.title}</p>
                      <p className="text-xs text-white/40 truncate">{s.artist}</p>
                    </div>
                    {song?.id === s.id && isPlaying && (
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
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

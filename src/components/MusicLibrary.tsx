import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FolderOpen, Play, MoreHorizontal, Heart, SortAsc, ChevronDown, Music, Sparkles } from 'lucide-react';
import { Song } from '../types';
import { pinyin } from 'pinyin-pro';
import { cn } from '../lib/utils';

interface MusicLibraryProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onAddFolder: () => void;
  onPlayAll: (songs: Song[]) => void;
  onMatchMetadata: () => void;
  isScanning?: boolean;
  isMatching?: boolean;
}

export default function MusicLibrary({ 
  songs, 
  onPlaySong, 
  onAddFolder, 
  onPlayAll, 
  onMatchMetadata,
  isScanning = false,
  isMatching = false
}: MusicLibraryProps) {
  const [sortKey, setSortKey] = useState<'title' | 'artist' | 'addedAt'>('addedAt');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isManualScrolling = useRef(false);

  const alphabet = useMemo(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split(''), []);

  const getFirstLetter = useCallback((str: string) => {
    if (!str || typeof str !== 'string') return '#';
    
    const trimmed = str.trim();
    if (trimmed.length === 0) return '#';
    
    const firstChar = trimmed.charAt(0).toUpperCase();
    
    // 1. Direct check for English letters
    if (/^[A-Z]$/.test(firstChar)) return firstChar;
    
    // 2. Check for Chinese characters using pinyin
    try {
      const py = pinyin(firstChar, { toneType: 'none', type: 'array' });
      if (py && py.length > 0 && py[0]) {
        const firstPyChar = py[0].charAt(0).toUpperCase();
        if (/^[A-Z]$/.test(firstPyChar)) return firstPyChar;
      }
    } catch (e) {
      console.error('Pinyin conversion error:', e);
    }
    
    // 3. Fallback to #
    return '#';
  }, []);

  const sortedSongs = useMemo(() => {
    let result = [...songs];
    
    if (sortKey === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh'));
    } else if (sortKey === 'artist') {
      result.sort((a, b) => (a.artist || '').localeCompare(b.artist || '', 'zh'));
    } else {
      result.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    }

    return result;
  }, [songs, sortKey]);

  const groupedSongs = useMemo(() => {
    const groups: { [key: string]: Song[] } = {};
    // Initialize all letters to ensure they exist in the map if needed, 
    // though we iterate over alphabet array anyway.
    alphabet.forEach(l => groups[l] = []);
    
    sortedSongs.forEach(song => {
      const letter = getFirstLetter(song.title);
      groups[letter].push(song);
    });
    return groups;
  }, [sortedSongs, alphabet, getFirstLetter]);

  const scrollToLetter = (letter: string) => {
    const element = sectionRefs.current[letter];
    const container = scrollContainerRef.current;
    if (element && container) {
      isManualScrolling.current = true;
      setActiveLetter(letter);
      
      // Calculate position relative to scroll container
      const top = element.offsetTop;
      
      container.scrollTo({
        top: top - 80, // Offset for sticky header
        behavior: 'smooth'
      });

      // Reset manual scroll flag after animation
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  // Find the scroll container and track scroll position
  useEffect(() => {
    const findScrollContainer = (el: HTMLElement | null): HTMLElement | null => {
      if (!el) return null;
      const overflow = window.getComputedStyle(el).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return el;
      return findScrollContainer(el.parentElement);
    };

    const rootElement = document.getElementById('music-library-root');
    const container = findScrollContainer(rootElement);
    scrollContainerRef.current = container;

    if (!container) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const scrollTop = container.scrollTop;
      
      let currentLetter = null;
      for (const letter of alphabet) {
        const element = sectionRefs.current[letter];
        if (element) {
          const elementTop = element.offsetTop;
          if (elementTop <= scrollTop + 120) { // Adjusted offset for better tracking
            currentLetter = letter;
          } else {
            break;
          }
        }
      }
      setActiveLetter(currentLetter);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [alphabet]);

  return (
    <div id="music-library-root" className="flex gap-8 min-h-full relative">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">本地音乐库</h2>
            <p className="text-on-surface-variant mt-2 text-sm">在这里探索和管理你的私人收藏。</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-bright transition-all"
              >
                <SortAsc size={18} />
                排序: {sortKey === 'title' ? '标题' : sortKey === 'artist' ? '艺术家' : '添加时间'}
                <ChevronDown size={14} className={cn("transition-transform", showSortMenu && "rotate-180")} />
              </button>
              
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-surface-container rounded-xl shadow-2xl border border-outline-variant py-2 z-50">
                  <button 
                    onClick={() => { setSortKey('addedAt'); setShowSortMenu(false); }}
                    className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/5", sortKey === 'addedAt' && "text-primary")}
                  >
                    添加时间
                  </button>
                  <button 
                    onClick={() => { setSortKey('title'); setShowSortMenu(false); }}
                    className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/5", sortKey === 'title' && "text-primary")}
                  >
                    歌曲标题
                  </button>
                  <button 
                    onClick={() => { setSortKey('artist'); setShowSortMenu(false); }}
                    className={cn("w-full text-left px-4 py-2 text-sm hover:bg-white/5", sortKey === 'artist' && "text-primary")}
                  >
                    艺术家
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={onMatchMetadata}
              disabled={isMatching || songs.length === 0}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="一键从网络匹配封面和歌词"
            >
              {isMatching ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {isMatching ? '正在匹配...' : '一键匹配'}
            </button>

            <button 
              onClick={onAddFolder}
              disabled={isScanning}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container text-primary font-semibold text-sm hover:bg-surface-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <FolderOpen size={18} />
              )}
              {isScanning ? '正在扫描...' : '添加文件夹'}
            </button>
            <button 
              onClick={() => onPlayAll(sortedSongs)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dim text-white font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
            >
              <Play size={18} fill="currentColor" />
              全部播放
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 bg-surface-container/20 rounded-3xl border border-outline-variant">
          <div className="grid grid-cols-[48px_2fr_1.5fr_1fr_120px] px-6 py-4 border-b border-outline-variant text-xs font-bold uppercase tracking-wider text-on-surface-variant sticky top-0 bg-surface-container z-20">
            <span>#</span>
            <span>歌曲名称</span>
            <span>艺术家</span>
            <span>时长</span>
            <span className="text-right">操作</span>
          </div>

          <div className="flex-1">
            {isScanning && songs.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-medium animate-pulse">正在深度扫描文件夹中的音频文件...</p>
              </div>
            ) : (
              <div className="pb-20">
                {alphabet.map(letter => {
                  const songsInGroup = groupedSongs[letter];
                  if (!songsInGroup || songsInGroup.length === 0) return null;

                  return (
                    <div key={letter} ref={el => sectionRefs.current[letter] = el} className="scroll-mt-20">
                      <div className="sticky top-[49px] bg-surface-container/90 backdrop-blur-md z-10 py-2 px-6 border-y border-outline-variant/30">
                        <span className="text-sm font-black text-primary">{letter}</span>
                      </div>
                      <div className="divide-y divide-outline-variant/10">
                        {songsInGroup.map((song, index) => (
                          <div 
                            key={song.id}
                            onDoubleClick={() => onPlaySong(song)}
                            className="grid grid-cols-[48px_2fr_1.5fr_1fr_120px] px-6 py-3 items-center transition-all group hover:bg-white/5 cursor-pointer"
                          >
                            <span className="text-sm text-on-surface-variant group-hover:text-primary font-mono">{String(index + 1).padStart(2, '0')}</span>
                            <div className="flex items-center gap-4 overflow-hidden">
                              <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-outline-variant/50">
                                {song.cover ? (
                                  <img src={song.cover} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                                    <Music size={16} />
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-white truncate">{song.title}</span>
                            </div>
                            <span className="text-sm text-on-surface-variant truncate">{song.artist}</span>
                            <span className="text-sm text-on-surface-variant font-mono">
                              {Math.floor(song.duration / 60)}:{(Math.floor(song.duration % 60)).toString().padStart(2, '0')}
                            </span>
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"><Heart size={16} /></button>
                              <button className="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"><MoreHorizontal size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {sortedSongs.length === 0 && !isScanning && (
                  <div className="py-20 text-center text-on-surface-variant">
                    <p>暂无音乐，请添加文件夹扫描</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* A-Z Navigation */}
      <div className="w-10 flex flex-col items-center py-4 bg-surface-container/40 backdrop-blur-2xl rounded-2xl border border-outline-variant self-start sticky top-20 z-30 shadow-2xl">
        <div className="flex flex-col gap-0.5">
          {alphabet.map(letter => {
            const hasSongs = groupedSongs[letter] && groupedSongs[letter].length > 0;
            return (
              <button
                key={letter}
                onClick={() => hasSongs && scrollToLetter(letter)}
                className={cn(
                  "w-6 h-6 flex flex-col items-center justify-center rounded-md transition-all relative group",
                  !hasSongs ? "text-on-surface-variant/20 cursor-default" : "text-on-surface hover:text-primary hover:bg-primary/10 cursor-pointer",
                  activeLetter === letter ? "text-primary bg-primary/20 font-bold scale-110" : "font-medium"
                )}
              >
                <span className="text-[10px] uppercase">{letter}</span>
                {hasSongs && (
                  <span className={cn(
                    "absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary transition-opacity",
                    activeLetter === letter ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

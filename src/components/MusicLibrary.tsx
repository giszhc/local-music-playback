import React, { useState, useMemo } from 'react';
import { FolderOpen, Play, MoreHorizontal, Heart, SortAsc } from 'lucide-react';
import { Song } from '../types';
import { pinyin } from 'pinyin-pro';
import { cn } from '../lib/utils';

interface MusicLibraryProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onAddFolder: () => void;
  isScanning?: boolean;
}

export default function MusicLibrary({ songs, onPlaySong, onAddFolder, isScanning = false }: MusicLibraryProps) {
  const [sortKey, setSortKey] = useState<'title' | 'artist' | 'addedAt'>('addedAt');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const sortedSongs = useMemo(() => {
    let result = [...songs];
    
    if (sortKey === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
    } else if (sortKey === 'artist') {
      result.sort((a, b) => a.artist.localeCompare(b.artist, 'zh'));
    } else {
      result.sort((a, b) => b.addedAt - a.addedAt);
    }

    if (activeLetter) {
      result = result.filter(song => {
        const firstChar = song.title.charAt(0);
        // Using pinyin-pro to get the first letter of the pinyin
        const py = pinyin(firstChar, { toneType: 'none', type: 'array' })[0]?.charAt(0).toUpperCase() || '#';
        if (activeLetter === '#') return !/^[A-Z]$/.test(py);
        return py === activeLetter;
      });
    }

    return result;
  }, [songs, sortKey, activeLetter]);

  return (
    <div className="flex gap-8 h-full">
      <div className="flex-1">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">本地音乐库</h2>
            <p className="text-on-surface-variant mt-2 text-sm">在这里探索和管理你的私人收藏。</p>
          </div>
          <div className="flex gap-3">
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
            <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dim text-white font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
              <Play size={18} fill="currentColor" />
              全部播放
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[48px_2fr_1.5fr_1fr_120px] px-4 py-4 border-b border-outline-variant text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <span>#</span>
            <span>歌曲名称</span>
            <span>艺术家</span>
            <span>时长</span>
            <span className="text-right">操作</span>
          </div>

          <div className="space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-320px)] pr-4 hide-scrollbar">
            {isScanning && songs.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-medium animate-pulse">正在深度扫描文件夹中的音频文件...</p>
              </div>
            ) : (
              <>
                {sortedSongs.map((song, index) => (
                  <div 
                    key={song.id}
                    onDoubleClick={() => onPlaySong(song)}
                    className="grid grid-cols-[48px_2fr_1.5fr_1fr_120px] px-4 py-4 rounded-xl items-center transition-all group hover:bg-white/5 cursor-pointer"
                  >
                    <span className="text-sm text-on-surface-variant group-hover:text-primary">{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                        {song.cover ? (
                          <img src={song.cover} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                            <Play size={16} />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white truncate">{song.title}</span>
                    </div>
                    <span className="text-sm text-on-surface-variant truncate">{song.artist}</span>
                    <span className="text-sm text-on-surface-variant font-manrope">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary"><Heart size={18} /></button>
                      <button className="text-on-surface-variant hover:text-primary"><MoreHorizontal size={18} /></button>
                    </div>
                  </div>
                ))}
                {sortedSongs.length === 0 && !isScanning && (
                  <div className="py-20 text-center text-on-surface-variant">
                    <p>暂无音乐，请添加文件夹扫描</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* A-Z Navigation */}
      <div className="w-8 flex flex-col items-center justify-center py-4 bg-surface rounded-full border border-outline-variant self-start mt-20">
        <div className="flex flex-col gap-1 text-[9px] font-bold text-on-surface-variant">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
              className={cn(
                "hover:text-primary transition-colors py-0.5",
                activeLetter === letter ? "text-primary scale-125" : ""
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

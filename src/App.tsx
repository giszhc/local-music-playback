/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PlayerBar from './components/PlayerBar';
import HomeView from './components/HomeView';
import MusicLibrary from './components/MusicLibrary';
import LyricsView from './components/LyricsView';
import PlaylistsView from './components/PlaylistsView';
import SearchView from './components/SearchView';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { Song } from './types';
import { AnimatePresence } from 'motion/react';
import { FolderOpen, MoreHorizontal, Sparkles } from 'lucide-react';
import * as mm from 'music-metadata-browser';
import { matchMetadata } from './services/musicService';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLyrics, setShowLyrics] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [addedFolders, setAddedFolders] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const player = useMusicPlayer();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query && activeTab !== 'search') {
      setActiveTab('search');
    }
  }, [activeTab]);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    
    setIsScanning(true);
    const audioFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || 
      /\.(mp3|wav|ogg|flac|m4a)$/i.test(file.name)
    );

    if (audioFiles.length === 0) {
      alert('所选文件夹中没有找到有效的音频文件。');
      setIsScanning(false);
      return;
    }

    const newSongs: Song[] = [];
    
    for (const file of audioFiles) {
      try {
        const metadata = await mm.parseBlob(file);
        const url = URL.createObjectURL(file);
        
        // Extract metadata
        const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");
        const artist = metadata.common.artist || '未知艺术家';
        const album = metadata.common.album;
        const duration = metadata.format.duration || 0;
        
        // Extract cover if available
        let cover = `https://picsum.photos/seed/${encodeURIComponent(title)}/400/400`;
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const pic = metadata.common.picture[0];
          const blob = new Blob([pic.data], { type: pic.format });
          cover = URL.createObjectURL(blob);
        }

        newSongs.push({
          id: Math.random().toString(36).substr(2, 9),
          title,
          artist,
          album,
          duration,
          url,
          file,
          addedAt: Date.now(),
          cover,
        });
      } catch (error) {
        console.error('Error parsing metadata for', file.name, error);
        // Fallback for files that fail to parse
        const url = URL.createObjectURL(file);
        newSongs.push({
          id: Math.random().toString(36).substr(2, 9),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: '未知艺术家',
          duration: 0,
          url,
          file,
          addedAt: Date.now(),
          cover: `https://picsum.photos/seed/${encodeURIComponent(file.name)}/400/400`,
        });
      }
    }

    setSongs(prev => {
      const combined = [...prev];
      newSongs.forEach(ns => {
        if (!combined.find(s => s.title === ns.title && s.artist === ns.artist)) {
          combined.push(ns);
        }
      });
      return combined;
    });

    // Extract folder name from the first file's path if available
    const firstFilePath = (audioFiles[0] as any).webkitRelativePath;
    if (firstFilePath) {
      const folderName = firstFilePath.split('/')[0];
      setAddedFolders(prev => Array.from(new Set([...prev, folderName])));
    } else {
      setAddedFolders(prev => Array.from(new Set([...prev, '本地导入'])));
    }

    setIsScanning(false);
    setActiveTab('library');
  }, []);

  const handleMatchAllMetadata = useCallback(async () => {
    if (songs.length === 0) return;
    
    setIsMatching(true);
    const updatedSongs = [...songs];
    
    for (let i = 0; i < updatedSongs.length; i++) {
      const song = updatedSongs[i];
      // Only match if it's missing a real cover or has "未知艺术家"
      if (song.artist === '未知艺术家' || !song.lyrics) {
        const match = await matchMetadata(song);
        updatedSongs[i] = { ...song, ...match };
      }
    }
    
    setSongs(updatedSongs);
    setIsMatching(false);
    alert('匹配完成！已更新封面和歌词。');
  }, [songs]);

  const handleAddFolder = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleClearLibrary = useCallback(() => {
    setSongs([]);
    setAddedFolders([]);
    player.setQueue([]);
    player.stop();
  }, [player]);

  // Sync queue with library songs
  useEffect(() => {
    if (songs.length > 0 && player.queue.length === 0) {
      player.setQueue(songs);
    }
  }, [songs, player]);

  const handlePlaySong = useCallback((song: Song) => {
    if (player.queue.length === 0) {
      player.setQueue(songs);
    }
    player.play(song);
  }, [player, songs]);

  const handlePlayAll = useCallback((songsToPlay: Song[]) => {
    if (songsToPlay.length > 0) {
      player.setQueue(songsToPlay);
      player.play(songsToPlay[0]);
    }
  }, [player]);

  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Hidden File Input for Folder Selection */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
        {...({ webkitdirectory: "", directory: "" } as any)}
      />

      <main className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <TopBar onSearch={handleSearch} />
        
        <div className="flex-1 mt-16 overflow-y-auto hide-scrollbar scroll-smooth">
          <div className="min-h-full w-full p-10 pb-36">
            {activeTab === 'home' && <HomeView songs={songs} onPlaySong={handlePlaySong} />}
            {activeTab === 'library' && (
              <MusicLibrary 
                songs={songs} 
                onPlaySong={handlePlaySong} 
                onAddFolder={handleAddFolder} 
                onPlayAll={handlePlayAll}
                onMatchMetadata={handleMatchAllMetadata}
                isScanning={isScanning}
                isMatching={isMatching}
              />
            )}
            {activeTab === 'folders' && (
              <div className="flex flex-col h-full">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">文件夹管理</h2>
                    <p className="text-on-surface-variant mt-2 text-sm">管理已添加的本地音乐目录。</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleClearLibrary}
                      className="px-6 py-3 bg-white/5 text-on-surface-variant rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                      清空库
                    </button>
                    <button 
                      onClick={handleAddFolder}
                      disabled={isScanning}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isScanning ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FolderOpen size={18} />
                      )}
                      {isScanning ? '正在扫描...' : '添加本地文件夹'}
                    </button>
                  </div>
                </div>

                {addedFolders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant py-20">
                    <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
                      <FolderOpen size={40} className="text-white/20" />
                    </div>
                    <p className="text-lg font-medium mb-2">暂未添加任何文件夹</p>
                    <p className="text-sm opacity-60">点击右上角按钮开始导入你的本地音乐</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addedFolders.map((folder, index) => (
                      <div key={index} className="p-4 rounded-2xl bg-surface-container border border-outline-variant hover:bg-surface-bright transition-all group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FolderOpen size={20} />
                          </div>
                          <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-white truncate mb-1">{folder.split('\\').pop()}</p>
                        <p className="text-[10px] text-on-surface-variant truncate font-mono">{folder}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'playlists' && <PlaylistsView />}
            {activeTab === 'search' && <SearchView searchQuery={searchQuery} />}
          </div>
        </div>

        <PlayerBar 
          currentSong={player.currentSong}
          isPlaying={player.isPlaying}
          progress={player.progress}
          duration={player.duration}
          volume={player.volume}
          queue={player.queue}
          playMode={player.playMode}
          onPlayPause={() => player.isPlaying ? player.pause() : player.play()}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
          onToggleLyrics={() => setShowLyrics(true)}
          onNext={player.playNext}
          onPrev={player.playPrevious}
          onTogglePlayMode={player.togglePlayMode}
          onPlaySong={handlePlaySong}
        />
      </main>

      <AnimatePresence>
        {showLyrics && (
          <LyricsView 
            song={player.currentSong}
            isPlaying={player.isPlaying}
            progress={player.progress}
            duration={player.duration}
            onClose={() => setShowLyrics(false)}
            onPlayPause={() => player.isPlaying ? player.pause() : player.play()}
            onSeek={player.seek}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

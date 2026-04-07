/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLyrics, setShowLyrics] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const player = useMusicPlayer();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query && activeTab !== 'search') {
      setActiveTab('search');
    }
  }, [activeTab]);

  const handleAddFolder = useCallback(() => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const mockSongs: Song[] = [
        {
          id: '1',
          title: '夜曲 (Nocturne)',
          artist: '周杰伦',
          album: '十一月的萧邦',
          duration: 228,
          cover: 'https://picsum.photos/seed/nocturne/400/400',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          addedAt: Date.now(),
        },
        {
          id: '2',
          title: '月光下的琴弦',
          artist: '李云迪',
          album: '肖邦精选',
          duration: 312,
          cover: 'https://picsum.photos/seed/piano/400/400',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          addedAt: Date.now() - 100000,
        },
        {
          id: '3',
          title: '电子脉冲',
          artist: '数字漫游者',
          album: '未来主义',
          duration: 260,
          cover: 'https://picsum.photos/seed/electro/400/400',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          addedAt: Date.now() - 200000,
        },
        {
          id: '4',
          title: '星际迷航',
          artist: '宇宙探索者',
          album: '深空',
          duration: 195,
          cover: 'https://picsum.photos/seed/space/400/400',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
          addedAt: Date.now() - 300000,
        },
        {
          id: '5',
          title: '雨中曲',
          artist: '自然之声',
          album: '四季',
          duration: 245,
          cover: 'https://picsum.photos/seed/rain/400/400',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
          addedAt: Date.now() - 400000,
        }
      ];
      setSongs(prev => {
        const newSongs = [...prev];
        mockSongs.forEach(s => {
          if (!newSongs.find(ns => ns.id === s.id)) {
            newSongs.push(s);
          }
        });
        return newSongs;
      });
      setIsScanning(false);
    }, 2000);
  }, []);

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

  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <TopBar onSearch={handleSearch} />
        
        <div className="flex-1 mt-16 p-10 pb-36 overflow-y-auto hide-scrollbar">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'library' && (
            <MusicLibrary 
              songs={songs} 
              onPlaySong={handlePlaySong} 
              onAddFolder={handleAddFolder} 
              isScanning={isScanning}
            />
          )}
          {activeTab === 'folders' && (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
              <p className="text-xl font-bold mb-4">文件夹管理</p>
              <button 
                onClick={handleAddFolder}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:brightness-110 transition-all"
              >
                添加本地文件夹
              </button>
            </div>
          )}
          {activeTab === 'playlists' && <PlaylistsView />}
          {activeTab === 'search' && <SearchView searchQuery={searchQuery} />}
        </div>

        <PlayerBar 
          currentSong={player.currentSong}
          isPlaying={player.isPlaying}
          progress={player.progress}
          duration={player.duration}
          volume={player.volume}
          onPlayPause={() => player.isPlaying ? player.pause() : player.play()}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
          onToggleLyrics={() => setShowLyrics(true)}
          onNext={player.playNext}
          onPrev={player.playPrevious}
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

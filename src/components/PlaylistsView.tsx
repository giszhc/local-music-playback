import React, { useMemo } from 'react';
import { ListMusic, Play, Heart } from 'lucide-react';
import { Song } from '../types';

interface PlaylistsViewProps {
  songs: Song[];
  likedSongIds: Set<string>;
  onPlaySong: (song: Song) => void;
}

export default function PlaylistsView({ songs, likedSongIds, onPlaySong }: PlaylistsViewProps) {
  const likedSongs = useMemo(() => 
    songs.filter(s => likedSongIds.has(s.id)),
  [songs, likedSongIds]);

  const playlists = [
    { 
      id: 'liked', 
      name: '我喜欢的音乐', 
      count: likedSongs.length, 
      cover: 'https://picsum.photos/seed/fav/400/400',
      songs: likedSongs
    },
    { id: '2', name: '深夜漫步', count: 0, cover: 'https://picsum.photos/seed/night/400/400', songs: [] },
    { id: '3', name: '工作专注', count: 0, cover: 'https://picsum.photos/seed/work/400/400', songs: [] },
    { id: '4', name: '复古流行', count: 0, cover: 'https://picsum.photos/seed/retro/400/400', songs: [] },
  ];

  const handlePlayPlaylist = (playlistSongs: Song[]) => {
    if (playlistSongs.length > 0) {
      onPlaySong(playlistSongs[0]);
    }
  };

  const handleCreatePlaylist = () => {
    const name = prompt('请输入新播放列表名称:');
    if (name && name.trim()) {
      alert(`已创建播放列表: ${name.trim()} (功能演示)`);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">播放列表</h2>
        <p className="text-on-surface-variant mt-2 text-sm">管理你的个性化音乐集。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="group cursor-pointer"
            onClick={() => handlePlayPlaylist(playlist.songs)}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-container mb-4 shadow-xl">
              <img 
                src={playlist.cover} 
                alt={playlist.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              {playlist.id === 'liked' && (
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                  <Heart size={20} fill="currentColor" />
                </div>
              )}
            </div>
            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{playlist.name}</h4>
            <p className="text-on-surface-variant text-sm">{playlist.count} 首歌曲</p>
          </div>
        ))}
        
        <div 
          onClick={handleCreatePlaylist}
          className="aspect-square rounded-3xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ListMusic size={32} />
          </div>
          <span className="font-bold">创建新列表</span>
        </div>
      </div>
    </div>
  );
}

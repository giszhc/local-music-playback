import React, { useMemo } from 'react';
import { Search as SearchIcon, Music, User, Disc, Play, Sparkles } from 'lucide-react';
import { Song } from '../types';

interface SearchViewProps {
  searchQuery: string;
  songs: Song[];
  onPlaySong: (song: Song) => void;
}

export default function SearchView({ searchQuery, songs, onPlaySong }: SearchViewProps) {
  const filteredSongs = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return songs.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.artist.toLowerCase().includes(query) ||
      (s.album && s.album.toLowerCase().includes(query))
    );
  }, [searchQuery, songs]);

  const artists = useMemo(() => {
    const uniqueArtists = Array.from(new Set(filteredSongs.map(s => s.artist)));
    return uniqueArtists.map(name => ({
      name,
      songCount: filteredSongs.filter(s => s.artist === name).length
    }));
  }, [filteredSongs]);

  const albums = useMemo(() => {
    const uniqueAlbums = Array.from(new Set(filteredSongs.filter(s => s.album).map(s => s.album!)));
    return uniqueAlbums.map(name => ({
      name,
      artist: filteredSongs.find(s => s.album === name)?.artist || '未知艺术家',
      songCount: filteredSongs.filter(s => s.album === name).length
    }));
  }, [filteredSongs]);

  const bestMatch = filteredSongs[0] || null;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">搜索结果</h2>
        <p className="text-on-surface-variant mt-2 text-sm">
          {searchQuery ? `关于 "${searchQuery}" 的搜索结果` : '输入关键词开始搜索'}
        </p>
      </div>

      {!searchQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <SearchIcon size={64} className="mb-6 opacity-20" />
          <p className="text-lg font-medium">发现你喜爱的音乐、艺术家和专辑</p>
        </div>
      ) : filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <Music size={64} className="mb-6 opacity-20" />
          <p className="text-lg font-medium">未找到匹配的音乐</p>
          <p className="text-sm opacity-60">尝试搜索其他关键词</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Best Match */}
          {bestMatch && (
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                最佳匹配
              </h3>
              <div 
                onClick={() => onPlaySong(bestMatch)}
                className="bg-surface-container p-8 rounded-[2rem] flex items-center gap-8 group cursor-pointer hover:bg-surface-bright transition-all max-w-2xl"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl">
                  <img src={bestMatch.cover || "https://picsum.photos/seed/match/300/300"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-3xl font-bold mb-1">{bestMatch.title}</h4>
                  <p className="text-on-surface-variant font-medium">{bestMatch.artist} • {bestMatch.album || '单曲'}</p>
                  <div className="flex gap-4 mt-6">
                    <button className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                      <Play size={16} fill="currentColor" />
                      播放
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Music size={20} className="text-primary" />
                歌曲
              </h3>
              <div className="space-y-2">
                {filteredSongs.slice(0, 6).map(song => (
                  <div 
                    key={song.id} 
                    onClick={() => onPlaySong(song)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded bg-surface-container overflow-hidden">
                      <img src={song.cover || `https://picsum.photos/seed/${song.id}/100/100`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm truncate">{song.title}</p>
                      <p className="text-xs text-on-surface-variant truncate">{song.artist}</p>
                    </div>
                    <Play size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User size={20} className="text-primary" />
                艺术家
              </h3>
              <div className="space-y-2">
                {artists.slice(0, 5).map((artist, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden">
                      <img src={`https://picsum.photos/seed/a${i}/100/100`} alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{artist.name}</p>
                      <p className="text-xs text-on-surface-variant">{artist.songCount} 首歌曲</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Disc size={20} className="text-primary" />
                专辑
              </h3>
              <div className="space-y-2">
                {albums.slice(0, 5).map((album, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden">
                      <img src={`https://picsum.photos/seed/alb${i}/100/100`} alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{album.name}</p>
                      <p className="text-xs text-on-surface-variant">{album.artist} • {album.songCount} 首歌曲</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

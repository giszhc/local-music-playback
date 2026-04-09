import { Song } from '../types';

// List of common music metadata sources for reference/manual search
export const METADATA_SOURCES = [
  { name: 'LRCLIB', url: 'https://lrclib.net', description: '开源歌词库，支持逐字/逐行同步' },
  { name: 'Lyrics.ovh', url: 'https://lyrics.ovh', description: '简单易用的歌词 API' },
  { name: '网易云音乐', url: 'https://music.163.com/#/search/m/?s=', type: 'search' },
  { name: 'QQ 音乐', url: 'https://y.qq.com/portal/search.html?w=', type: 'search' },
  { name: '酷狗音乐', url: 'https://www.kugou.com/yy/html/search.html?searchKeyWord=', type: 'search' },
  { name: 'Apple Music', url: 'https://music.apple.com/search?term=', type: 'search' },
  { name: 'Last.fm', url: 'https://www.last.fm/search?q=', type: 'search' },
  { name: 'MusicBrainz', url: 'https://musicbrainz.org/search?type=release&query=', type: 'search' },
  { name: 'Deezer', url: 'https://www.deezer.com/search/', type: 'search' },
  { name: 'Genius', url: 'https://genius.com/search?q=', type: 'search' },
];

/**
 * Gets a search URL for a specific source
 */
export function getSearchUrl(sourceName: string, title: string, artist: string): string | null {
  const source = METADATA_SOURCES.find(s => s.name === sourceName);
  if (!source || !source.url) return null;
  
  const query = encodeURIComponent(`${title} ${artist}`);
  if (source.type === 'search') {
    return `${source.url}${query}`;
  }
  return source.url;
}

/**
 * Fetches lyrics from LRCLIB (Open-source lyric database)
 * Supports synced lyrics (LRC format)
 */
async function fetchFromLRCLIB(title: string, artist: string, duration?: number): Promise<Partial<Song> | null> {
  try {
    const url = new URL('https://lrclib.net/api/get');
    url.searchParams.append('artist_name', artist);
    url.searchParams.append('track_name', title);
    if (duration) url.searchParams.append('duration', Math.round(duration).toString());

    const response = await fetch(url.toString());
    if (!response.ok) return null;

    const data = await response.json();
    return {
      lyrics: data.syncedLyrics || data.plainLyrics || null,
      album: data.albumName || undefined,
      cover: data.thumbnail || undefined,
    };
  } catch (error) {
    console.error('LRCLIB fetch error:', error);
    return null;
  }
}

/**
 * Fetches lyrics from Lyrics.ovh
 * Only supports plain text lyrics
 */
async function fetchFromLyricsOVH(title: string, artist: string): Promise<Partial<Song> | null> {
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.lyrics) {
      return {
        lyrics: data.lyrics,
      };
    }
    return null;
  } catch (error) {
    console.error('Lyrics.ovh fetch error:', error);
    return null;
  }
}

export async function matchMetadata(song: Song): Promise<Partial<Song>> {
  console.log(`Matching metadata for: ${song.title} - ${song.artist}`);
  
  // 1. Try LRCLIB first (best quality, supports synced lyrics)
  const lrclibResult = await fetchFromLRCLIB(song.title, song.artist, song.duration);
  if (lrclibResult && lrclibResult.lyrics) {
    console.log('Matched from LRCLIB');
    return lrclibResult;
  }

  // 2. Try Lyrics.ovh as fallback
  const lyricsOVHResult = await fetchFromLyricsOVH(song.title, song.artist);
  if (lyricsOVHResult && lyricsOVHResult.lyrics) {
    console.log('Matched from Lyrics.ovh');
    return lyricsOVHResult;
  }

  // 3. Fallback to mock/placeholder if nothing found
  console.log('No lyrics found in open sources, using placeholder');
  return {
    cover: song.cover || `https://picsum.photos/seed/${encodeURIComponent(song.title + song.artist)}/500/500`,
    lyrics: song.lyrics || `[00:00.00] 暂无歌词\n[00:05.00] 歌曲: ${song.title}\n[00:10.00] 歌手: ${song.artist}\n[00:15.00] 尝试在设置中手动搜索歌词`,
  };
}

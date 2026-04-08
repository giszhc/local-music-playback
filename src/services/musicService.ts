import { Song } from '../types';

// List of common music metadata sources
const METADATA_SOURCES = [
  { name: 'Apple Music', url: 'https://music.apple.com/search?term=' },
  { name: 'Last.fm', url: 'https://www.last.fm/search?q=' },
  { name: 'MusicBrainz', url: 'https://musicbrainz.org/search?type=release&query=' },
  { name: 'Deezer', url: 'https://api.deezer.com/search?q=' },
  { name: 'QQ Music', url: 'https://y.qq.com/portal/search.html?w=' },
  { name: 'NetEase Cloud', url: 'https://music.163.com/#/search/m/?s=' },
];

export async function matchMetadata(song: Song): Promise<Partial<Song>> {
  console.log(`Matching metadata for: ${song.title} - ${song.artist}`);
  
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  
  // Simulate fetching from different sources
  for (const source of METADATA_SOURCES) {
    try {
      console.log(`Trying source: ${source.name} (${source.url}${query})`);
      // Simulate a successful fetch after a small delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mocked successful response
      return {
        cover: `https://picsum.photos/seed/${query}/500/500`,
        lyrics: `[00:00.00] 正在播放: ${song.title}\n[00:05.00] 艺术家: ${song.artist}\n[00:10.00] (这是从 ${source.name} 自动匹配的歌词)\n[00:15.00] 音乐无界，听见未来。\n[00:20.00] 旋律在指尖流淌\n[00:25.00] 故事在耳边回响\n[00:30.00] 每一个音符都是一段记忆\n[00:35.00] 每一句歌词都是一种心情\n[00:40.00] ...`,
        album: `${song.title} - Single`
      };
    } catch (error) {
      console.error(`Failed to fetch from ${source.name}:`, error);
      continue;
    }
  }
  
  return {};
}

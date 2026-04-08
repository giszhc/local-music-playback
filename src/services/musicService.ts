import { Song } from '../types';

// List of common music metadata sources (simulated for this environment)
const METADATA_SOURCES = [
  'https://music.apple.com/search?term=',
  'https://www.last.fm/search?q=',
  'https://musicbrainz.org/search?type=release&query=',
  'https://api.deezer.com/search?q=',
];

export async function matchMetadata(song: Song): Promise<Partial<Song>> {
  console.log(`Matching metadata for: ${song.title} - ${song.artist}`);
  
  // In a real-world scenario, we would use a proxy or a backend to fetch from these sources
  // due to CORS restrictions in the browser.
  // For this demonstration, we'll simulate the "cycling" and fetching logic.
  
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  
  // Simulate fetching from different sources
  for (const source of METADATA_SOURCES) {
    try {
      console.log(`Trying source: ${source}${query}`);
      // Simulate a successful fetch after a small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mocked successful response
      // In reality, you'd parse the HTML or call an API
      return {
        cover: `https://picsum.photos/seed/${query}/500/500`,
        lyrics: `[00:00.00] 正在播放: ${song.title}\n[00:05.00] 艺术家: ${song.artist}\n[00:10.00] (这是自动匹配的歌词示例)\n[00:15.00] 音乐无界，听见未来。\n[00:20.00] ...`,
        album: '自动匹配专辑'
      };
    } catch (error) {
      console.error(`Failed to fetch from ${source}:`, error);
      continue;
    }
  }
  
  return {};
}

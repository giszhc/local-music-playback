export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  cover?: string;
  lyrics?: string;
  url: string;
  file?: File;
  addedAt: number;
}

export type PlayMode = 'list' | 'random' | 'single';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Song[];
  playMode: PlayMode;
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { Song, PlayMode } from '../types';

export function useMusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [playMode, setPlayMode] = useState<PlayMode>('list');
  
  const howlRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const playNextRef = useRef<() => void>(() => {});

  const play = useCallback((song?: Song) => {
    const targetSong = song || currentSong;
    if (!targetSong) return;

    if (howlRef.current && targetSong.id === currentSong?.id && !song) {
      howlRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }

    const newHowl = new Howl({
      src: [targetSong.url],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(newHowl.duration());
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        playNextRef.current();
      },
      onload: () => {
        setDuration(newHowl.duration());
      }
    });

    howlRef.current = newHowl;
    setCurrentSong(targetSong);
    newHowl.play();
  }, [currentSong, volume]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex = -1;
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);

    if (playMode === 'single' && currentSong) {
      play(currentSong);
      return;
    }

    if (playMode === 'random') {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    if (nextIndex !== -1) {
      play(queue[nextIndex]);
    }
  }, [queue, currentSong, playMode, play]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    
    let prevIndex = -1;
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);

    if (playMode === 'random') {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    }

    if (prevIndex !== -1) {
      play(queue[prevIndex]);
    }
  }, [queue, currentSong, playMode, play]);

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.stop();
      setIsPlaying(false);
      setProgress(0);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      setProgress(time);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (howlRef.current) {
          setProgress(howlRef.current.seek() as number);
        }
      }, 1000);
    } else {
      clearProgressInterval();
    }
    return () => clearProgressInterval();
  }, [isPlaying]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  return {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    queue,
    playMode,
    setVolume,
    setQueue,
    setPlayMode,
    play,
    pause,
    stop,
    seek,
    playNext,
    playPrevious,
    setCurrentSong
  };
}

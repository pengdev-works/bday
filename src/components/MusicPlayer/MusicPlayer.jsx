/**
 * MusicPlayer — YouTube IFrame Player API (Fixed)
 *
 * Root cause of previous failure: YouTube throttles/blocks iframes
 * positioned off-screen (left:-4px). This version uses a 1×1px
 * fixed-position container that IS within the visible viewport,
 * and calls player.playVideo() directly inside the click handler
 * so it runs within the browser's user-gesture context.
 *
 * Flow:
 *  1. On mount: load the YT IFrame API script once.
 *  2. When API is ready: create YT.Player in a tiny visible div.
 *  3. User clicks Play: call player.playVideo() directly (gesture-safe).
 *  4. User clicks Pause: call player.pauseVideo().
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MusicPlayer.module.css';

/** YouTube video ID — "About You" by The 1975 (Live MSG) */
const VIDEO_ID = 'tGv7CUutzqU';

/** Loads the YT IFrame API script exactly once, calls cb when ready. */
function loadYouTubeAPI(cb) {
  if (window.YT && window.YT.Player) {
    cb();
    return;
  }
  // Queue multiple callers safely
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (prev) prev();
    cb();
  };
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady,   setIsReady]   = useState(false);
  const playerRef    = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadYouTubeAPI(() => {
      if (!containerRef.current) return;
      // Create YT player — the API itself generates the iframe inside containerRef
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        // Must give a non-zero size so YouTube doesn't consider it hidden
        width:  '1',
        height: '1',
        playerVars: {
          controls:       0,  // hide YouTube controls
          loop:           1,
          playlist:       VIDEO_ID, // required for loop
          rel:            0,
          modestbranding: 1,
          playsinline:    1,  // required for iOS inline play
        },
        events: {
          onReady() {
            setIsReady(true);
          },
          onStateChange(e) {
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
          onError(e) {
            console.warn('[MusicPlayer] YouTube error code:', e.data);
          },
        },
      });
    });

    return () => {
      try { playerRef.current?.destroy(); } catch (_) {}
    };
  }, []);

  /**
   * Toggle called DIRECTLY from onClick — preserves the browser's
   * user-gesture context so unmuted playVideo() is allowed.
   */
  const toggle = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying, isReady]);

  return (
    <div className={styles.playerWrapper}>
      {/* Song info pill */}
      <div className={styles.songInfo}>
        {isPlaying && <span className={styles.songDot} />}
        🎵 About You — The 1975
      </div>

      {/*
        1×1px container WITHIN the viewport (fixed, bottom-right corner).
        YouTube won't throttle it because it's technically visible.
        The player API replaces this div with an <iframe>.
      */}
      <div
        ref={containerRef}
        style={{
          position:      'fixed',
          bottom:        0,
          right:         0,
          width:         '1px',
          height:        '1px',
          overflow:      'hidden',
          pointerEvents: 'none',
          zIndex:        -1,
        }}
        aria-hidden="true"
      />

      {/* Play / Pause button */}
      <button
        id="music-toggle-btn"
        className={styles.playButton}
        onClick={toggle}
        disabled={!isReady}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause music' : 'Play About You by The 1975'}
      >
        <span className={styles.buttonIcon} aria-hidden="true">
          {!isReady ? '⌛' : isPlaying ? '⏸' : '🎵'}
        </span>
        {!isReady ? 'Loading…' : isPlaying ? 'Pause Music' : 'Play Music'}
      </button>

      {/* Animated sound bars while playing */}
      {isPlaying && (
        <div className={styles.soundBars} aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.bar} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;

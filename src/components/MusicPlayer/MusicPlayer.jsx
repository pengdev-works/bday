/**
 * MusicPlayer — YouTube iframe Edition (Reliable)
 *
 * Plays "About You" by The 1975 via a hidden YouTube iframe.
 * Uses a lazy-load approach:
 *   - Iframe is NOT injected until the user clicks Play
 *   - This satisfies browser autoplay policies (user gesture = OK)
 *   - Uses postMessage to pause/resume without reloading
 *
 * The iframe is visually hidden (1×1px, off-screen fixed).
 */
import { useState, useRef, useCallback } from 'react';
import styles from './MusicPlayer.module.css';

/** YouTube video ID — "About You" by The 1975 (Live from MSG) */
const VIDEO_ID = 'tGv7CUutzqU';

/**
 * Sends a command to the YouTube iframe via postMessage.
 * @param {HTMLIFrameElement} iframe
 * @param {'playVideo'|'pauseVideo'|'stopVideo'} func
 */
function ytCommand(iframe, func) {
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    '*'
  );
}

/**
 * MusicPlayer — custom play/pause UI.
 */
function MusicPlayer() {
  const [isLoaded,  setIsLoaded]  = useState(false); // iframe injected?
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  // Called when user clicks Play for the first time
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsPlaying(true);
    // postMessage play after the iframe finishes loading (handled in onLoad)
  }, []);

  // Called when iframe fires onLoad (video player is ready)
  const handleIframeReady = useCallback(() => {
    // Small delay to let the YouTube player fully init before sending command
    setTimeout(() => {
      ytCommand(iframeRef.current, 'playVideo');
    }, 800);
  }, []);

  const toggle = useCallback(() => {
    if (!isLoaded) {
      // First click — inject iframe (triggers autoplay via URL param + onLoad)
      handleLoad();
      return;
    }

    if (isPlaying) {
      ytCommand(iframeRef.current, 'pauseVideo');
      setIsPlaying(false);
    } else {
      ytCommand(iframeRef.current, 'playVideo');
      setIsPlaying(true);
    }
  }, [isLoaded, isPlaying, handleLoad]);

  return (
    <div className={styles.playerWrapper}>
      {/* Song info pill */}
      <div className={styles.songInfo}>
        {isPlaying && <span className={styles.songDot} />}
        🎵 About You — The 1975
      </div>

      {/* Lazy-loaded hidden YouTube iframe — only mounted after first Play click */}
      {isLoaded && (
        <iframe
          ref={iframeRef}
          title="About You – The 1975"
          src={`https://www.youtube.com/embed/${VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&modestbranding=1&mute=0`}
          allow="autoplay; encrypted-media"
          onLoad={handleIframeReady}
          style={{
            position: 'fixed',
            left:   '-4px',
            top:    '-4px',
            width:  '4px',
            height: '4px',
            border: 'none',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Play / Pause button */}
      <button
        id="music-toggle-btn"
        className={styles.playButton}
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause music' : 'Play About You by The 1975'}
      >
        <span className={styles.buttonIcon} aria-hidden="true">
          {isPlaying ? '⏸' : '🎵'}
        </span>
        {isPlaying ? 'Pause Music' : 'Play Music'}
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

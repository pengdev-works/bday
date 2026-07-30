/**
 * MusicPlayer — Spotify Embed Edition
 *
 * Why Spotify instead of YouTube?
 * The 1975's label (Dirty Hit / Virgin Music Group) has disabled
 * YouTube embedding globally → YouTube error code 150 on all videos.
 *
 * Spotify embed:
 *  - No embedding restrictions
 *  - Works on any domain without configuration
 *  - 30-second preview for non-logged-in users (free)
 *  - Full song for Spotify users (free or premium)
 *  - Shows beautiful album art + waveform player
 *
 * Track: "About You" – The 1975
 * Spotify track ID: 1fDFHXcykq4iw8Gg7s5hG9
 */
import { useState } from 'react';
import styles from './MusicPlayer.module.css';

const SPOTIFY_TRACK_ID = '1fDFHXcykq4iw8Gg7s5hG9';
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_ID}?utm_source=generator&theme=0`;

function MusicPlayer() {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div className={styles.playerWrapper}>
      {!showPlayer ? (
        <>
          {/* Pre-load info pill */}
          <div className={styles.songInfo}>
            🎵 About You — The 1975
          </div>

          {/* Launch button */}
          <button
            id="music-toggle-btn"
            className={styles.playButton}
            onClick={() => setShowPlayer(true)}
            aria-label="Open music player for About You by The 1975"
          >
            <span className={styles.buttonIcon} aria-hidden="true">🎵</span>
            Play Music
          </button>
        </>
      ) : (
        <div className={styles.spotifyWrapper}>
          <p className={styles.spotifyLabel}>🎵 About You — The 1975</p>
          <iframe
            title="About You – The 1975 on Spotify"
            src={SPOTIFY_EMBED_URL}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={styles.spotifyIframe}
          />
          <button
            className={styles.closePlayerBtn}
            onClick={() => setShowPlayer(false)}
            aria-label="Close music player"
          >
            ✕ Close player
          </button>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;

/**
 * App Component — Root of the Birthday Greeting Application
 *
 * Layout (top to bottom):
 *  1. FloatingHearts       — fixed background layer of floating hearts
 *  2. Confetti             — canvas burst on load
 *  3. Header               — animated title & badge
 *  4. BirthdayCake         — illustrated cake with flickering candles
 *  5. TypingMessage        — animated birthday message card
 *  6. CountdownTimer       — live countdown → auto-opens Special Message on zero
 *  7. PhotoGallery         — polaroid-style cat photo gallery
 *  8. Actions row          — MusicPlayer + manual Special Message trigger button
 *  9. Footer               — heartbeat footer text
 *
 * Special Message Modal appears:
 *  - Automatically when the countdown reaches zero (birthday day!)
 *  - Or manually via the "💌 A Special Message" button
 *
 * Configuration:
 *  - Change BIRTHDAY_DATE to the recipient's birthday ("YYYY-MM-DD").
 *    The birth year is used to calculate age.
 *    Set to null to hide the countdown timer.
 */
import { useState, useCallback } from 'react';
import FloatingHearts from './components/FloatingHearts/FloatingHearts';
import Confetti from './components/Confetti/Confetti';
import BirthdayCake from './components/BirthdayCake/BirthdayCake';
import TypingMessage from './components/TypingMessage/TypingMessage';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import CountdownTimer from './components/CountdownTimer/CountdownTimer';
import SpecialMessageModal from './components/SpecialMessageModal/SpecialMessageModal';
import PhotoGallery from './components/PhotoGallery/PhotoGallery';
import styles from './App.module.css';

/**
 * Birthday date — "YYYY-MM-DD".
 * Year is used to calculate age; month/day drives the countdown.
 * Set to null to hide the countdown entirely.
 */
const BIRTHDAY_DATE = '2008-08-08'; // Aug 8 2008 — turning 18! 🎉

function App() {
  /**
   * Controlled state for the Special Message modal.
   * The countdown fires onBirthdayReached → opens modal automatically.
   * The "💌 A Special Message" button also opens it manually.
   */
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className={styles.page}>
      {/* Decorative background layers */}
      <FloatingHearts count={22} />
      <Confetti count={220} duration={6000} />

      {/* Special Message modal — controlled, opens on birthday or button press */}
      <SpecialMessageModal isOpen={modalOpen} onClose={closeModal} />

      {/* Main content */}
      <main className={styles.main} id="main-content">

        {/* Header */}
        <header className={styles.header}>
          <span className={styles.headerBadge}>✨ A Special Day ✨</span>
          <h1 className={styles.headerTitle}>Happy Birthday!</h1>
          <div className={styles.stars} aria-hidden="true">
            {['🌸', '✨', '💜', '✨', '🌸'].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </header>

        {/* Birthday cake illustration */}
        <BirthdayCake />

        <hr className={styles.sectionDivider} />

        {/* Animated typing message card */}
        <TypingMessage />

        {/* Countdown timer — auto-opens modal on birthday */}
        {BIRTHDAY_DATE && (
          <CountdownTimer
            birthdayDate={BIRTHDAY_DATE}
            onBirthdayReached={openModal}
          />
        )}

        <hr className={styles.sectionDivider} />

        {/* Polaroid cat photo gallery */}
        <PhotoGallery />

        <hr className={styles.sectionDivider} />

        {/* Music player + manual special message trigger */}
        <div className={styles.actionsRow}>
          <MusicPlayer />

          {/* Manual button — always visible regardless of auto-open state */}
          <button
            id="special-message-btn"
            className={styles.specialBtn}
            onClick={openModal}
            aria-haspopup="dialog"
          >
            💌 A Special Message
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Made with{' '}
          <span className={styles.footerHeart} aria-label="love">❤️</span>
          {' '}— wishing you nothing but the best
        </p>
      </footer>
    </div>
  );
}

export default App;

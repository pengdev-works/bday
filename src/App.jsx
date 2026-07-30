/**
 * App Component — Root of the Birthday Greeting Application
 *
 * Scroll animations use the global `.sr` CSS class (index.css):
 * - Pure CSS `animation-timeline: view()` — GPU compositor-driven, zero JS
 * - No opacity:0 flash, no JavaScript timing lag
 * - Degrades gracefully: content always visible even without animation support
 */
import { useState, useCallback } from 'react';
import FloatingHearts      from './components/FloatingHearts/FloatingHearts';
import Confetti            from './components/Confetti/Confetti';
import BirthdayCake        from './components/BirthdayCake/BirthdayCake';
import TypingMessage       from './components/TypingMessage/TypingMessage';
import MusicPlayer         from './components/MusicPlayer/MusicPlayer';
import SpecialMessageModal from './components/SpecialMessageModal/SpecialMessageModal';
import PhotoGallery        from './components/PhotoGallery/PhotoGallery';
import styles from './App.module.css';


function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className={styles.page}>
      <FloatingHearts count={22} />
      <Confetti count={220} duration={6000} />
      <SpecialMessageModal isOpen={modalOpen} onClose={closeModal} />

      <main className={styles.main} id="main-content">

        {/* Hero — always visible on load, no scroll animation */}
        <header className={styles.header}>
          <span className={styles.headerBadge}>✨ A Special Day ✨</span>
          <h1 className={styles.headerTitle}>Happy Birthday!</h1>
          <div className={styles.stars} aria-hidden="true">
            {['🌸', '✨', '💜', '✨', '🌸'].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </header>

        {/* Each section gets the .sr class — pure CSS scroll reveal */}
        <div className="sr"><BirthdayCake /></div>

        <hr className={styles.sectionDivider} />

        <div className="sr"><TypingMessage /></div>

        <hr className={styles.sectionDivider} />

        <div className="sr"><PhotoGallery /></div>

        <hr className={styles.sectionDivider} />

        <div className="sr">
          <div className={styles.actionsRow}>
            <MusicPlayer />
            <button
              id="special-message-btn"
              className={styles.specialBtn}
              onClick={openModal}
              aria-haspopup="dialog"
            >
              💌 A Special Message
            </button>
          </div>
        </div>

      </main>

      <div className="sr">
        <footer className={styles.footer}>
          <p>
            Made with{' '}
            <span className={styles.footerHeart} aria-label="love">❤️</span>
            {' '}— wishing you nothing but the best
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

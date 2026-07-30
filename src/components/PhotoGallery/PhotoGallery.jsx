/**
 * PhotoGallery Component — Polaroid Edition
 *
 * Displays all 29 cat photos from /public/cats/ in a 3-column masonry grid.
 * Each photo is styled as a Polaroid with a slight random rotation.
 * Hovering straightens & scales it with a heart stamp.
 * Clicking opens a full-screen lightbox (polaroid frame) with
 * prev/next navigation and keyboard support.
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styles from './PhotoGallery.module.css';

/** All cat photo filenames served from /public/cats/ */
const CAT_PHOTOS = [
  '02d8daa6-c5e0-48ff-906f-f973422190aa.jpg',
  '0f9099d9-2941-4e78-ba5f-3c0c06d6452a.jpg',
  '182e7b5f-8961-4367-a357-2bb7e1d5edf4.jpg',
  '1ad960e6-4a6b-442f-99da-9d432a49da26.jpg',
  '3d2f1780-6da2-4a15-834c-c5e15935c1f3.jpg',
  '4810f93a-3937-42e6-a0ab-fc7be532c15e.jpg',
  '5282d833-f762-4258-a805-7213cc91b1a1.jpg',
  '5a8937b0-6b78-45a6-aa7c-a19bb4d1a454.jpg',
  '6545871a-2bb0-4e09-be36-dd39e9e7a9a8.jpg',
  '655faea0-2bbd-49e7-b2ab-fd79ca8d2d02.jpg',
  '6b505208-22af-4956-9b75-0f0643ed6f31.jpg',
  '71bdafa1-9f82-45e4-a095-6fbf7e448e38.jpg',
  '76fe678c-62e5-4173-acf9-76811355344b.jpg',
  '8eef5e7f-7e4e-491a-a710-5d693d775457.jpg',
  '90e0efb8-78f4-4ab6-a4ba-45e9f8743adc.jpg',
  '941313ed-ef40-4058-9b7e-325f4b1d1020.jpg',
  'a5712c5b-52bd-4e31-8d03-c18c39e881ac.jpg',
  'af508168-25ad-4e3b-b2a5-e1df66cc688d.jpg',
  'b43dca20-7f9b-4806-8bf1-7f71cbcfa973.jpg',
  'beec896d-2fc2-4aef-8c40-5120a9e4e31f.jpg',
  'c148d596-be9f-44e9-96c3-26a742d05915.jpg',
  'cc509b11-5f05-416e-92af-4bd6383c5ff7.jpg',
  'ce0a6e24-595c-4e92-ab7c-3b229e1266d9.jpg',
  'd09e48cb-faf0-4c01-a33b-8a04399c7893.jpg',
  'd556e1d0-3793-4053-8b9b-f18858dde322.jpg',
  'd6ed505f-7582-4d56-8fc4-7fe8ccd35760.jpg',
  'd8f64961-91bc-44e1-a2b1-c101d6f93c2b.jpg',
  'd9d8a1f1-6eb7-46bd-9b06-ae27d842190f.jpg',
  'db9b17aa-89c3-401b-b8ef-8d9e43657709.jpg',
];

/** Sweet captions for the polaroid labels */
const CAPTIONS = [
  'so sleepy 😴', 'tiny paws 🐾', 'nap time 💤', 'hello there 👋',
  'too cute 🥺', 'little fluff ☁️', 'cozy vibes 🌸', 'snuggle mode 💕',
  'pure love 💜', 'so fluffy 🤍', 'cutie pie 🎀', 'my fav 💗',
  'gentle soul 🌙', 'always sleepy 😹', 'heart melter 💓', 'soft boi 🧁',
  'little angel 😇', 'stretch 🤸', 'purr machine 🎵', 'photogenic 📸',
  'too precious 💎', 'fluffball 🧶', 'drama queen 👑', 'sweetest 🍬',
  'button nose 🔴', 'curious cat 🔍', 'zen mode 🕊️', 'best cat 🏆',
  'forever loved 💖',
];

/**
 * Generates a stable random rotation for each photo.
 * Seeded by index so it doesn't shift on re-render.
 */
function getRotation(index) {
  const seed = (index * 137 + 42) % 100;
  const angle = ((seed / 100) * 6 - 3); // range: -3deg to +3deg
  return `${angle.toFixed(2)}deg`;
}

/**
 * Lightbox — full-screen Polaroid-framed image viewer.
 */
function Lightbox({ index, onClose, onPrev, onNext, total }) {
  const src = `/cats/${CAT_PHOTOS[index]}`;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape')    onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className={styles.lightboxBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <div className={styles.lightbox} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.lightboxClose} onClick={onClose} aria-label="Close" autoFocus>
          ✕
        </button>

        {/* Prev */}
        <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={onPrev} aria-label="Previous">
          ‹
        </button>

        {/* Polaroid frame */}
        <div className={styles.lightboxFrame}>
          <img
            className={styles.lightboxImg}
            src={src}
            alt={`Cat photo ${index + 1} of ${total}`}
          />
          <p className={styles.lightboxCaption}>{CAPTIONS[index % CAPTIONS.length]}</p>
        </div>

        {/* Next */}
        <button className={`${styles.navBtn} ${styles.navNext}`} onClick={onNext} aria-label="Next">
          ›
        </button>

        {/* Counter */}
        <p className={styles.lightboxCounter}>🐱 {index + 1} / {total}</p>
      </div>
    </div>
  );
}

/**
 * PhotoGallery — masonry polaroid grid + lightbox.
 */
function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox  = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() =>
    setLightboxIndex((i) => (i - 1 + CAT_PHOTOS.length) % CAT_PHOTOS.length), []);
  const goNext = useCallback(() =>
    setLightboxIndex((i) => (i + 1) % CAT_PHOTOS.length), []);

  // Pre-compute stable rotations
  const rotations = useMemo(
    () => CAT_PHOTOS.map((_, i) => getRotation(i)),
    []
  );

  // Ref for the masonry grid container
  const gridRef = useRef(null);

  // Bidirectional scroll reveal — reveals each photo as it enters the viewport
  // and hides it again when it exits (scrolling back up)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = [...grid.children];

    // Graceful fallback for older browsers
    if (!('IntersectionObserver' in window)) {
      items.forEach(item => { item.dataset.revealed = 'true'; });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = 'true';
          } else {
            delete entry.target.dataset.revealed;
          }
        });
      },
      {
        threshold: 0.05,
        // Start revealing slightly before the photo fully enters the viewport
        rootMargin: '0px 0px -20px 0px',
      }
    );

    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.gallerySection} aria-label="Cat photo gallery">
      {/* Heading */}
      <div className={styles.galleryHeading}>
        <span className={styles.galleryBadge}>🐾 memories</span>
        <h2 className={styles.galleryTitle}>Our Little Moments 🐱</h2>
        <p className={styles.gallerySubtitle}>Click any photo to view full-screen</p>
      </div>

      {/* Paw divider */}
      <div className={styles.pawDivider}>
        <div className={styles.pawLine} />
        <div className={styles.pawEmojis}>🐾 🐱 🐾</div>
        <div className={styles.pawLine} />
      </div>

      {/* Masonry polaroid grid */}
      <div className={styles.grid} ref={gridRef}>
        {CAT_PHOTOS.map((filename, i) => (
          <div
            key={filename}
            className={`${styles.gridItem} sr-photo`}
            style={{ '--rotation': rotations[i] }}
            onClick={() => openLightbox(i)}
            role="button"
            tabIndex={0}
            aria-label={`Open photo ${i + 1}: ${CAPTIONS[i % CAPTIONS.length]}`}
            onKeyDown={(e) => {

              if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
            }}
          >
            <img
              className={styles.photo}
              src={`/cats/${filename}`}
              alt={`Cat memory ${i + 1}`}
              loading="lazy"
            />
            <span className={styles.caption}>{CAPTIONS[i % CAPTIONS.length]}</span>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          total={CAT_PHOTOS.length}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  );
}

export default PhotoGallery;

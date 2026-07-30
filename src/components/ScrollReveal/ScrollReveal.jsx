/**
 * ScrollReveal Component — simplified
 *
 * A lightweight wrapper that uses IntersectionObserver to detect
 * when a section enters the viewport and applies a smooth
 * opacity + translateY transition.
 *
 * Inner component animations are suppressed (`animation: none !important`
 * via CSS) to prevent double-animation conflicts.
 *
 * Props:
 *  @param {ReactNode} children   - Content to reveal
 *  @param {number}    delay      - Transition delay in ms (staggers siblings)
 *  @param {number}    threshold  - Fraction of element visible before trigger (0–1)
 */
import { useRef, useEffect, useState } from 'react';
import styles from './ScrollReveal.module.css';

function ScrollReveal({ children, delay = 0, threshold = 0.08 }) {
  const ref            = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Graceful fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // Fire once only
        }
      },
      {
        threshold,
        // Start the animation just before the element fully enters
        rootMargin: '0px 0px -48px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;

/**
 * FloatingHearts Component
 * Renders randomly positioned hearts that float upward continuously.
 * Uses CSS custom properties to vary each heart's position, size, duration, and delay.
 */
import { useMemo } from 'react';
import styles from './FloatingHearts.module.css';

// Heart emoji variants for variety
const HEART_EMOJIS = ['❤️', '🩷', '💜', '💕', '💗', '💖', '🤍', '💝'];

/**
 * Generates an array of heart configuration objects.
 * @param {number} count - Number of hearts to generate
 * @returns {Array<Object>} Array of heart config objects
 */
function generateHearts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    left: `${Math.random() * 100}%`,
    fontSize: `${0.8 + Math.random() * 1.6}rem`,
    duration: `${6 + Math.random() * 10}s`,
    delay: `${Math.random() * 12}s`,
  }));
}

/**
 * FloatingHearts — decorative background component.
 * @param {Object} props
 * @param {number} [props.count=18] - How many hearts to render
 */
function FloatingHearts({ count = 18 }) {
  // Memoize so hearts don't regenerate on every render
  const hearts = useMemo(() => generateHearts(count), [count]);

  return (
    <div className={styles.heartsContainer} aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className={styles.heart}
          style={{
            left: heart.left,
            fontSize: heart.fontSize,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}

export default FloatingHearts;

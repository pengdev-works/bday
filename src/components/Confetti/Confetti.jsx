/**
 * Confetti Component
 * Renders a canvas-based confetti burst animation on mount.
 * Uses requestAnimationFrame for smooth, performant animation.
 * Automatically cleans up after the animation finishes.
 */
import { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

// Confetti piece colors — romantic palette
const COLORS = [
  '#f472b6', '#ec4899', '#a855f7', '#c084fc',
  '#fbbf24', '#f9a8d4', '#818cf8', '#fb7185',
  '#e879f9', '#38bdf8', '#ffffff',
];

/**
 * Creates a single confetti particle with random properties.
 * @param {number} canvasWidth - Canvas width for initial x position
 * @returns {Object} Particle configuration
 */
function createParticle(canvasWidth) {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * -200,        // start above viewport
    width: 6 + Math.random() * 8,
    height: 8 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 6,
    vx: (Math.random() - 0.5) * 2.5,
    vy: 2 + Math.random() * 4,
    opacity: 1,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  };
}

/**
 * Confetti — mounts a canvas and animates a burst of confetti pieces.
 * @param {Object} props
 * @param {number} [props.count=200] - Number of confetti particles
 * @param {number} [props.duration=5000] - Animation duration in ms
 */
function Confetti({ count = 200, duration = 5000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let startTime = null;

    // Match canvas size to window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particles = Array.from({ length: count }, () =>
      createParticle(canvas.width)
    );

    /**
     * Main animation loop.
     * @param {DOMHighResTimeStamp} timestamp
     */
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progress = Math.min(elapsed / duration, 1);

      particles.forEach((p) => {
        // Fade out in the last 30% of the animation
        p.opacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.06; // gravity

        // Wrap horizontally
        if (p.x < -p.width) p.x = canvas.width + p.width;
        if (p.x > canvas.width + p.width) p.x = -p.width;

        // Draw the particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }

        ctx.restore();
      });

      if (elapsed < duration) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Clear canvas when done
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [count, duration]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.confettiCanvas}
      aria-hidden="true"
    />
  );
}

export default Confetti;

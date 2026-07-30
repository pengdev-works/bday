/**
 * BirthdayCake Component
 * A pure-CSS illustrated 3-tier birthday cake with animated candles.
 * Each candle flame flickers at a slightly different rate for realism.
 */
import styles from './BirthdayCake.module.css';

/**
 * Candle — renders a single candle with a flame on top.
 * @param {Object} props
 * @param {number} props.height - Height of the candle body in px
 * @param {string} [props.color] - Override candle body gradient color (CSS value)
 */
function Candle({ height = 32 }) {
  return (
    <div className={styles.candle}>
      <div className={styles.flame} />
      <div className={styles.candleBody} style={{ height }} />
    </div>
  );
}

/**
 * BirthdayCake — three-tier illustrated cake with 5 animated candles.
 */
function BirthdayCake() {
  return (
    <div className={styles.cakeWrapper} role="img" aria-label="A beautiful birthday cake with flickering candles">
      {/* Candles */}
      <div className={styles.candlesRow}>
        <Candle height={30} />
        <Candle height={38} />
        <Candle height={44} />
        <Candle height={38} />
        <Candle height={30} />
      </div>

      {/* Three-tier cake */}
      <div className={styles.cakeTiers}>
        {/* Top tier */}
        <div className={`${styles.tier} ${styles.tierTop}`}>
          <div className={styles.dots}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.dot} />
            ))}
          </div>
        </div>

        {/* Middle tier */}
        <div className={`${styles.tier} ${styles.tierMiddle}`}>
          <div className={styles.dots}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.dot} />
            ))}
          </div>
        </div>

        {/* Bottom tier */}
        <div className={`${styles.tier} ${styles.tierBottom}`}>
          <div className={styles.dots}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.dot} />
            ))}
          </div>
        </div>
      </div>

      {/* Plate */}
      <div className={styles.plate} />

      {/* Label */}
      <p className={styles.cakeLabel}>✨ Make a Wish ✨</p>
    </div>
  );
}

export default BirthdayCake;

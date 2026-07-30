/**
 * CountdownTimer Component
 * Counts down to the next occurrence of the provided birthday date.
 * Updates every second using setInterval.
 * Displays a special "It's your Birthday!" message when time reaches zero.
 *
 * @param {Object} props
 * @param {string} props.birthdayDate - Target date as "YYYY-MM-DD" (uses next occurrence if passed)
 */
import { useState, useEffect, useRef } from 'react';
import styles from './CountdownTimer.module.css';

/**
 * Pads a number to 2 digits.
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Calculates the age being turned on the next birthday.
 * @param {string} birthdayDate - "YYYY-MM-DD"
 * @returns {number} Age they will be turning
 */
function getTurningAge(birthdayDate) {
  const now = new Date();
  const [birthYear, month, day] = birthdayDate.split('-').map(Number);
  let age = now.getFullYear() - birthYear;
  // If birthday hasn't happened yet this year, they haven't turned that age yet
  const hasBirthdayPassedThisYear =
    now.getMonth() + 1 > month ||
    (now.getMonth() + 1 === month && now.getDate() >= day);
  if (!hasBirthdayPassedThisYear) age -= 1;
  // The age they're TURNING next birthday
  return age + 1;
}

/**
 * Calculates time remaining until the next occurrence of the birthday.
 * @param {string} birthdayDate - "YYYY-MM-DD"
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isToday: boolean }}
 */
function getTimeRemaining(birthdayDate) {
  const now = new Date();
  const [, month, day] = birthdayDate.split('-').map(Number);

  // Build target this year
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);

  // If the date has passed this year, aim for next year
  if (target <= now) {
    target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  }

  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true };
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isToday: false };
}

/**
 * TimeUnit — displays a single countdown unit (e.g. "07 Days").
 */
function TimeUnit({ value, label }) {
  const [tick, setTick] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      setTick(true);
      const t = setTimeout(() => setTick(false), 200);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className={styles.timeUnit}>
      <span className={`${styles.timeValue} ${tick ? styles.tick : ''}`}>
        {pad(value)}
      </span>
      <span className={styles.timeLabel}>{label}</span>
    </div>
  );
}

/**
 * CountdownTimer — main timer component.
 * @param {Object}   props
 * @param {string}   props.birthdayDate      - "YYYY-MM-DD" format (birth year included for age calc)
 * @param {Function} [props.onBirthdayReached] - Fired once when countdown hits zero
 */
function CountdownTimer({ birthdayDate, onBirthdayReached }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(birthdayDate));
  const turningAge = getTurningAge(birthdayDate);
  // Guard so we only fire onBirthdayReached once
  const firedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(birthdayDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [birthdayDate]);

  // Fire callback when birthday is reached (once, with slight delay for effect)
  useEffect(() => {
    if (timeLeft.isToday && !firedRef.current && onBirthdayReached) {
      firedRef.current = true;
      const t = setTimeout(onBirthdayReached, 1800);
      return () => clearTimeout(t);
    }
  }, [timeLeft.isToday, onBirthdayReached]);

  return (
    <section className={styles.timerWrapper} aria-label="Birthday countdown timer">
      <h2 className={styles.timerTitle}>
        🕐 Countdown to the Big Day
      </h2>

      {/* Age badge */}
      <div className={styles.ageBadge}>
        <span className={styles.ageNumber}>{turningAge}</span>
        <span className={styles.ageLabel}>years of being amazing ✨</span>
      </div>

      {timeLeft.isToday ? (
        <p className={styles.birthdayNow}>
          🎉 She&apos;s turning {turningAge} today! Happy Birthday! 🎂
        </p>
      ) : (
        <div className={styles.countdownGrid} role="timer" aria-live="off">
          <TimeUnit value={timeLeft.days}    label="Days" />
          <span className={styles.separator} aria-hidden="true">:</span>
          <TimeUnit value={timeLeft.hours}   label="Hours" />
          <span className={styles.separator} aria-hidden="true">:</span>
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <span className={styles.separator} aria-hidden="true">:</span>
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      )}
    </section>
  );
}

export default CountdownTimer;

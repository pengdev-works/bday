/**
 * TypingMessage Component
 * Displays the birthday message with an animated typing effect.
 * Uses a custom useTypingEffect hook driven by setInterval.
 * Shows a blinking cursor while typing and after completion.
 */
import { useState, useEffect } from 'react';
import styles from './TypingMessage.module.css';

/** The main typed birthday message (signature shown separately below) */
const MESSAGE = `Hi good morning or good evening, anusam detoy nga inaramid kon haan ka met ngamin maikkan ti gift so atoy lattan, Happy Birthday jeng, Thank you for the memories we shared. Have an amazing birthday and enjoy your special day.`;

/** Signature shown beneath the message once typing finishes */
const SIGNATURE = 'by: paragas 🤍';

/**
 * Custom hook — types out text character-by-character.
 * @param {string} text - Full text to type
 * @param {number} speed - Ms per character
 * @param {number} startDelay - Ms before typing begins
 * @returns {{ displayText: string, isDone: boolean }}
 */
function useTypingEffect(text, speed = 35, startDelay = 1200) {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let timerId;

    // Wait for startDelay before beginning
    const delayTimer = setTimeout(() => {
      timerId = setInterval(() => {
        index += 1;
        setDisplayText(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(timerId);
          setIsDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timerId);
    };
  }, [text, speed, startDelay]);

  return { displayText, isDone };
}

/**
 * TypingMessage — animated birthday message inside a glass card.
 */
function TypingMessage() {
  const { displayText, isDone } = useTypingEffect(MESSAGE, 32, 1000);

  return (
    <article className={styles.messageCard}>
      {/* Main greeting heading */}
      <h1 className={styles.greeting}>Happy Birthday! 🎉</h1>

      {/* Typed message body */}
      <p className={styles.messageText} aria-live="polite" aria-label="Birthday message">
        {displayText}
        {/* Blinking cursor — hide when done typing */}
        <span
          className={`${styles.cursor} ${isDone ? styles.hidden : ''}`}
          aria-hidden="true"
        />
      </p>

      {/* Signature — fades in after typing finishes */}
      <p className={`${styles.signature} ${isDone ? styles.signatureVisible : ''}`}>
        {SIGNATURE}
      </p>
    </article>
  );
}

export default TypingMessage;

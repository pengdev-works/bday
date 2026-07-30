/**
 * SpecialMessageModal Component
 *
 * Works in TWO modes:
 *
 * 1. UNCONTROLLED (default) — renders a "💌 A Special Message" button
 *    that opens the modal internally.
 *
 * 2. CONTROLLED — when `isOpen` prop is provided, the parent drives open state.
 *    The trigger button is hidden. Pass `onClose` to let the parent know when to close.
 *    Used for auto-opening on birthday countdown reaching zero.
 *
 * Accessibility: focus-trap via autoFocus on close button, role="dialog",
 * aria-modal, aria-labelledby, Escape key handling, body scroll lock.
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './SpecialMessageModal.module.css';

/** The special message shown inside the modal */
const SPECIAL_MESSAGE = `Even though we've gone our separate ways, I sincerely hope life brings you everything you've ever wished for. Happy Birthday, and thank you for being a part of my story.`;

/**
 * SpecialMessageModal
 * @param {Object}   props
 * @param {boolean}  [props.isOpen]   - Controlled open state (optional)
 * @param {Function} [props.onClose]  - Callback when modal closes (for controlled mode)
 */
function SpecialMessageModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }) {
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledIsOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);

  // Resolve the effective open state and close handler
  const isOpen = isControlled ? controlledIsOpen : internalOpen;
  const doClose = isControlled ? (controlledOnClose ?? (() => { })) : () => setInternalOpen(false);
  const doOpen = () => setInternalOpen(true);

  // Close on Escape + prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => { if (e.key === 'Escape') doClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Trigger button — only shown in uncontrolled mode */}
      {!isControlled && (
        <button
          id="special-message-btn"
          className={styles.triggerButton}
          onClick={doOpen}
          aria-haspopup="dialog"
        >
          💌 A Special Message
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={doClose}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-heading"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className={styles.closeButton}
              onClick={doClose}
              aria-label="Close special message"
              autoFocus
            >
              ✕
            </button>

            <span className={styles.modalIcon} aria-hidden="true">💌</span>

            <h2 id="modal-heading" className={styles.modalHeading}>
              A Special Message for You
            </h2>

            <hr className={styles.divider} />

            <p className={styles.modalText}>{SPECIAL_MESSAGE}</p>

            <hr className={styles.divider} />

            <p className={styles.signature}>With warmth &amp; sincerity paragas🤍</p>
          </div>
        </div>
      )}
    </>
  );
}

export default SpecialMessageModal;

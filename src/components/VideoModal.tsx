import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/** Matches the exit animation in App.css so the modal unmounts after it finishes. */
const CLOSE_ANIMATION_MS = 180;

type VideoModalProps = {
  src: string;
  poster?: string;
  ariaLabel?: string;
  onClose: () => void;
  /** Focused when the modal closes, when the element is still in the document. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * Lightweight video lightbox. Opens over the current page with a scale-and-fade
 * transition, plays the given source with native controls, and restores focus
 * to the trigger on close. Reuses the dialog conventions from
 * `ProjectFinderModal` (portal, scroll lock, Escape, focus trap).
 */
function VideoModal({ src, poster, ariaLabel = "Video player", onClose, returnFocusRef }: VideoModalProps) {
  const [closing, setClosing] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingRef = useRef(false);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    videoRef.current?.pause();
    setClosing(true);
    closeTimerRef.current = setTimeout(onClose, CLOSE_ANIMATION_MS);
  }, [onClose]);

  // Autoplay on open and move focus into the dialog.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.focus();
      const video = videoRef.current;
      if (video) void video.play().catch(() => undefined);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Lock background scrolling while open, and restore the previous value on close.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Return focus to the trigger when the dialog closes.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const target = returnFocusRef?.current ?? null;
      if (target && document.contains(target)) target.focus();
    };
  }, [returnFocusRef]);

  // Escape closes the dialog; Tab is trapped inside it.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [requestClose]);

  // Pause playback when the tab is hidden.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) requestClose();
  };

  return createPortal(
    <div
      className={`video-modal-backdrop${closing ? " video-modal-backdrop--closing" : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className={`video-modal${closing ? " video-modal--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        <button
          className="video-modal__close"
          type="button"
          aria-label="Close video"
          onClick={requestClose}
        >
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </button>
        <div className="video-modal__frame">
          <video
            ref={videoRef}
            className="video-modal__video"
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default VideoModal;

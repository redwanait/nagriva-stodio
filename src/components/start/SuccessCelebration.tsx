import { useEffect, useMemo, useState, type CSSProperties } from "react";

// Full-viewport celebration shown once after a confirmed submission. It is a
// decorative layer only: pointer events are disabled in CSS, and the whole tree
// is removed by the parent after CELEBRATION_MS so nothing is left behind.

const CELEBRATION_MS = 3000;

type CelebrationShape = "ribbon" | "twist" | "streamer" | "star" | "circle" | "spark";

type CelebrationPiece = {
  id: number;
  shape: CelebrationShape;
  left: number;
  width: number;
  height: number;
  color: string;
  highlight: string;
  fallDuration: number;
  fallDelay: number;
  swayDuration: number;
  drift: number;
  rotateStart: number;
  rotateEnd: number;
  sway: number;
  opacity: number;
};

// Metallic and warm golds carry the palette; yellow softens it, and blue/white
// appear only as occasional contrast, never as a dominant colour.
const GOLD = ["#C8961E", "#D4A72C", "#E0B33C", "#EAC257", "#F2D179"];
const YELLOW = ["#FFD84D", "#FFE066", "#FFEC9E"];
const BLUE = ["#0047FF", "#2E63FF"];
const WHITE = ["#FFFFFF", "#EAF0FF"];

// Gift-wrapping and party shapes only — no plain square confetti. Blue and
// white are deliberately rare in this pool.
const SHAPE_POOL: CelebrationShape[] = [
  "ribbon", "ribbon", "ribbon", "ribbon", "ribbon",
  "twist", "twist", "twist", "twist",
  "streamer", "streamer", "streamer", "streamer", "streamer", "streamer",
  "star", "star", "star", "star", "star", "star", "star", "star",
  "circle", "circle", "circle", "circle",
  "spark", "spark", "spark",
];

function pick<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function between(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function shades(): { color: string; highlight: string } {
  const roll = Math.random();
  if (roll < 0.32) return { color: pick(GOLD), highlight: "#FFF2C4" };
  if (roll < 0.58) return { color: pick(GOLD), highlight: "#B8860B" };
  if (roll < 0.8) return { color: pick(YELLOW), highlight: "#FFF7D6" };
  if (roll < 0.92) return { color: pick(BLUE), highlight: "#9DB6FF" };
  return { color: pick(WHITE), highlight: "#C9D6FF" };
}

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function measure(shape: CelebrationShape): { width: number; height: number } {
  switch (shape) {
    case "streamer": {
      const width = between(8, 13);
      return { width, height: width * between(2.6, 3.4) };
    }
    case "ribbon": {
      const width = between(24, 40);
      return { width, height: width * between(0.55, 0.72) };
    }
    case "twist": {
      const width = between(20, 34);
      return { width, height: width * between(0.85, 1.05) };
    }
    case "star": {
      const size = between(10, 17);
      return { width: size, height: size };
    }
    case "spark": {
      const size = between(11, 19);
      return { width: size, height: size };
    }
    default: {
      const size = between(6, 12);
      return { width: size, height: size };
    }
  }
}

function buildPieces(): CelebrationPiece[] {
  const shapes = shuffle(SHAPE_POOL);
  return shapes.map((shape, index) => {
    const { color, highlight } = shades();
    const { width, height } = measure(shape);
    const rotateStart = between(-35, 35);
    const spin = between(220, 620) * (Math.random() < 0.5 ? -1 : 1);

    return {
      id: index,
      shape,
      // Even horizontal coverage with a little jitter so nothing lines up.
      left: ((index + 0.5) / shapes.length) * 94 + between(-2, 2),
      width,
      height,
      color,
      highlight,
      fallDuration: between(1.7, 2.5),
      fallDelay: between(0, 0.4),
      swayDuration: between(1.1, 2.2),
      drift: between(-70, 70),
      rotateStart,
      rotateEnd: rotateStart + spin,
      sway: between(4, 14),
      opacity: between(0.78, 1),
    };
  });
}

function ShapeIcon({ piece }: { piece: CelebrationPiece }) {
  const { shape, color, highlight } = piece;

  switch (shape) {
    case "star":
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <polygon
            points="12,1.4 14.7,8.5 22.4,9 16.5,13.9 18.4,21.3 12,17 5.6,21.3 7.5,13.9 1.6,9 9.3,8.5"
            fill={color}
            stroke={highlight}
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 0c.7 7.1 1.6 8.6 12 12-10.4 3.4-11.3 4.9-12 12-.7-7.1-1.6-8.6-12-12C10.4 8.6 11.3 7.1 12 0Z"
            fill={color}
          />
        </svg>
      );
    case "circle":
      return (
        <span
          className="start-celebration__dot"
          style={{ background: color, boxShadow: `0 0 6px ${highlight}` }}
        />
      );
    case "streamer":
      return (
        <svg viewBox="0 0 14 44" preserveAspectRatio="none" focusable="false">
          <path
            d="M7 1C1.4 9 12.6 15 7 23S1.4 35 7 43"
            fill="none"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "twist":
      return (
        <svg viewBox="0 0 40 40" preserveAspectRatio="xMidYMid meet" focusable="false">
          <path
            d="M6 35C2 24 10 9 20 11s7 15-1 16-13 5-11-6"
            fill="none"
            stroke={color}
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          <path
            d="M6 35C2 24 10 9 20 11s7 15-1 16-13 5-11-6"
            fill="none"
            stroke={highlight}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 30" preserveAspectRatio="xMidYMid meet" focusable="false">
          <path
            d="M3 25C8 7 16 4 22 13s15 12 23-4"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M3 25C8 7 16 4 22 13s15 12 23-4"
            fill="none"
            stroke={highlight}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2.5 6"
            opacity="0.85"
          />
        </svg>
      );
  }
}

type SuccessCelebrationProps = {
  onComplete: () => void;
};

function SuccessCelebration({ onComplete }: SuccessCelebrationProps) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Built once per mount, so neither parent re-renders nor unrelated state
  // updates regenerate or restart the animation.
  const pieces = useMemo(() => (reduced ? [] : buildPieces()), [reduced]);

  useEffect(() => {
    if (reduced || pieces.length === 0) {
      onComplete();
      return;
    }
    const timer = window.setTimeout(onComplete, CELEBRATION_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete, pieces.length, reduced]);

  if (reduced || pieces.length === 0) return null;

  return (
    <div className="start-celebration" aria-hidden="true">
      {pieces.map((piece) => {
        const style = {
          left: `${piece.left}%`,
          width: `${piece.width}px`,
          height: `${piece.height}px`,
          animationDuration: `${piece.fallDuration}s`,
          animationDelay: `${piece.fallDelay}s`,
          "--drift": `${piece.drift}px`,
          "--rot-start": `${piece.rotateStart}deg`,
          "--rot-end": `${piece.rotateEnd}deg`,
          "--sway": `${piece.sway}px`,
          "--piece-opacity": piece.opacity,
        } as CSSProperties;

        const shapeClass =
          piece.shape === "ribbon" || piece.shape === "twist"
            ? "start-celebration__shape start-celebration__shape--twist"
            : piece.shape === "streamer"
              ? "start-celebration__shape start-celebration__shape--streamer"
              : "start-celebration__shape";

        return (
          <span key={piece.id} className="start-celebration__piece" style={style}>
            <span className={shapeClass} style={{ animationDuration: `${piece.swayDuration}s` }}>
              <ShapeIcon piece={piece} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default SuccessCelebration;

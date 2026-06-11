type Props = {
  className?: string;
  size?: number;
};

/**
 * Enso (円相) — Zen circle painted in one ink stroke.
 * Used as a decorative background flourish.
 */
export function Enso({ className = "", size = 320 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="ensoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M 100 18
           C 154 18, 182 60, 182 100
           C 182 144, 146 182, 100 182
           C 56 182, 22 148, 22 100
           C 22 56, 56 22, 100 22"
        stroke="url(#ensoStroke)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 102 21 L 95 19 L 102 16 Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

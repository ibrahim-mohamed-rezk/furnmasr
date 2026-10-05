export default function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      {/* Black circle background */}
      <circle cx="12" cy="12" r="10" fill="#010101" />

      {/* TikTok note shape */}
      <path
        d="M15.5 7.5
           a2.5 2.5 0 0 0 2.5 2.5
           v2
           a4.5 4.5 0 0 1-2.5-.75
           v4.25
           a3.5 3.5 0 1 1-3.5-3.5
           c.18 0 .35.01.52.04
           v2.04
           a1.5 1.5 0 1 0 1 1.42
           V7.5h2Z"
        fill="white"
      />
    </svg>
  );
}
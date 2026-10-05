export default function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="10%" stopColor="#fdf497" />
          <stop offset="50%" stopColor="#fd5949" />
          <stop offset="68%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>

      {/* Gradient circle background */}
      <circle cx="12" cy="12" r="10" fill="url(#ig-grad)" />

      {/* Outer rounded square */}
      <rect x="7" y="7" width="10" height="10" rx="3" ry="3" fill="none" stroke="white" strokeWidth="1.5" />

      {/* Center circle */}
      <circle cx="12" cy="12" r="2.5" fill="none" stroke="white" strokeWidth="1.5" />

      {/* Top-right dot */}
      <circle cx="15.2" cy="8.8" r="0.75" fill="white" />
    </svg>
  );
}
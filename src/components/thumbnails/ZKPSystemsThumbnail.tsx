export default function ZKPSystemsThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path
        d="M60 12 L85 24 L85 48 Q85 64 60 72 Q35 64 35 48 L35 24 Z"
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1}
      />
      {/* Checkmark */}
      <polyline
        points="48,42 56,52 72,34"
        stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

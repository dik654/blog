export default function EthPrivacyThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lock body */}
      <rect x={42} y={38} width={36} height={28} rx={4}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      {/* Lock shackle */}
      <path d="M48 38 V28 A12 12 0 0 1 72 28 V38"
        stroke="#6366f1" strokeWidth={1.5} fill="none" />
      {/* Shield overlay */}
      <path d="M60 42 L70 47 L70 56 Q70 62 60 65 Q50 62 50 56 L50 47 Z"
        stroke="#10b981" strokeWidth={1} fill="#10b981" fillOpacity={0.15} />
      {/* Keyhole */}
      <circle cx={60} cy={52} r={2} fill="#f59e0b" fillOpacity={0.8} />
    </svg>
  );
}

export default function TimeSeriesThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sine wave (observed) */}
      <path
        d="M10 40 Q22 18 34 40 Q46 62 58 40 Q70 18 82 40"
        stroke="#6366f1" strokeWidth={1.5} fill="none"
      />
      {/* Predicted portion (dashed) */}
      <path
        d="M82 40 Q94 62 106 40"
        stroke="#10b981" strokeWidth={1.5} fill="none" strokeDasharray="3 2"
      />
      {/* Confidence band */}
      <path
        d="M82 40 Q94 55 106 42 L106 38 Q94 69 82 40 Z"
        fill="#10b981" fillOpacity={0.08}
      />
      {/* Divider line */}
      <line x1={82} y1={12} x2={82} y2={68} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" />
    </svg>
  );
}

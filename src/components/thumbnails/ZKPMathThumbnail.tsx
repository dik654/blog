export default function ZKPMathThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Elliptic curve */}
      <path
        d="M20 60 Q30 10 60 40 Q90 70 100 20"
        stroke="#6366f1" strokeWidth={1.5} fill="none"
      />
      {/* Points on curve */}
      <circle cx={35} cy={30} r={3} fill="#10b981" fillOpacity={0.8} />
      <circle cx={60} cy={40} r={3} fill="#10b981" fillOpacity={0.8} />
      <circle cx={82} cy={48} r={3} fill="#10b981" fillOpacity={0.8} />
      {/* Tangent line */}
      <line x1={28} y1={35} x2={90} y2={45} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
    </svg>
  );
}

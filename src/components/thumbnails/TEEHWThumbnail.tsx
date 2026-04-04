export default function TEEHWThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* CPU die */}
      <rect x={25} y={15} width={70} height={50} rx={5}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.06} />
      {/* CPU pins on edges */}
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <line x1={35 + i * 12} y1={65} x2={35 + i * 12} y2={73}
            stroke="#6366f1" strokeWidth={1.5} />
          <line x1={35 + i * 12} y1={7} x2={35 + i * 12} y2={15}
            stroke="#6366f1" strokeWidth={1.5} />
        </g>
      ))}
      {/* Secure enclave region inside CPU */}
      <rect x={40} y={26} width={40} height={28} rx={4}
        stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.15} />
      {/* Shield in enclave */}
      <path d="M60 30 L70 35 L70 43 Q70 48 60 50 Q50 48 50 43 L50 35 Z"
        stroke="#f59e0b" strokeWidth={1} fill="#f59e0b" fillOpacity={0.1} />
    </svg>
  );
}

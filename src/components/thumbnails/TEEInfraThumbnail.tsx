export default function TEEInfraThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Attestation flow: Enclave → Verifier → Certificate */}
      {/* Enclave box */}
      <rect x={8} y={26} width={28} height={28} rx={4}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.12} />
      {/* Verifier */}
      <circle cx={60} cy={40} r={12} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.1} />
      {/* Certificate */}
      <rect x={84} y={26} width={28} height={28} rx={4}
        stroke="#f59e0b" strokeWidth={1.5} fill="#f59e0b" fillOpacity={0.12} />
      {/* Checkmark in certificate */}
      <polyline points="92,40 96,45 104,35" stroke="#f59e0b" strokeWidth={1.5}
        strokeLinecap="round" fill="none" />
      {/* Arrows */}
      <line x1={36} y1={36} x2={48} y2={36} stroke="#10b981" strokeWidth={1.5} />
      <polygon points="46,33 50,36 46,39" fill="#10b981" />
      <line x1={72} y1={36} x2={84} y2={36} stroke="#6366f1" strokeWidth={1.5} />
      <polygon points="82,33 86,36 82,39" fill="#6366f1" />
      {/* Quote arrow back */}
      <path d="M60 52 Q60 66 22 56" stroke="#6366f1" strokeWidth={1}
        strokeDasharray="3 2" fill="none" />
    </svg>
  );
}

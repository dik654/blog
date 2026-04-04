export default function TEEFoundationsThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer untrusted region */}
      <rect x={8} y={6} width={104} height={68} rx={5}
        stroke="#6366f1" strokeWidth={1} fill="#6366f1" fillOpacity={0.04}
        strokeDasharray="4 2" />
      {/* Enclave boundary */}
      <rect x={25} y={18} width={70} height={44} rx={5}
        stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.1} />
      {/* Secure data inside */}
      <rect x={35} y={28} width={50} height={10} rx={3}
        fill="#10b981" fillOpacity={0.15} />
      <rect x={35} y={44} width={50} height={10} rx={3}
        fill="#10b981" fillOpacity={0.15} />
      {/* Lock icon on boundary */}
      <circle cx={60} cy={18} r={5} fill="#10b981" fillOpacity={0.3}
        stroke="#10b981" strokeWidth={1} />
    </svg>
  );
}

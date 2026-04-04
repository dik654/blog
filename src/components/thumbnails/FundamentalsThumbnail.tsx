export default function FundamentalsThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three connected cubes representing a blockchain */}
      {[20, 50, 80].map((x, i) => (
        <g key={i}>
          <rect x={x - 10} y={28} width={20} height={20} rx={3}
            stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
          <rect x={x - 7} y={25} width={20} height={20} rx={3}
            stroke="#6366f1" strokeWidth={1} fill="#6366f1" fillOpacity={0.05} />
        </g>
      ))}
      {/* Chain links */}
      <line x1={30} y1={38} x2={40} y2={38} stroke="#6366f1" strokeWidth={1.5} />
      <line x1={60} y1={38} x2={70} y2={38} stroke="#6366f1" strokeWidth={1.5} />
    </svg>
  );
}

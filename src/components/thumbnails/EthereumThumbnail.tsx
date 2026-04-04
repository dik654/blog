export default function EthereumThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Diamond / octahedron shape */}
      <polygon
        points="60,8 88,38 60,72 32,38"
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1}
      />
      {/* Inner horizontal line */}
      <line x1={32} y1={38} x2={88} y2={38} stroke="#6366f1" strokeWidth={1} />
      {/* Inner diagonal facets */}
      <line x1={60} y1={8} x2={60} y2={72} stroke="#6366f1" strokeWidth={1} strokeOpacity={0.4} />
      <line x1={60} y1={38} x2={88} y2={38} stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} />
    </svg>
  );
}

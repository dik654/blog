export default function MPCThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three pie slices meeting at center */}
      <path d="M60 40 L60 15 A25 25 0 0 1 81.6 52.5 Z"
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.15} />
      <path d="M60 40 L81.6 52.5 A25 25 0 0 1 38.4 52.5 Z"
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.15} />
      <path d="M60 40 L38.4 52.5 A25 25 0 0 1 60 15 Z"
        stroke="#f59e0b" strokeWidth={1.5} fill="#f59e0b" fillOpacity={0.15} />
      {/* Nodes at each vertex */}
      <circle cx={60} cy={15} r={3} fill="#6366f1" />
      <circle cx={81.6} cy={52.5} r={3} fill="#10b981" />
      <circle cx={38.4} cy={52.5} r={3} fill="#f59e0b" />
    </svg>
  );
}

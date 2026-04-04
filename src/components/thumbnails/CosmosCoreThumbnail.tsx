export default function CosmosCoreThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circular arrows representing CometBFT rounds */}
      <path d="M60 16 A24 24 0 0 1 84 40"
        stroke="#6366f1" strokeWidth={1.5} fill="none" />
      <path d="M84 40 A24 24 0 0 1 60 64"
        stroke="#10b981" strokeWidth={1.5} fill="none" />
      <path d="M60 64 A24 24 0 0 1 36 40"
        stroke="#f59e0b" strokeWidth={1.5} fill="none" />
      <path d="M36 40 A24 24 0 0 1 60 16"
        stroke="#6366f1" strokeWidth={1.5} fill="none" strokeOpacity={0.5} />
      {/* Arrow heads */}
      <polygon points="82,37 86,41 82,43" fill="#10b981" />
      <polygon points="62,63 58,65 58,61" fill="#f59e0b" />
      <polygon points="38,43 34,39 38,37" fill="#6366f1" />
      {/* Center dot */}
      <circle cx={60} cy={40} r={4} fill="#6366f1" fillOpacity={0.2}
        stroke="#6366f1" strokeWidth={1} />
    </svg>
  );
}

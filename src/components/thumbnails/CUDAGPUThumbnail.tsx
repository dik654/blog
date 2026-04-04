export default function CUDAGPUThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* GPU grid of threads */}
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 6 }, (_, col) => (
          <rect key={`${row}-${col}`}
            x={14 + col * 16} y={10 + row * 16}
            width={12} height={12} rx={2}
            stroke="#10b981" strokeWidth={1}
            fill="#10b981" fillOpacity={(row + col) % 3 === 0 ? 0.2 : 0.08} />
        ))
      )}
      {/* GPU chip outline */}
      <rect x={8} y={4} width={104} height={72} rx={5}
        stroke="#6366f1" strokeWidth={1.5} fill="none" />
    </svg>
  );
}

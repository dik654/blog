export default function DeepLearningThumbnail() {
  const layers = [
    { x: 20, nodes: 3 },
    { x: 46, nodes: 4 },
    { x: 72, nodes: 4 },
    { x: 98, nodes: 2 },
  ];
  const nodeY = (count: number, i: number) => 20 + (40 / (count + 1)) * (i + 1);

  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {layers.map((layer, li) =>
        Array.from({ length: layer.nodes }, (_, ni) => {
          const y = nodeY(layer.nodes, ni);
          return (
            <g key={`${li}-${ni}`}>
              {li < layers.length - 1 &&
                Array.from({ length: layers[li + 1].nodes }, (_, nj) => (
                  <line key={nj} x1={layer.x} y1={y}
                    x2={layers[li + 1].x} y2={nodeY(layers[li + 1].nodes, nj)}
                    stroke="#6366f1" strokeWidth={0.5} strokeOpacity={0.3} />
                ))}
              <circle cx={layer.x} cy={y} r={3.5}
                stroke="#6366f1" strokeWidth={1} fill="#6366f1" fillOpacity={0.15} />
            </g>
          );
        })
      )}
    </svg>
  );
}

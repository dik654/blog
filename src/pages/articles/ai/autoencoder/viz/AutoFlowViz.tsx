import { LAYERS, LABELS } from './AutoFlowVizData';

const W = 440, H = 160;
const LX = [40, 130, 210, 290, 380]; // x positions per layer

function nodeY(count: number, idx: number) {
  const gap = 28;
  const top = (H - (count - 1) * gap) / 2;
  return top + idx * gap;
}

export default function AutoFlowViz() {
  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Connections between layers */}
        {LAYERS.slice(0, -1).map((layer, li) => {
          const next = LAYERS[li + 1];
          return Array.from({ length: layer.dim }).flatMap((_, si) =>
            Array.from({ length: next.dim }).map((_, di) => (
              <line key={`${li}-${si}-${di}`}
                x1={LX[li] + 20} y1={nodeY(layer.dim, si)}
                x2={LX[li + 1] - 10} y2={nodeY(next.dim, di)}
                stroke={layer.color} strokeWidth={0.5} strokeOpacity={0.25} />
            ))
          );
        })}

        {/* Nodes */}
        {LAYERS.map((layer, li) => (
          <g key={li}>
            {Array.from({ length: layer.dim }).map((_, ni) => {
              const y = nodeY(layer.dim, ni);
              const labels = li === 0 ? LABELS.input
                : li === 2 ? LABELS.latent
                : li === 4 ? LABELS.output : null;
              return (
                <g key={ni}>
                  <circle cx={LX[li]} cy={y} r={10}
                    fill={`${layer.color}18`} stroke={layer.color} strokeWidth={1.2} />
                  {labels && (
                    <text x={LX[li]} y={y + 3} textAnchor="middle"
                      fontSize={9} fontWeight={500} fill={layer.color}>
                      {labels[ni]}
                    </text>
                  )}
                </g>
              );
            })}
            <text x={LX[li]} y={H - 8} textAnchor="middle"
              fontSize={9} fill={layer.color} fontWeight={600}>
              {layer.label}({layer.dim})
            </text>
          </g>
        ))}

        {/* Region labels */}
        <rect x={95} y={4} width={82} height={16} rx={4}
          fill="#6366f108" stroke="#6366f1" strokeWidth={0.6} />
        <text x={136} y={15} textAnchor="middle" fontSize={9}
          fill="#6366f1" fontWeight={500}>Encoder</text>

        <rect x={260} y={4} width={82} height={16} rx={4}
          fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
        <text x={301} y={15} textAnchor="middle" fontSize={9}
          fill="#10b981" fontWeight={500}>Decoder</text>

        <rect x={182} y={4} width={56} height={16} rx={4}
          fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.6}
          strokeDasharray="3 2" />
        <text x={210} y={15} textAnchor="middle" fontSize={9}
          fill="#f59e0b" fontWeight={500}>Bottleneck</text>
      </svg>
    </div>
  );
}

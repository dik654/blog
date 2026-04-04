import type { Variant } from './VariantsVizData';
import { VARIANTS } from './VariantsVizData';

const M = 'var(--muted-foreground)';

export default function VariantDiagram({ sel }: { sel: number }) {
  const v: Variant = VARIANTS[sel];
  return (
    <svg viewBox="0 0 420 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Input */}
      <rect x={10} y={20} width={80} height={45} rx={6}
        fill={`${v.color}10`} stroke={v.color} strokeWidth={1} />
      <text x={50} y={38} textAnchor="middle" fontSize={9}
        fontWeight={500} fill={v.color}>입력</text>
      <text x={50} y={52} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={v.color}>{v.inputLabel}</text>

      <line x1={90} y1={42} x2={120} y2={42}
        stroke={v.color} strokeWidth={0.8} markerEnd={`url(#var-arr-${sel})`} />

      {/* Encoder */}
      <rect x={120} y={25} width={50} height={35} rx={4}
        fill={`${v.color}12`} stroke={v.color} strokeWidth={1} />
      <text x={145} y={46} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={v.color}>Enc</text>

      <line x1={170} y1={42} x2={195} y2={42} stroke={v.color} strokeWidth={0.8} />

      {/* Latent */}
      <rect x={195} y={18} width={70} height={50} rx={8}
        fill={`${v.color}15`} stroke={v.color} strokeWidth={1.2}
        strokeDasharray="4 2" />
      <text x={230} y={38} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={v.color}>{v.latentLabel}</text>
      {v.latentExtra && (
        <text x={230} y={52} textAnchor="middle" fontSize={9}
          fill={M}>{v.latentExtra}</text>
      )}

      <line x1={265} y1={42} x2={290} y2={42} stroke={v.color} strokeWidth={0.8} />

      {/* Decoder */}
      <rect x={290} y={25} width={50} height={35} rx={4}
        fill={`${v.color}12`} stroke={v.color} strokeWidth={1} />
      <text x={315} y={46} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={v.color}>Dec</text>

      <line x1={340} y1={42} x2={360} y2={42}
        stroke={v.color} strokeWidth={0.8} markerEnd={`url(#var-arr-${sel})`} />

      {/* Output */}
      <rect x={360} y={20} width={55} height={45} rx={6}
        fill={`${v.color}10`} stroke={v.color} strokeWidth={1} />
      <text x={387} y={38} textAnchor="middle" fontSize={9}
        fontWeight={500} fill={v.color}>출력</text>
      <text x={387} y={52} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={v.color}>{v.outputLabel}</text>

      {/* Variant-specific annotations */}
      {sel === 0 && (
        <text x={50} y={78} textAnchor="middle" fontSize={9}
          fill={M}>노이즈 추가된 입력</text>
      )}
      {sel === 1 && [0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={200 + i * 12} y={56} width={8} height={6}
          rx={1} fill={i === 1 || i === 3 ? v.color : `${v.color}25`} />
      ))}
      {sel === 2 && (
        <text x={230} y={78} textAnchor="middle" fontSize={9}
          fill={M}>N(mu, sigma)에서 샘플링</text>
      )}

      <defs>
        {VARIANTS.map((vr, i) => (
          <marker key={i} id={`var-arr-${i}`} markerWidth="6"
            markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={vr.color} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

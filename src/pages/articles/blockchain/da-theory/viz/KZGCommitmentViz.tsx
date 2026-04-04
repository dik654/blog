import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const STEPS = [
  { label: 'Trusted Setup: SRS 포인트 생성', body: '비밀값 τ의 거듭제곱을 G₁에 곱한 포인트 [τ⁰G, τ¹G, ..., τ⁴⁰⁹⁵G]를 공개한다. τ 자체는 삭제된다.' },
  { label: '다항식 커밋먼트 C = Σaᵢ·[τⁱ]₁', body: 'Blob의 계수 a₀...a₄₀₉₅와 SRS 포인트의 선형 결합이 커밋먼트 C (G₁ 점, 48바이트)다.' },
  { label: '증명 π: 몫 다항식의 커밋먼트', body: 'p(z)=v를 증명하려면 Q(x)=(p(x)-v)/(x-z)의 커밋먼트 π=[Q(τ)]₁을 만든다.' },
  { label: '검증: 페어링 등식 e(π,[τ-z]₂)=e(C-[v]₁,G₂)', body: '쌍선형 페어링으로 원본 데이터 없이 48B+48B만으로 O(1) 검증한다.' },
];

export default function KZGCommitmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Trusted Setup */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0 }}>
            <text x={40} y={28} fontSize={10} fontWeight={600} fill={C[0]}>Trusted Setup (SRS)</text>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={40 + i * 68} y={36} width={58} height={24} rx={4}
                  fill={`${C[0]}12`} stroke={C[0]} strokeWidth={1} />
                <text x={69 + i * 68} y={51} textAnchor="middle" fontSize={10}
                  fill={C[0]}>{i < 3 ? `[τ${'\u2070\u00B9\u00B2'[i]}]₁` : '...4096'}</text>
              </g>
            ))}
          </motion.g>

          {/* Step 1: Commitment */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <text x={40} y={84} fontSize={10} fontWeight={600} fill={C[1]}>
                Blob 계수 × SRS → Commitment
              </text>
              <rect x={40} y={90} width={180} height={28} rx={5}
                fill={`${C[1]}12`} stroke={C[1]} strokeWidth={1.2} />
              <text x={130} y={107} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C[1]}>C = Σ aᵢ · [τⁱ]₁</text>
              <rect x={240} y={90} width={60} height={28} rx={5}
                fill={`${C[1]}20`} stroke={C[1]} strokeWidth={1.5} />
              <text x={270} y={107} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[1]}>48 B</text>
              <line x1={220} y1={104} x2={240} y2={104}
                stroke={C[1]} strokeWidth={1} markerEnd="url(#arr-g)" />
            </motion.g>
          )}

          {/* Step 2: Proof */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <text x={40} y={142} fontSize={10} fontWeight={600} fill={C[2]}>
                몫 다항식 Q(x) = (p(x) - v) / (x - z)
              </text>
              <rect x={40} y={148} width={160} height={28} rx={5}
                fill={`${C[2]}12`} stroke={C[2]} strokeWidth={1.2} />
              <text x={120} y={165} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C[2]}>π = [Q(τ)]₁</text>
              <rect x={220} y={148} width={60} height={28} rx={5}
                fill={`${C[2]}20`} stroke={C[2]} strokeWidth={1.5} />
              <text x={250} y={165} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[2]}>48 B</text>
              <line x1={200} y1={162} x2={220} y2={162}
                stroke={C[2]} strokeWidth={1} markerEnd="url(#arr-y)" />
            </motion.g>
          )}

          {/* Step 3: Pairing verify */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={320} y={86} width={180} height={94} rx={6}
                fill={`${C[3]}08`} stroke={C[3]} strokeWidth={1.5} />
              <text x={410} y={106} textAnchor="middle" fontSize={10}
                fontWeight={700} fill={C[3]}>Pairing Check</text>
              <text x={410} y={124} textAnchor="middle" fontSize={10}
                fill={C[3]}>e(π, [τ-z]₂)</text>
              <text x={410} y={140} textAnchor="middle" fontSize={12}
                fontWeight={700} fill={C[3]}>=</text>
              <text x={410} y={156} textAnchor="middle" fontSize={10}
                fill={C[3]}>e(C - [v]₁, G₂)</text>
              <text x={410} y={174} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">검증 O(1)</text>
            </motion.g>
          )}

          <defs>
            <marker id="arr-g" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto"><path d="M0,0 L6,3 L0,6Z" fill={C[1]} /></marker>
            <marker id="arr-y" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto"><path d="M0,0 L6,3 L0,6Z" fill={C[2]} /></marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

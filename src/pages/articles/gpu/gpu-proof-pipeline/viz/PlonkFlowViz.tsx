import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Round 1: 와이어 a,b,c 다항식 INTT 후 SRS로 MSM 커밋 (3 NTT + 3 MSM)' },
  { label: 'Round 2: 순열 누적자 z(X) 계산 후 SRS로 커밋 (1 NTT + 1 MSM)' },
  { label: 'Round 3: 몫 다항식 t(X) 3등분 후 각각 커밋 (7 NTT + 3 MSM)' },
  { label: 'Round 4-5: 평가 + 오프닝 증명 W 생성 (2 MSM)' },
];

const ROUNDS = [
  { label: 'R1: Wire', sub: '3 NTT + 3 MSM', color: '#6366f1', w: 120 },
  { label: 'R2: Perm', sub: '1 NTT + 1 MSM', color: '#8b5cf6', w: 100 },
  { label: 'R3: Quot', sub: '7 NTT + 3 MSM', color: '#6366f1', w: 120 },
  { label: 'R4-5: Open', sub: '2 MSM', color: '#10b981', w: 100 },
];

export default function PlonkFlowViz() {
  let cx = 10;
  const positions = ROUNDS.map((r) => {
    const x = cx;
    cx += r.w + 20;
    return { ...r, x };
  });

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 90" className="w-full max-w-2xl">
          <defs>
            <marker id="pl-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>
          {positions.map((r, i) => {
            const active = i === step;
            const done = i < step;
            const opacity = active ? 1 : done ? 0.4 : 0.18;
            return (
              <g key={r.label}>
                {i > 0 && (
                  <line x1={r.x - 12} y1={40} x2={r.x - 2} y2={40}
                    stroke="#888" strokeWidth={1.2} markerEnd="url(#pl-arr)"
                    opacity={done || active ? 0.7 : 0.2} />
                )}
                <motion.rect x={r.x} y={16} width={r.w} height={48} rx={8}
                  fill={r.color} animate={{ opacity }} transition={{ duration: 0.3 }} />
                <text x={r.x + r.w / 2} y={36} textAnchor="middle"
                  fontSize={10} fontWeight="bold" fill="white"
                  style={{ opacity: Math.max(opacity, 0.4) }}>{r.label}</text>
                <text x={r.x + r.w / 2} y={50} textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6}
                  style={{ opacity: Math.max(opacity, 0.3) }}>{r.sub}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}

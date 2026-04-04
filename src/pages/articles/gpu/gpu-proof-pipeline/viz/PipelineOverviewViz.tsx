import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Witness: CPU에서 제약 조건을 순차적으로 풀어 증인 벡터를 생성한다' },
  { label: 'NTT: 다항식을 평가 형태로 변환한다 (20-30% 시간)' },
  { label: 'MSM: 타원곡선 스칼라 곱으로 커밋먼트를 계산한다 (60-70% 시간)' },
  { label: 'Proof: 최종 증명 원소를 조합한다 (256 bytes)' },
];

const STAGES = [
  { label: 'Witness', sub: 'CPU', color: '#f59e0b', w: 80 },
  { label: 'NTT', sub: 'GPU ~25%', color: '#6366f1', w: 120 },
  { label: 'MSM', sub: 'GPU ~65%', color: '#6366f1', w: 200 },
  { label: 'Proof', sub: '조합', color: '#10b981', w: 80 },
];

export default function PipelineOverviewViz() {
  let cx = 20;
  const positions = STAGES.map((s) => {
    const x = cx;
    cx += s.w + 24;
    return { ...s, x };
  });

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 96" className="w-full max-w-2xl">
          <defs>
            <marker id="pp-arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>
          {positions.map((s, i) => {
            const active = i === step;
            const done = i < step;
            const opacity = active ? 1 : done ? 0.4 : 0.18;
            return (
              <g key={s.label}>
                {i > 0 && (
                  <line x1={s.x - 16} y1={40} x2={s.x - 4} y2={40}
                    stroke="#888" strokeWidth={1.2} markerEnd="url(#pp-arrow)"
                    opacity={done || active ? 0.7 : 0.2} />
                )}
                <motion.rect x={s.x} y={14} width={s.w} height={52} rx={8}
                  fill={s.color} animate={{ opacity }} transition={{ duration: 0.3 }} />
                <text x={s.x + s.w / 2} y={38} textAnchor="middle"
                  fontSize={10} fontWeight="bold" fill="white" style={{ opacity: Math.max(opacity, 0.4) }}>
                  {s.label}
                </text>
                <text x={s.x + s.w / 2} y={52} textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6} style={{ opacity: Math.max(opacity, 0.3) }}>
                  {s.sub}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}

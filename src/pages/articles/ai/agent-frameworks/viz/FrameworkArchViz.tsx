import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const PARTS = [
  { label: 'User', color: '#6366f1', x: 10, y: 42 },
  { label: 'Agent', color: '#10b981', x: 110, y: 42 },
  { label: 'LLM', color: '#3b82f6', x: 210, y: 12 },
  { label: 'Memory', color: '#f59e0b', x: 210, y: 72 },
  { label: 'Tools', color: '#ef4444', x: 310, y: 12 },
  { label: 'Retriever', color: '#a855f7', x: 310, y: 72 },
];
const BW = 60, BH = 28;

const EDGES = [
  [0, 1], [1, 2], [2, 1], [1, 3], [1, 4], [1, 5],
];

const STEPS = [
  { label: '전체 에이전트 아키텍처' },
  { label: 'LLM 추론 루프' },
  { label: 'Memory & Tools 활용' },
  { label: 'RAG 검색 보강' },
];
const BODY = [
  'Agent가 중심 허브 오케스트레이션',
  'LLM 추론 → 도구 호출 결정',
  '대화 기억 + 외부 도구 호출',
  'Retriever로 컨텍스트 보강',
];

const ACTIVE_SETS = [[0, 1, 2, 3, 4, 5], [0, 1, 2], [1, 3, 4], [1, 2, 5]];

export default function FrameworkArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const actives = ACTIVE_SETS[step];
        return (
          <svg viewBox="0 0 500 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* edges */}
            {EDGES.map(([fi, ti], ei) => {
              const f = PARTS[fi], t = PARTS[ti];
              const visible = actives.includes(fi) && actives.includes(ti);
              return (
                <motion.line key={ei}
                  x1={f.x + BW} y1={f.y + BH / 2} x2={t.x} y2={t.y + BH / 2}
                  stroke="var(--border)" strokeWidth={1}
                  animate={{ opacity: visible ? 0.5 : 0.08 }}
                  transition={{ duration: 0.3 }} />
              );
            })}
            {/* nodes */}
            {PARTS.map((p, i) => {
              const active = actives.includes(i);
              return (
                <g key={p.label}>
                  <motion.rect x={p.x} y={p.y} width={BW} height={BH} rx={5}
                    animate={{ fill: `${p.color}${active ? '22' : '06'}`, stroke: p.color,
                      strokeWidth: active ? 2 : 0.8, opacity: active ? 1 : 0.2 }}
                    transition={{ duration: 0.3 }} />
                  <text x={p.x + BW / 2} y={p.y + BH / 2 + 3} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={p.color} opacity={active ? 1 : 0.2}>
                    {p.label}
                  </text>
                </g>
              );
            })}
            {/* highlight pulse on Agent */}
            {step > 0 && (
              <motion.rect x={PARTS[1].x - 2} y={PARTS[1].y - 2} width={BW + 4} height={BH + 4} rx={7}
                fill="none" stroke="#10b981" strokeWidth={1}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.5 }} />
            )}
            <motion.text x={390} y={55} fontSize={9}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}

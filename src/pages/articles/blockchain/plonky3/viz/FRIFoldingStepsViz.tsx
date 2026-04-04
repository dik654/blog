import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'f(x)', sub: '원본 다항식', color: '#6366f1', x: 30 },
  { label: 'Merkle', sub: 'Poseidon2 커밋', color: '#3b82f6', x: 90 },
  { label: 'β 샘플', sub: 'Fiat-Shamir', color: '#f59e0b', x: 150 },
  { label: 'FRI 접기', sub: 'f+f(-x) 결합', color: '#10b981', x: 210 },
  { label: 'f/2(x)', sub: '차수 절반', color: '#8b5cf6', x: 270 },
  { label: '쿼리', sub: '100개 샘플', color: '#ec4899', x: 330 },
  { label: '열기 증명', sub: 'Merkle 경로', color: '#ef4444', x: 390 },
];

const STEPS = [
  { label: '원본 다항식', body: 'AIR 트레이스를 다항식 f(x)로 인코딩합니다.' },
  { label: 'Merkle 커밋', body: 'Reed-Solomon 확장 후 Poseidon2 Merkle 트리에 커밋합니다.' },
  { label: '도전값 샘플링', body: 'Fiat-Shamir 채린저가 beta 도전값을 생성합니다.' },
  { label: 'FRI 접기', body: 'f(x)와 f(-x)를 beta로 선형 결합해 차수를 절반으로 줄입니다.' },
  { label: '차수 감소', body: '접기를 반복해 상수 다항식에 도달할 때까지 진행합니다.' },
  { label: '쿼리 단계', body: 'num_queries(100)개 랜덤 인덱스를 샘플링합니다.' },
  { label: '열기 증명', body: '각 쿼리 인덱스에 대해 Merkle 경로 증명을 생성합니다.' },
];

export default function FRIFoldingStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 565 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = i <= step;
            const hl = i === step;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <motion.line
                    x1={NODES[i - 1].x + 22} y1={35} x2={n.x - 22} y2={35}
                    stroke={NODES[i - 1].color} strokeWidth={0.7}
                    animate={{ opacity: active ? 0.5 : 0.1 }} transition={sp} />
                )}
                <motion.rect x={n.x - 21} y={18} width={42} height={34} rx={4}
                  animate={{
                    fill: hl ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: hl ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }} transition={sp} />
                <motion.text x={n.x} y={33} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                  {n.label}
                </motion.text>
                <motion.text x={n.x} y={43} textAnchor="middle" fontSize={9}
                  animate={{ fill: n.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                  {n.sub}
                </motion.text>
              </g>
            );
          })}
          {/* fold loop */}
          {step >= 4 && (
            <motion.path d="M 215,56 Q 240,66 265,56" fill="none"
              stroke="#8b5cf6" strokeWidth={0.6} strokeDasharray="2 2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
          )}
        </svg>
      )}
    </StepViz>
  );
}

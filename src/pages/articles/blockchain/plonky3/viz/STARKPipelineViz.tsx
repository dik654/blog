import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const PHASES = [
  { label: 'Trace Commit', color: '#6366f1', x: 10 },
  { label: 'Challenge (alpha)', color: '#10b981', x: 75 },
  { label: 'Quotient Q(x)', color: '#f59e0b', x: 140 },
  { label: 'FRI Open', color: '#ec4899', x: 205 },
  { label: 'Proof', color: '#8b5cf6', x: 270 },
];

const STEPS = [
  { label: 'STARK 증명 파이프라인', body: '트레이스 커밋 → 챌린지 → 몫 다항식 → FRI 개구 → 증명 생성.' },
  { label: '1. 트레이스 커밋', body: 'AIR 트레이스를 DFT로 다항식 보간, Merkle 트리에 커밋.' },
  { label: '2-3. 챌린지 & Quotient', body: 'alpha로 제약 결합, Q(x) = C(x)/Z_H(x) 계산.' },
  { label: '4-5. FRI 개구 & 증명', body: 'zeta에서 다항식 개방, FRI로 저차 증명 생성.' },
];

const BW = 55, BH = 26;

export default function STARKPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 50" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const active = step===0 || (step===1&&i===0) || (step===2&&(i===1||i===2)) || (step===3&&i>=3);
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={PHASES[i-1].x+BW} y1={BH/2+5} x2={p.x} y2={BH/2+5}
                    stroke={p.color} strokeWidth={1} strokeDasharray="3 2"
                    animate={{ opacity: active?0.6:0.15 }} />
                )}
                <motion.rect x={p.x} y={5} width={BW} height={BH} rx={5}
                  animate={{ fill:`${p.color}${active?'18':'06'}`, stroke:p.color,
                    strokeWidth: active?1.5:0.5, opacity: active?1:0.2 }} />
                <text x={p.x+BW/2} y={21} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={p.color} opacity={active?1:0.2}>{p.label}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}

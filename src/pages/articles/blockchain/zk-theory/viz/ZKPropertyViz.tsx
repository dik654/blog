import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const PROPS = [
  { label: '완전성', sub: 'Completeness', color: C1 },
  { label: '건전성', sub: 'Soundness', color: C2 },
  { label: '영지식성', sub: 'Zero-Knowledge', color: C3 },
];

const STEPS = [
  { label: 'ZKP의 세 가지 성질', body: '영지식 증명은 완전성, 건전성, 영지식성을 동시에 만족해야 한다.' },
  { label: '완전성 — 참인 명제는 반드시 수락', body: '정직한 증명자(Prover)가 참인 명제를 증명하면, 검증자(Verifier)는 항상 수락한다.' },
  { label: '건전성 — 거짓 명제는 수락 불가', body: '악의적 증명자가 거짓을 증명하려 해도, 검증자를 속일 확률은 무시할 수 있을 만큼 작다.' },
  { label: '영지식성 — 증명 외 정보 누출 없음', body: '검증자는 "명제가 참"이라는 사실만 알 뿐, 비밀(witness)에 대해 어떤 정보도 얻지 못한다.' },
];

const CX = [105, 210, 315], CY = 70, R = 40;

export default function ZKPropertyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PROPS.map((p, i) => {
            const active = step === i + 1;
            const op = step === 0 || active ? 1 : 0.25;
            return (
              <motion.g key={p.label} animate={{ opacity: op }} transition={{ duration: 0.3 }}>
                <motion.circle cx={CX[i]} cy={CY} r={R} fill={`${p.color}10`}
                  stroke={p.color} strokeWidth={active ? 1.5 : 0.8}
                  animate={{ r: active ? 44 : R }} transition={{ type: 'spring', bounce: 0.2 }} />
                <text x={CX[i]} y={CY - 4} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={p.color}>{p.label}</text>
                <text x={CX[i]} y={CY + 10} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{p.sub}</text>
              </motion.g>
            );
          })}
          {/* Prover → Verifier 아래 화살표 */}
          <text x={60} y={145} fontSize={9} fontWeight={500} fill={C1}>Prover</text>
          <line x1={95} y1={142} x2={320} y2={142} stroke="var(--border)" strokeWidth={0.8} />
          <polygon points="320,139 326,142 320,145" fill="var(--muted-foreground)" opacity={0.5} />
          <text x={332} y={145} fontSize={9} fontWeight={500} fill={C2}>Verifier</text>
        </svg>
      )}
    </StepViz>
  );
}

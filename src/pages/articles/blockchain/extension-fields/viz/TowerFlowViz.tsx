import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'Fp', c: '#6b7280', x: 20 },
  { label: 'Fp2', c: '#6366f1', x: 80 },
  { label: 'Fp6', c: '#f59e0b', x: 155 },
  { label: 'Fp12', c: '#ec4899', x: 240 },
  { label: 'GT', c: '#ef4444', x: 310 },
];
const EDGES = ['u²=-1', 'v³=9+u', 'w²=v', 'r차 부분군'];

const STEPS = [
  { label: 'Fp: 256-bit 소수체', body: 'BN254의 기초체. 모든 확장의 출발점입니다.' },
  { label: 'Fp → Fp2: 복소수 확장', body: 'u²=-1로 이차 확장. a₀+a₁u. G2 좌표 공간. Conjugate = Frobenius.' },
  { label: 'Fp2 → Fp6: Karatsuba 적용', body: 'v³=ξ(9+u)로 삼차 확장. Fp2 원소 3개. Karatsuba: 6×Fp2 mul.' },
  { label: 'Fp6 → Fp12: 페어링 공간', body: 'w²=v로 이차 확장. 총 12개 Fp 원소. Miller Loop 결과가 여기에.' },
  { label: 'GT: 페어링 결과 부분군', body: 'Fp12*의 r차 부분군. e(P,Q) ∈ GT. Final Exponentiation으로 투영.' },
];

export default function TowerFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const visible = i <= step;
            const active = i === step;
            return (
              <motion.g key={n.label} animate={{ opacity: visible ? 1 : 0.1 }} transition={sp}>
                <motion.rect x={n.x} y={20} width={48} height={30} rx={6}
                  animate={{
                    fill: active ? `${n.c}25` : `${n.c}0a`,
                    stroke: n.c, strokeWidth: active ? 2 : 0.6,
                  }} transition={sp} />
                <text x={n.x + 24} y={38} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={n.c}>{n.label}</text>
                {/* Size indicator */}
                {visible && (
                  <motion.text x={n.x + 24} y={58} textAnchor="middle" fontSize={9}
                    fill={`${n.c}88`} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
                    {i === 0 ? '256 bit' : i === 1 ? '512 bit' : i === 2 ? '1536 bit' : i === 3 ? '3072 bit' : 'r차'}
                  </motion.text>
                )}
                {/* Edge arrow + label */}
                {i > 0 && visible && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp}>
                    <line x1={NODES[i - 1].x + 50} y1={35} x2={n.x - 2} y2={35}
                      stroke={n.c} strokeWidth={0.8} />
                    <text x={(NODES[i - 1].x + 50 + n.x) / 2} y={17}
                      textAnchor="middle" fontSize={9} fill={n.c}>{EDGES[i - 1]}</text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}
          {/* Dimension growth bar */}
          <rect x={20} y={68} width={338} height={3} rx={1.5} fill="var(--border)" opacity={0.2} />
          <motion.rect x={20} y={68} height={3} rx={1.5}
            animate={{ width: ((step + 1) / 5) * 338, fill: NODES[step].c }}
            transition={sp} />
        </svg>
      )}
    </StepViz>
  );
}

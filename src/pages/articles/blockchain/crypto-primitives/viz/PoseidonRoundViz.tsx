import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: '입력', sub: '[cap, r₀, r₁]', color: '#6366f1', x: 30 },
  { label: 'AddRC', sub: '상수 덧셈', color: '#10b981', x: 90 },
  { label: 'S-box', sub: 'x⁵', color: '#f59e0b', x: 150 },
  { label: 'MDS', sub: '행렬 곱', color: '#8b5cf6', x: 210 },
  { label: '반복', sub: '×65', color: '#ec4899', x: 270 },
  { label: '출력', sub: 'state[1]', color: '#ef4444', x: 330 },
];

const STEPS = [
  { label: '입력 State', body: 'Sponge 구조: [capacity=0, rate₀=left, rate₁=right]. capacity는 보안 파라미터.' },
  { label: 'AddRoundConstants', body: '미리 생성된 상수를 각 원소에 더합니다. 대칭성을 파괴합니다.' },
  { label: 'S-box (x⁵)', body: 'x² → x⁴ → x⁵. Fr 곱셈 3회. gcd(5, r-1)=1이므로 순열 조건 충족.' },
  { label: 'MDS 행렬', body: '최대 확산 보장. 모든 부분행렬의 det≠0. T=3일 때 I₃+J₃.' },
  { label: '65회 반복', body: '8 full rounds(RF) + 57 partial rounds(RP). 총 제약: 8×9 + 57×3 = 243개.' },
  { label: '해시 출력', body: '최종 state[1]을 추출. SHA-256의 ~25,000 제약 대비 ~250개로 100배 효율.' },
];

export default function PoseidonRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
                <motion.rect x={n.x - 21} y={20} width={42} height={30} rx={4}
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
        </svg>
      )}
    </StepViz>
  );
}

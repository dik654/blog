import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: '게이트 제약', sub: 'q·a·b + q·a + ...', color: '#6366f1', x: 10, y: 8 },
  { label: 'Copy 제약', sub: 'σ 순열 다항식', color: '#10b981', x: 120, y: 8 },
  { label: 'Public Input', sub: 'PI(X) 바인딩', color: '#f59e0b', x: 230, y: 8 },
  { label: 'Vanishing', sub: 'Zₕ(X) = Xⁿ-1', color: '#8b5cf6', x: 120, y: 58 },
];
const BW = 80, BH = 28;

const STEPS = [
  { label: '① 게이트 제약 확인', body: 'q_M*a*b + q_L*a + ... = 0 확인' },
  { label: '② Copy 제약 확인', body: 'Z(X) accumulator 순열 검증' },
  { label: '③ Public Input 바인딩', body: '공개 입력 wire 위치 확인' },
  { label: '④ Vanishing 검증', body: 'Zh(X) 나눗셈 전체 성립 확인' },
];

export default function ConstraintFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${n.color}20` : `${n.color}06`,
                    stroke: n.color, strokeWidth: glow ? 2 : 0.5, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={n.x + BW / 2} y={n.y + 12} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color} opacity={active ? 1 : 0.2}>{n.label}</text>
                <text x={n.x + BW / 2} y={n.y + 22} textAnchor="middle" fontSize={9}
                  fill={n.color} opacity={active ? 0.5 : 0.1}>{n.sub}</text>
              </g>
            );
          })}
          {/* arrows to vanishing */}
          {[0, 1, 2].map(i => (
            <motion.line key={i}
              x1={NODES[i].x + BW / 2} y1={36}
              x2={NODES[3].x + BW / 2} y2={57}
              stroke="#8b5cf6" strokeWidth={0.5} strokeDasharray="3 2"
              animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp} />
          ))}
          <motion.text x={165} y={94} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)"
            animate={{ opacity: step >= 3 ? 0.7 : 0.15 }} transition={sp}>
            t(X) = 전체 제약 / Zₕ(X) → 나머지 = 0
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}

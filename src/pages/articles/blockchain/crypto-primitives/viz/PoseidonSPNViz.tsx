import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const BOXES = [
  { label: 'State', sub: '[cap, r₀, r₁]', color: '#6366f1', x: 30 },
  { label: 'AddRC', sub: '대칭 파괴', color: '#10b981', x: 100 },
  { label: 'S-box', sub: 'x⁵', color: '#f59e0b', x: 170 },
  { label: 'MDS', sub: '확산', color: '#8b5cf6', x: 240 },
  { label: '출력', sub: 'state[1]', color: '#ef4444', x: 310 },
];

const STEPS = [
  { label: '입력 State (Sponge)', body: '[capacity=0, rate₀=left, rate₁=right]. capacity는 보안 파라미터입니다.' },
  { label: 'AddRoundConstants', body: '미리 생성된 상수를 각 원소에 더합니다. 대칭성을 파괴합니다.' },
  { label: 'S-box (x⁵)', body: 'x² → x⁴ → x⁵. Fr 곱셈 3회. Full 라운드에서 3개, Partial에서 1개 적용.' },
  { label: 'MDS 행렬 곱', body: '최대 확산 보장. 모든 부분행렬의 det≠0. T=3일 때 I₃+J₃.' },
  { label: '해시 출력', body: '65회 반복(8 full + 57 partial) 후 state[1] 추출. ~250 제약 (SHA-256의 1/100).' },
];

export default function PoseidonSPNViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* round loop indicator */}
          <motion.path d="M 95,62 Q 170,76 245,62" fill="none" stroke="#ec489960"
            strokeWidth={0.6} strokeDasharray="2 2"
            animate={{ opacity: step >= 3 ? 0.6 : 0.1 }} transition={sp} />
          {step >= 3 && (
            <motion.text x={170} y={75} textAnchor="middle" fontSize={9} fill="#ec4899"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp}>
              ×65 (8 full + 57 partial)
            </motion.text>
          )}
          {BOXES.map((b, i) => {
            const active = i <= step;
            const hl = i === step;
            return (
              <g key={b.label}>
                {i > 0 && (
                  <motion.line
                    x1={BOXES[i - 1].x + 26} y1={38} x2={b.x - 26} y2={38}
                    stroke={BOXES[i - 1].color} strokeWidth={0.8}
                    markerEnd="url(#parr)"
                    animate={{ opacity: active ? 0.5 : 0.1 }} transition={sp}
                  />
                )}
                <motion.rect x={b.x - 25} y={22} width={50} height={32} rx={4}
                  animate={{
                    fill: hl ? `${b.color}25` : active ? `${b.color}10` : `${b.color}04`,
                    stroke: b.color, strokeWidth: hl ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }} transition={sp} />
                <motion.text x={b.x} y={36} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: b.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                  {b.label}
                </motion.text>
                <motion.text x={b.x} y={46} textAnchor="middle" fontSize={9}
                  animate={{ fill: b.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                  {b.sub}
                </motion.text>
              </g>
            );
          })}
          <defs>
            <marker id="parr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

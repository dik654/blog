import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  'ZK 친화 해시 함수 — 산술 회로 효율성 비교',
  'SHA-256 — 비트 연산 기반 (~25,000 R1CS 제약)',
  'Poseidon — 체 연산 기반 (~300 제약, 80배 효율)',
  'Rescue — 대칭 S-box 구조 (~500 제약)',
];

const HASHES = [
  { label: 'SHA-256', constraints: '~25,000', type: '비트 연산 (AND, XOR, ROTATE)', bar: 96, color: C1 },
  { label: 'Poseidon', constraints: '~300', type: '체 연산 (덧셈, 곱셈) — HADES 전략', bar: 4, color: C2 },
  { label: 'Rescue', constraints: '~500', type: '체 연산 (대칭 S-box: x^α ↔ x^(1/α))', bar: 6, color: C3 },
];

export default function ZKHashViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {HASHES.map((h, i) => {
            const active = step === i + 1;
            const op = step === 0 || active ? 1 : 0.15;
            const y = 10 + i * 64;
            return (
              <motion.g key={h.label} animate={{ opacity: op }} transition={{ duration: 0.3 }}>
                {/* 이름 + 타입 */}
                <rect x={10} y={y} width={200} height={48} rx={6}
                  fill={`${h.color}${active ? '12' : '06'}`} stroke={h.color}
                  strokeWidth={active ? 1.5 : 0.8} />
                <text x={20} y={y + 20} fontSize={11} fontWeight={600} fill={h.color}>{h.label}</text>
                <text x={20} y={y + 36} fontSize={9} fill="var(--muted-foreground)">{h.type}</text>

                {/* R1CS 제약 수 바 */}
                <rect x={220} y={y + 8} width={170} height={14} rx={3}
                  fill={`${h.color}06`} stroke={h.color} strokeWidth={0.5} />
                <motion.rect x={222} y={y + 10} height={10} rx={2}
                  fill={`${h.color}30`}
                  animate={{ width: active || step === 0 ? h.bar * 1.6 : 40 }}
                  transition={{ type: 'spring', bounce: 0.1 }} />
                <text x={225} y={y + 38} fontSize={9} fontWeight={500} fill={h.color}>
                  {h.constraints} 제약
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}

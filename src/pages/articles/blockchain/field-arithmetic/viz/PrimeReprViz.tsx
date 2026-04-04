import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LIMBS = [
  { hex: '0xe131a029…', bits: '[63..0]', c: '#6366f1' },
  { hex: '0x23deac2f…', bits: '[127..64]', c: '#10b981' },
  { hex: '0x08213000…', bits: '[191..128]', c: '#f59e0b' },
  { hex: '0x2259d6b1…', bits: '[255..192]', c: '#8b5cf6' },
];

const STEPS = [
  { label: '254-bit 소수 p (BN254)', body: 'p = 2188824287... (254 비트). 하나의 레지스터에 담을 수 없는 크기입니다.' },
  { label: '4개 limb로 분해', body: 'p를 64비트 워드 4개로 표현: [u64; 4]. 리틀 엔디언 — limb[0]이 최하위.' },
  { label: 'limb별 비트 범위', body: '각 limb가 64비트씩 담당. 총 256비트 공간에 254비트 소수를 저장합니다.' },
  { label: 'limb 연산: carry 전파', body: 'add: limb별 덧셈 → carry 전파 → 조건부 mod p. 오버플로 없이 정확한 산술.' },
];

export default function PrimeReprViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Big number */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
            <rect x={20} y={6} width={300} height={20} rx={4} fill="#6366f110" stroke="#6366f1"
              strokeWidth={step === 0 ? 1.5 : 0.5} />
            <text x={170} y={19} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#6366f1">
              p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
            </text>
          </motion.g>
          {/* Decomposition arrow */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp}>
              <line x1={170} y1={28} x2={170} y2={38} stroke="var(--muted-foreground)" strokeWidth={0.7} />
              <rect x={172} y={30} width={28} height={7} rx={2} fill="var(--card)" />
              <text x={186} y={35} fontSize={9} fill="var(--muted-foreground)">64-bit 분해</text>
            </motion.g>
          )}
          {/* 4 limbs */}
          {LIMBS.map((l, i) => {
            const x = 20 + i * 80;
            const active = step === 1 || (step === 2 && true) || step === 3;
            return (
              <motion.g key={i} animate={{ opacity: step >= 1 ? 1 : 0.12 }} transition={sp}>
                <motion.rect x={x} y={42} width={72} height={28} rx={4}
                  animate={{
                    fill: step >= 1 ? `${l.c}18` : `${l.c}06`,
                    stroke: l.c, strokeWidth: active ? 1.3 : 0.5,
                  }} transition={sp} />
                <text x={x + 36} y={53} textAnchor="middle" fontSize={9} fontWeight={600}
                  fontFamily="monospace" fill={l.c}>limb[{i}]</text>
                <text x={x + 36} y={63} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill={`${l.c}aa`}>{l.hex}</text>
                {/* bit range */}
                {step >= 2 && (
                  <motion.text x={x + 36} y={80} textAnchor="middle" fontSize={9}
                    fill={l.c} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 0.7, y: 0 }}
                    transition={{ ...sp, delay: i * 0.08 }}>{l.bits}</motion.text>
                )}
                {/* carry arrows */}
                {step === 3 && i < 3 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    <line x1={x + 74} y1={56} x2={x + 78} y2={56}
                      stroke={l.c} strokeWidth={0.8} />
                    <rect x={x + 68} y={47} width={16} height={6} rx={1} fill="var(--card)" />
                    <text x={x + 76} y={52} textAnchor="middle" fontSize={9} fill={l.c}>carry</text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}
          {/* Conditional reduction */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={90} y={90} width={160} height={16} rx={4} fill="#f59e0b15" stroke="#f59e0b" strokeWidth={0.7} />
              <text x={170} y={100.5} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                result ≥ p → result -= p (조건부 감산)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

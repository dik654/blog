import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'EOA vs Smart Account', body: 'EOA — ECDSA 고정, 단일 서명. Smart Account — 검증 로직 커스텀, 배치 트랜잭션, 소셜 복구.' },
  { label: 'EOA: 고정된 검증', body: 'ecrecover(hash, v, r, s) → address. 서명 알고리즘 변경 불가. 시드 분실 = 자산 손실.' },
  { label: 'Smart Account: 프로그래머블', body: 'validateUserOp() — 서명 검증 로직을 컨트랙트에 구현. ECDSA, BLS, Passkey 등 자유 선택.' },
  { label: 'AA의 이점', body: '가스 대납(Paymaster), 배치 트랜잭션, 세션 키, 소셜 복구, 지출 한도 — 컨트랙트로 모두 구현 가능.' },
];

export default function AAModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* EOA box */}
          <motion.g animate={{ opacity: step === 1 || step === 0 ? 1 : 0.2 }}>
            <rect x={20} y={20} width={170} height={55} rx={6} fill={`${C1}08`} stroke={C1}
              strokeWidth={step === 1 ? 1.2 : 0.6} />
            <text x={105} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>EOA</text>
            <text x={105} y={53} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              ECDSA 고정 | 단일 서명자
            </text>
            <text x={105} y={67} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              시드 분실 → 복구 불가
            </text>
          </motion.g>
          {/* Smart Account box */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : (step === 0 ? 0.5 : 0.2) }}>
            <rect x={220} y={20} width={180} height={55} rx={6} fill={`${C2}08`} stroke={C2}
              strokeWidth={step >= 2 ? 1.2 : 0.6} />
            <text x={310} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>Smart Account</text>
            <text x={310} y={53} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              커스텀 검증 | 다중 서명자
            </text>
            <text x={310} y={67} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              소셜 복구, 세션 키, 배치 TX
            </text>
          </motion.g>
          {/* Arrow */}
          <motion.g animate={{ opacity: step >= 2 ? 0.8 : 0 }}>
            <line x1={190} y1={47} x2={220} y2={47} stroke={C3} strokeWidth={0.8} />
            <rect x={190} y={82} width={40} height={14} rx={3} fill={`${C3}10`} stroke={C3} strokeWidth={0.5} />
            <text x={210} y={92} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>AA</text>
          </motion.g>
          {/* Benefits */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              {[
                { label: 'Paymaster', x: 45 },
                { label: '배치 TX', x: 135 },
                { label: '세션 키', x: 225 },
                { label: '소셜 복구', x: 330 },
              ].map((b) => (
                <g key={b.label}>
                  <rect x={b.x - 35} y={105} width={70} height={20} rx={4}
                    fill={`${C3}10`} stroke={C3} strokeWidth={0.6} />
                  <text x={b.x} y={118} textAnchor="middle" fontSize={10} fill={C3}>{b.label}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

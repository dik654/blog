import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { fs: '#6366f1', pre: '#10b981', f: '#f59e0b', e: '#8b5cf6', pair: '#ef4444' };

const STEPS = [
  { label: 'Fiat-Shamir 챌린지 재생', body: '증명자와 동일한 순서로 transcript에서 beta, gamma, alpha, zeta, nu, u를 결정론적으로 도출.' },
  { label: '도메인 값 사전 계산', body: 'Zh(zeta), L1(zeta), PI(zeta) 등 도메인 함수 평가. O(log n) 거듭제곱으로 계산.' },
  { label: '[F] 선형화 커밋 재구성', body: '기존 커밋들을 선형 결합하여 [F]를 재구성. 새 커밋 없이 가법 동형성으로 합산.' },
  { label: '[E] 평가 커밋', body: '모든 평가값을 하나의 스칼라로 합산한 뒤 G1 곱 1회로 [E] 산출.' },
  { label: 'Pairing 검증 -- O(1)', body: 'e(LHS, [tau]_2) = e(RHS, G2) 페어링 2회. 성립하면 accept. 회로 크기와 무관한 상수 시간.' },
];

const STAGE_DATA = [
  { label: 'FS Replay', sub: 'challenges', color: C.fs, items: ['beta,gamma', 'alpha', 'zeta', 'nu', 'u'] },
  { label: 'Domain', sub: 'precompute', color: C.pre, items: ['Zh(z)', 'L1(z)', 'PI(z)'] },
  { label: '[F]', sub: 'linearization', color: C.f, items: ['q_commits', 'perm', '[Z]'] },
  { label: '[E]', sub: 'eval commit', color: C.e, items: ['scalar*G1'] },
  { label: 'Pairing', sub: 'O(1) verify', color: C.pair, items: ['e(LHS,[t]2)', '=e(RHS,G2)'] },
];

export default function VerifierDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STAGE_DATA.map((s, i) => {
            const x = 8 + i * 95;
            const active = step === i;
            const past = step > i;
            return (
              <g key={s.label}>
                {/* Stage box */}
                <motion.rect x={x} y={12} width={86} height={95} rx={6}
                  initial={{ opacity: 0.15 }}
                  animate={{
                    opacity: active ? 1 : past ? 0.6 : 0.18,
                    fill: active ? `${s.color}14` : `${s.color}05`,
                    stroke: s.color,
                    strokeWidth: active ? 1.8 : 0.5,
                  }}
                  transition={sp} />
                {/* Left accent bar */}
                <rect x={x} y={12} width={3.5} height={95} rx={0} fill={s.color}
                  opacity={active ? 0.85 : past ? 0.3 : 0.08} />

                {/* Title */}
                <text x={x + 46} y={28} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill={s.color}
                  opacity={active || past ? 1 : 0.25}>{s.label}</text>
                <text x={x + 46} y={39} textAnchor="middle"
                  fontSize={7.5} fill={s.color}
                  opacity={active || past ? 0.6 : 0.15}>{s.sub}</text>

                {/* Item pills */}
                {s.items.map((item, j) => (
                  <motion.g key={j}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: active ? 1 : past ? 0.45 : 0.1 }}
                    transition={{ ...sp, delay: active ? j * 0.06 : 0 }}>
                    <rect x={x + 8} y={46 + j * 14} width={70} height={12} rx={3}
                      fill={`${s.color}10`} stroke={s.color} strokeWidth={0.3} />
                    <text x={x + 43} y={46 + j * 14 + 9} textAnchor="middle"
                      fontSize={7} fill={s.color}>{item}</text>
                  </motion.g>
                ))}

                {/* Arrow to next */}
                {i < 4 && (
                  <motion.g initial={{ opacity: 0 }}
                    animate={{ opacity: past ? 0.5 : 0.06 }} transition={sp}>
                    <line x1={x + 86} y1={55} x2={x + 95} y2={55}
                      stroke={STAGE_DATA[i + 1].color} strokeWidth={0.8} />
                    <polygon
                      points={`${x + 93},52 ${x + 93},58 ${x + 97},55`}
                      fill={STAGE_DATA[i + 1].color} />
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Final result */}
          <motion.g initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: step === 4 ? 1 : 0, y: step === 4 ? 0 : 5 }}
            transition={sp}>
            <rect x={170} y={120} width={140} height={26} rx={13}
              fill="#22c55e12" stroke="#22c55e" strokeWidth={1} />
            <text x={240} y={137} textAnchor="middle"
              fontSize={10} fontWeight={700} fill="#22c55e">
              Accept / Reject
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}

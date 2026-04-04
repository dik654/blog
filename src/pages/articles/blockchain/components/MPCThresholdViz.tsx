import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const N = 7, T = 2;
const CX = 160, CY = 52, R = 38;

function pos(i: number) {
  const a = (i * 2 * Math.PI) / N - Math.PI / 2;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

const STEPS = [
  { label: `n=${N}명 참가자 배치`, body: '타원곡선 위에 n명의 MPC 참가자를 배치합니다.' },
  { label: `t=${T}명 악의적 참가자 가정`, body: `t명까지 악의적이어도 프로토콜이 안전하려면 n >= 2t+1 필요.` },
  { label: `안전 조건: ${N} >= ${2 * T + 1}`, body: `정직 ${N - T}명 > 악의적 ${T}명. n >= 2t+1 만족 — 안전 보장.` },
  { label: '임계값 서명 실행', body: `t+1 = ${T + 1}명 이상이 협력하면 유효한 서명 생성. 비밀키는 누구도 단독 소유 불가.` },
];

export default function MPCThresholdViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 320 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {Array.from({ length: N }, (_, i) => {
            const p = pos(i);
            const evil = step >= 1 && i < T;
            const signing = step === 3 && i >= T && i < T + 3;
            const c = evil ? '#ef4444' : signing ? '#f59e0b' : '#10b981';
            return (
              <g key={i}>
                <motion.circle cx={p.x} cy={p.y} r={9}
                  animate={{ fill: step >= 0 ? `${c}20` : `${c}06`,
                    stroke: c, strokeWidth: evil || signing ? 2 : 1,
                    scale: signing ? [1, 1.15, 1] : 1 }}
                  transition={signing ? { duration: 0.8, repeat: Infinity, repeatDelay: 0.5 } : sp} />
                <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={9} fontWeight={600} fill={c}>
                  P{i + 1}
                </text>
                {evil && step >= 1 && (
                  <motion.text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={9} fill="#ef4444"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>악의</motion.text>
                )}
              </g>
            );
          })}
          {/* condition */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={220} y={20} width={90} height={20} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={265} y={33} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                {N} {'≥'} {2 * T + 1} (안전)
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={220} y={52} width={90} height={16} rx={4} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={265} y={63} textAnchor="middle" fontSize={5.5} fontWeight={600} fill="#f59e0b">
                t+1 = {T + 1}명 협력 서명
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'ECDH 키 교환', body: 'Alice와 Bob이 각자 비밀 스칼라를 선택하고, 공개 점을 교환하여 동일한 공유 비밀에 도달.' },
  { label: 'Alice: 비밀 a, 공개 [a]G', body: 'Alice가 비밀 스칼라 a를 선택하고 [a]G를 Bob에게 전송한다.' },
  { label: 'Bob: 비밀 b, 공개 [b]G', body: 'Bob이 비밀 스칼라 b를 선택하고 [b]G를 Alice에게 전송한다.' },
  { label: '공유 비밀 K = [ab]G', body: 'Alice: [a]([b]G) = [ab]G. Bob: [b]([a]G) = [ab]G. 동일한 점에 도달. 도청자는 a, b 모름.' },
];

export default function KeyExchangeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Alice */}
          <rect x={30} y={25} width={70} height={30} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={1} />
          <text x={65} y={44} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>Alice</text>
          {/* Bob */}
          <rect x={320} y={25} width={70} height={30} rx={5} fill={`${C2}10`} stroke={C2} strokeWidth={1} />
          <text x={355} y={44} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>Bob</text>
          {/* Alice's secret */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={62} width={70} height={16} rx={3} fill={`${C1}08`} stroke={C1} strokeWidth={0.6} />
              <text x={65} y={74} textAnchor="middle" fontSize={10} fill={C1}>a (secret)</text>
              {/* Arrow Alice → Bob */}
              <motion.line x1={100} y1={35} x2={320} y2={35} stroke={C1} strokeWidth={0.7}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              <rect x={170} y={26} width={50} height={13} rx={2} fill="none" stroke={C1} strokeWidth={0.5} />
              <text x={195} y={36} textAnchor="middle" fontSize={10} fill={C1}>[a]G</text>
            </motion.g>
          )}
          {/* Bob's secret */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={320} y={62} width={70} height={16} rx={3} fill={`${C2}08`} stroke={C2} strokeWidth={0.6} />
              <text x={355} y={74} textAnchor="middle" fontSize={10} fill={C2}>b (secret)</text>
              {/* Arrow Bob → Alice */}
              <motion.line x1={320} y1={50} x2={100} y2={50} stroke={C2} strokeWidth={0.7}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              <rect x={170} y={44} width={50} height={13} rx={2} fill="none" stroke={C2} strokeWidth={0.5} />
              <text x={195} y={54} textAnchor="middle" fontSize={10} fill={C2}>[b]G</text>
            </motion.g>
          )}
          {/* Shared secret */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}>
              <rect x={130} y={90} width={160} height={28} rx={5} fill={`${C3}10`} stroke={C3} strokeWidth={1} />
              <text x={210} y={105} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
                K = [ab]G
              </text>
              <text x={210} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                도청자: [a]G, [b]G만 보임 — ECDLP
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

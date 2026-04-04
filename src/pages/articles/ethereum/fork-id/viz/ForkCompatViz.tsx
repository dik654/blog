import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CASES = [
  { label: '동일 체인, 동일 포크 → 허용', c: '#10b981', icon: 'O', detail: 'A: 0xfc64ec04/0 · B: 0xfc64ec04/0' },
  { label: '동일 체인, 미래 포크 인지 → 허용', c: '#10b981', icon: 'O', detail: 'A: 0xfc64ec04/0 · B: 0xfc64ec04/21000000' },
  { label: '다른 체인 (genesis 불일치) → 거부', c: '#ef4444', icon: 'X', detail: 'A: 0xfc64ec04 (ETH) · B: 0xa3f5ab08 (BSC)' },
  { label: '같은 genesis, 다른 포크 경로 → 거부', c: '#ef4444', icon: 'X', detail: 'A: 0xfc64ec04 (Cancun) · B: 0x3edd5b10 (Shanghai)' },
  { label: 'fork_next 불일치 → 조건부 거부', c: '#f59e0b', icon: '?', detail: 'A.next=21000000 · B.next=0 (모름)' },
];
const ANNOT = ['hash+next 모두 일치', '업그레이드 예정 피어', 'genesis hash 불일치', '포크 이력 분기', '소프트 거부 처리'];
const AX = 80, BX = 320, NY = 60;

export default function ForkCompatViz() {
  return (
    <StepViz steps={CASES}>
      {(step) => {
        const cs = CASES[step];
        return (
          <svg viewBox="0 0 500 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Peer A */}
            <rect x={AX - 35} y={NY - 20} width={70} height={40} rx={8}
              fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
            <text x={AX} y={NY + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">Peer A</text>
            {/* Peer B */}
            <rect x={BX - 35} y={NY - 20} width={70} height={40} rx={8}
              fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1.5} />
            <text x={BX} y={NY + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">Peer B</text>
            {/* connection line */}
            <motion.line key={`line-${step}`}
              x1={AX + 38} y1={NY} x2={BX - 38} y2={NY}
              stroke={cs.c} strokeWidth={2.5}
              strokeDasharray={cs.icon === 'X' ? '6 4' : 'none'}
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* result badge */}
            <motion.g key={`badge-${step}`}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}>
              <circle cx={200} cy={NY} r={16} fill={cs.c + '25'} stroke={cs.c} strokeWidth={1.5} />
              <text x={200} y={NY + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill={cs.c}>
                {cs.icon}
              </text>
            </motion.g>
            {/* result label */}
            <motion.text key={`rl-${step}`}
              x={200} y={NY + 38} textAnchor="middle" fontSize={9} fontWeight={600} fill={cs.c}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {cs.label.split(' → ')[1]}
            </motion.text>
            {/* fork ID detail */}
            <motion.text key={`dt-${step}`}
              x={200} y={113} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="currentColor" fillOpacity={0.45}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {cs.detail}
            </motion.text>
            {/* scenario label */}
            <motion.text key={`sl-${step}`}
              x={200} y={130} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              시나리오 {step + 1}: {cs.label.split(' → ')[0]}
            </motion.text>
            <motion.text x={405} y={70} fontSize={9} fill="var(--foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}

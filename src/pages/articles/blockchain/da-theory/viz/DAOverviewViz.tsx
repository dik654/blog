import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const STEPS = [
  { label: 'DA 문제: 블록 생산자가 데이터를 숨기면?', body: '블록 생산자가 블록 헤더만 공개하고 데이터를 숨기는 공격이 가능합니다.' },
  { label: '풀노드: 전체 다운로드로 검증', body: '풀노드는 전체 블록 데이터를 다운로드하여 가용성을 확인합니다.' },
  { label: '라이트 노드: 전체 다운로드 불가', body: '라이트 노드는 대역폭 제한으로 전체 다운로드가 불가능합니다.' },
  { label: 'DA Sampling: 랜덤 샘플로 검증', body: 'DA Sampling으로 라이트 노드도 높은 확률로 가용성을 검증합니다.' },
];

export default function DAOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Block producer */}
          <rect x={30} y={40} width={90} height={36} rx={6}
            fill={`${C[0]}0c`} stroke={C[0]} strokeWidth={1.2} />
          <text x={75} y={58} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={C[0]}>Block Producer</text>
          <text x={75} y={70} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">블록 데이터</text>
          {/* block data */}
          <rect x={150} y={28} width={80} height={16} rx={3}
            fill={`${C[0]}15`} stroke={C[0]} strokeWidth={0.8} />
          <text x={190} y={39} textAnchor="middle" fontSize={10} fill={C[0]}>Header</text>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={150} y={50} width={80} height={16} rx={3}
                fill="#ef444415" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={190} y={61} textAnchor="middle" fontSize={10} fill="#ef4444">Data ???</text>
            </motion.g>
          )}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={150} y={50} width={80} height={16} rx={3}
                fill={`${C[1]}15`} stroke={C[1]} strokeWidth={0.8} />
              <text x={190} y={61} textAnchor="middle" fontSize={10} fill={C[1]}>Data OK</text>
            </motion.g>
          )}
          {/* full node */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <rect x={270} y={24} width={80} height={28} rx={5}
                fill={`${C[1]}10`} stroke={C[1]} strokeWidth={step === 1 ? 2 : 1} />
              <text x={310} y={41} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[1]}>Full Node</text>
              <text x={310} y={16} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">전체 다운로드</text>
            </motion.g>
          )}
          {/* light node */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <rect x={270} y={65} width={80} height={28} rx={5}
                fill={step === 2 ? '#ef444410' : `${C[2]}10`}
                stroke={step === 2 ? '#ef4444' : C[2]}
                strokeWidth={step >= 2 ? 2 : 1} />
              <text x={310} y={82} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={step === 2 ? '#ef4444' : C[2]}>Light Node</text>
              <text x={310} y={103} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">
                {step === 2 ? '대역폭 부족' : 'DAS 샘플링'}
              </text>
            </motion.g>
          )}
          {/* sampling dots */}
          {step === 3 && [0, 1, 2].map((i) => (
            <motion.circle key={i} cx={260 + i * 15} cy={56} r={3}
              fill={C[2]} initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.15, type: 'spring' }} />
          ))}
        </svg>
      )}
    </StepViz>
  );
}

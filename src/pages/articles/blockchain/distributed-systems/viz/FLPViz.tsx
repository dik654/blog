import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#ef4444', C3 = '#f59e0b';

const STEPS = [
  { label: 'FLP 불가능성 정리 (1985)', body: 'Fischer, Lynch, Paterson — 비동기 시스템에서 결정적 합의는 단 하나의 장애로도 불가능.' },
  { label: '가정: 비동기 + 1개 crash fault', body: '메시지 전달 지연에 상한 없음. 프로세스 하나가 언제든 crash 가능.' },
  { label: 'Bivalent → Univalent 전환 불가', body: '어떤 상태에서 0과 1 모두 가능(bivalent). 결정적 프로토콜은 univalent로 반드시 전환해야 하지만...' },
  { label: '무한 연기(indefinite postponement)', body: '적대적 스케줄러가 메시지 지연을 조작하면, bivalent 상태를 영원히 유지 가능.' },
];

const NODES = [
  { x: 110, y: 55, label: 'P1' },
  { x: 210, y: 55, label: 'P2' },
  { x: 310, y: 55, label: 'P3' },
];

export default function FLPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Process nodes */}
          {NODES.map((n, i) => {
            const crashed = step >= 1 && i === 2;
            return (
              <motion.g key={n.label}>
                <motion.circle cx={n.x} cy={n.y} r={20}
                  fill={crashed ? `${C2}15` : `${C1}10`}
                  stroke={crashed ? C2 : C1}
                  strokeWidth={1}
                  animate={{ opacity: crashed ? 0.4 : 1 }} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={10} fontWeight={500}
                  fill={crashed ? C2 : C1}>{n.label}</text>
                {crashed && (
                  <motion.text x={n.x} y={n.y + 16} textAnchor="middle" fontSize={10}
                    fill={C2} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                    crash
                  </motion.text>
                )}
              </motion.g>
            );
          })}
          {/* Message lines */}
          <motion.g animate={{ opacity: step >= 1 ? 0.6 : 0.3 }}>
            <line x1={135} y1={55} x2={185} y2={55} stroke="var(--border)" strokeWidth={0.8}
              strokeDasharray={step >= 3 ? '4,3' : 'none'} />
            <line x1={235} y1={55} x2={285} y2={55} stroke={step >= 1 ? C2 : 'var(--border)'}
              strokeWidth={0.8} strokeDasharray="4,3" />
          </motion.g>
          {/* Bivalent state box */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={80} y={95} width={260} height={35} rx={6}
                fill={`${C3}10`} stroke={C3} strokeWidth={0.8} />
              <text x={210} y={112} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
                {step === 2 ? 'Bivalent: 결과가 0 또는 1 모두 가능한 상태' : 'Bivalent 상태를 탈출할 수 없음 → 합의 불가능'}
              </text>
              <text x={210} y={125} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                {step === 2 ? '결정적 알고리즘은 반드시 univalent로 수렴해야 함' : '해결책: 확률적 합의 (Ben-Or) 또는 부분 동기 가정'}
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

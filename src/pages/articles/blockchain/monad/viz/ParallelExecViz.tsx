import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const STEPS = [
  { label: '동시 제출', body: '모든 트랜잭션이 Fiber 풀에 동시에 제출됩니다.' },
  { label: '낙관적 실행', body: '각 트랜잭션이 현재 상태의 스냅샷으로 독립 실행됩니다.' },
  { label: '순서 대기', body: 'Promise 체인으로 이전 트랜잭션의 머지를 대기합니다.' },
  { label: '충돌 감지 & 머지', body: 'can_merge() 성공 시 머지, 실패 시 재실행합니다.' },
];

const TXS = ['Tx 0', 'Tx 1', 'Tx 2', 'Tx 3'];
const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ParallelExecViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 460 140" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
          {/* Labels */}
          <text x={30} y={10} fontSize={9} fill="currentColor" fillOpacity={0.4}
            textAnchor="middle">Fiber</text>
          <text x={130} y={10} fontSize={9} fill="currentColor" fillOpacity={0.4}
            textAnchor="middle">Execute</text>
          <text x={240} y={10} fontSize={9} fill="currentColor" fillOpacity={0.4}
            textAnchor="middle">Wait</text>
          <text x={360} y={10} fontSize={9} fill="currentColor" fillOpacity={0.4}
            textAnchor="middle">Merge</text>

          {TXS.map((tx, i) => {
            const y = 22 + i * 30;
            const c = COLORS[i];
            return (
              <motion.g key={i} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {/* Tx label */}
                <rect x={6} y={y} width={48} height={20} rx={4}
                  fill={c + '15'} stroke={c} strokeWidth={step >= 0 ? 1.2 : 0.5}
                  strokeOpacity={step >= 0 ? 0.7 : 0.2} />
                <text x={30} y={y + 13} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={c}>{tx}</text>

                {/* Execute bar */}
                <motion.rect x={70} y={y + 3} height={14} rx={3}
                  fill={c + '20'} stroke={c} strokeWidth={1}
                  strokeOpacity={step >= 1 ? 0.6 : 0.15}
                  initial={{ width: 0 }} animate={{ width: step >= 1 ? 100 : 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }} />

                {/* Wait arrow */}
                {step >= 2 && (
                  <motion.line x1={185} y1={y + 10} x2={225} y2={y + 10}
                    stroke={c} strokeWidth={1} strokeOpacity={0.5}
                    strokeDasharray="3 2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }} />
                )}

                {/* Merge box */}
                {step >= 3 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}>
                    <rect x={320} y={y + 2} width={80} height={16} rx={4}
                      fill={i === 2 ? '#f43f5e12' : c + '12'}
                      stroke={i === 2 ? '#f43f5e' : c}
                      strokeWidth={1} strokeOpacity={0.5} />
                    <text x={360} y={y + 13} textAnchor="middle"
                      fontSize={9} fill={i === 2 ? '#f43f5e' : c}>
                      {i === 2 ? 'Retry' : 'Merge OK'}
                    </text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}
        </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('monad-parallel-exec')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}

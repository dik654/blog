import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const TXS = ['TX 0', 'TX 1', 'TX 2', 'TX 3'];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

const STEPS = [
  { label: '모든 TX 낙관적 병렬 실행', body: '블록 내 모든 TX 동시 실행 시작. 사전 계정 선언 불필요' },
  { label: 'Read/Write Set 추적', body: '각 TX의 읽기/쓰기 키를 MVHashMap에 기록' },
  { label: '검증: 충돌 감지', body: 'TX 1이 읽은 값을 TX 0이 변경 → TX 1 재실행 필요' },
  { label: '재실행 & 완료', body: 'TX 1만 재실행, 나머지 검증 통과. 블록 실행 완료' },
];
const REFS = ['apt-blockstm-exec', 'apt-mvhashmap', 'apt-blockstm-exec', 'apt-blockstm-exec'];

export default function BlockSTMViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 130" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Threads</text>
            {TXS.map((tx, i) => {
              const y = 24 + i * 26;
              const conflict = step >= 2 && i === 1;
              const rerun = step === 3 && i === 1;
              const done = step === 3 && i !== 1;
              return (
                <motion.g key={i} transition={sp}>
                  <text x={10} y={y + 14} fontSize={9} fontWeight={600} fill={COLORS[i]}>{tx}</text>
                  <motion.rect x={60} y={y + 2} rx={4} height={18}
                    animate={{ width: step >= 0 ? 160 : 0,
                      fill: conflict ? '#ef444425' : rerun ? `${COLORS[i]}30` : `${COLORS[i]}18`,
                      stroke: conflict ? '#ef4444' : COLORS[i] }}
                    strokeWidth={1.5} transition={sp} />
                  <motion.text x={140} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={conflict ? '#ef4444' : COLORS[i]} animate={{ opacity: step >= 0 ? 0.8 : 0 }}>
                    {conflict ? 'CONFLICT' : rerun ? 'RE-EXECUTE' : done ? 'VALID' : 'executing...'}
                  </motion.text>
                  {step >= 2 && !conflict && (
                    <motion.text x={235} y={y + 15} fontSize={9} fill="#10b981"
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                      {step === 3 || i !== 1 ? '\u2713' : ''}
                    </motion.text>
                  )}
                  {rerun && (
                    <motion.rect x={260} y={y + 2} width={90} height={18} rx={4}
                      fill={`${COLORS[i]}30`} stroke={COLORS[i]} strokeWidth={1.5}
                      initial={{ width: 0 }} animate={{ width: 90 }} transition={sp} />
                  )}
                  {rerun && (
                    <motion.text x={305} y={y + 14} textAnchor="middle" fontSize={9}
                      fill={COLORS[i]} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>VALID</motion.text>
                  )}
                </motion.g>
              );
            })}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(REFS[step])} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}

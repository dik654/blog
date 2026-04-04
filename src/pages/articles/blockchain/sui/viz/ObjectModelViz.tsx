import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const OBJECTS = [
  { label: 'Coin A', type: 'Owned', owner: 'Alice', color: '#10b981', x: 30, y: 30 },
  { label: 'Coin B', type: 'Owned', owner: 'Bob', color: '#0ea5e9', x: 140, y: 30 },
  { label: 'DEX Pool', type: 'Shared', owner: 'Anyone', color: '#f59e0b', x: 250, y: 30 },
  { label: 'Package', type: 'Immutable', owner: 'Read-only', color: '#8b5cf6', x: 140, y: 90 },
];

const STEPS = [
  { label: '소유 객체 (Owned)', body: 'Alice/Bob의 Coin은 소유자만 접근. 독립 처리' },
  { label: '공유 객체 (Shared)', body: 'DEX Pool은 누구나 접근 → 합의로 순서 결정' },
  { label: '불변 객체 (Immutable)', body: '패키지 코드 = 배포 후 변경 불가. 읽기 전용' },
  { label: '병렬 처리 결과', body: '소유 객체 간 TX는 합의 없이 동시 실행' },
];
const REFS = ['sui-object-types', 'sui-fast-path', 'sui-object-types', 'sui-fast-path'];
const BW = 100, BH = 42;

export default function ObjectModelViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {OBJECTS.map((obj, i) => {
              const hl = (step === 0 && i <= 1) || (step === 1 && i === 2)
                || (step === 2 && i === 3) || step === 3;
              return (
                <motion.g key={i} animate={{ opacity: hl ? 1 : 0.15 }} transition={sp}>
                  <motion.rect x={obj.x} y={obj.y} width={BW} height={BH} rx={8}
                    fill={`${obj.color}15`} stroke={obj.color}
                    animate={{ strokeWidth: hl ? 2 : 1 }} transition={sp} />
                  <text x={obj.x + BW / 2} y={obj.y + 16} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={obj.color}>{obj.label}</text>
                  <text x={obj.x + BW / 2} y={obj.y + 29} textAnchor="middle"
                    fontSize={9} fill={obj.color}>{obj.type}</text>
                  <text x={obj.x + BW / 2} y={obj.y + 39} textAnchor="middle"
                    fontSize={9} fill="var(--muted-foreground)">owner: {obj.owner}</text>
                </motion.g>
              );
            })}
            {(step === 0 || step === 3) && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={20} y={80} width={240} height={18} rx={4}
                  fill="#10b98110" stroke="#10b981" strokeWidth={1} strokeDasharray="4 2" />
                <text x={140} y={92} textAnchor="middle" fontSize={9}
                  fill="#10b981" fontWeight={600}>Fast Path (no consensus)</text>
              </motion.g>
            )}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={240} y={80} width={120} height={18} rx={4}
                  fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2" />
                <text x={300} y={92} textAnchor="middle" fontSize={9}
                  fill="#f59e0b" fontWeight={600}>Consensus Path</text>
              </motion.g>
            )}
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

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const COL_SHARED = '#0ea5e9';
const COL_GLOBAL = '#f59e0b';
const COL_WIN = '#10b981';

const STEPS = [
  { label: 'n = 2^24, BLOCK_SIZE = 1024 — 24 스테이지를 두 구간으로 분할' },
  { label: '작은 스테이지 (0~9): 1024 원소를 공유 메모리에 로드' },
  { label: '__syncthreads()만으로 10개 스테이지 연속 처리 → 글로벌 R/W는 처음/끝 1회씩' },
  { label: '큰 스테이지 (10~23): stride ≥ 1024 → 다른 블록 데이터 필요 → 스테이지당 글로벌 커널 1회' },
  { label: '결과: 순수 글로벌 24회 → 하이브리드 15회 (1 + 14) → ~2x 향상' },
];

const STAGES = Array.from({ length: 24 });

export default function HybridStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Stage list */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">24 스테이지 (n=2²⁴)</text>
            {STAGES.map((_, i) => {
              const isShared = i < 10;
              const isHi = (step === 1 && isShared) || (step === 3 && !isShared) || step === 4;
              return (
                <motion.rect key={i}
                  x={20 + i * 18} y={20} width={16} height={20} rx={2}
                  fill={isShared ? COL_SHARED : COL_GLOBAL}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHi ? 0.95 : 0.45 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                />
              );
            })}
            <text x={20} y={56} fontSize={9} fill={COL_SHARED}>0~9 (공유)</text>
            <text x={200} y={56} fontSize={9} fill={COL_GLOBAL}>10~23 (글로벌)</text>
          </motion.g>

          {/* Shared memory zone */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 || step === 2 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={84} fontSize={10} fontWeight={700} fill={COL_SHARED}>
              작은 스테이지: 공유 메모리 1 커널
            </text>
            <ModuleBox x={20} y={92} w={120} h={48}
              label="Block (1024)" sub="공유 메모리" color={COL_SHARED} />
            <ActionBox x={150} y={94} w={170} h={44}
              label="10 스테이지 연속" sub="__syncthreads() ×9" color={COL_SHARED} />
            <DataBox x={328} y={104} w={130} h={28}
              label="글로벌 R/W: 처음·끝" color={COL_SHARED} outlined />
          </motion.g>

          {/* Global zone */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={156} fontSize={10} fontWeight={700} fill={COL_GLOBAL}>
              큰 스테이지: 글로벌 커널 14회
            </text>
            {[10, 11, 12, 13, 14].map((s, i) => (
              <ActionBox key={i} x={20 + i * 90} y={164} w={80} h={32}
                label={`커널 #${s}`} color={COL_GLOBAL} />
            ))}
            <text x={460} y={184} fontSize={11} fill="var(--muted-foreground)">…</text>
          </motion.g>

          {/* Performance */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <StatusBox x={20} y={206} w={200} h={28}
                label="순수 글로벌: 24회" color="#94a3b8" progress={1} />
              <StatusBox x={240} y={206} w={220} h={28}
                label="하이브리드: 15회 (~2x ↑)" color={COL_WIN} progress={0.625} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

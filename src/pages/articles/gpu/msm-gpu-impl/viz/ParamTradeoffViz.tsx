import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const COL_C = '#0ea5e9';
const COL_BUCKET = '#10b981';
const COL_WIN = '#f59e0b';
const COL_BAD = '#dc2626';

const STEPS = [
  { label: 'n = 점의 개수 (보통 2^20 ~ 2^26, 백만~수천만)' },
  { label: 'c = 윈도우 비트 수 (16~20). 2^c = 윈도우당 버킷 수, ceil(254/c) = 윈도우 수' },
  { label: 'c=22 (n=2^22일 때): 버킷 4M개, 윈도우 12개 — 메모리 폭발 위험' },
  { label: 'c=16 (실전 표준): 버킷 64K개, 윈도우 16개 — 메모리·연산 균형' },
  { label: 'c가 작으면 윈도우↑ → 반복↑, c가 크면 버킷↑ → 메모리↑ — VRAM/n에 맞춰 튜닝' },
];

interface Cand {
  c: number;
  buckets: string;
  windows: number;
  hint: string;
  color: string;
  highlight?: boolean;
}

const CANDIDATES: Cand[] = [
  { c: 12, buckets: '4K', windows: 22, hint: '윈도우 많음', color: COL_WIN },
  { c: 16, buckets: '64K', windows: 16, hint: '균형 ✓', color: COL_BUCKET, highlight: true },
  { c: 20, buckets: '1M', windows: 13, hint: '메모리 부담', color: COL_BAD },
  { c: 22, buckets: '4M', windows: 12, hint: '메모리 폭발', color: COL_BAD },
];

export default function ParamTradeoffViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Header */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">파라미터 정의</text>
            <DataBox x={20} y={20} w={100} h={26} label="n: 점 개수" color={COL_C} />
            <DataBox x={130} y={20} w={100} h={26} label="c: 윈도우 비트" color={COL_C} />
            <DataBox x={240} y={20} w={100} h={26} label="2^c: 버킷" color={COL_BUCKET} />
            <DataBox x={350} y={20} w={120} h={26} label="ceil(254/c): 윈도우" color={COL_WIN} />
          </motion.g>

          {/* Trade-off table */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={68} fontSize={10} fontWeight={700} fill="var(--foreground)">
              c 후보별 트레이드오프 (n = 2^22 기준)
            </text>
            {/* Column headers */}
            <text x={50} y={90} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">c</text>
            <text x={130} y={90} fontSize={9} fontWeight={600} fill={COL_BUCKET}>버킷 수</text>
            <text x={230} y={90} fontSize={9} fontWeight={600} fill={COL_WIN}>윈도우 수</text>
            <text x={340} y={90} fontSize={9} fontWeight={600} fill="var(--foreground)">평가</text>

            {CANDIDATES.map((cand, i) => {
              const y = 96 + i * 30;
              const isActive =
                (cand.c === 22 && step === 2) ||
                (cand.c === 16 && step >= 3) ||
                step <= 1;
              const opacity = isActive ? 1 : 0.32;
              return (
                <motion.g key={cand.c}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {cand.highlight && step >= 3 && (
                    <rect x={20} y={y} width={440} height={26} rx={4}
                      fill={COL_BUCKET + '14'} stroke={COL_BUCKET} strokeWidth={0.6} />
                  )}
                  <text x={50} y={y + 16} fontSize={10} fontWeight={700} fill={cand.color}>{cand.c}</text>
                  <text x={130} y={y + 16} fontSize={10} fontWeight={600} fill={COL_BUCKET}>{cand.buckets}</text>
                  <text x={230} y={y + 16} fontSize={10} fontWeight={600} fill={COL_WIN}>{cand.windows}</text>
                  <text x={340} y={y + 16} fontSize={10} fontWeight={600} fill={cand.color}>{cand.hint}</text>
                </motion.g>
              );
            })}
          </motion.g>

          {/* Final hint */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <ModuleBox x={20} y={222} w={440} h={32}
                label="결론: c는 GPU VRAM과 n에 따라 튜닝 — 보통 c ≈ log₂(n) 부근"
                color={COL_C} />
            </motion.g>
          )}

          {/* Hidden import keep */}
          {step < 0 && <AlertBox x={0} y={0} label="" color="#000" />}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_L1 = '#10b981';
const C_L2 = '#6366f1';
const C_L3 = '#f59e0b';
const C_DRAM = '#ef4444';

const STEPS = [
  {
    label: 'Intel/AMD 서버 CPU 캐시 계층',
    body: 'L1: core-private, 32KB+32KB, 4~5 cycle.\nL2: core-private, 512KB~1MB, 12~15 cycle.\nLLC(L3): cores 공유, 32~96MB, 40~80 cycle.',
  },
  {
    label: 'LLC가 공격 표면 — cores 사이 공유',
    body: 'LLC는 모든 core가 공유 → 다른 CPU의 메모리 접근을 관측 가능.\nPrime+Probe 공격은 LLC eviction을 측정해 victim 접근 패턴을 복원한다.',
  },
  {
    label: '레이턴시 차이로 hit/miss 판별',
    body: 'L1 ~5 / L2 ~15 / LLC ~40 / DRAM ~250 cycles.\nRDTSCP로 nano-초 측정 → 어느 level까지 캐시됐는지 정확히 구분.',
  },
];

export default function CacheHierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={20} w={120} h={42} label="Core 0" sub="L1: 32KB / 32KB" color={C_L1} />
              <ModuleBox x={180} y={20} w={120} h={42} label="Core 1" sub="L1: 32KB / 32KB" color={C_L1} />
              <ModuleBox x={320} y={20} w={120} h={42} label="Core 2" sub="L1: 32KB / 32KB" color={C_L1} />
              <ModuleBox x={40} y={72} w={120} h={36} label="L2 cache" sub="512KB ~ 1MB" color={C_L2} />
              <ModuleBox x={180} y={72} w={120} h={36} label="L2 cache" sub="512KB ~ 1MB" color={C_L2} />
              <ModuleBox x={320} y={72} w={120} h={36} label="L2 cache" sub="512KB ~ 1MB" color={C_L2} />
              <ModuleBox x={40} y={120} w={400} h={42} label="LLC (L3) — 32MB ~ 96MB" sub="cores 공유" color={C_L3} />
              <ModuleBox x={40} y={172} w={400} h={32} label="Main Memory (DRAM)" sub="200~300 cycles" color={C_DRAM} />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={20} w={120} h={36} label="공격자" sub="Core 0" color={C_DRAM} />
              <ModuleBox x={320} y={20} w={120} h={36} label="Victim TEE" sub="Core 2" color={C_L1} />
              <AlertBox x={40} y={70} w={400} h={48} label="LLC (공유 영역)" sub="이곳을 통해 cross-core 관측" color={C_L3} />
              <line x1={100} y1={56} x2={100} y2={70} stroke={C_DRAM} strokeWidth={0.7} />
              <line x1={380} y1={56} x2={380} y2={70} stroke={C_L1} strokeWidth={0.7} />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill={C_L3}>
                victim의 LLC eviction이 공격자에게 누출
              </text>
              <text x={240} y={156} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_DRAM}>
                → Prime+Probe 공격의 주 타겟
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                ['L1 hit', 5, C_L1],
                ['L2 hit', 15, C_L2],
                ['LLC hit', 40, C_L3],
                ['DRAM (miss)', 250, C_DRAM],
              ].map(([label, cycles, color], i) => {
                const y = 30 + i * 38;
                const w = (cycles as number) / 250 * 380;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <text x={40} y={y + 6} fontSize={9.5} fontWeight={600} fill={color as string}>{label as string}</text>
                    <rect x={40} y={y + 12} width={w} height={14} rx={3} fill={color as string} opacity={0.85} />
                    <text x={50 + w} y={y + 22} fontSize={9} fill="var(--foreground)">~{cycles} cycles</text>
                  </motion.g>
                );
              })}
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                RDTSCP 측정 → 어떤 level까지 hit인지 판별
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  sm: '#0ea5e9',     // sky — SM 전체
  pb: '#10b981',     // emerald — Processing Block
  fp32: '#a855f7',   // violet — FP32
  fp64: '#f59e0b',   // amber — FP64
  tc: '#ec4899',     // pink — Tensor Core
  reg: '#06b6d4',    // cyan — Register
  cache: '#84cc16',  // lime — Cache
};

const STEPS = [
  { label: 'Hopper SM 전체 구성', body: 'Processing Block × 4 (per SM).\n총 FP32 128 / FP64 64 / Tensor Core 4 / LSU 32.\nWarp Scheduler 4 + Dispatch Unit 4.' },
  { label: 'Processing Block (1/4 SM)', body: 'FP32 32 / FP64 16 / Tensor Core 1.\nLoad/Store 8 / Warp Scheduler 1 + Dispatch 1.' },
  { label: 'Register File: 64K × 32-bit', body: 'SM당 256 KB 레지스터.\n워프당 최대 255 레지스터 사용 가능.\n점유율(occupancy)의 핵심 자원.' },
  { label: 'L1 Cache + Shared: 256 KB', body: 'Ampere(A100) 192KB → Hopper(H100) 256KB.\n런타임에 공유메모리/L1 비율 분할 가능.' },
  { label: 'L2 Cache: 50 MB chip-wide', body: 'Ampere 40MB → Hopper 50MB (+25%).\n모든 SM이 공유하는 마지막 단계 캐시.\nHBM3 ↔ SM 사이의 버퍼.' },
];

function SmOverview() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sm}>
        Hopper SM (GH100) — Processing Block × 4
      </text>
      <rect x={20} y={22} width={440} height={120} rx={10} fill={C.sm + '06'} stroke={C.sm} strokeWidth={1.2} strokeDasharray="6 3" />
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
          <rect x={32 + i * 110} y={32} width={100} height={70} rx={6} fill={C.pb + '12'} stroke={C.pb} strokeWidth={0.8} />
          <text x={82 + i * 110} y={46} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.pb}>PB {i}</text>
          <text x={82 + i * 110} y={60} textAnchor="middle" fontSize={7} fill={C.fp32}>FP32 × 32</text>
          <text x={82 + i * 110} y={72} textAnchor="middle" fontSize={7} fill={C.fp64}>FP64 × 16</text>
          <text x={82 + i * 110} y={84} textAnchor="middle" fontSize={7} fill={C.tc}>TC × 1</text>
          <text x={82 + i * 110} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">LSU × 8</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill={C.reg}>Register 64K × 32b</text>
        <text x={240} y={134} textAnchor="middle" fontSize={8} fill={C.cache}>L1 + Shared = 256 KB</text>
      </motion.g>
    </g>
  );
}

function PbStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pb}>
        Processing Block (SM의 1/4)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <rect x={70} y={26} width={340} height={130} rx={10} fill={C.pb + '06'} stroke={C.pb} strokeWidth={1} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataBox x={84} y={36} w={140} h={26} label="FP32 CUDA Core" sub="× 32" color={C.fp32} outlined />
        <DataBox x={234} y={36} w={140} h={26} label="FP64 CUDA Core" sub="× 16" color={C.fp64} outlined />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <DataBox x={84} y={70} w={140} h={26} label="Tensor Core 4세대" sub="× 1 (FP8/16/TF32)" color={C.tc} outlined />
        <DataBox x={234} y={70} w={140} h={26} label="Load/Store Unit" sub="× 8" color={C.cache} outlined />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <rect x={84} y={104} width={290} height={28} rx={5} fill={C.sm + '12'} stroke={C.sm} strokeWidth={0.6} />
        <text x={229} y={118} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sm}>
          Warp Scheduler × 1 + Dispatch Unit × 1
        </text>
        <text x={229} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          매 사이클 1 워프 명령 발행
        </text>
      </motion.g>
    </g>
  );
}

function RegStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.reg}>
        Register File: 64K × 32-bit (SM당 256 KB)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={40} y={28} width={400} height={50} rx={8} fill={C.reg + '08'} stroke={C.reg} strokeWidth={1} />
        {Array.from({ length: 32 }).map((_, i) => (
          <rect key={i} x={48 + i * 12.2} y={36} width={11} height={34} rx={1.5}
            fill={C.reg + (i < 16 ? '40' : '20')} />
        ))}
        <text x={240} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.reg}>
          워프당 최대 255 reg → 너무 많이 쓰면 active warp 수 감소
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <rect x={40} y={104} width={195} height={36} rx={6} fill={C.fp32 + '08'} stroke={C.fp32} strokeWidth={0.6} />
        <text x={138} y={120} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.fp32}>저(low) reg 사용</text>
        <text x={138} y={132} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">점유율 ↑, 메모리 레이턴시 숨김</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <rect x={245} y={104} width={195} height={36} rx={6} fill={C.fp64 + '08'} stroke={C.fp64} strokeWidth={0.6} />
        <text x={343} y={120} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.fp64}>고(high) reg 사용</text>
        <text x={343} y={132} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">단일 워프 throughput ↑, occupancy ↓</text>
      </motion.g>
    </g>
  );
}

function L1Step() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cache}>
        L1 Cache + Shared Memory: 256 KB (combined)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={40} y={28} width={180} height={40} rx={6} fill={C.cache + '12'} stroke={C.cache} strokeWidth={0.8} />
        <text x={130} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cache}>Ampere (A100)</text>
        <text x={130} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">192 KB</text>
      </motion.g>
      <motion.text x={235} y={50} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>→</motion.text>
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <rect x={260} y={28} width={180} height={40} rx={6} fill={C.cache + '20'} stroke={C.cache} strokeWidth={1.2} />
        <text x={350} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cache}>Hopper (H100)</text>
        <text x={350} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">256 KB (+33%)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={40} y={84} width={400} height={48} rx={6} fill={C.cache + '06'} stroke={C.cache} strokeWidth={0.5} />
        <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cache}>
          런타임에 L1 / Shared 비율 동적 분할 (carveout)
        </text>
        <text x={240} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          shared 우선: 데이터 재사용 ↑ / L1 우선: cache miss ↓
        </text>
        <text x={240} y={126} textAnchor="middle" fontSize={8} fill={C.cache}>
          cudaFuncSetAttribute 로 커널별 설정
        </text>
      </motion.g>
    </g>
  );
}

function L2Step() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#84cc16">
        L2 Cache: 50 MB (chip-wide)
      </text>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <ModuleBox x={20} y={30} w={130} h={36} label="Ampere" sub="40 MB" color="#0ea5e9" />
      </motion.g>
      <motion.text x={165} y={50} fontSize={12} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <ModuleBox x={180} y={30} w={130} h={36} label="Hopper" sub="50 MB (+25%)" color="#10b981" />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <ModuleBox x={340} y={30} w={120} h={36} label="HBM3" sub="3.35 TB/s" color="#a855f7" />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={40} y={84} width={400} height={50} rx={6} fill="#84cc1610" stroke="#84cc16" strokeWidth={0.5} />
        <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="#84cc16">
          모든 SM 132개가 공유하는 마지막 캐시
        </text>
        <text x={240} y={113} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          HBM3 ↔ SM 사이의 데이터 버퍼
        </text>
        <text x={240} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          파티션 가능: SM별 L2 일부를 전용으로 할당
        </text>
      </motion.g>
    </g>
  );
}

const R = [SmOverview, PbStep, RegStep, L1Step, L2Step];

export default function SmStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 160" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}

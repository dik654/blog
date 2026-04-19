import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  good: '#10b981',
  warn: '#f59e0b',
  bad: '#ef4444',
  cold: '#6366f1',
  modern: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Latency 오버헤드: 캐시 히트가 핵심',
    body: 'Cache hit 0% (캐시는 평문). Cache miss 10~30% (DRAM 복호화). Write-back ~20% (암호화). 캐시 적중률 높을수록 오버헤드 감소.',
  },
  {
    label: 'SGX 2018 벤치마크: 5~20% 오버헤드',
    body: 'SPEC2006 5~20%, DRAM bandwidth ~70% 유지, Enclave entry/exit ~8,000 cycles. EPC 페이징이 가장 큰 비용.',
  },
  {
    label: 'TDX/SEV-SNP 2023: 최적화 후 2~10%',
    body: 'AES-NI 활용. 일반 워크로드 2~10%, DB 5~15%, ML inference 10~25%. SGX2/TDX는 EPC 제약 제거로 추가 개선.',
  },
  {
    label: 'EPC 크기 제약 진화',
    body: 'SGX v1: 128~256MB → EPC paging 병목. SGX v2 (Scalable): 최대 1TB. SEV/TDX: VM/TD 전체 제한 없음.',
  },
];

interface BarItem { label: string; pct: number; color: string; note?: string; }

const LATENCY: BarItem[] = [
  { label: 'Cache hit', pct: 0, color: C.good, note: '캐시는 평문' },
  { label: 'Cache miss', pct: 25, color: C.warn, note: 'DRAM 복호화' },
  { label: 'Write-back', pct: 20, color: C.warn, note: '암호화 비용' },
  { label: 'Enclave entry', pct: 35, color: C.bad, note: '~8000 cycles' },
];

const SGX_BENCH: BarItem[] = [
  { label: 'SPEC2006 (low)', pct: 5, color: C.good },
  { label: 'SPEC2006 (high)', pct: 20, color: C.warn },
  { label: 'DRAM BW loss', pct: 30, color: C.warn, note: '70% 유지' },
  { label: 'EPC paging miss', pct: 60, color: C.bad, note: '병목' },
];

const MODERN: { label: string; min: number; max: number; color: string }[] = [
  { label: '일반 워크로드', min: 2, max: 10, color: C.good },
  { label: 'Database', min: 5, max: 15, color: C.warn },
  { label: 'ML inference', min: 10, max: 25, color: C.bad },
];

function BarChart({ items, title, color }: { items: BarItem[]; title: string; color: string }) {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {items.map((it, i) => {
        const y = 30 + i * 26;
        const w = (it.pct / 60) * 280;
        return (
          <motion.g key={it.label} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <text x={140} y={y + 12} textAnchor="end" fontSize={9} fontWeight={600} fill={it.color}>
              {it.label}
            </text>
            <rect x={150} y={y + 2} width={280} height={16} rx={3} fill="var(--border)" opacity={0.18} />
            <motion.rect x={150} y={y + 2} height={16} rx={3} fill={it.color} opacity={0.85}
              initial={{ width: 0 }} animate={{ width: w }}
              transition={{ delay: 0.05 + i * 0.1, duration: 0.4 }} />
            <text x={155} y={y + 14} fontSize={8.5} fontWeight={700} fill="#fff">
              {it.pct}%
            </text>
            {it.note && (
              <text x={150 + w + 8} y={y + 14} fontSize={8} fill={C.muted}>{it.note}</text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

function ModernBench() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.modern}>
        Modern TDX/SEV-SNP (2023) — AES-NI 최적화 후
      </text>
      {MODERN.map((it, i) => {
        const y = 30 + i * 30;
        return (
          <motion.g key={it.label} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={130} y={y + 14} textAnchor="end" fontSize={10} fontWeight={600} fill={it.color}>
              {it.label}
            </text>
            <rect x={140} y={y + 4} width={260} height={20} rx={3}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={140 + (it.min / 30) * 260} y={y + 4}
              height={20} rx={3} fill={it.color} opacity={0.7}
              initial={{ width: 0 }} animate={{ width: ((it.max - it.min) / 30) * 260 }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.4 }} />
            <text x={410} y={y + 18} fontSize={9} fontWeight={700} fill={it.color}>
              {it.min}~{it.max}%
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

interface EpcGen { name: string; size: string; sizeBytes: number; status: string; color: string; }

const EPC_GENS: EpcGen[] = [
  { name: 'SGX v1', size: '128~256 MB', sizeBytes: 256, status: 'EPC paging 병목', color: C.bad },
  { name: 'SGX v2 (Scalable)', size: '최대 1 TB', sizeBytes: 1048576, status: '제약 거의 제거', color: C.warn },
  { name: 'SEV', size: 'VM 전체', sizeBytes: 8388608, status: '제한 없음', color: C.good },
  { name: 'TDX', size: 'TD 전체', sizeBytes: 8388608, status: '제한 없음', color: C.good },
];

function EpcEvolution() {
  const maxLog = Math.log2(8388608);
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">EPC 크기 제약 진화 (log scale, MB)</text>
      {EPC_GENS.map((g, i) => {
        const y = 28 + i * 25;
        const w = 60 + (Math.log2(g.sizeBytes) / maxLog) * 240;
        return (
          <motion.g key={g.name} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <text x={120} y={y + 14} textAnchor="end" fontSize={9.5} fontWeight={700} fill={g.color}>
              {g.name}
            </text>
            <motion.rect x={130} y={y + 4} height={18} rx={3} fill={g.color} opacity={0.85}
              initial={{ width: 0 }} animate={{ width: w }}
              transition={{ delay: 0.05 + i * 0.1, duration: 0.4 }} />
            <text x={140} y={y + 17} fontSize={8.5} fontWeight={700} fill="#fff">{g.size}</text>
            <text x={140 + w + 8} y={y + 17} fontSize={8} fill={C.muted}>{g.status}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function PerfOverheadViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <BarChart items={LATENCY} title="Latency 오버헤드 (캐시 효과)" color={C.cold} />}
          {step === 1 && <BarChart items={SGX_BENCH} title="SGX 2018 벤치마크" color={C.warn} />}
          {step === 2 && <ModernBench />}
          {step === 3 && <EpcEvolution />}
        </svg>
      )}
    </StepViz>
  );
}

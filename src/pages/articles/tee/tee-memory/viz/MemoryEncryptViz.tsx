import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'CPU Cache(평문) ↔ Memory Controller ↔ DRAM(암호문)' },
  { label: 'DMA 공격: DRAM을 읽어도 암호문만 획득' },
  { label: '세 방식 비교: SGX 페이지별 / SEV VM별 / TDX TD별 키' },
];

function CacheToDram({ step }: { step: number }) {
  const attack = step === 1;
  return (
    <svg viewBox="0 0 500 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* CPU Cache */}
      <motion.rect x={20} y={30} width={100} height={50} rx={6}
        animate={{ fill: '#6366f118', stroke: '#6366f1', strokeWidth: 1.5 }} transition={sp} />
      <text x={70} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">CPU Cache</text>
      <text x={70} y={65} textAnchor="middle" fontSize={10} fill="#6366f1" opacity={0.7}>평문 데이터</text>
      {/* Memory Controller */}
      <motion.rect x={175} y={30} width={110} height={50} rx={6}
        animate={{ fill: '#10b98118', stroke: '#10b981', strokeWidth: 1.5 }} transition={sp} />
      <text x={230} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Mem Controller</text>
      <text x={230} y={65} textAnchor="middle" fontSize={10} fill="#10b981" opacity={0.7}>AES Engine</text>
      {/* DRAM */}
      <motion.rect x={340} y={30} width={100} height={50} rx={6}
        animate={{ fill: attack ? '#f59e0b30' : '#f59e0b18', stroke: '#f59e0b',
          strokeWidth: attack ? 2.5 : 1.5 }} transition={sp} />
      <text x={390} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">DRAM</text>
      <text x={390} y={65} textAnchor="middle" fontSize={10} fill="#f59e0b" opacity={0.7}>암호문</text>
      {/* Arrows */}
      <motion.line x1={120} y1={55} x2={175} y2={55} stroke="#6366f1" strokeWidth={1}
        markerEnd="url(#arrowG)" animate={{ opacity: 1 }} transition={sp} />
      <motion.line x1={285} y1={55} x2={340} y2={55} stroke="#10b981" strokeWidth={1}
        markerEnd="url(#arrowO)" animate={{ opacity: 1 }} transition={sp} />
      <text x={147} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">evict</text>
      <text x={313} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">AES</text>
      {/* Attacker */}
      {attack && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
          <rect x={345} y={90} width={90} height={22} rx={4} fill="#ef444420" stroke="#ef4444" strokeWidth={1} />
          <text x={390} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">DMA 공격자</text>
          <line x1={390} y1={80} x2={390} y2={90} stroke="#ef4444" strokeWidth={1} strokeDasharray="3,2" />
        </motion.g>
      )}
      <defs>
        <marker id="arrowG" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#6366f1" />
        </marker>
        <marker id="arrowO" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#10b981" />
        </marker>
      </defs>
    </svg>
  );
}

function CompareTable() {
  const rows = [
    { name: 'SGX', scope: '페이지별', key: 'MEE 키', algo: 'AES-128' },
    { name: 'SEV', scope: 'VM별', key: 'VEK (ASID)', algo: 'AES-128-XEX' },
    { name: 'TDX', scope: 'TD별', key: 'MKTME KeyID', algo: 'AES-XTS-256' },
  ];
  const colors = ['#6366f1', '#10b981', '#f59e0b'];
  return (
    <svg viewBox="0 0 500 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {rows.map((r, i) => (
        <g key={r.name}>
          <rect x={20} y={10 + i * 30} width={460} height={24} rx={4}
            fill={`${colors[i]}10`} stroke={colors[i]} strokeWidth={0.8} />
          <text x={60} y={26 + i * 30} textAnchor="middle" fontSize={10} fontWeight={600} fill={colors[i]}>{r.name}</text>
          <text x={160} y={26 + i * 30} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.scope}</text>
          <text x={290} y={26 + i * 30} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.key}</text>
          <text x={420} y={26 + i * 30} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.algo}</text>
        </g>
      ))}
    </svg>
  );
}

export default function MemoryEncryptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => step < 2 ? <CacheToDram step={step} /> : <CompareTable />}
    </StepViz>
  );
}

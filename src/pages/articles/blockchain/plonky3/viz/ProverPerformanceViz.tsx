import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  trace: '#6366f1', merkle: '#10b981', fri: '#f59e0b', query: '#ec4899',
  plonky3: '#10b981', plonky2: '#f59e0b', halo2: '#ef4444', gpu: '#8b5cf6',
};

const STEPS = [
  { label: '① 벤치마크 환경', body: 'Keccak-AIR 10,000 hashes / AMD Ryzen 9 5950X (16 cores). 2024년 실측 기준.' },
  { label: '② Phase Breakdown (~650ms)', body: 'Trace 50ms · Merkle 200ms · FRI 300ms · Query 100ms. FRI folding 이 가장 큰 비중.' },
  { label: '③ 시스템 비교', body: 'Plonky3 650ms / Plonky2 1200ms / Halo2 5000ms. BabyBear + 2-adic FFT 가 최단. GPU 가속 시 5–10x 추가 단축 기대.' },
  { label: '④ 메모리 스케일링', body: '2^20 → 2GB · 2^22 → 8GB · 2^24 → 32GB. 31-bit BabyBear 가 254-bit BN254 대비 4x 적게 소비.' },
  { label: '⑤ 실전 Use Case', body: 'SP1 zkVM 1s/RISC-V batch · Succinct aggregation 10s/1000 proofs · Taiko zkEVM 20s/block.' },
];

const PHASES = [
  { name: 'Trace',  ms: 50,  color: C.trace },
  { name: 'Merkle', ms: 200, color: C.merkle },
  { name: 'FRI',    ms: 300, color: C.fri },
  { name: 'Query',  ms: 100, color: C.query },
];
const TOTAL = PHASES.reduce((s, p) => s + p.ms, 0);

const SYSTEMS = [
  { name: 'Plonky3 (BabyBear)',   ms: 650,  color: C.plonky3 },
  { name: 'Plonky2 (Goldilocks)', ms: 1200, color: C.plonky2 },
  { name: 'Halo2 (BN254)',        ms: 5000, color: C.halo2 },
];

const MEM = [
  { rows: '2^20', gb: 2,  color: C.trace },
  { rows: '2^22', gb: 8,  color: C.merkle },
  { rows: '2^24', gb: 32, color: C.halo2 },
];

const CASES = [
  { title: 'SP1 zkVM',         metric: '1s',  sub: 'per RISC-V batch',   color: C.plonky3 },
  { title: 'Succinct Agg.',    metric: '10s', sub: '1000 proofs',        color: C.fri },
  { title: 'Taiko zkEVM',      metric: '20s', sub: 'per block',          color: C.gpu },
];

function Step1() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.rect x={40} y={30} width={400} height={60} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${C.trace}10`} stroke={C.trace} strokeWidth={1.2} />
      <text x={240} y={52} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.trace}>Benchmark</text>
      <text x={240} y={70} textAnchor="middle" fontSize={9} fill="#cbd5e1">Keccak-AIR · 10,000 hashes</text>
      <text x={240} y={84} textAnchor="middle" fontSize={8} fill="#94a3b8">Plonky3 v2024 reference build</text>

      <motion.rect x={40} y={110} width={400} height={60} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        fill={`${C.merkle}10`} stroke={C.merkle} strokeWidth={1.2} />
      <text x={240} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.merkle}>Hardware</text>
      <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#cbd5e1">AMD Ryzen 9 5950X · 16 cores / 32 threads</text>
      <text x={240} y={164} textAnchor="middle" fontSize={8} fill="#94a3b8">single-node, AVX2 enabled</text>
    </svg>
  );
}

function Step2() {
  const W = 420, X0 = 30;
  let acc = 0;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#e2e8f0">
        Total ≈ {TOTAL}ms
      </text>
      {PHASES.map((p, i) => {
        const w = (p.ms / TOTAL) * W;
        const x = X0 + acc;
        acc += w;
        return (
          <g key={p.name}>
            <motion.rect x={x} y={70} width={w} height={36} rx={3}
              initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              style={{ transformOrigin: `${x}px 88px` }}
              fill={`${p.color}30`} stroke={p.color} strokeWidth={1.2} />
            <text x={x + w / 2} y={92} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={p.color}>{p.ms}ms</text>
            <text x={x + w / 2} y={56} textAnchor="middle" fontSize={8} fill={p.color}>{p.name}</text>
            <line x1={x + w / 2} y1={60} x2={x + w / 2} y2={68}
              stroke={p.color} strokeWidth={0.8} opacity={0.6} />
          </g>
        );
      })}
      <text x={X0} y={130} fontSize={8} fill="#94a3b8">0ms</text>
      <text x={X0 + W} y={130} textAnchor="end" fontSize={8} fill="#94a3b8">{TOTAL}ms</text>

      <text x={240} y={160} textAnchor="middle" fontSize={9} fill="#cbd5e1">
        FRI folding 이 전체의 ~46%
      </text>
      <text x={240} y={176} textAnchor="middle" fontSize={8} fill="#94a3b8">
        Trace 8% · Merkle 31% · FRI 46% · Query 15%
      </text>
    </svg>
  );
}

function Step3() {
  const X0 = 130, W_MAX = 280, MS_MAX = 5000;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {SYSTEMS.map((s, i) => {
        const w = (s.ms / MS_MAX) * W_MAX;
        const y = 30 + i * 40;
        return (
          <g key={s.name}>
            <text x={X0 - 6} y={y + 16} textAnchor="end" fontSize={8.5}
              fontWeight={600} fill={s.color}>{s.name}</text>
            <motion.rect x={X0} y={y + 4} width={w} height={22} rx={3}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.1 + i * 0.18, duration: 0.5 }}
              style={{ transformOrigin: `${X0}px ${y + 15}px` }}
              fill={`${s.color}30`} stroke={s.color} strokeWidth={1.2} />
            <text x={X0 + w + 6} y={y + 19} fontSize={9}
              fontWeight={700} fill={s.color}>{s.ms}ms</text>
          </g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={30} y={155} width={420} height={32} rx={6}
          fill={`${C.gpu}10`} stroke={C.gpu} strokeWidth={1} strokeDasharray="3 2" />
        <text x={42} y={168} fontSize={8.5} fontWeight={700} fill={C.gpu}>GPU acceleration (future)</text>
        <text x={42} y={180} fontSize={7.5} fill="#cbd5e1">CUDA NTT · Poseidon2 AVX-512 · multi-GPU</text>
        <text x={400} y={176} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.gpu}>5–10x</text>
        <text x={400} y={184} textAnchor="middle" fontSize={6.5} fill={C.gpu}>speedup</text>
      </motion.g>
    </svg>
  );
}

function Step4() {
  const X0 = 70, W_MAX = 320, GB_MAX = 32;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#e2e8f0">
        Trace size → RAM 사용량
      </text>
      {MEM.map((m, i) => {
        const w = (m.gb / GB_MAX) * W_MAX;
        const y = 40 + i * 38;
        return (
          <g key={m.rows}>
            <text x={X0 - 6} y={y + 15} textAnchor="end" fontSize={9}
              fontWeight={700} fill={m.color}>{m.rows}</text>
            <motion.rect x={X0} y={y + 3} width={w} height={20} rx={3}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              style={{ transformOrigin: `${X0}px ${y + 13}px` }}
              fill={`${m.color}30`} stroke={m.color} strokeWidth={1.2} />
            <text x={X0 + w + 6} y={y + 17} fontSize={9}
              fontWeight={700} fill={m.color}>{m.gb}GB</text>
          </g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <line x1={X0} y1={170} x2={X0 + W_MAX} y2={170}
          stroke={C.gpu} strokeWidth={1} strokeDasharray="4 2" opacity={0.6} />
        <text x={X0 + 6} y={184} fontSize={8} fontWeight={700} fill={C.gpu}>BabyBear (31-bit)</text>
        <text x={X0 + W_MAX - 6} y={184} textAnchor="end" fontSize={8} fontWeight={700} fill={C.halo2}>
          BN254 → 4x 더 큼
        </text>
        <polygon points={`${X0 + W_MAX},170 ${X0 + W_MAX - 8},166 ${X0 + W_MAX - 8},174`} fill={C.halo2} />
      </motion.g>
    </svg>
  );
}

function Step5() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill="#e2e8f0">
        실전 zkVM / Aggregation / zkEVM
      </text>
      {CASES.map((c, i) => {
        const x = 25 + i * 150;
        return (
          <motion.g key={c.title}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.18 }}>
            <rect x={x} y={50} width={130} height={120} rx={10}
              fill={`${c.color}10`} stroke={c.color} strokeWidth={1.2} />
            <text x={x + 65} y={75} textAnchor="middle" fontSize={10}
              fontWeight={700} fill={c.color}>{c.title}</text>
            <line x1={x + 20} y1={86} x2={x + 110} y2={86}
              stroke={c.color} strokeWidth={0.6} opacity={0.4} />
            <text x={x + 65} y={122} textAnchor="middle" fontSize={22}
              fontWeight={800} fill={c.color}>{c.metric}</text>
            <text x={x + 65} y={148} textAnchor="middle" fontSize={8} fill="#cbd5e1">{c.sub}</text>
          </motion.g>
        );
      })}
      <text x={240} y={188} textAnchor="middle" fontSize={8} fill="#94a3b8">
        Plonky3 → 실서비스 zk 인프라의 핵심 prover
      </text>
    </svg>
  );
}

export default function ProverPerformanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        step === 0 ? <Step1 /> :
        step === 1 ? <Step2 /> :
        step === 2 ? <Step3 /> :
        step === 3 ? <Step4 /> :
        <Step5 />
      )}
    </StepViz>
  );
}

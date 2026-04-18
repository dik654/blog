import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  p: '#10b981',
  t: '#6366f1',
  d: '#f59e0b',
  rf: '#ec4899',
  rp: '#8b5cf6',
  bn: '#ef4444',
  fg: '#94a3b8',
};

const PARAMS = [
  { key: 'p', label: 'p', sub: 'prime field', val: '2³¹−2²⁷+1', color: C.p },
  { key: 't', label: 't', sub: 'state width', val: '16', color: C.t },
  { key: 'd', label: 'd', sub: 'S-box deg', val: '7', color: C.d },
  { key: 'RF', label: 'R_F', sub: 'full rounds', val: '8', color: C.rf },
  { key: 'RP', label: 'R_P', sub: 'partial rounds', val: '12', color: C.rp },
];

const FIELDS = [
  { name: 'BabyBear', d: 7, p: 'p−1=2²⁷·k', note: 'smallest valid d', color: C.p },
  { name: 'Goldilocks', d: 7, p: 'p−1=2³²·k', note: 'gcd(7, p−1)=1', color: C.d },
  { name: 'BN254', d: 5, p: 'p−1=2²⁸·k', note: 'on-chain efficient', color: C.bn },
];

const CONFIGS = [
  { name: 'BabyBear', t: 16, d: 7, ns: 300, label: '~300 ns', color: C.p, use: 'recursion proof' },
  { name: 'Goldilocks', t: 12, d: 7, ns: 500, label: '~500 ns', color: C.d, use: 'STARK 64-bit' },
  { name: 'BN254', t: 3, d: 5, ns: 5000, label: '~5 μs', color: C.bn, use: 'on-chain verify' },
];

const STEPS = [
  { label: '① Poseidon2 5개 핵심 파라미터',
    body: 'p (prime field), t (state width), d (S-box degree), R_F (full rounds), R_P (partial rounds).\n각 박스를 클릭하면 BabyBear 의 구체값을 표시.' },
  { label: '② S-box degree 선택 규칙: d≥3 ∧ gcd(d, p−1)=1',
    body: 'BabyBear=7, Goldilocks=7, BN254=5 — 각 필드에서 bijection 을 만족하는 가장 작은 d 가 선택됨.' },
  { label: '③ MDS matrix: Poseidon1 Cauchy vs Poseidon2 diagonal',
    body: 'Poseidon1 은 dense Cauchy 행렬로 강한 diffusion 을 얻지만 t² 곱셈 비용.\nPoseidon2 는 diagonal+1 구조로 t 곱셈만으로 충분한 diffusion 을 확보.' },
  { label: '④ Tradeoff 삼각형: rounds × width × degree',
    body: 'rounds 多 → 안전·느림 / width 多 → parallelism / degree 高 → rounds 少 but per-round cost 高.' },
  { label: '⑤ Plonky3 typical configs — 성능 비교',
    body: 'BabyBear t=16 d=7 ≈ 300 ns / Goldilocks t=12 d=7 ≈ 500 ns / BN254 t=3 d=5 ≈ 5 μs.' },
];

export default function Poseidon2ParamsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <Step1 />;
        if (step === 1) return <Step2 />;
        if (step === 2) return <Step3 />;
        if (step === 3) return <Step4 />;
        return <Step5 />;
      }}
    </StepViz>
  );
}

function Step1() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="w-full max-w-2xl space-y-3">
      <p className="text-[11px] font-mono text-foreground/50 text-center">Poseidon2 파라미터 — 박스 클릭 시 BabyBear 구체값 표시</p>
      <div className="grid grid-cols-5 gap-2">
        {PARAMS.map((p, i) => (
          <motion.button key={p.key} whileHover={{ scale: 1.04 }} onClick={() => setSel(sel === i ? null : i)}
            className="rounded-lg border px-2 py-3 flex flex-col items-center"
            style={{ borderColor: sel === i ? p.color : p.color + '40', background: sel === i ? p.color + '20' : p.color + '08' }}>
            <span className="font-mono text-base font-bold" style={{ color: p.color }}>{p.label}</span>
            <span className="text-[9px] text-foreground/60 mt-1">{p.sub}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel !== null && (
          <motion.div key={sel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-lg border p-3 text-center"
            style={{ borderColor: PARAMS[sel].color + '50', background: PARAMS[sel].color + '10' }}>
            <p className="text-xs font-mono" style={{ color: PARAMS[sel].color }}>
              BabyBear: {PARAMS[sel].label} = <strong>{PARAMS[sel].val}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Step2() {
  return (
    <div className="w-full max-w-2xl space-y-3">
      <p className="text-[11px] font-mono text-foreground/50 text-center">d ≥ 3 ∧ gcd(d, p−1) = 1 → bijection 보장</p>
      <div className="grid grid-cols-3 gap-3">
        {FIELDS.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-lg border p-3 flex flex-col items-center"
            style={{ borderColor: f.color + '50', background: f.color + '08' }}>
            <p className="text-xs font-mono font-bold" style={{ color: f.color }}>{f.name}</p>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-[10px] font-mono text-foreground/60">d =</span>
              <span className="text-2xl font-bold font-mono" style={{ color: f.color }}>{f.d}</span>
            </div>
            <p className="text-[9px] font-mono text-foreground/50">{f.p}</p>
            <p className="text-[9px] text-foreground/60 mt-1 text-center">{f.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Step3() {
  const N = 4;
  const cell = 22;
  const drawMat = (filled: (i: number, j: number) => boolean, color: string, label: string, sub: string) => (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-mono font-bold" style={{ color }}>{label}</p>
      <svg viewBox={`0 0 ${N * cell + 4} ${N * cell + 4}`} className="w-32 h-32">
        {Array.from({ length: N }).map((_, i) =>
          Array.from({ length: N }).map((_, j) => {
            const on = filled(i, j);
            return (
              <motion.rect key={`${i}-${j}`} x={2 + j * cell} y={2 + i * cell} width={cell - 2} height={cell - 2}
                rx={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (i * N + j) * 0.02 }}
                fill={on ? color + '90' : color + '10'} stroke={color + '40'} strokeWidth={0.5} />
            );
          })
        )}
      </svg>
      <p className="text-[9px] text-foreground/60 text-center max-w-[140px]">{sub}</p>
    </div>
  );
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-3">
      <p className="text-[11px] font-mono text-foreground/50 text-center">MDS matrix 비교 — 같은 diffusion, 다른 비용</p>
      <div className="flex gap-8 justify-center items-start">
        {drawMat(() => true, C.t, 'Poseidon1 Cauchy', 'dense — t² 곱셈, 강한 diffusion')}
        {drawMat((i, j) => i === j || (i === 0 && j === 1), C.p, 'Poseidon2 diagonal', 'sparse — t 곱셈, 같은 보안 수준')}
      </div>
    </div>
  );
}

function Step4() {
  const cx = 240, cy = 110, r = 80;
  const ang = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const verts = [
    { label: 'rounds', sub: '안전·느림', color: C.rf, deg: 0 },
    { label: 'width', sub: 'parallelism', color: C.t, deg: 120 },
    { label: 'degree', sub: 'rounds↓ cost↑', color: C.d, deg: 240 },
  ].map(v => ({ ...v, x: cx + r * Math.cos(ang(v.deg)), y: cy + r * Math.sin(ang(v.deg)) }));
  return (
    <div className="w-full max-w-2xl">
      <p className="text-[11px] font-mono text-foreground/50 text-center mb-1">Poseidon2 파라미터 tradeoff</p>
      <svg viewBox="0 0 480 220" className="w-full">
        <motion.polygon points={verts.map(v => `${v.x},${v.y}`).join(' ')}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          fill={C.fg + '08'} stroke={C.fg + '40'} strokeWidth={1} strokeDasharray="3 3" />
        {verts.map((v, i) => (
          <g key={i}>
            <motion.circle cx={v.x} cy={v.y} r={6} fill={v.color}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} />
            <text x={v.x} y={v.y - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={v.color}>{v.label}</text>
            <text x={v.x} y={v.y + 22} textAnchor="middle" fontSize={9} fill={C.fg}>{v.sub}</text>
          </g>
        ))}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fill={C.fg + 'a0'}>balance</text>
      </svg>
    </div>
  );
}

function Step5() {
  const maxNs = 5000;
  return (
    <div className="w-full max-w-2xl space-y-3">
      <p className="text-[11px] font-mono text-foreground/50 text-center">Plonky3 typical Poseidon2 configs</p>
      <div className="grid grid-cols-3 gap-3">
        {CONFIGS.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-lg border p-3 flex flex-col items-center"
            style={{ borderColor: c.color + '50', background: c.color + '08' }}>
            <p className="text-xs font-mono font-bold" style={{ color: c.color }}>{c.name}</p>
            <p className="text-[10px] font-mono text-foreground/60 mt-1">t={c.t}, d={c.d}</p>
            <p className="text-base font-bold font-mono mt-2" style={{ color: c.color }}>{c.label}</p>
            <p className="text-[9px] text-foreground/60 mt-1 text-center">{c.use}</p>
          </motion.div>
        ))}
      </div>
      <div className="rounded-lg border p-3 space-y-2" style={{ borderColor: C.fg + '30' }}>
        <p className="text-[10px] font-mono text-foreground/50 text-center">log-scale 시간 비교 (lower = faster)</p>
        {CONFIGS.map((c, i) => {
          const w = (Math.log10(c.ns) / Math.log10(maxNs)) * 100;
          return (
            <div key={c.name} className="flex items-center gap-2">
              <span className="text-[10px] font-mono w-20" style={{ color: c.color }}>{c.name}</span>
              <div className="flex-1 h-4 rounded bg-muted/40 overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="h-full rounded" style={{ background: c.color + 'b0' }} />
              </div>
              <span className="text-[10px] font-mono w-14 text-right" style={{ color: c.color }}>{c.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

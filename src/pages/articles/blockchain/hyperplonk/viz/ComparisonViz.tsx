import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ── colors ── */
const PLONK_C = '#6366f1';   // indigo
const HYPER_C = '#10b981';   // emerald
const WARN_C  = '#f59e0b';   // amber

/* ── Step 0: pipeline nodes ── */
const PLONK_PIPE = ['Circuit', 'R1CS', 'Univariate', 'FFT', 'KZG'];
const HYPER_PIPE = ['Circuit', 'MLE', 'Sumcheck', 'Multilinear PCS'];

/* ── Step 1: bar chart data ── */
const BARS = [
  { label: 'Prover', plonk: 30, hyper: 10, unit: 's', max: 35 },
  { label: 'Proof size', plonk: 700, hyper: 5000, unit: 'B', max: 6000, fmt: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}KB` : `${v}B` },
  { label: 'Verify', plonk: 2, hyper: 5, unit: 'ms', max: 6 },
];

/* ── Step 2: decision cards ── */
const DECISIONS = [
  { when: 'FFT 병목', pick: 'HyperPLONK', color: HYPER_C, reason: 'sumcheck O(n)' },
  { when: '작은 증명 크기', pick: 'PLONK', color: PLONK_C, reason: 'KZG O(1)' },
  { when: '투명 셋업', pick: 'HyperPLONK', color: HYPER_C, reason: 'Dory PCS' },
  { when: '성숙한 생태계', pick: 'PLONK', color: PLONK_C, reason: 'Halo2, gnark' },
];

const STEPS = [
  {
    label: '파이프라인 비교 — PLONK vs HyperPLONK',
    body: 'PLONK: 단변수 다항식 + FFT + KZG.\nHyperPLONK: 다중선형 확장(MLE) + sumcheck + multilinear PCS. FFT 제거.',
  },
  {
    label: '성능 비교 — Prover / Proof / Verify',
    body: 'Prover: sumcheck이 FFT 대비 3배 빠름.\n증명 크기: KZG O(1) vs Dory O(log²n).\n검증: KZG pairing 2회 vs sumcheck 로그 라운드.',
  },
  {
    label: '선택 기준 — 언제 어떤 시스템을 쓸까',
    body: 'FFT 병목·투명 셋업 → HyperPLONK.\n작은 증명·검증 속도·성숙한 도구 → PLONK.',
  },
];

/* ── pipeline renderer (Step 0) ── */
function PipelineSVG() {
  const BW = 68, BH = 26, GAP = 10, OY_P = 35, OY_H = 100;

  const renderPipe = (nodes: string[], color: string, oy: number, label: string) => {
    const totalW = nodes.length * BW + (nodes.length - 1) * GAP;
    const ox = (480 - totalW) / 2;
    return (
      <g>
        {/* pipeline label */}
        <text x={240} y={oy - 10} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={color}>{label}</text>
        {nodes.map((n, i) => {
          const x = ox + i * (BW + GAP);
          return (
            <g key={n}>
              <motion.rect x={x} y={oy} width={BW} height={BH} rx={5}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ ...sp, delay: i * 0.08 }}
                fill={`${color}18`} stroke={color} strokeWidth={1.2} />
              <motion.text x={x + BW / 2} y={oy + BH / 2 + 4} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={color}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: i * 0.08 + 0.1 }}>
                {n}
              </motion.text>
              {/* arrow */}
              {i > 0 && (
                <motion.line
                  x1={x - GAP + 2} y1={oy + BH / 2}
                  x2={x - 2} y2={oy + BH / 2}
                  stroke={color} strokeWidth={1}
                  markerEnd="none"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                  transition={{ ...sp, delay: i * 0.08 }} />
              )}
              {/* arrowhead */}
              {i > 0 && (
                <motion.polygon
                  points={`${x - 2},${oy + BH / 2 - 3} ${x - 2},${oy + BH / 2 + 3} ${x + 2},${oy + BH / 2}`}
                  fill={color}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                  transition={{ ...sp, delay: i * 0.08 }} />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* divider */}
      <line x1={30} y1={80} x2={450} y2={80}
        stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={14} y={84} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">vs</text>
      {renderPipe(PLONK_PIPE, PLONK_C, OY_P, 'PLONK')}
      {renderPipe(HYPER_PIPE, HYPER_C, OY_H, 'HyperPLONK')}
    </svg>
  );
}

/* ── bar chart renderer (Step 1) ── */
function BarChartSVG() {
  const BAR_MAX_W = 220, BAR_H = 14, GAP = 44, X0 = 80, Y0 = 16;

  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {BARS.map((b, i) => {
        const y = Y0 + i * GAP;
        const fmt = b.fmt ?? ((v: number) => `${v}${b.unit}`);
        const plonkW = Math.max((b.plonk / b.max) * BAR_MAX_W, 6);
        const hyperW = Math.max((b.hyper / b.max) * BAR_MAX_W, 6);
        const plonkBetter = b.plonk <= b.hyper;
        return (
          <g key={b.label}>
            <text x={X0 - 8} y={y + BAR_H} textAnchor="end"
              fontSize={10} fontWeight={600} fill="var(--foreground)">{b.label}</text>
            {/* PLONK bar */}
            <motion.rect x={X0} y={y} rx={3}
              initial={{ width: 0 }} animate={{ width: plonkW }}
              height={BAR_H} fill={`${PLONK_C}80`} transition={sp} />
            <motion.text x={X0 + plonkW + 5} y={y + 11}
              fontSize={9} fontWeight={500} fill={PLONK_C}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: 0.2 }}>
              {fmt(b.plonk)} {plonkBetter ? '✓' : ''}
            </motion.text>
            {/* HyperPLONK bar */}
            <motion.rect x={X0} y={y + BAR_H + 3} rx={3}
              initial={{ width: 0 }} animate={{ width: hyperW }}
              height={BAR_H} fill={`${HYPER_C}80`} transition={sp} />
            <motion.text x={X0 + hyperW + 5} y={y + BAR_H + 14}
              fontSize={9} fontWeight={500} fill={HYPER_C}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: 0.25 }}>
              {fmt(b.hyper)} {!plonkBetter ? '✓' : ''}
            </motion.text>
          </g>
        );
      })}
      {/* Legend */}
      <rect x={X0} y={148} width={10} height={7} rx={2} fill={`${PLONK_C}80`} />
      <text x={X0 + 14} y={155} fontSize={8} fill="var(--muted-foreground)">PLONK</text>
      <rect x={X0 + 60} y={148} width={10} height={7} rx={2} fill={`${HYPER_C}80`} />
      <text x={X0 + 74} y={155} fontSize={8} fill="var(--muted-foreground)">HyperPLONK</text>
    </svg>
  );
}

/* ── decision cards renderer (Step 2) ── */
function DecisionSVG() {
  const CW = 100, CH = 48, GAP = 12, OY = 30;
  const totalW = DECISIONS.length * CW + (DECISIONS.length - 1) * GAP;
  const ox = (480 - totalW) / 2;

  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* header */}
      <text x={240} y={16} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={WARN_C}>선택 기준</text>
      {DECISIONS.map((d, i) => {
        const x = ox + i * (CW + GAP);
        return (
          <g key={d.when}>
            {/* card bg */}
            <motion.rect x={x} y={OY} width={CW} height={CH} rx={6}
              initial={{ opacity: 0, y: OY + 10 }}
              animate={{ opacity: 1, y: OY }}
              transition={{ ...sp, delay: i * 0.1 }}
              fill={`${d.color}10`} stroke={d.color} strokeWidth={1} />
            {/* "when" label */}
            <motion.text x={x + CW / 2} y={OY + 16} textAnchor="middle"
              fontSize={9} fontWeight={600} fill="var(--foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: i * 0.1 + 0.05 }}>
              {d.when}
            </motion.text>
            {/* arrow down */}
            <motion.line x1={x + CW / 2} y1={OY + 22} x2={x + CW / 2} y2={OY + 28}
              stroke={d.color} strokeWidth={0.8}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ ...sp, delay: i * 0.1 + 0.1 }} />
            {/* pick label */}
            <motion.text x={x + CW / 2} y={OY + 38} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={d.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: i * 0.1 + 0.12 }}>
              → {d.pick}
            </motion.text>
            {/* reason under card */}
            <motion.text x={x + CW / 2} y={OY + CH + 14} textAnchor="middle"
              fontSize={8} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: i * 0.1 + 0.15 }}>
              {d.reason}
            </motion.text>
          </g>
        );
      })}
      {/* bottom summary */}
      <text x={240} y={148} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)">
        Zeromorph: KZG + MLE 결합 → 두 세계의 장점 수렴 중
      </text>
    </svg>
  );
}

export default function ComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <PipelineSVG />;
        if (step === 1) return <BarChartSVG />;
        return <DecisionSVG />;
      }}
    </StepViz>
  );
}

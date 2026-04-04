import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 벡터' },
  { label: '결합 [h_{t-1}, x_t]' },
  { label: 'Forget Gate (σ → 0~1)' },
  { label: 'Input Gate (σ × tanh)' },
  { label: 'C_t = old×f + new' },
];
const BODY = [
  'h_{t-1}과 x_t가 게이트 입력',
  'concat → 단일 입력 벡터',
  'σ: 0이면 잊고, 1이면 유지',
  'σ 저장비율 × tanh 후보값',
  'old×forget + new로 셀 갱신',
];

const RAW = [0.8, -0.6, 0.3, -0.9, 0.5];
const SIG = RAW.map(v => 1 / (1 + Math.exp(-v * 3)));
const TNH = RAW.map(v => Math.tanh(v * 2));
const OLD_C = [0.4, 0.7, -0.2, 0.5, -0.3];
const NEW_C = OLD_C.map((c, i) => c * SIG[i] + SIG[i] * TNH[i]);

const BW = 18, BG = 6, BY = 100, SC = 50;
const bx = (i: number, gx: number) => gx + i * (BW + BG);
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

type BP = { gx: number; vals: number[]; color: string; step: number; at: number };
function Bars({ gx, vals, color, step, at }: BP) {
  const a = step === at, d = step > at;
  return <g>{vals.map((v, i) => (
    <motion.rect key={i} x={bx(i, gx)} width={BW} rx={2} transition={sp} animate={{
      y: v >= 0 ? BY - v * SC : BY, height: Math.abs(v) * SC,
      fill: a ? color : d ? `${color}66` : `${color}22`, opacity: a ? 1 : d ? 0.5 : 0.2,
    }} />
  ))}</g>;
}

const GROUPS: { minStep: number; gx: number; vals: number[]; color: string; at: number; lbl: string }[] = [
  { minStep: 1, gx: 20, vals: RAW, color: '#818cf8', at: 1, lbl: '[h, x]' },
  { minStep: 2, gx: 150, vals: SIG, color: '#ef4444', at: 2, lbl: 'σ (0~1)' },
  { minStep: 3, gx: 280, vals: TNH.map((t, i) => t * SIG[i]), color: '#10b981', at: 3, lbl: 'σ × tanh' },
  { minStep: 4, gx: 400, vals: NEW_C, color: '#8b5cf6', at: 4, lbl: 'C_t' },
];

export default function GateFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 600 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <line x1={10} y1={BY} x2={470} y2={BY} stroke="var(--border)" strokeWidth={1} />
          <text x={6} y={BY - SC + 3} fontSize={9} fill="var(--muted-foreground)">1</text>
          <text x={2} y={BY + SC + 3} fontSize={9} fill="var(--muted-foreground)">-1</text>
          {/* Step 0: split inputs */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Bars gx={20} vals={RAW.slice(0, 3)} color="#0ea5e9" step={0} at={0} />
              <text x={48} y={155} textAnchor="middle" fontSize={9} fill="#0ea5e9">h_{'{t-1}'}</text>
              <Bars gx={100} vals={RAW.slice(2)} color="#6366f1" step={0} at={0} />
              <text x={130} y={155} textAnchor="middle" fontSize={9} fill="#6366f1">x_t</text>
            </motion.g>
          )}
          {/* Groups 1-4 */}
          {GROUPS.map(g => step >= g.minStep && (
            <g key={g.lbl}>
              <Bars gx={g.gx} vals={g.vals} color={g.color} step={step} at={g.at} />
              {step === g.at && <text x={g.gx + 55} y={155} textAnchor="middle" fontSize={9} fill={g.color}>{g.lbl}</text>}
            </g>
          ))}
          {/* S-curve icon for sigmoid step */}
          {step === 2 && (
            <motion.path d="M148,35 Q160,35 165,50 Q170,65 182,65" fill="none" stroke="#ef4444" strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          )}
          {/* Flow arrows */}
          {step >= 2 && <line x1={135} y1={90} x2={148} y2={90} stroke="var(--border)" strokeWidth={1} markerEnd="url(#ga)" />}
          {step >= 3 && <line x1={268} y1={90} x2={278} y2={90} stroke="var(--border)" strokeWidth={1} markerEnd="url(#ga)" />}
          {step >= 4 && <motion.path d="M270,90 L395,90" fill="none" stroke="#8b5cf6" strokeWidth={1.5}
            strokeDasharray="4 3" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />}
          <defs><marker id="ga" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
            <path d="M0,0 L6,2 L0,4" fill="var(--border)" /></marker></defs>
          <motion.text x={490} y={100} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}

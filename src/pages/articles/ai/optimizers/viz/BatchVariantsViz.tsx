import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import {
  STEPS, BATCH_LOSS, SGD_LOSS, MINIBATCH_LOSS, COLORS,
} from './BatchVariantsVizData';

const W = 420, H = 200, PAD = { l: 44, r: 16, t: 20, b: 30 };
const gW = W - PAD.l - PAD.r, gH = H - PAD.t - PAD.b;
const maxE = 5, maxL = 48;

function toX(e: number) { return PAD.l + (e / maxE) * gW; }
function toY(l: number) { return PAD.t + (1 - l / maxL) * gH; }

function pathD(pts: { epoch: number; loss: number }[]) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.epoch).toFixed(1)},${toY(p.loss).toFixed(1)}`).join(' ');
}

const DATASETS = [
  { data: BATCH_LOSS, color: COLORS.batch, label: 'Batch' },
  { data: SGD_LOSS, color: COLORS.sgd, label: 'SGD' },
  { data: MINIBATCH_LOSS, color: COLORS.mini, label: 'Mini-batch' },
];

function Axes() {
  const yTicks = [0, 12, 24, 36, 48];
  const xTicks = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b}
        stroke="var(--border)" strokeWidth={0.8} />
      <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b}
        stroke="var(--border)" strokeWidth={0.8} />
      {yTicks.map(v => (
        <g key={`y${v}`}>
          <line x1={PAD.l - 3} y1={toY(v)} x2={PAD.l} y2={toY(v)}
            stroke="var(--border)" strokeWidth={0.6} />
          <text x={PAD.l - 6} y={toY(v) + 3} textAnchor="end"
            fontSize={9} fill="var(--muted-foreground)">{v}</text>
        </g>
      ))}
      {xTicks.map(v => (
        <g key={`x${v}`}>
          <line x1={toX(v)} y1={H - PAD.b} x2={toX(v)} y2={H - PAD.b + 3}
            stroke="var(--border)" strokeWidth={0.6} />
          <text x={toX(v)} y={H - PAD.b + 14} textAnchor="middle"
            fontSize={9} fill="var(--muted-foreground)">{v}</text>
        </g>
      ))}
      <text x={W / 2} y={H - 2} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">에폭</text>
      <text x={12} y={H / 2} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)" transform={`rotate(-90,12,${H / 2})`}>손실</text>
    </g>
  );
}

export default function BatchVariantsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Axes />
          {DATASETS.map((ds, i) => {
            const active = i === step;
            return (
              <g key={ds.label}>
                <motion.path d={pathD(ds.data)} fill="none"
                  stroke={ds.color} strokeWidth={active ? 1.5 : 0.8}
                  initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }} />
                {active && (
                  <motion.text x={toX(ds.data[ds.data.length - 1].epoch) + 4}
                    y={toY(ds.data[ds.data.length - 1].loss) - 4}
                    fontSize={9} fontWeight={500} fill={ds.color}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {ds.label}
                  </motion.text>
                )}
              </g>
            );
          })}
          {/* 범례 */}
          {DATASETS.map((ds, i) => (
            <g key={`leg-${i}`} transform={`translate(${PAD.l + 8 + i * 90}, ${PAD.t + 6})`}>
              <line x1={0} y1={0} x2={14} y2={0} stroke={ds.color} strokeWidth={1.2} />
              <text x={18} y={3} fontSize={9} fill={ds.color}>{ds.label}</text>
            </g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}

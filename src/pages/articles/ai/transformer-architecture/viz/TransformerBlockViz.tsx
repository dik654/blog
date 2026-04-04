import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Input Embedding + PE', color: '#6366f1' },
  { label: 'Multi-Head Attention', color: '#10b981' },
  { label: 'Add & Norm', color: '#f59e0b' },
  { label: 'Feed-Forward (MLP)', color: '#8b5cf6' },
  { label: 'Add & Norm', color: '#f59e0b' },
  { label: 'Output Projection', color: '#ec4899' },
];
const LH = 22, GAP = 4, X0 = 80, W = 200, CX = X0 + W / 2;

const STEPS = [
  { label: 'Input Embedding + Positional Encoding' }, { label: 'Multi-Head Attention' },
  { label: 'Add & Norm ①' }, { label: 'Feed-Forward Network' },
  { label: 'Add & Norm ②' }, { label: 'Output → Softmax' },
];
const BODY = [
  '토큰 → d_model + sin/cos PE', 'Q/K/V 병렬 Attention',
  'Residual + LayerNorm', 'd→4d→GELU→d 토큰별 MLP',
  '잔차 + 정규화 (×N 반복)', 'd_model→vocab Softmax 출력',
];

export default function TransformerBlockViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const y = 10 + i * (LH + GAP);
            const active = step === i, done = step > i;
            const op = active ? 1 : done ? 0.5 : 0.2;
            return (
              <g key={i}>
                <motion.rect x={X0} y={y} width={W} height={LH} rx={4}
                  animate={{ fill: `${l.color}${active ? '25' : '10'}`, stroke: l.color,
                    strokeWidth: active ? 2 : 1, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={CX} y={y + LH / 2 + 3} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={active ? l.color : 'var(--foreground)'} opacity={op}>
                  {l.label}
                </text>
                {i < LAYERS.length - 1 && (
                  <line x1={CX} y1={y + LH} x2={CX} y2={y + LH + GAP}
                    stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.15} />
                )}
              </g>
            );
          })}
          {/* Residual curves: Attn→Add&Norm, FFN→Add&Norm */}
          {[1, 3].map(from => {
            const y1 = 10 + from * (LH + GAP) + LH / 2;
            const y2 = 10 + (from + 1) * (LH + GAP) + LH / 2;
            const show = step >= from + 1;
            return (
              <motion.path key={from}
                d={`M ${X0} ${y1} C ${X0 - 30} ${y1} ${X0 - 30} ${y2} ${X0} ${y2}`}
                fill="none" stroke={LAYERS[from + 1].color}
                strokeWidth={show ? 1.5 : 0.5} strokeDasharray={show ? 'none' : '3 2'}
                animate={{ opacity: show ? 0.7 : 0.12 }} transition={{ duration: 0.3 }} />
            );
          })}
          <motion.circle r={6}
            animate={{ cx: CX, cy: 10 + step * (LH + GAP) + LH / 2 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            fill={LAYERS[step].color}
            style={{ filter: `drop-shadow(0 0 4px ${LAYERS[step].color}88)` }} />
          {/* inline body */}
          <motion.text x={370} y={87} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}

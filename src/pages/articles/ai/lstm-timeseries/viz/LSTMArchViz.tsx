import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 시퀀스' },
  { label: 'LSTM Layer 1 (64 유닛)' },
  { label: 'Dropout (0.2)' },
  { label: 'LSTM Layer 2 (32 유닛)' },
  { label: 'Dense → 예측값 출력' },
];
const BODY = [
  '슬라이딩 윈도우 시계열 입력',
  '모든 타임스텝 hidden state 전달',
  '20% 뉴런 비활성화로 과적합 방지',
  '마지막 타임스텝만 출력',
  '완전연결층 → 다음 시점 예측',
];

const LAYERS = [
  { y: 22, w: 260, h: 28, label: '입력 (window)', color: '#6366f1' },
  { y: 58, w: 240, h: 28, label: 'LSTM-1 (64)', color: '#10b981' },
  { y: 94, w: 220, h: 24, label: 'Dropout 0.2', color: '#f59e0b' },
  { y: 126, w: 200, h: 28, label: 'LSTM-2 (32)', color: '#10b981' },
  { y: 162, w: 140, h: 26, label: 'Dense → 출력', color: '#ef4444' },
];

const spring = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };
const CX = 180;

/* 8 dots representing data flowing through layers */
const DOTS = Array.from({ length: 8 }, (_, i) => ({ dx: (i - 3.5) * 22 }));

export default function LSTMArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Layers */}
          {LAYERS.map((l, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <g key={l.label}>
                <motion.rect x={CX - l.w / 2} y={l.y} width={l.w} height={l.h} rx={6}
                  animate={{
                    fill: active ? `${l.color}25` : done ? `${l.color}10` : 'color-mix(in oklch, var(--muted) 30%, transparent)',
                    stroke: active || done ? l.color : 'var(--border)',
                    strokeWidth: active ? 2 : 1,
                  }} transition={spring} />
                <text x={CX} y={l.y + l.h / 2 + 4} textAnchor="middle" fontSize={9} fontWeight={600}
                  style={{ fill: active ? l.color : 'var(--foreground)' }}>
                  {l.label}
                </text>
                {/* connector to next layer */}
                {i < LAYERS.length - 1 && (
                  <line x1={CX} y1={l.y + l.h} x2={CX} y2={LAYERS[i + 1].y}
                    stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2" />
                )}
              </g>
            );
          })}

          {/* Data dots flowing downward */}
          {DOTS.map((d, di) => {
            const targetLayer = LAYERS[Math.min(step, LAYERS.length - 1)];
            const visible = step !== 2 || di % 5 !== 0; /* dropout hides some */
            return (
              <motion.circle key={di} r={3.5}
                animate={{
                  cx: CX + d.dx * (targetLayer.w / 260),
                  cy: targetLayer.y + targetLayer.h / 2,
                  opacity: visible ? 0.85 : 0.1,
                  scale: visible ? 1 : 0.3,
                }}
                transition={spring}
                fill={LAYERS[Math.min(step, LAYERS.length - 1)].color}
                style={{ filter: `drop-shadow(0 0 3px ${LAYERS[Math.min(step, LAYERS.length - 1)].color}88)` }} />
            );
          })}
          <motion.text x={370} y={100} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}

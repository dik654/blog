import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

/* Simple wave points for a sine-like series */
const wave = (n: number, trend: number, amp: number, off: number) =>
  Array.from({ length: n }, (_, i) => ({ x: 20 + i * 8, y: off + trend * i * 0.3 - amp * Math.sin(i * 0.7) }));

const RAW = wave(36, -1, 14, 90);       // with downward trend
const STAT = wave(36, 0, 14, 70);       // stationary (no trend)
const PRED_X = [20 + 36 * 8, 20 + 39 * 8, 20 + 42 * 8];
const PRED_Y = [70, 74, 68];

const ACF_BARS = [1, 0.6, 0.25, 0.08, -0.05, -0.1]; // lag correlations

const STEPS = [
  { label: '원시 시계열 (추세 포함)' },
  { label: 'ADF 정상성 검정' },
  { label: '차분으로 추세 제거 (d=1)' },
  { label: 'ACF / PACF로 p, q 결정' },
  { label: '모델 적합 → 예측' },
];
const BODY = [
  '추세 있으면 비정상 시계열',
  'ADF p>0.05이면 비정상',
  'Yt-Yt₋₁ 변환으로 추세 제거',
  'ACF→MA(q), PACF→AR(p)',
  'ARIMA(p,d,q) 적합 후 예측',
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const pts = (arr: { x: number; y: number }[]) => arr.map(p => `${p.x},${p.y}`).join(' ');

export default function ARIMAPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Axes */}
          <line x1={18} y1={110} x2={340} y2={110} stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <line x1={18} y1={20} x2={18} y2={110} stroke="var(--muted-foreground)" strokeWidth={0.5} />

          {/* Raw / Stationary wave */}
          <motion.polyline points={pts(step < 2 ? RAW : STAT)} fill="none"
            stroke={step < 2 ? '#6366f1' : '#10b981'} strokeWidth={1.8}
            animate={{ opacity: step <= 2 || step === 4 ? 1 : 0.25 }} transition={sp} />

          {/* Step 1: ADF dotted line */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={20} y1={72} x2={300} y2={72} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
              <text x={305} y={75} fontSize={9} fill="#f59e0b">mean</text>
              <text x={160} y={18} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>p = 0.32 → 비정상</text>
            </motion.g>
          )}

          {/* Step 2: differencing arrow */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={160} y={18} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>d=1 차분 → 추세 제거 완료</text>
            </motion.g>
          )}

          {/* Step 3: ACF bars */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={24} fontSize={9} fill="var(--muted-foreground)">ACF (lag)</text>
              {ACF_BARS.map((v, i) => (
                <motion.rect key={i} x={240 + i * 14} y={v >= 0 ? 50 - v * 30 : 50} width={10}
                  height={Math.abs(v) * 30} rx={1.5} fill={v >= 0 ? '#3b82f6' : '#ef4444'} fillOpacity={0.7}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.07 }} style={{ transformOrigin: v >= 0 ? 'bottom' : 'top' }} />
              ))}
              <line x1={238} y1={50} x2={330} y2={50} stroke="var(--muted-foreground)" strokeWidth={0.5} />
            </motion.g>
          )}

          {/* Step 4: prediction extension */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={STAT[STAT.length - 1].x} y1={STAT[STAT.length - 1].y}
                x2={PRED_X[0]} y2={PRED_Y[0]} stroke="#ec4899" strokeWidth={1.5} strokeDasharray="4 2" />
              {PRED_X.map((px, i) => (
                <g key={i}>
                  {i > 0 && <line x1={PRED_X[i - 1]} y1={PRED_Y[i - 1]} x2={px} y2={PRED_Y[i]}
                    stroke="#ec4899" strokeWidth={1.5} strokeDasharray="4 2" />}
                  <circle cx={px} cy={PRED_Y[i]} r={3} fill="#ec4899" fillOpacity={0.8} />
                </g>
              ))}
              <text x={PRED_X[2] + 6} y={PRED_Y[2] + 3} fontSize={9} fill="#ec4899">예측</text>
            </motion.g>
          )}
          <motion.text x={370} y={65} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}

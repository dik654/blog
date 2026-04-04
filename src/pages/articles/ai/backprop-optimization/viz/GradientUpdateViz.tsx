import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, SNAPSHOTS, CITIES } from './gradientUpdateData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MAX_GRAD = 2.14;

export default function GradientUpdateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const snap = SNAPSHOTS[step];
        const gradBarW = Math.abs(snap.grad) / MAX_GRAD * 90;
        return (
          <svg viewBox="0 0 460 155" className="w-full max-w-2xl"
            style={{ height: 'auto' }}>

            {/* Weight m2 track (number line) */}
            <text x={15} y={25} fontSize={8} fontWeight={600}
              fill="var(--foreground)">m₂ 변화</text>
            <line x1={60} y1={28} x2={340} y2={28}
              stroke="var(--border)" strokeWidth={0.8} />
            {/* scale ticks: 0, 1, 2, 2.35 */}
            {[0, 0.5, 1.0, 1.5, 2.0, 2.35].map((v) => {
              const tx = 60 + (v / 2.5) * 280;
              return (
                <g key={v}>
                  <line x1={tx} y1={24} x2={tx} y2={32}
                    stroke="var(--border)" strokeWidth={0.6} />
                  <text x={tx} y={40} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{v}</text>
                </g>
              );
            })}
            {/* target marker */}
            <text x={60 + (2.35 / 2.5) * 280} y={19} textAnchor="middle"
              fontSize={7} fill="#10b981" fontWeight={600}>목표</text>
            {/* current position dot */}
            <motion.circle
              cy={28} r={5}
              fill="#3b82f630" stroke="#3b82f6" strokeWidth={1.5}
              animate={{ cx: 60 + (snap.m2 / 2.5) * 280 }}
              transition={sp} />
            <motion.text
              y={16} textAnchor="middle" fontSize={8}
              fontWeight={600} fill="#3b82f6"
              animate={{ x: 60 + (snap.m2 / 2.5) * 280 }}
              transition={sp}>
              {snap.m2}
            </motion.text>

            {/* Gradient magnitude bar */}
            <text x={15} y={62} fontSize={8} fontWeight={600}
              fill="var(--foreground)">기울기</text>
            <rect x={60} y={54} width={92} height={16} rx={3}
              fill="color-mix(in oklch, var(--muted) 6%, transparent)"
              stroke="var(--border)" strokeWidth={0.4} />
            <motion.rect x={60} y={54} rx={3}
              height={16}
              fill={Math.abs(snap.grad) > 1 ? '#ef444430' :
                Math.abs(snap.grad) > 0.3 ? '#f59e0b30' : '#10b98130'}
              stroke={Math.abs(snap.grad) > 1 ? '#ef4444' :
                Math.abs(snap.grad) > 0.3 ? '#f59e0b' : '#10b981'}
              strokeWidth={0.8}
              animate={{ width: Math.max(gradBarW, 2) }}
              transition={sp} />
            <motion.text y={66} fontSize={8} fontWeight={600}
              fill={Math.abs(snap.grad) > 1 ? '#ef4444' :
                Math.abs(snap.grad) > 0.3 ? '#f59e0b' : '#10b981'}
              animate={{ x: 66 + gradBarW }}
              transition={sp}>
              {snap.grad}
            </motion.text>

            {/* Prediction probability bars */}
            <text x={15} y={90} fontSize={8} fontWeight={600}
              fill="var(--foreground)">예측</text>
            {CITIES.map((c, i) => {
              const by = 82 + i * 18;
              const barW = snap.pred[i] * 120;
              const isTarget = i === 1;
              return (
                <g key={c.name}>
                  <text x={60} y={by + 12} fontSize={8}
                    fill={c.color}>{c.name}</text>
                  <motion.rect x={115} y={by + 2} rx={2}
                    height={12}
                    fill={`${c.color}25`}
                    stroke={c.color}
                    strokeWidth={isTarget ? 1.2 : 0.6}
                    animate={{ width: Math.max(barW, 2) }}
                    transition={sp} />
                  <motion.text y={by + 12} fontSize={8}
                    fontWeight={600} fill={c.color}
                    animate={{ x: 120 + barW }}
                    transition={sp}>
                    {(snap.pred[i] * 100).toFixed(0)}%
                  </motion.text>
                  {isTarget && (
                    <text x={260} y={by + 12} fontSize={7}
                      fill="#3b82f6">← 정답</text>
                  )}
                </g>
              );
            })}

            {/* Update calculation box */}
            <rect x={290} y={50} width={160} height={74} rx={6}
              fill="color-mix(in oklch, var(--muted) 6%, transparent)"
              stroke="var(--border)" strokeWidth={0.6} />
            <text x={370} y={65} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">epoch: {snap.epoch}</text>
            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={sp}>
                <text x={305} y={80} fontSize={8}
                  fill="var(--muted-foreground)">
                  m₂ = {SNAPSHOTS[step - 1].m2} − 0.1×({snap.grad})
                </text>
                <text x={305} y={94} fontSize={9}
                  fontWeight={600} fill="#3b82f6">
                  = {snap.m2}
                </text>
                {step >= 3 && (
                  <text x={305} y={112} fontSize={8}
                    fontWeight={600}
                    fill={step >= 4 ? '#10b981' : '#f59e0b'}>
                    {step >= 4 ? '수렴 완료!' : '기울기 작아짐 → 미세 조정'}
                  </text>
                )}
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}

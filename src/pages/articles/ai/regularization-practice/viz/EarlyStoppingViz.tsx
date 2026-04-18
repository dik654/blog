import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './EarlyStoppingData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const epochs = 25;
const valLoss = Array.from({ length: epochs }, (_, i) => {
  const base = 1.1 - 0.6 * (1 - Math.exp(-i / 5));
  return i > 10 ? base + (i - 10) * 0.025 : base;
});
const trainLoss = Array.from({ length: epochs }, (_, i) => 1.0 - 0.9 * (1 - Math.exp(-i / 4)));

const bestEpoch = 10; // val loss가 최소인 에폭
const patience = 5;
const stopEpoch = bestEpoch + patience; // 15

function toX(epoch: number, ox: number, w: number) { return ox + (epoch / (epochs - 1)) * w; }
function toY(loss: number, oy: number, h: number) { return oy + h - loss * h; }

function toPath(data: number[], ox: number, oy: number, w: number, h: number, limit?: number): string {
  const d = limit !== undefined ? data.slice(0, limit + 1) : data;
  return d
    .map((v, i) => {
      const x = toX(i, ox, w);
      const y = toY(v, oy, h);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function EarlyStoppingViz() {
  const ox = 45, oy = 28, W = 390, H = 120;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 축 */}
          <line x1={ox} y1={oy} x2={ox} y2={oy + H} stroke="#888" strokeWidth={0.5} />
          <line x1={ox} y1={oy + H} x2={ox + W} y2={oy + H} stroke="#888" strokeWidth={0.5} />
          <text x={ox - 6} y={oy + 4} textAnchor="end" fontSize={7} fill="#888">Loss</text>
          <text x={ox + W} y={oy + H + 12} textAnchor="end" fontSize={7} fill="#888">Epoch</text>

          {/* 범례 */}
          <line x1={ox + 10} y1={oy - 14} x2={ox + 24} y2={oy - 14}
            stroke={COLORS.train} strokeWidth={1.2} />
          <text x={ox + 28} y={oy - 11} fontSize={7} fill={COLORS.train}>Train</text>
          <line x1={ox + 62} y1={oy - 14} x2={ox + 76} y2={oy - 14}
            stroke={COLORS.val} strokeWidth={1.2} strokeDasharray="3 2" />
          <text x={ox + 80} y={oy - 11} fontSize={7} fill={COLORS.val}>Val</text>

          {/* Train Loss — 항상 표시 */}
          <path d={toPath(trainLoss, ox, oy, W, H, step >= 2 ? stopEpoch : undefined)}
            fill="none" stroke={COLORS.train} strokeWidth={1.2} />

          {/* Val Loss */}
          <path d={toPath(valLoss, ox, oy, W, H, step >= 2 ? stopEpoch : undefined)}
            fill="none" stroke={COLORS.val} strokeWidth={1.2} strokeDasharray="3 2" />

          {/* Step 0: best 시점 */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <circle cx={toX(bestEpoch, ox, W)} cy={toY(valLoss[bestEpoch], oy, H)}
                r={4} fill="none" stroke={COLORS.best} strokeWidth={1.5} />
              <text x={toX(bestEpoch, ox, W)} y={toY(valLoss[bestEpoch], oy, H) - 8}
                textAnchor="middle" fontSize={7} fontWeight={700} fill={COLORS.best}>
                Best
              </text>
            </motion.g>
          )}

          {/* Step 1: patience 구간 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
              {/* patience 영역 하이라이트 */}
              <rect x={toX(bestEpoch, ox, W)} y={oy}
                width={toX(stopEpoch, ox, W) - toX(bestEpoch, ox, W)}
                height={H} rx={4}
                fill={COLORS.patience} fillOpacity={0.08}
                stroke={COLORS.patience} strokeWidth={0.6} strokeDasharray="3 2" />
              <text x={(toX(bestEpoch, ox, W) + toX(stopEpoch, ox, W)) / 2} y={oy + 12}
                textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.patience}>
                patience = {patience}
              </text>

              {/* patience 카운터 */}
              {Array.from({ length: patience }).map((_, i) => {
                const ep = bestEpoch + 1 + i;
                const cx = toX(ep, ox, W);
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                    <circle cx={cx} cy={toY(valLoss[ep], oy, H)} r={3}
                      fill={COLORS.patience} fillOpacity={0.3} stroke={COLORS.patience} strokeWidth={0.8} />
                    <text x={cx} y={oy + H + 12} textAnchor="middle" fontSize={7}
                      fill={COLORS.patience} fontWeight={600}>{i + 1}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {/* Step 2: STOP + restore */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
              {/* 정지선 */}
              <line x1={toX(stopEpoch, ox, W)} y1={oy} x2={toX(stopEpoch, ox, W)} y2={oy + H}
                stroke={COLORS.stop} strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={toX(stopEpoch, ox, W) + 4} y={oy + 8} fontSize={8}
                fontWeight={700} fill={COLORS.stop}>STOP</text>

              {/* restore 화살표 */}
              <motion.path
                d={`M${toX(stopEpoch, ox, W)},${oy + H - 10} Q${toX((bestEpoch + stopEpoch) / 2, ox, W)},${oy + H + 8} ${toX(bestEpoch, ox, W)},${toY(valLoss[bestEpoch], oy, H) + 10}`}
                fill="none" stroke={COLORS.best} strokeWidth={1} strokeDasharray="3 2"
                markerEnd="url(#arrowES)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }} />
              <text x={(toX(bestEpoch, ox, W) + toX(stopEpoch, ox, W)) / 2} y={oy + H - 2}
                textAnchor="middle" fontSize={7} fontWeight={600} fill={COLORS.best}>
                restore best weights
              </text>

              <defs>
                <marker id="arrowES" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.best} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 3: patience 가이드 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
              {[
                { ox: 45, label: '작은 데이터', pat: '5~10', color: '#f59e0b' },
                { ox: 195, label: '큰 데이터', pat: '10~20', color: '#3b82f6' },
                { ox: 345, label: 'LR Scheduler', pat: '15~30', color: '#8b5cf6' },
              ].map((g, i) => (
                <g key={i}>
                  <rect x={g.ox} y={162} width={130} height={30} rx={6}
                    fill={`${g.color}10`} stroke={g.color} strokeWidth={0.6} />
                  <text x={g.ox + 65} y={176} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={g.color}>{g.label}</text>
                  <text x={g.ox + 65} y={188} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">patience = {g.pat}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

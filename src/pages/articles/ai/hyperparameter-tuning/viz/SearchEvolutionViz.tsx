import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import {
  STEPS, GRID_PTS, RAND_PTS, BAYES_EVALUATED, BAYES_NEXT,
  TPE_GOOD, TPE_BAD, sp,
} from './SearchEvolutionVizData';

const pts = (arr: { x: number; y: number }[]) => arr.map(p => `${p.x},${p.y}`).join(' ');

export default function SearchEvolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Axes */}
          <line x1={40} y1={165} x2={460} y2={165} stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <line x1={40} y1={10} x2={40} y2={165} stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <text x={250} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">param 1</text>
          <text x={15} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,15,90)">param 2</text>

          {/* Step 0: Grid Search — uniform grid */}
          {step === 0 && GRID_PTS.map((p, i) => (
            <motion.circle key={i} cx={p.x} cy={p.y} r={4}
              fill="#6366f1" fillOpacity={0.6}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...sp, delay: i * 0.02 }} />
          ))}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={`gl-${i}`}>
                  <line x1={60 + i * 80} y1={20} x2={60 + i * 80} y2={158}
                    stroke="#6366f1" strokeWidth={0.3} strokeDasharray="3 3" />
                  <line x1={50} y1={30 + i * 32} x2={450} y2={30 + i * 32}
                    stroke="#6366f1" strokeWidth={0.3} strokeDasharray="3 3" />
                </g>
              ))}
              <text x={420} y={20} fontSize={9} fill="#ef4444" fontWeight={600}>5x5 = 25회</text>
            </motion.g>
          )}

          {/* Step 1: Random Search — scattered points */}
          {step === 1 && RAND_PTS.map((p, i) => (
            <motion.circle key={i} cx={p.x} cy={p.y} r={4}
              fill="#10b981" fillOpacity={0.6}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...sp, delay: i * 0.03 }} />
          ))}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <text x={420} y={20} fontSize={9} fill="#10b981" fontWeight={600}>20회 (같은 예산)</text>
              {/* Highlight best region */}
              <circle cx={280} cy={55} r={30} fill="none" stroke="#10b981" strokeWidth={1} strokeDasharray="4 2" />
              <text x={280} y={100} textAnchor="middle" fontSize={8} fill="#10b981">최적 영역 커버</text>
            </motion.g>
          )}

          {/* Step 2: Bayesian — surrogate with evaluated points */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Surrogate contour (simplified as gradient rects) */}
              {[0, 1, 2, 3].map(i => (
                <rect key={`sr-${i}`} x={80 + i * 90} y={30} width={80} height={130}
                  fill="#3b82f6" fillOpacity={0.03 + i * 0.03} rx={4} />
              ))}
              <text x={390} y={24} fontSize={8} fill="var(--muted-foreground)">surrogate model</text>
            </motion.g>
          )}
          {step === 2 && BAYES_EVALUATED.map((p, i) => (
            <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...sp, delay: i * 0.08 }}>
              <circle cx={p.x} cy={p.y} r={5} fill="#3b82f6" fillOpacity={0.7} />
              <text x={p.x + 8} y={p.y - 4} fontSize={8} fill="#3b82f6" fontWeight={600}>
                {p.score.toFixed(2)}
              </text>
            </motion.g>
          ))}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ ...sp, delay: 0.6 }}>
              <circle cx={BAYES_NEXT.x} cy={BAYES_NEXT.y} r={7} fill="none"
                stroke="#ec4899" strokeWidth={2} />
              <text x={BAYES_NEXT.x + 10} y={BAYES_NEXT.y - 2} fontSize={8}
                fill="#ec4899" fontWeight={600}>다음 탐색</text>
            </motion.g>
          )}

          {/* Step 3: TPE — l(good) vs g(bad) distributions */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Threshold line */}
              <line x1={50} y1={140} x2={450} y2={140} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <text x={455} y={143} fontSize={7} fill="var(--muted-foreground)">x</text>

              {/* g(x): bad distribution */}
              <motion.polyline points={pts(TPE_BAD)} fill="none"
                stroke="#ef4444" strokeWidth={1.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }} />
              <text x={140} y={42} fontSize={9} fill="#ef4444" fontWeight={600}>g(x): y &ge; y*</text>
              <text x={140} y={52} fontSize={7.5} fill="#ef4444">나쁜 trial 분포</text>

              {/* l(x): good distribution */}
              <motion.polyline points={pts(TPE_GOOD)} fill="none"
                stroke="#10b981" strokeWidth={1.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }} />
              <text x={320} y={28} fontSize={9} fill="#10b981" fontWeight={600}>l(x): y &lt; y*</text>
              <text x={320} y={38} fontSize={7.5} fill="#10b981">좋은 trial 분포</text>

              {/* EI arrow at peak of l(x)/g(x) */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <line x1={320} y1={45} x2={320} y2={130} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
                <text x={320} y={120} textAnchor="middle" fontSize={8} fill="#f59e0b" fontWeight={600}>
                  EI max
                </text>
                <rect x={280} y={148} width={80} height={16} rx={4} fill="#f59e0b" fillOpacity={0.1}
                  stroke="#f59e0b" strokeWidth={0.5} />
                <text x={320} y={159} textAnchor="middle" fontSize={8} fill="#f59e0b" fontWeight={600}>
                  l(x)/g(x) 최대
                </text>
              </motion.g>
            </motion.g>
          )}

          <defs>
            <marker id="arrPink" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#ec4899" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

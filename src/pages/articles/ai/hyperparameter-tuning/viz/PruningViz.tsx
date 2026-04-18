import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, TRIAL_CURVES, PARETO_PTS, IMPORTANCE, sp } from './PruningVizData';

export default function PruningViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Step 0: MedianPruner */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                MedianPruner 동작
              </text>
              {/* Axes */}
              <line x1={50} y1={175} x2={440} y2={175} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={50} y1={25} x2={50} y2={175} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <text x={245} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">epoch</text>
              <text x={25} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                transform="rotate(-90,25,100)">val_loss</text>

              {/* Epoch labels */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map(e => (
                <text key={e} x={70 + e * 48} y={186} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{e}</text>
              ))}

              {/* Trial curves */}
              {TRIAL_CURVES.map((trial, ti) => {
                const points = trial.pts.map((v, i) => `${70 + i * 48},${30 + v * 140}`).join(' ');
                return (
                  <motion.g key={ti} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: ti * 0.12 }}>
                    <polyline points={points} fill="none" stroke={trial.color}
                      strokeWidth={trial.pruned ? 1.2 : 1.8}
                      strokeDasharray={trial.pruned ? '4 2' : 'none'} />
                    {trial.pts.map((v, i) => (
                      <circle key={i} cx={70 + i * 48} cy={30 + v * 140} r={2.5}
                        fill={trial.color} fillOpacity={0.8} />
                    ))}
                    {trial.pruned && (
                      <g>
                        <text x={70 + (trial.pts.length - 1) * 48 + 8}
                          y={30 + trial.pts[trial.pts.length - 1] * 140}
                          fontSize={8} fill={trial.color} fontWeight={600}>pruned</text>
                      </g>
                    )}
                  </motion.g>
                );
              })}

              {/* Median line */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <line x1={50} y1={30 + 0.78 * 140} x2={440} y2={30 + 0.78 * 140}
                  stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="6 3" />
                <text x={442} y={30 + 0.78 * 140 + 4} fontSize={7.5} fill="#f59e0b">median</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: HyperbandPruner */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Hyperband: 다단계 리소스 할당
              </text>
              {/* Successive halving visualization */}
              {[
                { y: 40, n: 16, epochs: 1, label: 'Round 1: 16 trials x 1 epoch' },
                { y: 80, n: 8, epochs: 3, label: 'Round 2: 8 trials x 3 epochs' },
                { y: 120, n: 4, epochs: 9, label: 'Round 3: 4 trials x 9 epochs' },
                { y: 160, n: 2, epochs: 27, label: 'Round 4: 2 trials x 27 epochs' },
              ].map((round, ri) => (
                <motion.g key={ri} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: ri * 0.15 }}>
                  {/* Trial dots */}
                  {Array.from({ length: round.n }, (_, i) => (
                    <rect key={i} x={40 + i * (round.n > 8 ? 22 : round.n > 4 ? 40 : 70)}
                      y={round.y} width={round.n > 8 ? 18 : round.n > 4 ? 32 : 55} height={24}
                      rx={4} fill={ri === 3 ? '#10b98118' : '#6366f108'}
                      stroke={ri === 3 ? '#10b981' : '#6366f1'} strokeWidth={ri === 3 ? 1 : 0.5} />
                  ))}
                  {/* Label */}
                  <text x={440} y={round.y + 16} fontSize={7.5} fill="var(--muted-foreground)">
                    {round.label}
                  </text>
                  {/* Halving arrows */}
                  {ri < 3 && (
                    <line x1={200} y1={round.y + 28} x2={200} y2={round.y + 38}
                      stroke="#ef4444" strokeWidth={0.7} markerEnd="url(#arrRed)" />
                  )}
                </motion.g>
              ))}
              <motion.text x={200} y={195} textAnchor="middle" fontSize={8}
                fill="#ef4444" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                매 라운드 하위 50% 탈락 (SHA)
              </motion.text>
            </motion.g>
          )}

          {/* Step 2: Pruning effect */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Pruning 효과: 3~5배 효율 향상
              </text>
              {/* Without pruning */}
              <rect x={40} y={35} width={180} height={70} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={130} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
                Pruning 없이 (100 trials)
              </text>
              {/* All trials full length */}
              {Array.from({ length: 10 }, (_, i) => (
                <motion.rect key={i} x={55 + i * 15} y={60} width={10} height={35} rx={2}
                  fill={i < 3 ? '#10b981' : '#ef4444'} fillOpacity={i < 3 ? 0.7 : 0.3}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ ...sp, delay: i * 0.04 }} style={{ transformOrigin: 'bottom' }} />
              ))}

              {/* With pruning */}
              <rect x={260} y={35} width={180} height={70} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={350} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                Pruning 적용 (100 trials)
              </text>
              {/* Some full, most short */}
              {Array.from({ length: 10 }, (_, i) => {
                const h = i < 3 ? 35 : 8 + Math.random() * 12;
                return (
                  <motion.rect key={i} x={275 + i * 15} y={95 - h} width={10} height={h} rx={2}
                    fill={i < 3 ? '#10b981' : '#f59e0b'} fillOpacity={i < 3 ? 0.7 : 0.4}
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ ...sp, delay: i * 0.04 }} style={{ transformOrigin: 'bottom' }} />
                );
              })}

              {/* Code pattern */}
              <rect x={60} y={120} width={360} height={60} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={75} y={137} fontSize={8} fill="#6366f1" fontFamily="monospace">for epoch in range(100):</text>
              <text x={85} y={150} fontSize={8} fill="var(--muted-foreground)" fontFamily="monospace">train(); val = evaluate()</text>
              <text x={85} y={163} fontSize={8} fill="#f59e0b" fontFamily="monospace">trial.report(val, epoch)</text>
              <text x={85} y={176} fontSize={8} fill="#ef4444" fontFamily="monospace">if trial.should_prune(): raise TrialPruned()</text>
            </motion.g>
          )}

          {/* Step 3: Multi-objective — Pareto front */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                멀티 목적: Pareto Front
              </text>
              {/* Axes */}
              <line x1={60} y1={170} x2={420} y2={170} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={60} y1={30} x2={60} y2={170} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                추론 시간 (ms) →
              </text>
              <text x={20} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                transform="rotate(-90,20,100)">정확도 ↑</text>

              {/* Points */}
              {PARETO_PTS.map((p, i) => {
                const cx = 60 + (p.lat / 130) * 350;
                const cy = 170 - (p.acc - 0.84) * 1200;
                return (
                  <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <circle cx={cx} cy={cy} r={p.pareto ? 6 : 4}
                      fill={p.pareto ? '#10b981' : '#6366f1'} fillOpacity={p.pareto ? 0.8 : 0.4}
                      stroke={p.pareto ? '#10b981' : 'none'} strokeWidth={p.pareto ? 1.5 : 0} />
                    {p.pareto && (
                      <text x={cx + 8} y={cy - 5} fontSize={7.5} fill="#10b981">
                        {(p.acc * 100).toFixed(0)}% / {p.lat}ms
                      </text>
                    )}
                  </motion.g>
                );
              })}

              {/* Pareto front line */}
              <motion.polyline
                points={PARETO_PTS
                  .filter(p => p.pareto)
                  .sort((a, b) => a.lat - b.lat)
                  .map(p => `${60 + (p.lat / 130) * 350},${170 - (p.acc - 0.84) * 1200}`)
                  .join(' ')}
                fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <text x={380} y={50} fontSize={8} fill="#10b981" fontWeight={600}>Pareto front</text>
                <text x={380} y={62} fontSize={7} fill="var(--muted-foreground)">최적 해 집합</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: Visualization tools */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                결과 시각화: param_importances (fANOVA)
              </text>
              {/* Importance horizontal bars — narrower bar area to leave room for % */}
              {IMPORTANCE.map((imp, i) => {
                const barMax = 230;
                const barW = imp.value * barMax;
                const rowY = 38 + i * 30;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    <text x={150} y={rowY + 13} textAnchor="end" fontSize={9}
                      fontWeight={600} fill={imp.color} fontFamily="monospace">{imp.name}</text>
                    <rect x={158} y={rowY + 1} width={barW} height={18} rx={3}
                      fill={imp.color} fillOpacity={0.6} />
                    <text x={163 + barW} y={rowY + 14} fontSize={8} fontWeight={600} fill={imp.color}>
                      {(imp.value * 100).toFixed(0)}%
                    </text>
                  </motion.g>
                );
              })}

              {/* Insight — placed below all bars (y=210), viewBox extended */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={40} y={206} width={400} height={42} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={223} textAnchor="middle" fontSize={8.5} fill="var(--foreground)" fontWeight={600}>
                  fANOVA: 각 파라미터가 성능 분산의 몇 %를 설명하는지 분석
                </text>
                <text x={240} y={238} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  중요도 낮은 파라미터는 고정 → 탐색 공간 축소
                </text>
              </motion.g>
            </motion.g>
          )}

          <defs>
            <marker id="arrRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#ef4444" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

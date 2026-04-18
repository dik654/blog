import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS, sp } from './LRStrategyVizData';

export default function LRStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Discriminative LR per layer */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { label: 'Conv1~2', lr: '1e-5', barW: 30, color: COLORS.low, y: 30 },
                { label: 'Conv3~4', lr: '1e-4', barW: 100, color: COLORS.mid, y: 68 },
                { label: 'FC Head', lr: '1e-3', barW: 300, color: COLORS.high, y: 106 },
              ].map((row, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  {/* Layer label */}
                  <text x={95} y={row.y + 18} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">
                    {row.label}
                  </text>
                  <text x={95} y={row.y + 30} textAnchor="end" fontSize={8} fill={row.color} fontWeight={600}>
                    LR = {row.lr}
                  </text>
                  {/* Bar background */}
                  <rect x={110} y={row.y + 6} width={330} height={24} rx={4} fill="var(--border)" opacity={0.15} />
                  {/* Animated bar */}
                  <motion.rect x={110} y={row.y + 6} width={0} height={24} rx={4}
                    fill={row.color} opacity={0.6}
                    animate={{ width: row.barW }} transition={{ ...sp, duration: 0.8, delay: 0.2 + i * 0.1 }} />
                </motion.g>
              ))}
              {/* Scale annotation */}
              <text x={300} y={166} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                하위 → 상위: 학습률 10~100배 차이 (로그 스케일)
              </text>
              {/* Arrow */}
              <line x1={60} y1={50} x2={60} y2={130} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrLR)" />
              <text x={50} y={47} fontSize={7} fill="var(--muted-foreground)" textAnchor="middle">하위</text>
              <text x={50} y={140} fontSize={7} fill="var(--muted-foreground)" textAnchor="middle">상위</text>
              {/* Insight box */}
              <rect x={120} y={178} width={280} height={26} rx={5} fill={COLORS.high} fillOpacity={0.08}
                stroke={COLORS.high} strokeWidth={0.8} />
              <text x={260} y={195} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.high}>
                범용 피처(에지) 보존 + 태스크 피처 빠른 적응 = 최적 균형
              </text>
            </motion.g>
          )}

          {/* Step 1: Warmup */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Chart axes */}
              <line x1={80} y1={30} x2={80} y2={170} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={80} y1={170} x2={460} y2={170} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={40} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,40,100)">
                Learning Rate
              </text>
              <text x={270} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Epoch</text>
              {/* No warmup: jump to high LR */}
              <motion.path d="M80,40 L100,40 L450,40"
                stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.8 }} />
              <text x={350} y={35} fontSize={8} fill="#ef4444">Warmup 없음: 즉시 높은 LR</text>
              {/* With warmup */}
              <motion.path d="M80,165 L160,40 L450,40"
                stroke={COLORS.warmup} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 1 }} />
              <text x={120} y={120} fontSize={8} fill={COLORS.warmup} fontWeight={600}>Warmup 구간</text>
              {/* Warmup zone highlight */}
              <rect x={80} y={30} width={80} height={140} rx={0} fill={COLORS.warmup} fillOpacity={0.05} />
              {/* Annotations */}
              <circle cx={160} cy={40} r={4} fill={COLORS.warmup} />
              <text x={170} y={55} fontSize={8} fill={COLORS.warmup}>Target LR 도달</text>
              <text x={270} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Warmup 5~10% epoch → pretrained 가중치 안정적 적응
              </text>
            </motion.g>
          )}

          {/* Step 2: Cosine Annealing */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Axes */}
              <line x1={60} y1={30} x2={60} y2={160} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={60} y1={160} x2={480} y2={160} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={25} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,25,95)">LR</text>
              <text x={270} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Epoch</text>
              {/* Cosine curve — approximated */}
              <motion.path d="M60,40 C120,42 180,80 240,130 C280,155 300,158 320,158"
                stroke={COLORS.cosine} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 1 }} />
              <text x={190} y={60} fontSize={8} fill={COLORS.cosine} fontWeight={600}>Cosine Decay</text>
              {/* Warm restart variation */}
              <motion.path d="M320,40 C370,42 400,100 430,155"
                stroke={COLORS.accent} strokeWidth={2} fill="none" strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.8, delay: 0.5 }} />
              {/* Restart arrow */}
              <motion.line x1={318} y1={158} x2={322} y2={40}
                stroke={COLORS.accent} strokeWidth={1.5} markerEnd="url(#arrLR)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }} />
              <text x={345} y={35} fontSize={8} fill={COLORS.accent} fontWeight={600}>Warm Restart</text>
              {/* Formula */}
              <rect x={60} y={188} width={400} height={22} rx={4} fill="var(--muted)" fillOpacity={0.15} />
              <text x={260} y={203} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                {'η(t) = η_min + 0.5(η_max − η_min)(1 + cos(πt/T))'}
              </text>
            </motion.g>
          )}

          {/* Step 3: Warmup + Cosine combined */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Axes */}
              <line x1={60} y1={25} x2={60} y2={150} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={60} y1={150} x2={480} y2={150} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={25} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,25,90)">LR</text>
              <text x={270} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Epoch</text>
              {/* Phase 1: Warmup (linear ramp) */}
              <rect x={60} y={20} width={60} height={130} fill={COLORS.warmup} fillOpacity={0.05} />
              <motion.path d="M60,148 L120,35"
                stroke={COLORS.warmup} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.6 }} />
              <text x={90} y={15} textAnchor="middle" fontSize={8} fill={COLORS.warmup} fontWeight={600}>Warmup</text>
              {/* Phase 2: Cosine decay */}
              <motion.path d="M120,35 C200,38 300,80 400,140 C440,148 460,149 470,149"
                stroke={COLORS.cosine} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 1, delay: 0.3 }} />
              <text x={300} y={55} fontSize={8} fill={COLORS.cosine} fontWeight={600}>Cosine Decay</text>
              {/* Peak point */}
              <circle cx={120} cy={35} r={4} fill={COLORS.warmup} />
              <text x={140} y={30} fontSize={7.5} fill={COLORS.warmup}>Peak LR</text>
              {/* End point */}
              <circle cx={470} cy={149} r={3} fill={COLORS.cosine} />
              <text x={470} y={143} fontSize={7.5} fill={COLORS.cosine} textAnchor="end">η_min</text>
              {/* Usage examples */}
              {[
                { label: 'BERT fine-tune', config: 'warmup=10%, peak=2e-5', color: COLORS.low, x: 80 },
                { label: 'GPT fine-tune', config: 'warmup=5%, peak=5e-5', color: COLORS.cosine, x: 240 },
                { label: 'ViT fine-tune', config: 'warmup=5%, peak=1e-4', color: COLORS.high, x: 390 },
              ].map((ex, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
                  <rect x={ex.x} y={178} width={130} height={28} rx={5}
                    fill={`${ex.color}10`} stroke={ex.color} strokeWidth={0.8} />
                  <text x={ex.x + 65} y={190} textAnchor="middle" fontSize={8} fontWeight={600} fill={ex.color}>{ex.label}</text>
                  <text x={ex.x + 65} y={201} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{ex.config}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          <defs>
            <marker id="arrLR" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

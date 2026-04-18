import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LGBM_PARAMS, NN_PARAMS, sp } from './SearchSpaceVizData';
import type { ParamDef } from './SearchSpaceVizData';

function ParamRow({ p, i, y0 }: { p: ParamDef; i: number; y0: number }) {
  const y = y0 + i * 26;
  const typeLabel = p.type === 'float' ? (p.log ? 'log-float' : 'float')
    : p.type === 'int' ? 'int' : 'categorical';
  return (
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ ...sp, delay: i * 0.06 }}>
      {/* Background bar */}
      <rect x={30} y={y} width={420} height={22} rx={4}
        fill={`${p.color}08`} stroke={`${p.color}25`} strokeWidth={0.5} />
      {/* Name */}
      <text x={40} y={y + 14} fontSize={9} fontWeight={700} fill={p.color} fontFamily="monospace">
        {p.name}
      </text>
      {/* Range */}
      <text x={185} y={y + 14} fontSize={8.5} fill="var(--foreground)">
        {p.range}
      </text>
      {/* Type badge */}
      <rect x={360} y={y + 3} width={55} height={16} rx={8}
        fill={`${p.color}15`} stroke={p.color} strokeWidth={0.5} />
      <text x={387} y={y + 14} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={p.color}>
        {typeLabel}
      </text>
    </motion.g>
  );
}

export default function SearchSpaceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Step 0: LightGBM params */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
                LightGBM 탐색 공간
              </text>
              <text x={40} y={35} fontSize={8} fill="var(--muted-foreground)">파라미터</text>
              <text x={185} y={35} fontSize={8} fill="var(--muted-foreground)">범위</text>
              <text x={380} y={35} fontSize={8} fill="var(--muted-foreground)">타입</text>
              {LGBM_PARAMS.map((p, i) => (
                <ParamRow key={p.name} p={p} i={i} y0={42} />
              ))}
            </motion.g>
          )}

          {/* Step 1: Neural network params */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
                신경망 탐색 공간
              </text>
              <text x={40} y={35} fontSize={8} fill="var(--muted-foreground)">파라미터</text>
              <text x={185} y={35} fontSize={8} fill="var(--muted-foreground)">범위</text>
              <text x={380} y={35} fontSize={8} fill="var(--muted-foreground)">타입</text>
              {NN_PARAMS.map((p, i) => (
                <ParamRow key={p.name} p={p} i={i} y0={42} />
              ))}
            </motion.g>
          )}

          {/* Step 2: log vs uniform scale comparison */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                log scale vs uniform
              </text>
              {/* Log scale visualization */}
              <text x={40} y={42} fontSize={9} fontWeight={600} fill="#10b981">log scale (학습률)</text>
              <line x1={40} y1={55} x2={440} y2={55} stroke="var(--border)" strokeWidth={1} />
              {/* Log-spaced ticks */}
              {[
                { v: '1e-5', x: 40 }, { v: '1e-4', x: 140 },
                { v: '1e-3', x: 240 }, { v: '1e-2', x: 340 }, { v: '1e-1', x: 440 },
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <line x1={t.x} y1={50} x2={t.x} y2={60} stroke="#10b981" strokeWidth={1} />
                  <text x={t.x} y={72} textAnchor="middle" fontSize={8} fill="#10b981" fontFamily="monospace">
                    {t.v}
                  </text>
                </motion.g>
              ))}
              <text x={240} y={86} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                각 10배 구간을 동등하게 탐색 — 소수점 영역도 충분히 커버
              </text>

              {/* Uniform scale visualization */}
              <text x={40} y={110} fontSize={9} fontWeight={600} fill="#f59e0b">uniform (dropout)</text>
              <line x1={40} y1={123} x2={440} y2={123} stroke="var(--border)" strokeWidth={1} />
              {[
                { v: '0.0', x: 40 }, { v: '0.1', x: 120 }, { v: '0.2', x: 200 },
                { v: '0.3', x: 280 }, { v: '0.4', x: 360 }, { v: '0.5', x: 440 },
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.06 }}>
                  <line x1={t.x} y1={118} x2={t.x} y2={128} stroke="#f59e0b" strokeWidth={1} />
                  <text x={t.x} y={140} textAnchor="middle" fontSize={8} fill="#f59e0b" fontFamily="monospace">
                    {t.v}
                  </text>
                </motion.g>
              ))}
              <text x={240} y={155} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                균등 간격 — [0,1] 범위에서 어디든 동일한 밀도
              </text>

              {/* Categorical */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <text x={40} y={174} fontSize={9} fontWeight={600} fill="#8b5cf6">categorical</text>
                {['Adam', 'SGD', 'AdamW', 'RMSprop'].map((opt, i) => (
                  <g key={opt}>
                    <rect x={140 + i * 75} y={164} width={65} height={22} rx={11}
                      fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={0.5} />
                    <text x={172 + i * 75} y={178} textAnchor="middle"
                      fontSize={8} fill="#8b5cf6" fontWeight={600}>{opt}</text>
                  </g>
                ))}
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Conditional search space */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                조건부 탐색 공간 (define-by-run)
              </text>
              {/* Root: optimizer choice (centered x=240) */}
              <rect x={185} y={28} width={110} height={28} rx={14}
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1} />
              <text x={240} y={46} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
                optimizer
              </text>

              {/* Branch lines from root to branches */}
              <line x1={220} y1={56} x2={150} y2={78} stroke="#10b981" strokeWidth={1} />
              <line x1={260} y1={56} x2={330} y2={78} stroke="#f59e0b" strokeWidth={1} />

              {/* Branch: Adam (x=80..220) */}
              <rect x={80} y={78} width={140} height={26} rx={6}
                fill="#10b98110" stroke="#10b981" strokeWidth={0.7} />
              <text x={150} y={95} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                Adam
              </text>
              {/* Adam children — 3 boxes inside x=80..220 */}
              {['beta1', 'beta2', 'weight_decay'].map((p, i) => {
                const childW = 42;
                const childGap = 4;
                const groupW = 3 * childW + 2 * childGap;
                const startX = 150 - groupW / 2;
                const childX = startX + i * (childW + childGap);
                return (
                  <motion.g key={p} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                    <line x1={childX + childW / 2} y1={104} x2={childX + childW / 2} y2={114}
                      stroke="#10b981" strokeWidth={0.5} />
                    <rect x={childX} y={114} width={childW} height={18} rx={4}
                      fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                    <text x={childX + childW / 2} y={126} textAnchor="middle"
                      fontSize={7} fill="#10b981" fontFamily="monospace">{p}</text>
                  </motion.g>
                );
              })}

              {/* Branch: SGD (x=260..400) */}
              <rect x={260} y={78} width={140} height={26} rx={6}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.7} />
              <text x={330} y={95} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
                SGD
              </text>
              {/* SGD children — 2 boxes inside x=260..400 */}
              {['momentum', 'nesterov'].map((p, i) => {
                const childW = 58;
                const childGap = 10;
                const groupW = 2 * childW + childGap;
                const startX = 330 - groupW / 2;
                const childX = startX + i * (childW + childGap);
                return (
                  <motion.g key={p} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                    <line x1={childX + childW / 2} y1={104} x2={childX + childW / 2} y2={114}
                      stroke="#f59e0b" strokeWidth={0.5} />
                    <rect x={childX} y={114} width={childW} height={18} rx={4}
                      fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                    <text x={childX + childW / 2} y={126} textAnchor="middle"
                      fontSize={7} fill="#f59e0b" fontFamily="monospace">{p}</text>
                  </motion.g>
                );
              })}

              {/* Advantage note — placed below children with clear gap */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={60} y={150} width={360} height={38} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={166} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
                  Grid/Random은 트리 구조 탐색 공간 표현 불가
                </text>
                <text x={240} y={180} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  Optuna define-by-run: if/else로 조건부 공간을 자연스럽게 정의
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

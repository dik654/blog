import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C1 = '#10b981', C2 = '#f59e0b', C3 = '#6366f1';
const MUT = 'var(--muted-foreground)';
const W = 640, CX = W / 2;

const PHASES = [
  '흡수 완료 — 최종 상태',
  'rate 영역에서 출력 복사',
  '출력이 더 필요하면?',
  'π를 한 번 더 적용 후 다시 rate에서 추출',
];

export default function SqueezeViz() {
  const [phase, setPhase] = useState(0);

  const bw = 100, bh = 48, gap = 12;
  const totalW = 3 * (bw + gap) - gap;
  const x0 = CX - totalW / 2;
  const cellX = (i: number) => x0 + i * (bw + gap);
  const stateY = 56;
  const outY = stateY + bh + 40;
  const state2Y = outY + bh + 50;

  return (
    <div className="not-prose">
      <svg viewBox={`0 0 ${W} ${phase >= 2 ? 320 : 240}`} className="w-full max-w-3xl"
        style={{ height: 'auto' }}>
        <text x={CX} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill={C1}>
          압출 (Squeeze) 상세
        </text>
        <text x={CX} y={38} textAnchor="middle" fontSize={12} fill={MUT}>
          {PHASES[phase]}
        </text>

        {/* Labels */}
        <text x={x0 + (2 * (bw + gap) - gap) / 2} y={stateY - 6}
          textAnchor="middle" fontSize={11} fill={C1}>rate</text>
        <text x={cellX(2) + bw / 2} y={stateY - 6}
          textAnchor="middle" fontSize={11} fill={C2}>cap</text>

        {/* State row */}
        {[0, 1].map(i => (
          <rect key={`s${i}`} x={cellX(i)} y={stateY} width={bw} height={bh} rx={8}
            fill={`${C1}12`} stroke={C1} strokeWidth={1} />
        ))}
        {[0, 1].map(i => (
          <text key={`st${i}`} x={cellX(i) + bw / 2} y={stateY + bh / 2 + 6}
            textAnchor="middle" fontSize={14} fontWeight={600} fill={C1}>
            {phase >= 3 ? `r${i === 0 ? '₀' : '₁'}'` : `r${i === 0 ? '₀' : '₁'}`}
          </text>
        ))}
        <rect x={cellX(2)} y={stateY} width={bw} height={bh} rx={8}
          fill={`${C2}12`} stroke={C2} strokeWidth={1} />
        <text x={cellX(2) + bw / 2} y={stateY + bh / 2 + 6}
          textAnchor="middle" fontSize={14} fontWeight={600} fill={C2}>c₀</text>

        {/* Phase 1+: extraction arrows + output */}
        <AnimatePresence>
          {phase >= 1 && (<>
            {[0, 1].map(i => (
              <motion.g key={`a${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.2 * i }}>
                <line x1={cellX(i) + bw / 2} y1={stateY + bh}
                  x2={cellX(i) + bw / 2} y2={outY}
                  stroke={C1} strokeWidth={1.2} />
                <text x={cellX(i) + bw / 2} y={stateY + bh + 18}
                  textAnchor="middle" fontSize={10} fill={C1}>복사 ↓</text>
              </motion.g>
            ))}
            {[0, 1].map(i => (
              <motion.g key={`o${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + 0.2 * i }}>
                <rect x={cellX(i)} y={outY} width={bw} height={bh} rx={8}
                  fill={`${C1}20`} stroke={C1} strokeWidth={1.4} />
                <text x={cellX(i) + bw / 2} y={outY + bh / 2 + 6} textAnchor="middle"
                  fontSize={15} fontWeight={700} fill={C1}>
                  출력 {i}
                </text>
              </motion.g>
            ))}
            <motion.text x={cellX(2) + bw / 2} y={outY + bh / 2 + 6}
              textAnchor="middle" fontSize={13} fontWeight={600} fill={C2}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              비노출
            </motion.text>
          </>)}
        </AnimatePresence>

        {/* Phase 2+: need more? Apply π again */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <text x={CX} y={outY + bh + 24} textAnchor="middle" fontSize={12} fill={MUT}>
                출력 길이가 부족하면?
              </text>
              <rect x={CX - 100} y={outY + bh + 30} width={200} height={30} rx={6}
                fill={`${C3}12`} stroke={C3} strokeWidth={1} />
              <text x={CX} y={outY + bh + 50} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={C3}>π를 한 번 더 적용</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Phase 3: extract again from new state */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1={CX} y1={outY + bh + 60} x2={CX} y2={state2Y - 4}
                stroke={C3} strokeWidth={.6} />
              <text x={CX} y={state2Y + 6} textAnchor="middle" fontSize={12} fill={C1}>
                변경된 rate에서 다시 추출 → 출력 연장 (SHAKE256 등)
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <div className="flex justify-center gap-3 mt-2">
        <button onClick={() => setPhase(0)}
          className="px-3 py-1 rounded text-sm bg-muted hover:bg-muted/80 transition">
          처음
        </button>
        <button onClick={() => setPhase(p => Math.max(0, p - 1))}
          className="px-3 py-1 rounded text-sm bg-muted hover:bg-muted/80 transition"
          disabled={phase === 0}>
          ← 이전
        </button>
        <span className="px-2 py-1 text-sm text-muted-foreground">
          {phase + 1} / {PHASES.length}
        </span>
        <button onClick={() => setPhase(p => Math.min(PHASES.length - 1, p + 1))}
          className="px-3 py-1 rounded text-sm bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition"
          disabled={phase === PHASES.length - 1}>
          다음 →
        </button>
      </div>
    </div>
  );
}

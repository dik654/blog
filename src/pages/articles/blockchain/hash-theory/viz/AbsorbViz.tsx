import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C1 = '#10b981', C2 = '#f59e0b', C3 = '#6366f1';
const MUT = 'var(--muted-foreground)';
const W = 640, CX = W / 2;

/*
  Absorb detail — auto-play animation showing:
  1. State (rate + cap) appears
  2. Message block drops in
  3. XOR merges message into rate cells one by one
  4. Result state shown
  5. Cap unchanged highlighted
*/

const PHASES = [
  '현재 상태 (rate + cap)',
  '메시지 블록 도착',
  'rate 칸마다 XOR 적용',
  '결과 — cap은 변경 없음',
];

export default function AbsorbViz() {
  const [phase, setPhase] = useState(0);

  const bw = 100, bh = 48, gap = 12;
  const rateN = 2, capN = 1;
  const totalW = (rateN + capN) * (bw + gap) - gap;
  const x0 = CX - totalW / 2;
  const stateY = 60;
  const msgY = stateY - 56;
  const resultY = stateY + bh + 70;

  const cellX = (i: number) => x0 + i * (bw + gap);

  return (
    <div className="not-prose">
      <svg viewBox={`0 0 ${W} 260`} className="w-full max-w-3xl" style={{ height: 'auto' }}>
        {/* Phase indicator */}
        <text x={CX} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill={C3}>
          흡수 (Absorb) 상세
        </text>
        <text x={CX} y={38} textAnchor="middle" fontSize={12} fill={MUT}>
          {PHASES[phase]}
        </text>

        {/* Labels */}
        <text x={x0 + (rateN * (bw + gap) - gap) / 2} y={stateY - 8}
          textAnchor="middle" fontSize={11} fill={C1}>rate</text>
        <text x={cellX(rateN) + bw / 2} y={stateY - 8}
          textAnchor="middle" fontSize={11} fill={C2}>cap</text>

        {/* ═══ State row (always visible) ═══ */}
        {[0, 1].map(i => (
          <motion.g key={`s${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * i }}>
            <rect x={cellX(i)} y={stateY} width={bw} height={bh} rx={8}
              fill={`${C1}12`} stroke={C1} strokeWidth={1} />
            <text x={cellX(i) + bw / 2} y={stateY + bh / 2 + 6} textAnchor="middle"
              fontSize={14} fontWeight={600} fill={C1}>
              {phase < 3 ? `r${i === 0 ? '₀' : '₁'}` : `r${i === 0 ? '₀' : '₁'}⊕m`}
            </text>
          </motion.g>
        ))}
        {/* Cap cell */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <rect x={cellX(2)} y={stateY} width={bw} height={bh} rx={8}
            fill={`${C2}12`} stroke={C2} strokeWidth={phase >= 3 ? 2 : 1} />
          <text x={cellX(2) + bw / 2} y={stateY + bh / 2 + 6} textAnchor="middle"
            fontSize={14} fontWeight={600} fill={C2}>c₀</text>
        </motion.g>

        {/* ═══ Phase 1+: Message block drops in ═══ */}
        <AnimatePresence>
          {phase >= 1 && [0, 1].map(i => (
            <motion.g key={`m${i}`}
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i, duration: 0.4 }}>
              <rect x={cellX(i)} y={msgY} width={bw} height={36} rx={6}
                fill={`${C3}12`} stroke={C3} strokeWidth={1} />
              <text x={cellX(i) + bw / 2} y={msgY + 22} textAnchor="middle"
                fontSize={13} fontWeight={600} fill={C3}>
                m[{i}]
              </text>
            </motion.g>
          ))}
        </AnimatePresence>

        {/* ═══ Phase 2+: XOR arrows animate down ═══ */}
        <AnimatePresence>
          {phase >= 2 && [0, 1].map(i => (
            <motion.g key={`xor${i}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + 0.4 * i, duration: 0.3 }}>
              <line x1={cellX(i) + bw / 2} y1={msgY + 36}
                x2={cellX(i) + bw / 2} y2={stateY}
                stroke={C3} strokeWidth={1.2} />
              <circle cx={cellX(i) + bw / 2} cy={(msgY + 36 + stateY) / 2} r={12}
                fill={`${C3}20`} stroke={C3} strokeWidth={1} />
              <text x={cellX(i) + bw / 2} y={(msgY + 36 + stateY) / 2 + 5}
                textAnchor="middle" fontSize={13} fontWeight={700} fill={C3}>⊕</text>
            </motion.g>
          ))}
        </AnimatePresence>

        {/* ═══ Phase 3: Result row ═══ */}
        <AnimatePresence>
          {phase >= 3 && (<>
            <motion.text x={CX} y={resultY - 8} textAnchor="middle" fontSize={12} fill={MUT}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              결과
            </motion.text>
            {[0, 1].map(i => (
              <motion.g key={`r${i}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i, duration: 0.3 }}>
                <rect x={cellX(i)} y={resultY} width={bw} height={bh} rx={8}
                  fill={`${C3}12`} stroke={C3} strokeWidth={1.2} />
                <text x={cellX(i) + bw / 2} y={resultY + bh / 2 + 6} textAnchor="middle"
                  fontSize={13} fontWeight={700} fill={C3}>
                  r{i === 0 ? '₀' : '₁'} ⊕ m[{i}]
                </text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <rect x={cellX(2)} y={resultY} width={bw} height={bh} rx={8}
                fill={`${C2}12`} stroke={C2} strokeWidth={2} />
              <text x={cellX(2) + bw / 2} y={resultY + bh / 2 + 6} textAnchor="middle"
                fontSize={14} fontWeight={600} fill={C2}>c₀</text>
              <text x={cellX(2) + bw / 2} y={resultY + bh + 16} textAnchor="middle"
                fontSize={12} fontWeight={600} fill={C2}>← 변경 없음</text>
            </motion.g>
          </>)}
        </AnimatePresence>
      </svg>

      {/* Controls */}
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

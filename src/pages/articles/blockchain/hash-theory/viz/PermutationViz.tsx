import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C1 = '#10b981', C2 = '#f59e0b', C3 = '#6366f1';
const MUT = 'var(--muted-foreground)';
const W = 640, CX = W / 2;

/*
  Keccak-f permutation — 5 internal steps, animated sequentially.
  Shown as a 5×5 grid (simplified) that transforms through each step.
*/

const PHASES = [
  { title: '입력 상태', desc: 'rate + cap이 하나의 5×5 행렬로 배열됨', color: C3 },
  { title: 'θ (세타)', desc: '각 열의 패리티를 계산 → 인접 열에 XOR. 열 간 확산.', color: C1 },
  { title: 'ρ (로)', desc: '각 칸을 서로 다른 양만큼 비트 회전. 칸 내부 확산.', color: C1 },
  { title: 'π (파이)', desc: '칸 위치를 고정 패턴으로 재배치. 행↔열 혼합.', color: C1 },
  { title: 'χ (카이)', desc: '행 내 비선형 혼합. 각 비트 = 자신 ⊕ (¬이웃 AND 이웃).', color: C2 },
  { title: 'ι (이오타)', desc: '라운드 상수를 XOR. 라운드마다 다른 상수 → 대칭 파괴.', color: C2 },
  { title: '1라운드 완료', desc: '이 5단계를 24번 반복하면 Keccak-f 순열 완성.', color: C3 },
];

/* 5x5 mini grid */
const GS = 32, GG = 3;
const gridW = 5 * (GS + GG) - GG;
const gx0 = CX - gridW / 2;

function Grid({ phase, y }: { phase: number; y: number }) {
  /* Color cells differently per phase to show transformation */
  const getColor = (r: number, c: number) => {
    if (phase === 0) return r < 3 ? C1 : C2; // rate vs cap
    if (phase === 1) return C1; // θ: column-based → highlight columns
    if (phase === 2) return C1; // ρ: rotation arrows
    if (phase === 3) return C3; // π: rearrange
    if (phase === 4) return C2; // χ: nonlinear
    if (phase === 5) return C2; // ι: one cell gets constant
    return C3;
  };

  const getOpacity = (r: number, c: number) => {
    if (phase === 1) return c === 2 ? 1 : 0.4; // highlight one column
    if (phase === 3) return (r + c) % 2 === 0 ? 1 : 0.5; // checkerboard shuffle
    if (phase === 5) return (r === 0 && c === 0) ? 1 : 0.4; // one cell for ι
    return 0.8;
  };

  return (
    <g>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => {
          const col = getColor(r, c);
          const op = getOpacity(r, c);
          const cx = gx0 + c * (GS + GG);
          const cy = y + r * (GS + GG);

          /* π phase: animate position swap */
          const dx = phase === 3 ? ((c * 2 + r) % 5 - c) * (GS + GG) : 0;
          const dy = phase === 3 ? (c - r) * (GS + GG) * 0.3 : 0;

          /* ρ phase: show rotation arrow */
          const showRotArrow = phase === 2 && (r + c) % 3 === 0;

          return (
            <motion.g key={`${r}-${c}`}
              animate={{ x: dx, y: dy, opacity: op }}
              transition={{ duration: 0.4, delay: (r * 5 + c) * 0.02 }}>
              <rect x={cx} y={cy} width={GS} height={GS} rx={4}
                fill={`${col}18`} stroke={col} strokeWidth={.8} />
              {phase === 0 && (
                <text x={cx + GS / 2} y={cy + GS / 2 + 4} textAnchor="middle"
                  fontSize={9} fill={col}>{r < 3 ? 'r' : 'c'}</text>
              )}
              {showRotArrow && (
                <text x={cx + GS / 2} y={cy + GS / 2 + 5} textAnchor="middle"
                  fontSize={12} fill={C1}>↻</text>
              )}
              {phase === 4 && (
                <text x={cx + GS / 2} y={cy + GS / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={C2}>⊕</text>
              )}
              {phase === 5 && r === 0 && c === 0 && (
                <text x={cx + GS / 2} y={cy + GS / 2 + 5} textAnchor="middle"
                  fontSize={9} fontWeight={700} fill={C2}>RC</text>
              )}
            </motion.g>
          );
        })
      )}
    </g>
  );
}

export default function PermutationViz() {
  const [phase, setPhase] = useState(0);
  const p = PHASES[phase];
  const gridY = 80;

  return (
    <div className="not-prose">
      <svg viewBox={`0 0 ${W} 280`} className="w-full max-w-3xl" style={{ height: 'auto' }}>
        <text x={CX} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill={C3}>
          순열 π 내부 — Keccak-f (24라운드)
        </text>

        {/* Phase title + description */}
        <AnimatePresence mode="wait">
          <motion.g key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <text x={CX} y={48} textAnchor="middle" fontSize={16} fontWeight={700} fill={p.color}>
              {p.title}
            </text>
            <text x={CX} y={68} textAnchor="middle" fontSize={12} fill={MUT}>
              {p.desc}
            </text>
          </motion.g>
        </AnimatePresence>

        {/* 5×5 grid */}
        <Grid phase={phase} y={gridY} />

        {/* Grid labels */}
        {phase === 0 && (<>
          <text x={gx0 + gridW + 12} y={gridY + 1.5 * (GS + GG)} fontSize={11} fill={C1}>
            ← rate (상위 3행)
          </text>
          <text x={gx0 + gridW + 12} y={gridY + 4 * (GS + GG)} fontSize={11} fill={C2}>
            ← cap (하위 2행)
          </text>
        </>)}

        {phase === 1 && (
          <text x={gx0 + 2 * (GS + GG) + GS / 2} y={gridY + 5 * (GS + GG) + 6}
            textAnchor="middle" fontSize={10} fill={C1}>
            ↑ 이 열의 패리티 → 양옆 열에 XOR
          </text>
        )}

        {phase === 6 && (<>
          <text x={CX} y={gridY + 5 * (GS + GG) + 14}
            textAnchor="middle" fontSize={12} fill={C3}>
            θ → ρ → π → χ → ι = 1라운드
          </text>
          <text x={CX} y={gridY + 5 * (GS + GG) + 32}
            textAnchor="middle" fontSize={12} fill={MUT}>
            × 24라운드 반복 → 입력과 출력이 완전히 무관해짐
          </text>
        </>)}
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

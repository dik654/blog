import { motion } from 'framer-motion';
import { useState } from 'react';
import StepViz from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  filled: '#10b981',
  empty: '#6b7280',
  dtwist: '#3b82f6',
  mtwist: '#f59e0b',
  sparse: '#10b981',
  full: '#ef4444',
};

// Fp12 basis: {1, w, v, vw, v², v²w} × Fp2 → 12 slots
// Slot index → label
const SLOT_LABELS = [
  '1·1', '1·u',
  'w·1', 'w·u',
  'v·1', 'v·u',
  'vw·1', 'vw·u',
  'v²·1', 'v²·u',
  'v²w·1', 'v²w·u',
];

const STEPS = [
  {
    label: '① Fp12 = 12 슬롯 = {1, w, v, vw, v², v²w} × {1, u}',
    body: (
      <>
        Fp12 한 원소 = <M>{'\\mathbb{F}_{p^2}'}</M> 계수 6개 = <M>{'\\mathbb{F}_p'}</M> 계수 12개.
        {'\n'}이 12개 슬롯이 비어 있는 보드에서 출발한다.
      </>
    ),
  },
  {
    label: '② Line 평가: l(P) = y_P + (-λ·x_P)·w + (λx_T - y_T)·vw',
    body: (
      <>
        G1 점 <M>P</M>에서 평가하면 슬롯 0(상수항), 슬롯 2(<M>w</M>항), 슬롯 6(<M>vw</M>항)만 채워진다.
        {'\n'}나머지 9 슬롯은 모두 0 — 그래서 <strong>sparse</strong>.
      </>
    ),
  },
  {
    label: '③ D-twist (0,3,4) vs M-twist (0,1,4) — twist 종류로 위치만 바뀐다',
    body: (
      <>
        D-twist: <code>mul_by_034</code> — 슬롯 0, 3, 4가 non-zero.
        {'\n'}M-twist: <code>mul_by_014</code> — 슬롯 0, 1, 4가 non-zero.
        {'\n'}패턴은 다르지만 항상 <strong>3개 Fp2 = 6 Fp 계수</strong>만 살아있다.
      </>
    ),
  },
  {
    label: '④ Standard Fp12 mult (Karatsuba) = 18 Fp2 곱셈',
    body: (
      <>
        일반 곱은 모든 항 × 모든 항 — 6 Fp2 × 6 Fp2 그리드를 Karatsuba로 풀어 <M>18</M>회 Fp2 곱.
        {'\n'}곱셈 그리드의 모든 셀이 살아있다.
      </>
    ),
  },
  {
    label: '⑤ Sparse line mult ≈ 9 Fp2 곱셈 (50% 절감)',
    body: (
      <>
        line function은 6 Fp2 중 <strong>3개</strong>만 non-zero — 그리드 절반이 0이라 건너뛴다.
        {'\n'}<M>{'18 \\to 9'}</M> Fp2 mults = <strong>50% 절감</strong>. Miller loop 매 비트마다 누적.
      </>
    ),
  },
];

// 4×3 grid (12 slots) — but easier to read as 6×2 (6 Fp2 × 2 Fp coeffs)
const GRID_COLS = 6;
const GRID_ROWS = 2;
const CELL_W = 56;
const CELL_H = 36;
const GRID_X = 60;
const GRID_Y = 60;

const D_TWIST = [0, 3, 4];   // Fp2-level slots
const M_TWIST = [0, 1, 4];

// Convert Fp2-slot index to two Fp-slot indices
function fp2ToFp(fp2idx: number): [number, number] {
  return [fp2idx * 2, fp2idx * 2 + 1];
}

export default function SparseSlotPatternViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 2 && <SlotGrid step={step} />}
          {step === 3 && <MultGrid sparse={false} />}
          {step === 4 && <MultGrid sparse={true} />}
        </svg>
      )}
    </StepViz>
  );
}

/* ============ Slot grid (steps 1-3) ============ */
function SlotGrid({ step }: { step: number }) {
  const [twist, setTwist] = useState<'D' | 'M'>('D');

  // Step 1: line eval reveal — slots 0, 2, 6 (using D-twist style: idx 0,3,4 in Fp2)
  // We'll use D-twist as default: Fp2 slots 0,3,4 → Fp slots 0-1, 6-7, 8-9
  // But the body says "slot 0, 2, 6" for Fp positions. Let's keep it intuitive:
  // For step 2 (line eval), highlight Fp2 slots 0, 3, 4 = D-twist default.
  const activeFp2 =
    step === 0 ? [] :
    step === 1 ? [0, 3, 4] :
    twist === 'D' ? D_TWIST : M_TWIST;

  const color = step <= 1 ? C.filled : (twist === 'D' ? C.dtwist : C.mtwist);

  return (
    <g>
      {/* Title */}
      <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.empty}>
        Fp12 = 6 Fp2 slots × 2 Fp coeffs (12 cells)
      </text>

      {/* Grid cells */}
      {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        // Fp2 slot index = col, Fp coeff = row (1 or u)
        const fp2idx = col;
        const isActive = activeFp2.includes(fp2idx);
        const x = GRID_X + col * (CELL_W + 4);
        const y = GRID_Y + row * (CELL_H + 4);

        return (
          <g key={i}>
            <motion.rect
              x={x}
              y={y}
              width={CELL_W}
              height={CELL_H}
              rx={4}
              initial={{ fill: `${C.empty}15`, stroke: C.empty }}
              animate={{
                fill: isActive ? `${color}30` : `${C.empty}15`,
                stroke: isActive ? color : C.empty,
                strokeWidth: isActive ? 1.6 : 0.6,
              }}
              transition={{ ...sp, delay: isActive ? fp2idx * 0.05 : 0 }}
            />
            <text
              x={x + CELL_W / 2}
              y={y + CELL_H / 2 - 2}
              textAnchor="middle"
              fontSize={9}
              fontWeight={isActive ? 700 : 400}
              fill={isActive ? color : C.empty}
            >
              {SLOT_LABELS[fp2idx * 2 + row]}
            </text>
            <text
              x={x + CELL_W / 2}
              y={y + CELL_H / 2 + 9}
              textAnchor="middle"
              fontSize={7}
              fill={isActive ? color : C.empty}
            >
              {isActive && step >= 1 ? 'non-0' : '0'}
            </text>
          </g>
        );
      })}

      {/* Fp2 slot index labels above */}
      {Array.from({ length: GRID_COLS }).map((_, c) => (
        <text
          key={`col-${c}`}
          x={GRID_X + c * (CELL_W + 4) + CELL_W / 2}
          y={GRID_Y - 4}
          textAnchor="middle"
          fontSize={8}
          fill={C.empty}
        >
          slot {c}
        </text>
      ))}

      {/* Step 2: equation hint */}
      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
          <rect x={60} y={170} width={360} height={50} rx={6} fill={`${C.filled}10`} stroke={`${C.filled}55`} strokeWidth={1} />
          <text x={240} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.filled}>
            l(P) = y_P  +  (−λ · x_P) · w  +  (λ x_T − y_T) · vw
          </text>
          <text x={240} y={205} textAnchor="middle" fontSize={9} fill={C.empty}>
            slot 0 (const) + slot 3 (w) + slot 4 (vw) → 3 of 6 Fp2 = non-zero
          </text>
          <text x={240} y={216} textAnchor="middle" fontSize={8} fill={C.empty}>
            나머지 9 Fp 계수는 모두 0
          </text>
        </motion.g>
      )}

      {/* Step 3: D/M twist toggle */}
      {step === 2 && (
        <g>
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sp}
            onClick={() => setTwist('D')}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={90}
              y={175}
              width={150}
              height={42}
              rx={6}
              fill={twist === 'D' ? `${C.dtwist}25` : `${C.empty}10`}
              stroke={twist === 'D' ? C.dtwist : C.empty}
              strokeWidth={twist === 'D' ? 1.6 : 0.8}
            />
            <text x={165} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill={twist === 'D' ? C.dtwist : C.empty}>
              D-twist
            </text>
            <text x={165} y={208} textAnchor="middle" fontSize={9} fill={twist === 'D' ? C.dtwist : C.empty}>
              slots 0, 3, 4 · mul_by_034
            </text>
          </motion.g>

          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.05 }}
            onClick={() => setTwist('M')}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={250}
              y={175}
              width={150}
              height={42}
              rx={6}
              fill={twist === 'M' ? `${C.mtwist}25` : `${C.empty}10`}
              stroke={twist === 'M' ? C.mtwist : C.empty}
              strokeWidth={twist === 'M' ? 1.6 : 0.8}
            />
            <text x={325} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill={twist === 'M' ? C.mtwist : C.empty}>
              M-twist
            </text>
            <text x={325} y={208} textAnchor="middle" fontSize={9} fill={twist === 'M' ? C.mtwist : C.empty}>
              slots 0, 1, 4 · mul_by_014
            </text>
          </motion.g>
        </g>
      )}
    </g>
  );
}

/* ============ Mult grid (steps 4-5) ============ */
function MultGrid({ sparse }: { sparse: boolean }) {
  // 6×6 Fp2 grid (Fp12 = 6 Fp2 coeffs, so mult is 6×6 = 36 cells, but Karatsuba reduces to 18 mults)
  const N = 6;
  const CW = 36;
  const CH = 28;
  const GX = 60;
  const GY = 50;

  const nonZeroCols = D_TWIST; // Sparse: line is non-zero only in slots 0, 3, 4

  return (
    <g>
      {/* Header */}
      <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={sparse ? C.sparse : C.full}>
        {sparse ? 'Sparse mult: line × Fp12 (3 non-zero × 6 = 18 cells, 9 effective Fp2 mults)' : 'Standard Fp12 mult: 6 × 6 = 36 cells (Karatsuba → 18 Fp2 mults)'}
      </text>

      {/* Column labels (Fp12 input b) */}
      {Array.from({ length: N }).map((_, c) => (
        <text key={`c-${c}`} x={GX + c * (CW + 2) + CW / 2} y={GY - 6} textAnchor="middle" fontSize={8} fill={C.empty}>
          b{c}
        </text>
      ))}
      {/* Row labels (line a) */}
      {Array.from({ length: N }).map((_, r) => (
        <text key={`r-${r}`} x={GX - 8} y={GY + r * (CH + 2) + CH / 2 + 3} textAnchor="end" fontSize={8} fill={C.empty}>
          a{r}
        </text>
      ))}

      {/* Cells */}
      {Array.from({ length: N * N }).map((_, i) => {
        const r = Math.floor(i / N);
        const c = i % N;
        const x = GX + c * (CW + 2);
        const y = GY + r * (CH + 2);
        const aIsZero = sparse && !nonZeroCols.includes(r);
        const isLive = !aIsZero;
        const color = sparse ? C.sparse : C.full;

        return (
          <motion.g key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...sp, delay: (r * N + c) * 0.012 }}
          >
            <motion.rect
              x={x}
              y={y}
              width={CW}
              height={CH}
              rx={3}
              animate={{
                fill: isLive ? `${color}25` : `${C.empty}10`,
                stroke: isLive ? color : C.empty,
                strokeWidth: isLive ? 1 : 0.5,
                opacity: isLive ? 1 : 0.4,
              }}
              transition={sp}
            />
            <text
              x={x + CW / 2}
              y={y + CH / 2 + 3}
              textAnchor="middle"
              fontSize={8}
              fontWeight={isLive ? 600 : 400}
              fill={isLive ? color : C.empty}
            >
              {isLive ? `a${r}b${c}` : '·'}
            </text>
          </motion.g>
        );
      })}

      {/* Stats badge */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
        <rect
          x={60}
          y={GY + N * (CH + 2) + 8}
          width={360}
          height={30}
          rx={6}
          fill={sparse ? `${C.sparse}15` : `${C.full}15`}
          stroke={sparse ? C.sparse : C.full}
          strokeWidth={1.2}
        />
        <text
          x={240}
          y={GY + N * (CH + 2) + 28}
          textAnchor="middle"
          fontSize={11}
          fontWeight={800}
          fill={sparse ? C.sparse : C.full}
        >
          {sparse ? '≈ 9 Fp2 mults  ·  18 → 9 (50% 절감)' : '18 Fp2 mults (Karatsuba on full 6×6)'}
        </text>
      </motion.g>
    </g>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Poseidon1 vs Poseidon2', body: '핵심 차이: Partial round의 MDS를 대각 행렬로 교체.\n곱셈 O(T²) → O(T)로 줄여 ~30% 속도 향상.' },
  { label: 'Poseidon1: dense MDS 연산', body: 'Partial round에서도 dense MDS 사용.\nT=3 기준 9회 곱셈. T=16이면 256회 → 비효율.' },
  { label: 'Poseidon2: 대각 MDS 연산', body: 'Internal round에서 D+1 대각 행렬 사용.\nT=3 기준 3회 곱셈. T=16이면 16회 → 16배 절감.' },
];

const labels = ['s₀', 's₁', 's₂'];
const y0 = 36, gap = 38;

/* 행렬 연산 시각화 */
function MatrixOp({ matRows, formulas, matColor, matLabel, complexity }:
  { matRows: string[][]; formulas: string[]; matColor: string; matLabel: string; complexity: string }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* 열 헤더 */}
      <text x={44} y={y0 - 6} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">입력</text>
      <text x={150} y={y0 - 6} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">{matLabel}</text>
      <text x={340} y={y0 - 6} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">출력 공식</text>

      {labels.map((l, i) => {
        const y = y0 + i * gap;
        const hasMul = matRows[i].some(v => v !== '0' && v !== '1');
        return (
          <motion.g key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            {/* input */}
            <rect x={20} y={y} width={48} height={28} rx={5}
              fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
            <text x={44} y={y + 18} textAnchor="middle"
              fontSize={10} fontWeight={600} fill={C1}>{l}</text>

            {/* matrix row */}
            <rect x={86} y={y} width={128} height={28} rx={5}
              fill={`${matColor}08`} stroke={matColor} strokeWidth={0.7} />
            <text x={150} y={y + 18} textAnchor="middle"
              fontSize={9} fontWeight={500} fill={matColor}>
              [{matRows[i].join('    ')}]
            </text>

            {/* = sign */}
            <text x={226} y={y + 18} fontSize={10} fill="var(--muted-foreground)">=</text>

            {/* formula */}
            <rect x={240} y={y} width={200} height={28} rx={5}
              fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
            <text x={340} y={y + 18} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C2}>{formulas[i]}</text>
          </motion.g>
        );
      })}

      {/* complexity badge */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={140} y={y0 + 3 * gap + 4} width={200} height={22} rx={11}
          fill={`${matColor}12`} stroke={matColor} strokeWidth={0.8} />
        <text x={240} y={y0 + 3 * gap + 19} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={matColor}>{complexity}</text>
      </motion.g>
    </motion.g>
  );
}

/* Step 0: comparison overview */
function Overview() {
  const rows = [
    { label: 'MDS 행렬', v1: 'dense (모든 원소 ≠ 0)', v2: 'D+1 대각 (대부분 0)' },
    { label: '곱셈 횟수', v1: 'T² = 9 (T=3)', v2: 'T = 3 (T=3)' },
    { label: '속도', v1: '기준', v2: '~30% 향상' },
  ];
  const x0 = 30, colW = [90, 160, 160];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">Partial/Internal Round MDS 비교</text>
      {/* headers */}
      <text x={x0 + colW[0] + colW[1] / 2} y={40} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={C3}>Poseidon1</text>
      <text x={x0 + colW[0] + colW[1] + colW[2] / 2} y={40} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={C2}>Poseidon2</text>
      <line x1={x0} y1={46} x2={x0 + colW[0] + colW[1] + colW[2]} y2={46}
        stroke="var(--border)" strokeWidth={0.5} />
      {rows.map((r, i) => {
        const y = 64 + i * 32;
        return (
          <motion.g key={r.label} initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <text x={x0} y={y} fontSize={9} fontWeight={500}
              fill="var(--muted-foreground)">{r.label}</text>
            <text x={x0 + colW[0] + colW[1] / 2} y={y} textAnchor="middle"
              fontSize={9} fill={C3}>{r.v1}</text>
            <text x={x0 + colW[0] + colW[1] + colW[2] / 2} y={y} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C2}>{r.v2}</text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}

export default function Poseidon2Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 0 ? '0 0 480 160' : '0 0 480 170'}
          className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Overview />}
          {step === 1 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>
                Poseidon1: dense MDS (Partial Round)
              </text>
              <MatrixOp
                matRows={[['2', '1', '1'], ['1', '2', '1'], ['1', '1', '2']]}
                formulas={['2·s₀ + 1·s₁ + 1·s₂', '1·s₀ + 2·s₁ + 1·s₂', '1·s₀ + 1·s₁ + 2·s₂']}
                matColor={C3} matLabel="dense MDS"
                complexity="T² = 9 곱셈/라운드 — 모든 원소와 곱셈"
              />
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>
                Poseidon2: D+1 대각 (Internal Round)
              </text>
              <MatrixOp
                matRows={[['d₀', '0', '0'], ['0', 'd₁', '0'], ['0', '0', 'd₂']]}
                formulas={['d₀·s₀ + s₀+s₁+s₂', 'd₁·s₁ + s₀+s₁+s₂', 'd₂·s₂ + s₀+s₁+s₂']}
                matColor={C2} matLabel="D+1 대각"
                complexity="T = 3 곱셈/라운드 — 대각 원소만 곱셈 (~30% 향상)"
              />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

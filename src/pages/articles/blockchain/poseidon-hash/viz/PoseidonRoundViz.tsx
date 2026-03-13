import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  {
    label: 'Step 1: 입력 상태 벡터 [c, r0, r1]',
    body: 'Poseidon은 t개의 필드 원소로 구성된 상태 벡터를 입력으로 받습니다. t=3인 경우 capacity 1개와 rate 2개로 구성됩니다.',
  },
  {
    label: 'Step 2: AddRoundConstants (ARC)',
    body: '각 상태 원소에 라운드 상수 ci를 더합니다. 상수는 Grain LFSR로 결정론적으로 생성되며, nothing-up-my-sleeve 원칙을 따릅니다.',
  },
  {
    label: 'Step 3: S-box (x -> x^5) 적용',
    body: 'S-box는 x^5 거듭제곱으로 구현됩니다. Full round에서는 모든 원소에, partial round에서는 첫 번째 원소에만 적용합니다. R1CS에서 3개의 곱셈 제약조건으로 표현됩니다.',
  },
  {
    label: 'Step 4: MDS 행렬 곱셈 (혼합)',
    body: 'MDS(Maximum Distance Separable) 행렬을 곱하여 상태를 혼합합니다. branch number = t+1로 최대 확산을 보장하며, 한 입력의 변경이 모든 출력에 영향을 줍니다.',
  },
];

/* Layout constants */
const W = 400;
const H = 220;
const CX = W / 2;
const CELL_W = 60;
const CELL_H = 32;
const GAP = 16;
const STATE_LABELS = ['c', 'r\u2080', 'r\u2081'];
const STATE_X = [CX - CELL_W - GAP, CX, CX + CELL_W + GAP];

function Cell({ x, y, label, color, show, sub }: {
  x: number; y: number; label: string; color: string; show: boolean; sub?: string;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.35 }}
    >
      <rect x={x - CELL_W / 2} y={y - CELL_H / 2} width={CELL_W} height={CELL_H} rx={6}
        fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight="600" fill={color}>
        {label}
      </text>
      {sub && (
        <text x={x} y={y + CELL_H / 2 + 14} textAnchor="middle" fontSize={9} fill={`${color}aa`}>
          {sub}
        </text>
      )}
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, color, show }: {
  x1: number; y1: number; x2: number; y2: number; color: string; show: boolean;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5} strokeDasharray="4 3"
      initial={{ opacity: 0 }} animate={show ? { opacity: 0.6 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}

export default function PoseidonRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md">
          {/* Row 1: Input state */}
          {STATE_LABELS.map((lbl, i) => (
            <Cell key={`in-${i}`} x={STATE_X[i]} y={30} label={lbl}
              color={i === 0 ? C.purple : C.blue} show={step >= 0}
              sub={step === 0 ? `s${i}` : undefined} />
          ))}

          {/* Row 2: After ARC */}
          {step >= 1 && STATE_LABELS.map((_, i) => (
            <g key={`arc-${i}`}>
              <Arrow x1={STATE_X[i]} y1={46} x2={STATE_X[i]} y2={74} color={C.orange} show />
              <Cell x={STATE_X[i]} y={90} label={`s${i}+c${i}`}
                color={C.orange} show sub={step === 1 ? 'ARC' : undefined} />
            </g>
          ))}

          {/* Row 3: After S-box */}
          {step >= 2 && STATE_LABELS.map((_, i) => (
            <g key={`sbox-${i}`}>
              <Arrow x1={STATE_X[i]} y1={106} x2={STATE_X[i]} y2={134} color={C.green} show />
              <Cell x={STATE_X[i]} y={150} label={`(...)^5`}
                color={C.green} show sub={step === 2 ? 'S-box' : undefined} />
            </g>
          ))}

          {/* Row 4: After MDS */}
          {step >= 3 && (
            <>
              {/* Cross-mixing arrows */}
              {STATE_X.map((sx, i) =>
                STATE_X.map((dx, j) => (
                  <Arrow key={`mix-${i}-${j}`}
                    x1={sx} y1={166} x2={dx} y2={194}
                    color={C.purple} show />
                ))
              )}
              {STATE_LABELS.map((_, i) => (
                <Cell key={`mds-${i}`} x={STATE_X[i]} y={200}
                  label={`s'${i}`} color={C.purple} show sub="MDS" />
              ))}
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}

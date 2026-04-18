import { motion } from 'framer-motion';
import { C, VARIANCE_EXAMPLES, SOFT_LARGE, SOFT_SMALL, SCORE_TABLE } from './MultiplicativeDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: Variance analysis - why scaling is needed */
function VarianceStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C.muted}>Var[Q·K] = dₖ — 차원이 클수록 분산 커지</text>

      {/* Q,K assumption */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x={10} y={24} width={140} height={26} rx={4}
          fill={C.dot + '10'} stroke={C.dot} strokeWidth={0.8} />
        <text x={80} y={37} textAnchor="middle" fontSize={8} fill={C.dot}>
          Qᵢ, Kᵢ ~ N(0, 1) 독립
        </text>
        <text x={80} y={62} fontSize={8} fill={C.dot}>
          Q·K = Σ QᵢKᵢ → Var = dₖ
        </text>
      </motion.g>

      {/* Three examples with bars */}
      {VARIANCE_EXAMPLES.map((ex, i) => {
        const bx = 30 + i * 150;
        const rawH = Math.min(ex.raw * 2, 50);
        const scaledH = ex.scaled * 30;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15 }}>
            <text x={bx + 30} y={82} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={C.muted}>dₖ={ex.dk}</text>

            {/* Raw bar */}
            <rect x={bx} y={140 - rawH} width={25} height={rawH} rx={3}
              fill={C.dot + '30'} stroke={C.dot} strokeWidth={0.8} />
            <text x={bx + 12} y={136 - rawH} textAnchor="middle" fontSize={7}
              fill={C.dot}>{ex.raw}</text>

            {/* Scaled bar */}
            <rect x={bx + 35} y={140 - scaledH} width={25} height={scaledH} rx={3}
              fill={C.scaled + '40'} stroke={C.scaled} strokeWidth={0.8} />
            <text x={bx + 47} y={136 - scaledH} textAnchor="middle" fontSize={7}
              fill={C.scaled}>{ex.scaled}</text>

            {/* Division */}
            <text x={bx + 30} y={152} textAnchor="middle" fontSize={7}
              fill={C.muted}>/√{ex.dk}={ex.sqrt}</text>
          </motion.g>
        );
      })}

      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={380} y={86} width={8} height={8} rx={1} fill={C.dot + '30'} stroke={C.dot} strokeWidth={0.5} />
        <text x={392} y={93} fontSize={7} fill={C.dot}>raw</text>
        <rect x={420} y={86} width={8} height={8} rx={1} fill={C.scaled + '40'} stroke={C.scaled} strokeWidth={0.5} />
        <text x={432} y={93} fontSize={7} fill={C.scaled}>scaled</text>
      </motion.g>
    </g>
  );
}

/* Step 1: Softmax saturation visualization */
function SaturationStep() {
  const barW = 50;
  const maxH = 70;

  function drawBars(vals: number[], label: string, ox: number, color: string, inputLabel: string) {
    return (
      <g>
        <text x={ox + 75} y={22} textAnchor="middle" fontSize={8} fontWeight={600} fill={color}>
          {inputLabel}
        </text>
        {vals.map((v, i) => {
          const h = v * maxH;
          return (
            <motion.g key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `${ox + i * (barW + 6) + barW / 2}px 140px` }}
              transition={{ delay: i * 0.1, ...sp }}>
              <rect x={ox + i * (barW + 6)} y={140 - h} width={barW} height={h}
                rx={3} fill={color + '30'} stroke={color} strokeWidth={1} />
              <text x={ox + i * (barW + 6) + barW / 2} y={134 - h}
                textAnchor="middle" fontSize={8} fontWeight={600} fill={color}>
                {v < 0.001 ? '~0' : v.toFixed(v < 0.01 ? 4 : 2)}
              </text>
            </motion.g>
          );
        })}
        <text x={ox + 75} y={152} textAnchor="middle" fontSize={7} fill={C.muted}>{label}</text>
      </g>
    );
  }

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Softmax 포화 비교 — 입력 크기에 따른 출력 분포
      </text>
      {drawBars(SOFT_LARGE, '포화 (one-hot)', 15, '#ef4444', 'input [10, 1, 1]')}
      {drawBars(SOFT_SMALL, '부드러움', 270, C.scaled, 'input [1, 0.1, 0.1]')}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={248} y={85} textAnchor="middle" fontSize={16} fill={C.muted}>vs</text>
        <text x={248} y={105} textAnchor="middle" fontSize={7} fill={'#ef4444'}>
          ∂softmax ≈ 0
        </text>
        <text x={248} y={116} textAnchor="middle" fontSize={7} fill={C.scaled}>
          ∂softmax ≠ 0
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: Score function comparison with visual blocks */
function ScoreCompareStep() {
  const rowH = 26;
  const startY = 28;
  const colors = [C.dot, C.scaled, C.general, '#8b5cf6'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C.muted}>4가지 Score 함수</text>

      {SCORE_TABLE.map((row, i) => {
        const y = startY + i * rowH;
        const c = colors[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={15} y={y} width={450} height={rowH - 4} rx={5}
              fill={c + '10'} stroke={c} strokeWidth={i === 1 ? 1.5 : 0.8} />
            <text x={30} y={y + 16} fontSize={9} fontWeight={600} fill={c}>{row.name}</text>
            <text x={130} y={y + 16} fontSize={9} fill={c}>{row.formula}</text>
            <text x={280} y={y + 16} fontSize={8} fill={c}>
              파라미터: {row.params === 0 ? '없음' : row.params + '개'}
            </text>
            <text x={400} y={y + 16} fontSize={9} fill={c}>{row.speed}</text>
          </motion.g>
        );
      })}

      {/* Practical recommendation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={80} y={132} width={320} height={22} rx={6}
          fill={C.scaled + '12'} stroke={C.scaled} strokeWidth={1} />
        <text x={240} y={147} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.scaled}>
          Transformer: Scaled Dot │ 소규모 RNN: Additive │ 다른 차원: General
        </text>
      </motion.g>
    </g>
  );
}

/* Step 3: Luong Global vs Local + Input-feeding */
function LuongExtrasStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C.muted}>Luong의 추가 기여</text>

      {/* Global attention */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={15} y={28} width={210} height={52} rx={6}
          fill={C.dot + '10'} stroke={C.dot} strokeWidth={1.2} />
        <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.dot}>Global Attention</text>
        {/* All source tokens highlighted */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={25 + i * 38} y={50} width={30} height={16} rx={3}
            fill={C.dot + '25'} stroke={C.dot} strokeWidth={0.8} />
        ))}
        <text x={120} y={74} textAnchor="middle" fontSize={7} fill={C.dot}>
          모든 소스 위치 참조
        </text>
      </motion.g>

      {/* Local attention */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <rect x={245} y={28} width={220} height={52} rx={6}
          fill={C.general + '10'} stroke={C.general} strokeWidth={1.2} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.general}>Local Attention</text>
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={255 + i * 38} y={50} width={30} height={16} rx={3}
            fill={i >= 1 && i <= 3 ? C.general + '35' : C.muted + '08'}
            stroke={i >= 1 && i <= 3 ? C.general : C.muted}
            strokeWidth={i >= 1 && i <= 3 ? 1 : 0.5} />
        ))}
        <text x={355} y={74} textAnchor="middle" fontSize={7} fill={C.general}>
          윈도우 내만 참조 → 효율적
        </text>
      </motion.g>

      {/* Input-feeding */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={60} y={92} width={360} height={44} rx={6}
          fill={C.scaled + '08'} stroke={C.scaled} strokeWidth={1} />
        <text x={240} y={106} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.scaled}>Input-feeding Approach</text>

        {/* Decoder chain with context feedback */}
        {['s₁', 's₂', 's₃'].map((s, i) => (
          <g key={i}>
            <rect x={100 + i * 100} y={110} width={40} height={18} rx={4}
              fill={C.scaled + '15'} stroke={C.scaled} strokeWidth={0.8} />
            <text x={120 + i * 100} y={123} textAnchor="middle" fontSize={8}
              fill={C.scaled}>{s}</text>
            {i < 2 && (
              <motion.line x1={140 + i * 100} y1={119} x2={200 + i * 100} y2={119}
                stroke={C.scaled} strokeWidth={0.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }} />
            )}
          </g>
        ))}
        <text x={240} y={142} textAnchor="middle" fontSize={7} fill={C.scaled} opacity={0.7}>
          이전 cᵢ₋₁을 concat → 과거 attention 결정 기억
        </text>
      </motion.g>
    </g>
  );
}

export default function MultiplicativeDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <VarianceStep />;
    case 1: return <SaturationStep />;
    case 2: return <ScoreCompareStep />;
    case 3: return <LuongExtrasStep />;
    default: return <g />;
  }
}

import { motion } from 'framer-motion';
import { C } from './AttnScoreDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function DotProductStep() {
  const scores = [
    [1.23, 0.68, 0.35],
    [0.58, 0.82, 0.43],
    [0.34, 0.31, 1.12],
  ];
  const tokens = ['t₀', 't₁', 't₂'];
  const cs = 32;
  const ox = 50;
  const oy = 32;
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.q}>
        Step 1: Q·K^T → 유사도 행렬
      </text>
      {/* Col / Row labels */}
      {tokens.map((t, i) => (
        <g key={i}>
          <text x={ox + i * cs + cs / 2} y={oy - 4} textAnchor="middle" fontSize={8}
            fill={C.k} fontWeight={600}>{t}</text>
          <text x={ox - 6} y={oy + i * cs + cs / 2 + 3} textAnchor="end" fontSize={8}
            fill={C.q} fontWeight={600}>{t}</text>
        </g>
      ))}
      {/* Matrix */}
      {scores.map((row, r) =>
        row.map((v, c) => (
          <motion.g key={`${r}-${c}`} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: (r * 3 + c) * 0.04 }}>
            <rect x={ox + c * cs} y={oy + r * cs} width={cs - 2} height={cs - 2} rx={4}
              fill={r === c ? C.q + '25' : C.q + '10'} stroke={C.q} strokeWidth={r === c ? 1 : 0.5} />
            <text x={ox + c * cs + cs / 2 - 1} y={oy + r * cs + cs / 2 + 3}
              textAnchor="middle" fontSize={9} fontWeight={r === c ? 700 : 400}
              fill={C.q}>{v.toFixed(2)}</text>
          </motion.g>
        ))
      )}
      {/* Calculation example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={200} y={30} width={268} height={54} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={334} y={44} textAnchor="middle" fontSize={8} fill={C.muted} fontWeight={600}>
          계산 예: scores[0][0]
        </text>
        <text x={334} y={58} textAnchor="middle" fontSize={7} fill={C.muted}>
          = 1.0·0.9 + 0.5·0.4 + ... + 0.3·0.3
        </text>
        <text x={334} y={72} textAnchor="middle" fontSize={7} fill={C.q}>
          = 0.9 + 0.2 + 0.02 + 0.02 + 0.09 = 1.23
        </text>
      </motion.g>
      <motion.text x={334} y={108} textAnchor="middle" fontSize={7} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        대각선이 크면 self-reference 강함
      </motion.text>
    </g>
  );
}

function ScalingStep() {
  const raw = [1.23, 0.68, 0.35];
  const scaled = [0.502, 0.278, 0.143];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.scale}>
        Step 2: ÷ √d_k — 스케일링
      </text>
      {/* Before */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={30} y={28} width={180} height={36} rx={6}
          fill={C.q + '10'} stroke={C.q} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.q}>
          스케일 전 (Row 0)
        </text>
        <text x={120} y={56} textAnchor="middle" fontSize={8} fill={C.q}>
          [{raw.join(', ')}]
        </text>
      </motion.g>
      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={212} y1={46} x2={258} y2={46} stroke={C.scale} strokeWidth={1.5} />
        <polygon points="258,46 252,42 252,50" fill={C.scale} />
        <text x={235} y={40} textAnchor="middle" fontSize={7} fill={C.scale} fontWeight={600}>
          ÷ √6
        </text>
      </motion.g>
      {/* After */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <rect x={260} y={28} width={190} height={36} rx={6}
          fill={C.scale + '10'} stroke={C.scale} strokeWidth={1} />
        <text x={355} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.scale}>
          스케일 후
        </text>
        <text x={355} y={56} textAnchor="middle" fontSize={8} fill={C.scale}>
          [{scaled.join(', ')}]
        </text>
      </motion.g>
      {/* Explanation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={50} y={78} width={380} height={52} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={92} textAnchor="middle" fontSize={8} fill={C.muted} fontWeight={600}>
          왜 √d_k로 나누는가?
        </text>
        <text x={240} y={106} textAnchor="middle" fontSize={7} fill={C.muted}>
          Q, K 원소 ~ N(0,1)이면 내적 분산 = d_k
        </text>
        <text x={240} y={118} textAnchor="middle" fontSize={7} fill={C.muted}>
          d_k 크면 내적 값 커짐 → softmax 포화 → 기울기 소실
        </text>
        <text x={240} y={130} textAnchor="middle" fontSize={7} fill={C.scale} fontWeight={600}>
          ÷√d_k 후 분산 ≈ 1 → softmax 기울기 건강 유지
        </text>
      </motion.g>
    </g>
  );
}

function SoftmaxStep() {
  const rows = [
    { label: 'Row 0', vals: [0.412, 0.329, 0.259] },
    { label: 'Row 1', vals: [0.325, 0.359, 0.316] },
    { label: 'Row 2', vals: [0.293, 0.289, 0.418] },
  ];
  const barW = 80;
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.soft}>
        Step 3: Softmax → 확률 분포
      </text>
      {rows.map((r, ri) => (
        <motion.g key={ri} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + ri * 0.12, ...sp }}>
          <text x={40} y={38 + ri * 40} fontSize={8} fontWeight={600} fill={C.soft}>{r.label}</text>
          {r.vals.map((v, ci) => (
            <g key={ci}>
              <rect x={80 + ci * (barW + 20)} y={24 + ri * 40} width={barW} height={20} rx={4}
                fill={C.soft + '08'} stroke={C.soft} strokeWidth={0.5} />
              <motion.rect x={80 + ci * (barW + 20)} y={24 + ri * 40}
                width={0} height={20} rx={4} fill={C.soft + '30'}
                animate={{ width: barW * v }}
                transition={{ delay: 0.3 + ri * 0.1 + ci * 0.05, duration: 0.5 }} />
              <text x={80 + ci * (barW + 20) + barW / 2} y={38 + ri * 40}
                textAnchor="middle" fontSize={8} fontWeight={600} fill={C.soft}>
                {v.toFixed(3)}
              </text>
            </g>
          ))}
          <text x={390} y={38 + ri * 40} fontSize={7} fill={C.muted}>Σ=1.0</text>
        </motion.g>
      ))}
      <motion.text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        각 행 = 독립 확률 분포 │ 낮은 entropy = 특정 토큰 집중
      </motion.text>
    </g>
  );
}

function WeightedSumStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.v}>
        Step 4: × V → 문맥 반영 출력
      </text>
      {/* attn weights */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={26} width={140} height={60} rx={6}
          fill={C.soft + '08'} stroke={C.soft} strokeWidth={0.8} />
        <text x={90} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.soft}>
          Attention 가중치
        </text>
        <text x={90} y={54} textAnchor="middle" fontSize={7} fill={C.soft}>
          [0.412, 0.329, 0.259]
        </text>
        <text x={90} y={66} textAnchor="middle" fontSize={7} fill={C.muted}>
          토큰 0의 주의 분배
        </text>
      </motion.g>
      {/* multiply sign */}
      <motion.text x={175} y={56} fontSize={14} fill={C.muted} fontWeight={300}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>×</motion.text>
      {/* V vectors */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, ...sp }}>
        <rect x={195} y={26} width={110} height={60} rx={6}
          fill={C.v + '08'} stroke={C.v} strokeWidth={0.8} />
        <text x={250} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.v}>V 행렬</text>
        <text x={250} y={54} textAnchor="middle" fontSize={7} fill={C.v}>V[0], V[1], V[2]</text>
        <text x={250} y={66} textAnchor="middle" fontSize={7} fill={C.muted}>각 (d_k=6)</text>
      </motion.g>
      {/* equals */}
      <motion.text x={318} y={56} fontSize={14} fill={C.muted} fontWeight={300}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>=</motion.text>
      {/* Output */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, ...sp }}>
        <rect x={335} y={26} width={130} height={60} rx={6}
          fill={C.v + '18'} stroke={C.v} strokeWidth={1.5} />
        <text x={400} y={40} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.v}>
          문맥 벡터
        </text>
        <text x={400} y={56} textAnchor="middle" fontSize={7} fill={C.v}>
          0.412·V₀ + 0.329·V₁
        </text>
        <text x={400} y={68} textAnchor="middle" fontSize={7} fill={C.v}>
          + 0.259·V₂
        </text>
      </motion.g>
      {/* Annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={240} y={108} textAnchor="middle" fontSize={8} fill={C.muted}>
          자기 자신(0.412)에 가장 많이 주목
        </text>
        <text x={240} y={124} textAnchor="middle" fontSize={8} fill={C.muted}>
          결과: 문맥 정보를 흡수한 벡터 (3, d_k=6)
        </text>
      </motion.g>
    </g>
  );
}

export default function AttnScoreDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <DotProductStep />;
    case 1: return <ScalingStep />;
    case 2: return <SoftmaxStep />;
    case 3: return <WeightedSumStep />;
    default: return <g />;
  }
}

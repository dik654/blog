import { motion } from 'framer-motion';
import { C, BLEU, SCORE_FUNCS } from './AttnOverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: Seq2Seq fixed vector compression */
function BottleneckStep() {
  const tokens = ['x₁', 'x₂', 'x₃', 'x₄', 'x₅'];
  return (
    <g>
      {/* Encoder chain */}
      {tokens.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, ...sp }}>
          <rect x={10 + i * 48} y={18} width={40} height={28} rx={5}
            fill={C.enc + '18'} stroke={C.enc} strokeWidth={1.2} />
          <text x={30 + i * 48} y={28} textAnchor="middle" fontSize={8}
            fill={C.enc} fontWeight={500}>h{i + 1}</text>
          <text x={30 + i * 48} y={40} textAnchor="middle" fontSize={7}
            fill={C.enc} opacity={0.6}>{t}</text>
          {i < tokens.length - 1 && (
            <line x1={50 + i * 48} y1={32} x2={58 + i * 48} y2={32}
              stroke={C.enc} strokeWidth={0.8} markerEnd="url(#arrowEnc)" />
          )}
        </motion.g>
      ))}
      {/* Bottleneck funnel — single clear compression shape */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        {/* Funnel polygon: wide at h5, narrow at c */}
        <polygon points="230,20 230,46 275,72 275,52"
          fill={C.bottleneck + '10'} stroke={C.bottleneck} strokeWidth={1}
          strokeDasharray="3 2" />
        <text x={252} y={40} textAnchor="middle" fontSize={7}
          fill={C.bottleneck} fontWeight={600}>압축</text>

        <rect x={275} y={48} width={48} height={30} rx={6}
          fill={C.bottleneck + '15'} stroke={C.bottleneck} strokeWidth={1.8} />
        <text x={299} y={61} textAnchor="middle" fontSize={9}
          fill={C.bottleneck} fontWeight={700}>c</text>
        <text x={299} y={73} textAnchor="middle" fontSize={7}
          fill={C.bottleneck}>d=512</text>
      </motion.g>
      {/* Decoder */}
      {['y₁', 'y₂', 'y₃'].map((y, i) => (
        <motion.g key={`d${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.06 }}>
          <rect x={345 + i * 46} y={48} width={38} height={28} rx={5}
            fill={C.dec + '18'} stroke={C.dec} strokeWidth={1.2} />
          <text x={364 + i * 46} y={66} textAnchor="middle" fontSize={8}
            fill={C.dec}>{y}</text>
        </motion.g>
      ))}
      <motion.line x1={323} y1={62} x2={345} y2={62}
        stroke={C.bottleneck} strokeWidth={1} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }} />
      {/* Prominent bottleneck warning */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={8} y={90} width={310} height={22} rx={4}
          fill={C.bottleneck + '10'} stroke={C.bottleneck} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={163} y={105} textAnchor="middle" fontSize={8} fill={C.bottleneck} fontWeight={600}>
          5단어든 50단어든 c 하나로 압축 → 정보 손실 불가피
        </text>
      </motion.g>
      {/* Arrow marker */}
      <defs>
        <marker id="arrowEnc" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.enc} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: BLEU bar chart */
function BleuStep() {
  const maxScore = 30;
  const barW = 50;
  const barMaxH = 80;
  return (
    <g>
      <text x={12} y={14} fontSize={9} fontWeight={600} fill={C.muted}>
        문장 길이 vs BLEU 점수 (Cho et al. 2014)
      </text>
      {/* Y axis */}
      <line x1={60} y1={24} x2={60} y2={115} stroke={C.muted} strokeWidth={0.5} />
      {[0, 10, 20, 30].map(v => (
        <g key={v}>
          <line x1={56} y1={115 - (v / maxScore) * barMaxH - 10} x2={60} y2={115 - (v / maxScore) * barMaxH - 10}
            stroke={C.muted} strokeWidth={0.5} />
          <text x={53} y={118 - (v / maxScore) * barMaxH - 10} textAnchor="end" fontSize={7} fill={C.muted}>{v}</text>
        </g>
      ))}
      {/* Bars */}
      {BLEU.map((d, i) => {
        const h = (d.score / maxScore) * barMaxH;
        const x = 70 + i * (barW + 12);
        const isDropoff = i >= 3;
        return (
          <motion.g key={i} initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            style={{ transformOrigin: `${x + barW / 2}px 115px` }}
            transition={{ delay: i * 0.1, ...sp }}>
            <rect x={x} y={115 - h} width={barW} height={h} rx={3}
              fill={isDropoff ? C.bottleneck + '30' : C.enc + '25'}
              stroke={isDropoff ? C.bottleneck : C.enc} strokeWidth={1} />
            <text x={x + barW / 2} y={110 - h} textAnchor="middle" fontSize={8}
              fill={isDropoff ? C.bottleneck : C.enc} fontWeight={600}>
              {d.score}
            </text>
            <text x={x + barW / 2} y={128} textAnchor="middle" fontSize={7} fill={C.muted}>
              {d.len}
            </text>
            {isDropoff && i === 3 && (
              <text x={x + barW + 4} y={115 - h + 4} fontSize={7}
                fill={C.bottleneck} fontWeight={600}>← 급락</text>
            )}
          </motion.g>
        );
      })}
      <text x={200} y={145} textAnchor="middle" fontSize={7} fill={C.muted}>문장 길이 (단어 수)</text>
    </g>
  );
}

/* Step 2: Q-K-V 3-stage pipeline */
function ThreeStageStep() {
  const stages = [
    { label: 'Score', desc: 'score(Q, Kᵢ)', color: C.enc, x: 30 },
    { label: 'Weight', desc: 'αᵢ = softmax', color: C.attn, x: 180 },
    { label: 'Aggregate', desc: 'Σ αᵢ·Vᵢ', color: C.dec, x: 330 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C.muted}>Attention 3단계 파이프라인</text>
      {stages.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, ...sp }}>
          <rect x={s.x} y={30} width={120} height={50} rx={8}
            fill={s.color + '15'} stroke={s.color} strokeWidth={1.5} />
          <text x={s.x + 60} y={50} textAnchor="middle" fontSize={11}
            fontWeight={700} fill={s.color}>{s.label}</text>
          <text x={s.x + 60} y={68} textAnchor="middle" fontSize={9}
            fill={s.color} opacity={0.7}>{s.desc}</text>
          {i < 2 && (
            <motion.line x1={s.x + 120} y1={55} x2={stages[i + 1].x} y2={55}
              stroke={C.muted} strokeWidth={1.2} strokeDasharray="4 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }} />
          )}
        </motion.g>
      ))}
      {/* Analogy */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={30} y={105} fontSize={8} fill={C.enc}>Q = 검색어</text>
        <text x={180} y={105} fontSize={8} fill={C.attn}>K = 인덱스</text>
        <text x={330} y={105} fontSize={8} fill={C.dec}>V = 문서 내용</text>
        <text x={240} y={122} textAnchor="middle" fontSize={8} fill={C.muted}>
          단일 선택이 아닌 가중합 — soft retrieval
        </text>
      </motion.g>
    </g>
  );
}

/* Step 3: Score function comparison table */
function ScoreFuncStep() {
  const colX = [30, 120, 220, 340];
  const headers = ['방식', '수식', '파라미터', '속도'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C.muted}>Score 함수 비교</text>
      {/* Header row */}
      <rect x={20} y={22} width={440} height={18} rx={3} fill={C.muted + '10'} />
      {headers.map((h, i) => (
        <text key={i} x={colX[i]} y={35} fontSize={8} fontWeight={600} fill={C.muted}>{h}</text>
      ))}
      {/* Data rows */}
      {SCORE_FUNCS.map((f, i) => {
        const y = 45 + i * 24;
        const rowColor = i === 2 ? C.attn : C.muted; // highlight Scaled
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}>
            {i === 2 && (
              <rect x={20} y={y - 6} width={440} height={20} rx={3}
                fill={C.attn + '08'} />
            )}
            <text x={colX[0]} y={y + 8} fontSize={9} fontWeight={i === 2 ? 700 : 500}
              fill={rowColor}>{f.name}</text>
            <text x={colX[1]} y={y + 8} fontSize={9} fill={rowColor}>{f.formula}</text>
            <text x={colX[2]} y={y + 8} fontSize={9} fill={rowColor}>{f.params}</text>
            <text x={colX[3]} y={y + 8} fontSize={9} fill={rowColor}>
              {i === 0 || i === 1 ? '★★★' : i === 2 ? '★★★' : i === 3 ? '★★' : '★'}
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={150} textAnchor="middle" fontSize={8} fill={C.attn}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Transformer 표준: Scaled Dot-Product — 효율 + 안정성
      </motion.text>
    </g>
  );
}

export default function AttnOverviewDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <BottleneckStep />;
    case 1: return <BleuStep />;
    case 2: return <ThreeStageStep />;
    case 3: return <ScoreFuncStep />;
    default: return <g />;
  }
}

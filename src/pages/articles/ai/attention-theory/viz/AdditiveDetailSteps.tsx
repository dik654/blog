import { motion } from 'framer-motion';
import {
  C, S_VEC, H_VECS, RAW_SCORES, ALPHAS, CTX,
  ALIGN_SRC, ALIGN_TGT, ALIGN_MATRIX,
} from './AdditiveDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(',')}]`; }

/* Step 0: MLP score computation trace */
function MlpScoreStep() {
  return (
    <g>
      {/* Decoder state */}
      <rect x={10} y={10} width={80} height={30} rx={5}
        fill={C.dec + '18'} stroke={C.dec} strokeWidth={1.2} />
      <text x={50} y={23} textAnchor="middle" fontSize={9}
        fill={C.dec} fontWeight={600}>s = {fmtV(S_VEC)}</text>
      <text x={50} y={36} textAnchor="middle" fontSize={7}
        fill={C.dec} opacity={0.6}>decoder state</text>

      {/* Encoder states */}
      {H_VECS.map((h, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={10 + i * 62} y={54} width={54} height={24} rx={4}
            fill={C.enc + '15'} stroke={C.enc} strokeWidth={1} />
          <text x={37 + i * 62} y={70} textAnchor="middle" fontSize={8}
            fill={C.enc}>h{i + 1}={fmtV(h)}</text>
        </motion.g>
      ))}

      {/* MLP pipeline */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={255} y={8} width={220} height={76} rx={6}
          fill={C.score + '08'} stroke={C.score} strokeWidth={1} strokeDasharray="4 2" />
        <text x={365} y={22} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.score}>MLP Score Pipeline</text>

        {/* W1*s + W2*h -> tanh -> v^T */}
        <rect x={265} y={30} width={50} height={18} rx={3}
          fill={C.dec + '20'} stroke={C.dec} strokeWidth={0.8} />
        <text x={290} y={42} textAnchor="middle" fontSize={7} fill={C.dec}>W₁·s</text>

        <text x={320} y={42} fontSize={10} fill={C.score}>+</text>

        <rect x={330} y={30} width={50} height={18} rx={3}
          fill={C.enc + '20'} stroke={C.enc} strokeWidth={0.8} />
        <text x={355} y={42} textAnchor="middle" fontSize={7} fill={C.enc}>W₂·h</text>

        <text x={388} y={42} fontSize={8} fill={C.score}>→</text>
        <text x={410} y={42} fontSize={8} fill={C.score}>tanh</text>
        <text x={440} y={42} fontSize={8} fill={C.score}>→ vᵀ</text>

        {/* Korean annotation inside the box */}
        <text x={365} y={72} textAnchor="middle" fontSize={7} fill={C.score} opacity={0.7}>
          두 벡터를 더해서(Additive) 비선형 변환 후 스칼라 점수 산출
        </text>
      </motion.g>

      {/* Resulting scores */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {RAW_SCORES.map((s, i) => (
          <g key={i}>
            <motion.line x1={37 + i * 62} y1={78} x2={37 + i * 62} y2={96}
              stroke={C.score} strokeWidth={0.8} strokeDasharray="2 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.7 + i * 0.05 }} />
            <rect x={17 + i * 62} y={96} width={40} height={18} rx={3}
              fill={C.score + '15'} stroke={C.score} strokeWidth={1} />
            <text x={37 + i * 62} y={109} textAnchor="middle" fontSize={8}
              fill={C.score} fontWeight={600}>e={s.toFixed(1)}</text>
          </g>
        ))}
      </motion.g>
      <text x={280} y={122} fontSize={7} fill={C.score} opacity={0.7}>
        왜 Additive? W₁s와 W₂h를 더하기 때문
      </text>
    </g>
  );
}

/* Step 1: Softmax normalization */
function SoftmaxStep() {
  const barMaxH = 60;
  return (
    <g>
      <text x={10} y={14} fontSize={9} fontWeight={600} fill={C.muted}>
        Softmax: 점수 → 확률 분포
      </text>

      {/* Raw scores on left */}
      <text x={10} y={32} fontSize={8} fill={C.score}>점수</text>
      {RAW_SCORES.map((s, i) => (
        <g key={i}>
          <rect x={10 + i * 52} y={38} width={44} height={20} rx={3}
            fill={C.score + '12'} stroke={C.score} strokeWidth={0.8} />
          <text x={32 + i * 52} y={52} textAnchor="middle" fontSize={8}
            fill={C.score}>{s.toFixed(1)}</text>
        </g>
      ))}

      {/* Softmax formula between scores and bars */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <text x={140} y={72} textAnchor="middle" fontSize={8} fill={C.muted}>
          αᵢ = exp(eᵢ) / Σexp(eⱼ)
        </text>
        <line x1={140} y1={58} x2={140} y2={64} stroke={C.muted} strokeWidth={0.8}
          markerEnd="url(#arrowDown)" />
      </motion.g>
      <defs>
        <marker id="arrowDown" viewBox="0 0 6 6" refX={3} refY={6} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,0 L3,6" fill={C.muted} />
        </marker>
      </defs>

      {/* Alpha bars */}
      {ALPHAS.map((a, i) => {
        const h = a * barMaxH / 0.5;
        const bx = 50 + i * 100;
        return (
          <motion.g key={i} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
            style={{ transformOrigin: `${bx + 30}px 145px` }}
            transition={{ delay: 0.3 + i * 0.1, ...sp }}>
            <rect x={bx} y={145 - h} width={60} height={h} rx={4}
              fill={i === 1 ? C.score + '40' : C.score + '20'}
              stroke={C.score} strokeWidth={i === 1 ? 1.5 : 0.8} />
            <text x={bx + 30} y={140 - h} textAnchor="middle" fontSize={9}
              fontWeight={i === 1 ? 700 : 500} fill={C.score}>{a.toFixed(2)}</text>
            <text x={bx + 30} y={155} textAnchor="middle" fontSize={8} fill={C.enc}>
              α{i + 1}
            </text>
          </motion.g>
        );
      })}
      {/* Highlight h2 — positioned to the right of bars to avoid overlap */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={330} y={82} width={120} height={20} rx={4}
          fill={C.score + '10'} stroke={C.score} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={390} y={95} textAnchor="middle" fontSize={8}
          fill={C.score} fontWeight={600}>
          h₂에 가장 집중 (50%)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: Context vector weighted sum */
function ContextStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={C.muted}>c = Σ αᵢ · hᵢ — 가중합</text>

      {/* Encoder states with weights */}
      {H_VECS.map((h, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={10 + i * 115} y={28} width={100} height={30} rx={5}
            fill={C.enc + '15'} stroke={C.enc} strokeWidth={1} />
          <text x={60 + i * 115} y={42} textAnchor="middle" fontSize={8} fill={C.enc}>
            {ALPHAS[i].toFixed(2)} × {fmtV(h)}
          </text>
          <text x={60 + i * 115} y={54} textAnchor="middle" fontSize={7}
            fill={C.enc} opacity={0.6}>α{i + 1}·h{i + 1}</text>
          {/* Lines to context */}
          <motion.line x1={60 + i * 115} y1={58} x2={240} y2={94}
            stroke={C.ctx} strokeWidth={0.5 + ALPHAS[i] * 3}
            strokeOpacity={0.3 + ALPHAS[i]}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }} />
        </motion.g>
      ))}

      {/* Result context */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ transformOrigin: '240px 110px' }}
        transition={{ delay: 0.6, ...sp }}>
        <rect x={160} y={90} width={160} height={34} rx={8}
          fill={C.ctx + '18'} stroke={C.ctx} strokeWidth={1.5} />
        <text x={240} y={106} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={C.ctx}>c = [{CTX.map(v => v.toFixed(2)).join(', ')}]</text>
        <text x={240} y={120} textAnchor="middle" fontSize={8}
          fill={C.ctx} opacity={0.7}>동적 컨텍스트 벡터</text>
      </motion.g>

      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        매 디코더 스텝마다 다른 α → 다른 c 생성
      </motion.text>
    </g>
  );
}

/* Step 3: Alignment heatmap */
function AlignmentStep() {
  const cellW = 36;
  const cellH = 16;
  const ox = 60;
  const oy = 28;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={C.muted}>En→Fr 번역 정렬 행렬 (감독 없이 학습)</text>

      {/* Column headers (src) */}
      {ALIGN_SRC.map((w, i) => (
        <text key={`s${i}`} x={ox + i * cellW + cellW / 2} y={oy - 2}
          textAnchor="middle" fontSize={7} fill={C.enc} fontWeight={500}>{w}</text>
      ))}
      {/* Row headers (tgt) */}
      {ALIGN_TGT.map((w, i) => (
        <text key={`t${i}`} x={ox - 4} y={oy + i * cellH + cellH / 2 + 3}
          textAnchor="end" fontSize={7} fill={C.dec} fontWeight={500}>{w}</text>
      ))}
      {/* Heatmap cells */}
      {ALIGN_MATRIX.map((row, r) =>
        row.map((v, c) => {
          const opacity = Math.min(v, 0.95);
          return (
            <motion.g key={`${r}-${c}`} initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={{ delay: (r * 6 + c) * 0.01 }}>
              <rect x={ox + c * cellW} y={oy + r * cellH} width={cellW - 1} height={cellH - 1}
                rx={2} fill={C.score} fillOpacity={opacity * 0.7}
                stroke={C.score} strokeWidth={0.3} strokeOpacity={0.2} />
              {v >= 0.5 && (
                <text x={ox + c * cellW + cellW / 2 - 0.5} y={oy + r * cellH + cellH / 2 + 2.5}
                  textAnchor="middle" fontSize={6} fill="#ffffff" fontWeight={600}>
                  {v.toFixed(1)}
                </text>
              )}
            </motion.g>
          );
        })
      )}

      {/* Diagonal pattern annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={300} y={42} fontSize={8} fill={C.score} fontWeight={600}>
          대각선 패턴 → 단어 대응
        </text>
        <text x={300} y={56} fontSize={7} fill={C.muted}>
          어순 차이도 자동 포착
        </text>
        <text x={300} y={70} fontSize={7} fill={C.muted}>
          일대일 / 일대다 매핑 학습
        </text>
        <text x={300} y={90} fontSize={8} fill={C.dec}>
          해석 가능성 확보
        </text>
      </motion.g>
    </g>
  );
}

export default function AdditiveDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <MlpScoreStep />;
    case 1: return <SoftmaxStep />;
    case 2: return <ContextStep />;
    case 3: return <AlignmentStep />;
    default: return <g />;
  }
}

import { motion } from 'framer-motion';
import { C, D_MODEL, D_K, N_HEADS, HEAD_ROLES, MASK_4x4, PARAMS_TOTAL } from './SelfAttnDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: Q, K, V linear projection from same X */
function QkvProjectionStep() {
  const items = [
    { label: 'Q', desc: '무엇을 찾을까', color: C.q },
    { label: 'K', desc: '나는 무엇인가', color: C.k },
    { label: 'V', desc: '내 정보', color: C.v },
  ];
  return (
    <g>
      {/* Input X */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x={155} y={4} width={170} height={28} rx={5}
          fill={C.muted + '12'} stroke={C.muted} strokeWidth={1.2} />
        <text x={240} y={17} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.muted}>X ∈ R (n x {D_MODEL})</text>
        <text x={240} y={28} textAnchor="middle" fontSize={7} fill={C.muted}>
          입력 시퀀스 (같은 출처 → "Self")
        </text>
      </motion.g>

      {/* Three projections */}
      {items.map((item, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.12, ...sp }}>
          {/* Arrow from X */}
          <motion.line x1={240} y1={30} x2={80 + i * 160} y2={48}
            stroke={item.color} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.25 + i * 0.1 }} />

          {/* Weight matrix */}
          <rect x={40 + i * 160} y={48} width={80} height={20} rx={4}
            fill={item.color + '10'} stroke={item.color} strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={80 + i * 160} y={61} textAnchor="middle" fontSize={7}
            fill={item.color}>{`W_${item.label} (${D_MODEL}x${D_K})`}</text>

          {/* Result */}
          <rect x={40 + i * 160} y={76} width={80} height={28} rx={6}
            fill={item.color + '18'} stroke={item.color} strokeWidth={1.5} />
          <text x={80 + i * 160} y={89} textAnchor="middle" fontSize={10}
            fontWeight={700} fill={item.color}>{item.label}</text>
          <text x={80 + i * 160} y={100} textAnchor="middle" fontSize={7}
            fill={item.color} opacity={0.6}>{item.desc}</text>
        </motion.g>
      ))}

      {/* Annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill={C.muted}>
          출력: 각 (n, {D_K}) | 같은 토큰 → 다른 W → 다른 역할
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: Attention matrix O(n^2) */
function AttnMatrixStep() {
  const n = 5;
  const cellSize = 16;
  const ox = 30;
  const oy = 30;
  const tokens = ['w₁', 'w₂', 'w₃', 'w₄', 'w₅'];
  return (
    <g>
      <text x={10} y={14} fontSize={9} fontWeight={600} fill={C.muted}>
        scores = Q·Kᵀ/√{D_K} → (n, n)
      </text>

      {/* Column/row labels */}
      {tokens.map((t, i) => (
        <g key={i}>
          <text x={ox + i * cellSize + cellSize / 2} y={oy - 3}
            textAnchor="middle" fontSize={7} fill={C.k}>{t}</text>
          <text x={ox - 4} y={oy + i * cellSize + cellSize / 2 + 2}
            textAnchor="end" fontSize={7} fill={C.q}>{t}</text>
        </g>
      ))}

      {/* Matrix cells with heatmap */}
      {Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) => {
          const val = r === c ? 0.7 : Math.abs(r - c) <= 1 ? 0.4 : 0.1;
          return (
            <motion.rect key={`${r}-${c}`}
              x={ox + c * cellSize} y={oy + r * cellSize}
              width={cellSize - 1} height={cellSize - 1} rx={2}
              fill={C.q} fillOpacity={val * 0.7}
              stroke={C.q} strokeWidth={0.3} strokeOpacity={0.3}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: (r * n + c) * 0.015 }}
            />
          );
        })
      )}

      {/* Softmax arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={ox + n * cellSize + 10} y1={oy + n * cellSize / 2}
          x2={ox + n * cellSize + 30} y2={oy + n * cellSize / 2}
          stroke={C.muted} strokeWidth={1} />
        <text x={ox + n * cellSize + 20} y={oy + n * cellSize / 2 - 6}
          textAnchor="middle" fontSize={7} fill={C.muted}>softmax</text>
      </motion.g>

      {/* Complexity comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={200} y={26} width={268} height={58} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={334} y={40} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.muted}>복잡도 비교 (왜 Self-Attention?)</text>

        <rect x={210} y={48} width={120} height={26} rx={4}
          fill={C.q + '10'} stroke={C.q} strokeWidth={0.8} />
        <text x={270} y={60} textAnchor="middle" fontSize={8} fill={C.q} fontWeight={600}>
          Self-Attn: O(n²d)
        </text>
        <text x={270} y={70} textAnchor="middle" fontSize={7} fill={C.q} opacity={0.7}>
          병렬 가능
        </text>

        <rect x={340} y={48} width={120} height={26} rx={4}
          fill={C.muted + '10'} stroke={C.muted} strokeWidth={0.8} />
        <text x={400} y={60} textAnchor="middle" fontSize={8} fill={C.muted}>
          RNN: O(n d²)
        </text>
        <text x={400} y={70} textAnchor="middle" fontSize={7} fill={C.muted} opacity={0.7}>
          순차 처리만
        </text>
      </motion.g>

      <motion.text x={330} y={100} textAnchor="middle" fontSize={8} fill={C.q}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        n &lt; d 일 때 이득 │ 완전 병렬화 가능
      </motion.text>

      <text x={200} y={126} fontSize={8} fill={C.muted}>
        A·V → (n, {D_K}). 가중 합산된 값.
      </text>
    </g>
  );
}

/* Step 2: Multi-Head parallel */
function MultiHeadStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C.muted}>Multi-Head: {N_HEADS}개 헤드 병렬</text>

      {/* Individual heads — show 3 + ellipsis + Head 11 */}
      {HEAD_ROLES.slice(0, 3).map((h, i) => (
        <motion.g key={i} initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: `${50 + i * 90}px 50px` }}
          transition={{ delay: i * 0.08, ...sp }}>
          <rect x={10 + i * 90} y={24} width={80} height={44} rx={6}
            fill={C.q + '12'} stroke={C.q} strokeWidth={1.2} />
          <text x={50 + i * 90} y={38} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={C.q}>Head {h.id}</text>
          <text x={50 + i * 90} y={52} textAnchor="middle" fontSize={7}
            fill={C.q} opacity={0.7}>{h.role}</text>
          <text x={50 + i * 90} y={63} textAnchor="middle" fontSize={7}
            fill={C.muted}>dₖ={D_K}</text>
        </motion.g>
      ))}

      {/* ... more heads indicator */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={290} y={50} fontSize={12} fill={C.muted}>···</text>
        <rect x={320} y={24} width={80} height={44} rx={6}
          fill={C.q + '08'} stroke={C.q} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={360} y={44} textAnchor="middle" fontSize={9} fill={C.q}>Head 11</text>
        <text x={360} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>dₖ={D_K}</text>
      </motion.g>

      {/* Concat + W_O */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ...sp }}>
        {/* Concat lines */}
        {[0, 1, 2].map(i => (
          <motion.line key={i} x1={50 + i * 90} y1={68} x2={230} y2={86}
            stroke={C.v} strokeWidth={0.6} strokeOpacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.55 + i * 0.05 }} />
        ))}
        <motion.line x1={360} y1={68} x2={290} y2={86}
          stroke={C.v} strokeWidth={0.6} strokeOpacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.7 }} />
        <rect x={100} y={84} width={280} height={28} rx={6}
          fill={C.v + '15'} stroke={C.v} strokeWidth={1.5} />
        <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.v}>Concat(head₀ .. head₁₁) * W_O</text>
        <text x={240} y={109} textAnchor="middle" fontSize={7}
          fill={C.v} opacity={0.6}>{D_MODEL}차원 복원</text>
      </motion.g>

      {/* Parameter count */}
      <motion.text x={240} y={132} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        파라미터: 약 {(PARAMS_TOTAL / 1e6).toFixed(1)}M / block
      </motion.text>
    </g>
  );
}

/* Step 3: Causal mask */
function CausalMaskStep() {
  const cellSize = 24;
  const ox = 60;
  const oy = 30;
  const labels = ['t₁', 't₂', 't₃', 't₄'];
  return (
    <g>
      <text x={20} y={14} fontSize={10} fontWeight={600} fill={C.muted}>
        Causal Mask (4×4)
      </text>

      {/* Column/row labels */}
      {labels.map((l, i) => (
        <g key={i}>
          <text x={ox + i * cellSize + cellSize / 2} y={oy - 4}
            textAnchor="middle" fontSize={8} fill={C.k}>{l}</text>
          <text x={ox - 6} y={oy + i * cellSize + cellSize / 2 + 3}
            textAnchor="end" fontSize={8} fill={C.q}>{l}</text>
        </g>
      ))}

      {/* Mask cells */}
      {MASK_4x4.map((row, r) =>
        row.map((v, c) => {
          const masked = !isFinite(v);
          return (
            <motion.g key={`${r}-${c}`} initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={{ delay: (r * 4 + c) * 0.03 }}>
              <rect x={ox + c * cellSize} y={oy + r * cellSize}
                width={cellSize - 2} height={cellSize - 2} rx={3}
                fill={masked ? C.mask + '18' : C.k + '20'}
                stroke={masked ? C.mask : C.k}
                strokeWidth={masked ? 1 : 1.2} />
              <text x={ox + c * cellSize + cellSize / 2 - 1}
                y={oy + r * cellSize + cellSize / 2 + 2}
                textAnchor="middle" fontSize={masked ? 7 : 8}
                fill={masked ? C.mask : C.k}
                fontWeight={masked ? 400 : 600}>
                {masked ? '-∞' : v.toFixed(1)}
              </text>
            </motion.g>
          );
        })
      )}

      {/* Annotations */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={200} y={26} width={268} height={80} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={334} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mask}>
          왜? softmax(-inf) = 0 → 미래 정보 차단
        </text>
        <text x={334} y={56} textAnchor="middle" fontSize={8} fill={C.muted}>
          위치 i는 0..i까지만 참조 가능
        </text>
        <text x={334} y={72} textAnchor="middle" fontSize={8} fill={C.muted}>
          GPT: causal mask | BERT: mask 없음
        </text>
        <text x={334} y={88} textAnchor="middle" fontSize={8} fill={C.q}>
          autoregressive 학습의 핵심 장치
        </text>
        <text x={334} y={100} textAnchor="middle" fontSize={7} fill={C.muted} opacity={0.7}>
          학습 시 정답을 미리 보는 것을 방지
        </text>
      </motion.g>

      {/* Lower triangular highlight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }}>
        <text x={ox + 24} y={oy + 108} fontSize={7} fill={C.k}>
          ◢ 하삼각 = 참조 가능 영역
        </text>
      </motion.g>
    </g>
  );
}

export default function SelfAttnDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <QkvProjectionStep />;
    case 1: return <AttnMatrixStep />;
    case 2: return <MultiHeadStep />;
    case 3: return <CausalMaskStep />;
    default: return <g />;
  }
}

import { motion } from 'framer-motion';
import { C } from './BertAttnDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.qkv}>Q, K, V 투영과 헤드 분리</text>
      {/* Input X */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={80} height={36} rx={4}
          fill={`${C.muted}08`} stroke={C.muted} strokeWidth={0.8} />
        <text x={60} y={44} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>X</text>
        <text x={60} y={58} textAnchor="middle" fontSize={7} fontFamily={MF} fill={C.muted}>(512, 768)</text>
      </motion.g>
      {/* Arrows to Q K V */}
      {['Q', 'K', 'V'].map((name, i) => {
        const y = 30 + i * 30;
        return (
          <motion.g key={name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
            <line x1={100} y1={46} x2={130} y2={y + 14} stroke={C.qkv} strokeWidth={0.8} />
            <polygon points={`${128},${y + 10} ${134},${y + 14} ${128},${y + 18}`} fill={C.qkv} />
            <rect x={136} y={y} width={100} height={26} rx={4}
              fill={`${C.qkv}10`} stroke={C.qkv} strokeWidth={1} />
            <text x={146} y={y + 12} fontSize={8} fontWeight={600} fill={C.qkv}>
              {name} = X @ W_{name}
            </text>
            <text x={146} y={y + 22} fontSize={6} fontFamily={MF} fill={C.muted}>(512, 768)</text>
          </motion.g>
        );
      })}
      {/* Reshape */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={240} y1={55} x2={270} y2={55} stroke={C.head} strokeWidth={1} />
        <polygon points="268,51 276,55 268,59" fill={C.head} />
        <text x={255} y={50} textAnchor="middle" fontSize={6} fill={C.head}>reshape</text>
      </motion.g>
      {/* Split heads */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={280} y={30} width={180} height={50} rx={5}
          fill={`${C.head}10`} stroke={C.head} strokeWidth={1} />
        <text x={290} y={46} fontSize={8} fontWeight={600} fill={C.head}>12 heads x 64 dims</text>
        <text x={290} y={60} fontSize={7} fontFamily={MF} fill={C.muted}>
          Q, K, V → (12, 512, 64)
        </text>
        <text x={290} y={72} fontSize={7} fill={C.muted}>
          d_k = 768 / 12 = 64 per head
        </text>
      </motion.g>
      {/* Why */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={20} y={100} width={440} height={28} rx={4}
          fill={`${C.head}06`} stroke={C.head} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={30} y={114} fontSize={7} fontWeight={600} fill={C.head}>
          왜 분리?
        </text>
        <text x={80} y={114} fontSize={7} fill={C.muted}>
          각 헤드가 구문/의미/위치 등 서로 다른 관계를 독립적으로 학습
        </text>
        <text x={30} y={126} fontSize={7} fontFamily={MF} fill={C.muted}>
          W_Q, W_K, W_V: 768x768 = 589,824 params each
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.attn}>Scaled Dot-Product Attention</text>
      {/* Flow: Q@K^T → scale → softmax → @V */}
      {[
        { label: 'Q @ K^T', sub: '(512, 512)', x: 20 },
        { label: '/ sqrt(64)', sub: '= / 8', x: 130 },
        { label: 'softmax', sub: '각 행 합=1', x: 230 },
        { label: '@ V', sub: '(512, 64)', x: 340 },
      ].map((b, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={b.x} y={28} width={90} height={34} rx={5}
            fill={`${C.attn}12`} stroke={C.attn} strokeWidth={1} />
          <text x={b.x + 45} y={44} textAnchor="middle" fontSize={8} fontWeight={600}
            fontFamily={MF} fill={C.attn}>{b.label}</text>
          <text x={b.x + 45} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>{b.sub}</text>
          {i < 3 && (
            <g>
              <line x1={b.x + 92} y1={45} x2={[130, 230, 340][i] - 2} y2={45}
                stroke={C.attn} strokeWidth={0.8} />
              <polygon points={`${[130, 230, 340][i] - 4},42 ${[130, 230, 340][i]},45 ${[130, 230, 340][i] - 4},48`}
                fill={C.attn} />
            </g>
          )}
        </motion.g>
      ))}
      {/* Why scale */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={72} width={220} height={40} rx={4}
          fill={`${C.attn}06`} stroke={C.attn} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={30} y={86} fontSize={7} fontWeight={600} fill={C.attn}>왜 sqrt(d_k)?</text>
        <text x={30} y={98} fontSize={7} fill={C.muted}>차원 커지면 dot product 값 증가</text>
        <text x={30} y={110} fontSize={7} fill={C.muted}>→ softmax 포화 → 기울기 소실 방지</text>
      </motion.g>
      {/* BERT vs GPT */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={260} y={72} width={200} height={40} rx={4}
          fill={`${C.qkv}08`} stroke={C.qkv} strokeWidth={0.8} />
        <text x={270} y={86} fontSize={7} fontWeight={600} fill={C.qkv}>BERT vs GPT</text>
        <text x={270} y={98} fontSize={7} fill={C.qkv}>BERT: 마스킹 없음 (양방향)</text>
        <text x={270} y={110} fontSize={7} fill={C.muted}>GPT: causal mask (미래 차단)</text>
      </motion.g>
      {/* Output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={20} y={120} width={440} height={22} rx={3}
          fill={`${C.attn}08`} stroke={C.attn} strokeWidth={0.5} />
        <text x={240} y={134} textAnchor="middle" fontSize={7} fill={C.attn}>
          head_h = attn @ V_h → (512, 64) — 문맥 반영된 가중 합산 벡터
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.head}>헤드 결합 및 출력 투영</text>
      {/* 12 head boxes */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={20 + i * 28} y={30} width={24} height={20} rx={3}
            fill={`${C.head}${10 + i * 2}`} stroke={C.head} strokeWidth={0.6} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <text key={`t${i}`} x={32 + i * 28} y={44} textAnchor="middle" fontSize={6}
            fontFamily={MF} fill={C.head}>{i + 1}</text>
        ))}
        <text x={200} y={28} textAnchor="middle" fontSize={7} fill={C.muted}>12 heads (각 64d)</text>
      </motion.g>
      {/* Concat arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <text x={200} y={60} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.head}>concat</text>
        <line x1={200} y1={63} x2={200} y2={72} stroke={C.head} strokeWidth={1} />
        <polygon points="196,70 200,76 204,70" fill={C.head} />
      </motion.g>
      {/* Concat result */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={100} y={78} width={200} height={22} rx={4}
          fill={`${C.head}10`} stroke={C.head} strokeWidth={1} />
        <text x={200} y={92} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.head}>
          (512, 768)
        </text>
      </motion.g>
      {/* W_O projection */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={302} y1={89} x2={340} y2={89} stroke={C.qkv} strokeWidth={1} />
        <polygon points="338,85 346,89 338,93" fill={C.qkv} />
        <text x={325} y={84} textAnchor="middle" fontSize={7} fill={C.qkv}>@ W_O</text>
        <rect x={350} y={78} width={100} height={22} rx={4}
          fill={`${C.qkv}12`} stroke={C.qkv} strokeWidth={1} />
        <text x={400} y={92} textAnchor="middle" fontSize={8} fontWeight={600}
          fontFamily={MF} fill={C.qkv}>output (512, 768)</text>
      </motion.g>
      {/* Params */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={20} y={108} width={220} height={22} rx={3}
          fill={`${C.qkv}06`} stroke={C.qkv} strokeWidth={0.4} />
        <text x={30} y={122} fontSize={7} fontFamily={MF} fill={C.qkv}>
          4 x 768 x 768 = 2,359,296 params
        </text>
      </motion.g>
      {/* Post-attention */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={260} y={108} width={200} height={40} rx={4}
          fill={`${C.attn}06`} stroke={C.attn} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={270} y={122} fontSize={7} fontWeight={600} fill={C.attn}>이후 처리:</text>
        <text x={270} y={134} fontSize={7} fill={C.muted}>+ Residual → LayerNorm</text>
        <text x={270} y={146} fontSize={7} fill={C.muted}>→ FFN(768→3072→768) → Add&Norm</text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const patterns = [
    { name: 'Syntactic', desc: '주어-동사 일치, 수식 관계', color: C.qkv, icon: '{ }' },
    { name: 'Semantic', desc: '공참조, 의미 유사성', color: C.attn, icon: '~ ~' },
    { name: 'Positional', desc: '직전/직후, 고정 거리', color: C.head, icon: '< >' },
    { name: 'Broad', desc: '전역 요약, [CLS]/[SEP]', color: C.pat, icon: '* *' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.pat}>Attention 헤드별 학습 패턴</text>
      {patterns.map((p, i) => {
        const x = 20 + (i % 2) * 230;
        const y = 28 + Math.floor(i / 2) * 42;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={x} y={y} width={210} height={34} rx={5}
              fill={`${p.color}10`} stroke={p.color} strokeWidth={1} />
            <text x={x + 10} y={y + 14} fontSize={9} fontWeight={700} fill={p.color}>{p.name}</text>
            <text x={x + 10} y={y + 28} fontSize={7} fill={C.muted}>{p.desc}</text>
            <text x={x + 190} y={y + 20} textAnchor="end" fontSize={10} fontFamily={MF} fill={p.color}>{p.icon}</text>
          </motion.g>
        );
      })}
      {/* Contextualized example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={20} y={118} width={440} height={36} rx={4}
          fill={`${C.pat}06`} stroke={C.pat} strokeWidth={0.5} />
        <text x={30} y={132} fontSize={8} fontWeight={600} fill={C.pat}>Contextualized Embedding</text>
        <text x={30} y={146} fontSize={7} fill={C.muted}>
          "bank" + money → 은행 벡터 | "bank" + river → 강둑 벡터
        </text>
        <text x={380} y={132} fontSize={7} fontFamily={MF} fill={C.head}>
          12x12=144 패턴
        </text>
      </motion.g>
    </g>
  );
}

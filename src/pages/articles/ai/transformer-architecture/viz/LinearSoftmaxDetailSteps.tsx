import { motion } from 'framer-motion';
import { C } from './LinearSoftmaxDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.linear}>Linear + Softmax 파이프라인</text>
      {/* h vector */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={30} width={70} height={30} rx={4}
          fill={`${C.linear}10`} stroke={C.linear} strokeWidth={1} />
        <text x={55} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.linear}>h</text>
        <text x={55} y={54} textAnchor="middle" fontSize={7} fontFamily={MF} fill={C.muted}>d_model</text>
      </motion.g>
      {/* Arrow 1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={90} y1={45} x2={120} y2={45} stroke={C.linear} strokeWidth={1} />
        <polygon points="118,41 126,45 118,49" fill={C.linear} />
        <text x={105} y={38} textAnchor="middle" fontSize={7} fill={C.muted}>W_out</text>
      </motion.g>
      {/* Logits */}
      <motion.g initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={130} y={30} width={90} height={30} rx={4}
          fill={`${C.linear}15`} stroke={C.linear} strokeWidth={1.2} />
        <text x={175} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.linear}>logits</text>
        <text x={175} y={54} textAnchor="middle" fontSize={7} fontFamily={MF} fill={C.muted}>vocab_size</text>
      </motion.g>
      {/* Arrow 2 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={220} y1={45} x2={250} y2={45} stroke={C.soft} strokeWidth={1} />
        <polygon points="248,41 256,45 248,49" fill={C.soft} />
        <text x={235} y={38} textAnchor="middle" fontSize={7} fill={C.soft}>softmax</text>
      </motion.g>
      {/* Probabilities */}
      <motion.g initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={260} y={30} width={90} height={30} rx={4}
          fill={`${C.soft}12`} stroke={C.soft} strokeWidth={1} />
        <text x={305} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.soft}>P(w)</text>
        <text x={305} y={54} textAnchor="middle" fontSize={7} fontFamily={MF} fill={C.muted}>sum=1</text>
      </motion.g>
      {/* Parameter count */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={370} y={26} width={100} height={40} rx={5}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={420} y={42} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.loss}>
          W_out 파라미터
        </text>
        <text x={420} y={56} textAnchor="middle" fontSize={8} fontWeight={700}
          fontFamily={MF} fill={C.loss}>131M</text>
      </motion.g>
      {/* Detail */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <text x={20} y={82} fontSize={8} fontFamily={MF} fill={C.muted}>
          d_model=4096, vocab=32000
        </text>
        <text x={20} y={96} fontSize={8} fontFamily={MF} fill={C.linear}>
          logits = h · W_out + b_out
        </text>
        <text x={20} y={110} fontSize={8} fontFamily={MF} fill={C.soft}>
          p_i = exp(logits_i) / Σ_j exp(logits_j)
        </text>
        <text x={20} y={128} fontSize={8} fill={C.muted}>
          학습: Cross-Entropy Loss / 추론: sampling 또는 argmax
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.tie}>Weight Tying</text>
      {/* Embedding E */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={30} width={130} height={50} rx={5}
          fill={`${C.tie}10`} stroke={C.tie} strokeWidth={1} />
        <text x={85} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.tie}>
          입력 임베딩 E
        </text>
        <text x={85} y={62} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.muted}>
          (vocab_size, d_model)
        </text>
        <text x={85} y={74} textAnchor="middle" fontSize={7} fill={C.tie}>토큰 ID → 벡터</text>
      </motion.g>
      {/* = sign */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <text x={175} y={60} fontSize={16} fontWeight={700} fill={C.tie}>=</text>
        <text x={170} y={76} fontSize={7} fill={C.muted}>공유!</text>
      </motion.g>
      {/* Output W_out */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={200} y={30} width={130} height={50} rx={5}
          fill={`${C.linear}10`} stroke={C.linear} strokeWidth={1} />
        <text x={265} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.linear}>
          출력 W_out
        </text>
        <text x={265} y={62} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.muted}>
          (d_model, vocab_size)
        </text>
        <text x={265} y={74} textAnchor="middle" fontSize={7} fill={C.linear}>
          W_out = E^T
        </text>
      </motion.g>
      {/* Benefits */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={360} y={30} width={110} height={50} rx={5}
          fill={`${C.soft}08`} stroke={C.soft} strokeWidth={0.8} />
        <text x={415} y={46} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.soft}>장점</text>
        <text x={370} y={60} fontSize={7} fill={C.muted}>파라미터 131M 절감</text>
        <text x={370} y={72} fontSize={7} fill={C.muted}>의미 공간 일치</text>
      </motion.g>
      {/* Models */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={104} fontSize={8} fontWeight={600} fill={C.tie}>채택 모델:</text>
        {['GPT-2', 'BERT', 'LLaMA'].map((m, i) => (
          <g key={i}>
            <rect x={100 + i * 80} y={92} width={70} height={20} rx={3}
              fill={`${C.tie}12`} stroke={C.tie} strokeWidth={0.8} />
            <text x={135 + i * 80} y={106} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={C.tie}>{m}</text>
          </g>
        ))}
        <rect x={60} y={120} width={360} height={18} rx={3} fill={`${C.tie}06`} />
        <text x={240} y={133} textAnchor="middle" fontSize={8} fill={C.muted}>
          임베딩-출력 공유 → 정규화 효과 + 모델 크기 절감
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const strats = [
    { name: 'Greedy', desc: 'argmax, 결정적', color: C.gen },
    { name: 'Temperature', desc: 'logits/T, T<1 sharp', color: C.gen },
    { name: 'Top-k', desc: '상위 k개만 유지', color: C.gen },
    { name: 'Top-p', desc: '누적 확률 p 이내', color: C.gen },
    { name: 'Beam Search', desc: 'top-k 경로 유지', color: C.gen },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.gen}>생성 전략</text>
      {strats.map((s, i) => {
        const y = 28 + i * 24;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={20} y={y} width={90} height={20} rx={3}
              fill={`${s.color}12`} stroke={s.color} strokeWidth={1} />
            <text x={65} y={y + 14} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={s.color}>{s.name}</text>
            <text x={120} y={y + 14} fontSize={8} fill={C.muted}>{s.desc}</text>
          </motion.g>
        );
      })}
      {/* Practical tip */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={280} y={40} width={180} height={60} rx={5}
          fill={`${C.gen}08`} stroke={C.gen} strokeWidth={1} strokeDasharray="4 2" />
        <text x={370} y={58} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen}>
          실무 설정
        </text>
        <text x={290} y={74} fontSize={8} fill={C.muted}>Temperature + Top-p 조합</text>
        <text x={290} y={88} fontSize={8} fill={C.muted}>T=0.7, p=0.9가 흔한 기본값</text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const losses = [
    { name: 'Cross-Entropy', formula: 'L = -log(p_target)', color: C.loss },
    { name: 'Label Smooth', formula: '0.9 정답 + 0.1 uniform', color: C.gen },
    { name: 'Focal Loss', formula: '어려운 샘플 가중', color: '#8b5cf6' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.loss}>Loss 변형과 최적화</text>
      {losses.map((l, i) => {
        const y = 30 + i * 32;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <rect x={20} y={y} width={100} height={24} rx={4}
              fill={`${l.color}12`} stroke={l.color} strokeWidth={1} />
            <text x={70} y={y + 16} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={l.color}>{l.name}</text>
            <text x={130} y={y + 16} fontSize={8} fontFamily={MF} fill={C.muted}>
              {l.formula}
            </text>
          </motion.g>
        );
      })}
      {/* Speculative decoding */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={126} width={440} height={22} rx={4}
          fill={`${C.tie}08`} stroke={C.tie} strokeWidth={0.8} />
        <text x={30} y={141} fontSize={8} fontWeight={600} fill={C.tie}>Speculative Decoding</text>
        <text x={180} y={141} fontSize={8} fill={C.muted}>
          작은 모델 초안 → 큰 모델 검증 → 추론 속도 2~3배
        </text>
      </motion.g>
      {/* Label smoothing detail */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={300} y={34} width={160} height={50} rx={5}
          fill={`${C.gen}08`} stroke={C.gen} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={380} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen}>
          Label Smoothing 효과
        </text>
        <text x={310} y={66} fontSize={7} fill={C.muted}>과신 방지 (overconfidence)</text>
        <text x={310} y={78} fontSize={7} fill={C.muted}>일반화 성능 향상</text>
      </motion.g>
    </g>
  );
}

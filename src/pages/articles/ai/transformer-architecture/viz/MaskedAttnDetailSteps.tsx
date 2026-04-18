import { motion } from 'framer-motion';
import { C } from './MaskedAttnDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function CausalMaskStep() {
  const cs = 26;
  const ox = 60;
  const oy = 32;
  const labels = ['t₀', 't₁', 't₂', 't₃'];
  const mask = [
    [0, -Infinity, -Infinity, -Infinity],
    [0, 0, -Infinity, -Infinity],
    [0, 0, 0, -Infinity],
    [0, 0, 0, 0],
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.mask}>
        Causal Mask: 하삼각 행렬
      </text>
      {/* Labels */}
      {labels.map((l, i) => (
        <g key={i}>
          <text x={ox + i * cs + cs / 2} y={oy - 4} textAnchor="middle" fontSize={8}
            fill={C.allow} fontWeight={600}>{l}</text>
          <text x={ox - 6} y={oy + i * cs + cs / 2 + 3} textAnchor="end" fontSize={8}
            fill={C.gpt} fontWeight={600}>{l}</text>
        </g>
      ))}
      {/* Matrix */}
      {mask.map((row, r) =>
        row.map((v, c) => {
          const masked = !isFinite(v);
          return (
            <motion.g key={`${r}-${c}`} initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={{ delay: (r * 4 + c) * 0.03 }}>
              <rect x={ox + c * cs} y={oy + r * cs} width={cs - 2} height={cs - 2} rx={3}
                fill={masked ? C.mask + '18' : C.allow + '18'}
                stroke={masked ? C.mask : C.allow} strokeWidth={masked ? 0.8 : 1} />
              <text x={ox + c * cs + cs / 2 - 1} y={oy + r * cs + cs / 2 + 3}
                textAnchor="middle" fontSize={masked ? 8 : 9}
                fill={masked ? C.mask : C.allow} fontWeight={masked ? 400 : 600}>
                {masked ? '-∞' : '0'}
              </text>
            </motion.g>
          );
        })
      )}
      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={200} y={32} width={260} height={66} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={330} y={48} textAnchor="middle" fontSize={8} fill={C.allow} fontWeight={600}>
          0 = 참조 가능 (하삼각 + 대각)
        </text>
        <text x={330} y={64} textAnchor="middle" fontSize={8} fill={C.mask} fontWeight={600}>
          -∞ = 참조 불가 (상삼각)
        </text>
        <text x={330} y={80} textAnchor="middle" fontSize={7} fill={C.muted}>
          scores에 mask를 더한 뒤 softmax 적용
        </text>
        <text x={330} y={92} textAnchor="middle" fontSize={7} fill={C.muted}>
          t₀: 자기만 │ t₃: 전부 참조 가능
        </text>
      </motion.g>
    </g>
  );
}

function SoftmaxInfStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.mask}>
        softmax(-∞) = 0: 완전 차단
      </text>
      {/* Before mask */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={30} y={26} width={200} height={44} rx={6}
          fill={C.gpt + '08'} stroke={C.gpt} strokeWidth={0.8} />
        <text x={130} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gpt}>
          scores + mask
        </text>
        <text x={130} y={58} textAnchor="middle" fontSize={7} fill={C.gpt}>
          [0.5, -∞, -∞, -∞]
        </text>
      </motion.g>
      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={234} y1={48} x2={258} y2={48} stroke={C.muted} strokeWidth={1.2} />
        <polygon points="260,48 254,44 254,52" fill={C.muted} />
        <text x={246} y={40} textAnchor="middle" fontSize={7} fill={C.muted}>softmax</text>
      </motion.g>
      {/* After softmax */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <rect x={264} y={26} width={200} height={44} rx={6}
          fill={C.allow + '08'} stroke={C.allow} strokeWidth={0.8} />
        <text x={364} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.allow}>
          attention weights
        </text>
        <text x={364} y={58} textAnchor="middle" fontSize={7} fill={C.allow}>
          [1.0, 0.0, 0.0, 0.0]
        </text>
      </motion.g>
      {/* Implementation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={40} y={84} width={400} height={56} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={98} textAnchor="middle" fontSize={8} fill={C.gpt} fontWeight={600}>
          PyTorch 구현
        </text>
        <text x={240} y={112} textAnchor="middle" fontSize={7} fill={C.muted} fontFamily="monospace">
          mask = torch.triu(ones(n,n), diagonal=1)
        </text>
        <text x={240} y={126} textAnchor="middle" fontSize={7} fill={C.muted} fontFamily="monospace">
          scores = scores + mask.masked_fill(mask==1, -inf)
        </text>
      </motion.g>
    </g>
  );
}

function DecoderVsEncoderStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        Decoder vs Encoder: 마스크 유무
      </text>
      {/* Decoder */}
      <motion.rect x={20} y={24} width={210} height={96} rx={6}
        fill={C.gpt + '08'} stroke={C.gpt} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={125} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.gpt}>
        Decoder-only (GPT)
      </text>
      <text x={125} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        Causal mask 필수
      </text>
      <text x={125} y={70} textAnchor="middle" fontSize={7} fill={C.gpt}>
        P(x_t | x_{'<'}t) 학습
      </text>
      <text x={125} y={84} textAnchor="middle" fontSize={7} fill={C.muted}>
        미래 보면 cheating
      </text>
      <text x={125} y={98} textAnchor="middle" fontSize={7} fill={C.gpt}>
        단방향 (← 과거만)
      </text>
      {/* Encoder */}
      <motion.rect x={250} y={24} width={210} height={96} rx={6}
        fill={C.bert + '08'} stroke={C.bert} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, ...sp }} />
      <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bert}>
        Encoder-only (BERT)
      </text>
      <text x={355} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        Mask 불필요
      </text>
      <text x={355} y={70} textAnchor="middle" fontSize={7} fill={C.bert}>
        P(x_masked | context) 학습
      </text>
      <text x={355} y={84} textAnchor="middle" fontSize={7} fill={C.muted}>
        양방향 문맥 필요
      </text>
      <text x={355} y={98} textAnchor="middle" fontSize={7} fill={C.bert}>
        양방향 (← →)
      </text>
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        Encoder-Decoder (T5): Encoder 양방향 + Decoder causal
      </motion.text>
    </g>
  );
}

function TrainGenStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        학습과 생성: 효율성 최적화
      </text>
      {/* Training */}
      <motion.rect x={20} y={24} width={210} height={90} rx={6}
        fill={C.gpt + '08'} stroke={C.gpt} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={125} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.gpt}>
        학습 시
      </text>
      <text x={125} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        Causal mask + teacher forcing
      </text>
      <text x={125} y={70} textAnchor="middle" fontSize={7} fill={C.gpt}>
        전체 시퀀스 한 번에 병렬 학습
      </text>
      <text x={125} y={84} textAnchor="middle" fontSize={7} fill={C.muted}>
        각 위치 손실 동시 계산
      </text>
      <text x={125} y={98} textAnchor="middle" fontSize={7} fill={C.gpt}>
        효율적 (O(1) forward pass)
      </text>
      {/* Generation */}
      <motion.rect x={250} y={24} width={210} height={90} rx={6}
        fill={C.allow + '08'} stroke={C.allow} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, ...sp }} />
      <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.allow}>
        생성 시
      </text>
      <text x={355} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        한 번에 한 토큰 (autoregressive)
      </text>
      <text x={355} y={70} textAnchor="middle" fontSize={7} fill={C.allow}>
        KV cache: 이전 K, V 캐시
      </text>
      <text x={355} y={84} textAnchor="middle" fontSize={7} fill={C.muted}>
        재계산 방지 → 속도 최적화
      </text>
      <text x={355} y={98} textAnchor="middle" fontSize={7} fill={C.allow}>
        O(1) per token
      </text>
      <motion.text x={240} y={136} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        학습: 병렬 (mask로 cheating 방지) │ 추론: 순차 (KV cache로 가속)
      </motion.text>
    </g>
  );
}

export default function MaskedAttnDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <CausalMaskStep />;
    case 1: return <SoftmaxInfStep />;
    case 2: return <DecoderVsEncoderStep />;
    case 3: return <TrainGenStep />;
    default: return <g />;
  }
}

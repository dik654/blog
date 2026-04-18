import { motion } from 'framer-motion';
import { C } from './PosEncDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function SinusoidalStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.sin}>
        Sinusoidal PE (2017)
      </text>
      {/* Formula boxes */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...sp }}>
        <rect x={40} y={22} width={190} height={24} rx={5}
          fill={C.sin + '12'} stroke={C.sin} strokeWidth={1} />
        <text x={135} y={37} textAnchor="middle" fontSize={8} fill={C.sin}>
          PE(pos,2i) = sin(pos/10000^(2i/d))
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...sp }}>
        <rect x={250} y={22} width={190} height={24} rx={5}
          fill={C.rope + '08'} stroke={C.rope} strokeWidth={0.8} />
        <text x={345} y={37} textAnchor="middle" fontSize={8} fill={C.rope}>
          PE(pos,2i+1) = cos(pos/10000^(2i/d))
        </text>
      </motion.g>
      {/* Properties */}
      {['학습 파라미터: 0개', '길이 제한: 없음 (임의)', '상대 위치: 선형 변환 암시'].map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}>
          <rect x={80} y={58 + i * 24} width={320} height={18} rx={4}
            fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.4} />
          <text x={240} y={70 + i * 24} textAnchor="middle" fontSize={8} fill={C.muted}>{t}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={138} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        단점: 절대 위치만 직접 표현, 상대 위치 학습은 간접적
      </motion.text>
    </g>
  );
}

function LearnedStep() {
  const models = [
    { name: 'BERT', maxLen: 512 },
    { name: 'GPT-2', maxLen: 1024 },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.learn}>
        Learned PE: 위치 임베딩 학습
      </text>
      {/* Position embedding table */}
      <motion.rect x={80} y={24} width={320} height={50} rx={6}
        fill={C.learn + '08'} stroke={C.learn} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={240} y={38} textAnchor="middle" fontSize={8} fill={C.learn} fontWeight={600}>
        위치 임베딩 테이블
      </text>
      {/* Position slots */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.04, ...sp }}>
          <rect x={95 + i * 36} y={46} width={30} height={20} rx={3}
            fill={i < 6 ? C.learn + '20' : C.muted + '10'}
            stroke={i < 6 ? C.learn : C.muted} strokeWidth={0.6} />
          <text x={110 + i * 36} y={59} textAnchor="middle" fontSize={7}
            fill={i < 6 ? C.learn : C.muted}>{i < 7 ? `p${i}` : '...'}</text>
        </motion.g>
      ))}
      {/* Model examples */}
      {models.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}>
          <rect x={80 + i * 180} y={88} width={160} height={22} rx={5}
            fill={C.learn + '10'} stroke={C.learn} strokeWidth={0.6} />
          <text x={160 + i * 180} y={102} textAnchor="middle" fontSize={8} fill={C.learn}>
            {m.name}: max {m.maxLen} 위치
          </text>
        </motion.g>
      ))}
      <motion.text x={240} y={132} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        장점: 데이터 최적화 │ 단점: 학습 길이 이상 일반화 어려움
      </motion.text>
    </g>
  );
}

function RoPEStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.rope}>
        RoPE: 복소수 회전 기반 (2021)
      </text>
      {/* Rotation visualization */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, ...sp }}>
        <circle cx={120} cy={75} r={42} fill="none" stroke={C.rope} strokeWidth={0.6} />
        <text x={120} y={75} textAnchor="middle" fontSize={8} fill={C.rope}>회전 평면</text>
        {/* Rotating arrow */}
        <motion.line x1={120} y1={75} x2={155} y2={55}
          stroke={C.rope} strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }} />
        <circle cx={155} cy={55} r={3} fill={C.rope} />
        <text x={162} y={52} fontSize={7} fill={C.rope}>θ_i</text>
      </motion.g>
      {/* Properties */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={200} y={30} width={260} height={80} rx={6}
          fill={C.rope + '06'} stroke={C.rope} strokeWidth={0.6} />
        <text x={330} y={46} textAnchor="middle" fontSize={8} fill={C.rope} fontWeight={600}>
          Q, K에 직접 회전 적용
        </text>
        <text x={330} y={62} textAnchor="middle" fontSize={8} fill={C.muted}>
          2차원씩 묶어 θ_i 각도로 회전
        </text>
        <text x={330} y={78} textAnchor="middle" fontSize={8} fill={C.muted}>
          Q·K^T에서 상대 위치 자연 등장
        </text>
        <text x={330} y={94} textAnchor="middle" fontSize={8} fill={C.muted}>
          긴 문맥 extrapolation 비교적 유리
        </text>
      </motion.g>
      <motion.text x={240} y={132} textAnchor="middle" fontSize={8} fill={C.rope} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        LLaMA, Gemma, Mistral 등 대부분 LLM 표준
      </motion.text>
    </g>
  );
}

function ALiBiYarnStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.alibi}>
        ALiBi & YaRN: 최신 접근
      </text>
      {/* ALiBi */}
      <motion.rect x={30} y={24} width={200} height={80} rx={6}
        fill={C.alibi + '08'} stroke={C.alibi} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={130} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.alibi}>
        ALiBi (BLOOM, 2022)
      </text>
      <text x={130} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        PE 자체를 제거
      </text>
      <text x={130} y={70} textAnchor="middle" fontSize={7} fill={C.muted}>
        score += -m·|i-j|
      </text>
      <text x={130} y={84} textAnchor="middle" fontSize={7} fill={C.alibi}>
        가까운 토큰 ↑ / 먼 토큰 ↓
      </text>
      <text x={130} y={98} textAnchor="middle" fontSize={7} fill={C.muted}>
        extrapolation 우수
      </text>
      {/* YaRN */}
      <motion.rect x={250} y={24} width={200} height={80} rx={6}
        fill={C.rel + '08'} stroke={C.rel} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, ...sp }} />
      <text x={350} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.rel}>
        YaRN / NTK scaling
      </text>
      <text x={350} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        RoPE 주파수 보간
      </text>
      <text x={350} y={70} textAnchor="middle" fontSize={7} fill={C.muted}>
        저주파 유지, 고주파 보간
      </text>
      <text x={350} y={84} textAnchor="middle" fontSize={7} fill={C.rel}>
        긴 문맥 적응 (4K→128K)
      </text>
      <text x={350} y={98} textAnchor="middle" fontSize={7} fill={C.muted}>
        LLaMA-2 Long 적용
      </text>
      <motion.text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        PE 진화: 학습 불필요 → 학습 → 회전 → bias → 보간
      </motion.text>
    </g>
  );
}

export default function PosEncDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <SinusoidalStep />;
    case 1: return <LearnedStep />;
    case 2: return <RoPEStep />;
    case 3: return <ALiBiYarnStep />;
    default: return <g />;
  }
}

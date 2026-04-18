import { motion } from 'framer-motion';
import { C } from './InputEmbDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function RequirementsStep() {
  const reqs = [
    { num: '1', text: '각 위치가 고유한 인코딩', icon: '①' },
    { num: '2', text: '다른 길이에도 일관성', icon: '②' },
    { num: '3', text: '상대 위치 학습 가능', icon: '③' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        Positional Encoding: 세 가지 요구사항
      </text>
      {reqs.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.12, ...sp }}>
          <rect x={60} y={26 + i * 32} width={360} height={26} rx={6}
            fill={C.sin + '10'} stroke={C.sin} strokeWidth={0.8} />
          <text x={80} y={42 + i * 32} fontSize={10} fill={C.sin} fontWeight={700}>{r.icon}</text>
          <text x={100} y={42 + i * 32} fontSize={9} fill={C.sin}>{r.text}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={120} y={124} width={240} height={22} rx={5}
          fill={C.cos + '12'} stroke={C.cos} strokeWidth={1} />
        <text x={240} y={138} textAnchor="middle" fontSize={8} fill={C.cos} fontWeight={600}>
          sin/cos 함수 조합이 세 조건 모두 충족
        </text>
      </motion.g>
    </g>
  );
}

function FrequencyStep() {
  const freqs = [
    { dim: 'i=0 (저차원)', speed: '빠름 (초침)', color: C.sin },
    { dim: 'i=중간', speed: '중간 (분침)', color: C.dim },
    { dim: 'i=d/2 (고차원)', speed: '느림 (시침)', color: C.cos },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        주파수 해석: 시계 비유
      </text>
      {/* Three frequency bands */}
      {freqs.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.12, ...sp }}>
          <rect x={40} y={24 + i * 30} width={400} height={24} rx={5}
            fill={f.color + '10'} stroke={f.color} strokeWidth={0.8} />
          <text x={60} y={39 + i * 30} fontSize={8} fill={f.color} fontWeight={600}>{f.dim}</text>
          <text x={250} y={39 + i * 30} textAnchor="middle" fontSize={8} fill={f.color}>→ {f.speed}</text>
          {/* Sine wave preview */}
          <motion.path
            d={`M 330 ${36 + i * 30} ${Array.from({ length: 20 }, (_, x) =>
              `L ${330 + x * 5} ${36 + i * 30 - Math.sin(x * (0.8 - i * 0.3)) * 6}`).join(' ')}`}
            fill="none" stroke={f.color} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} />
        </motion.g>
      ))}
      {/* Example values */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={240} y={125} textAnchor="middle" fontSize={8} fill={C.muted}>
          d=4: PE(0)=[0, 1, 0, 1] │ PE(1)≈[0.84, 0.54, 0.01, 1.00]
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={7} fill={C.muted}>
          저차원 급변 / 고차원 거의 불변 → 다중 스케일 위치 표현
        </text>
      </motion.g>
    </g>
  );
}

function RelativePositionStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cos}>
        상대 위치: 선형 변환 관계
      </text>
      {/* PE(pos) → PE(pos+k) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, ...sp }}>
        <rect x={40} y={28} width={120} height={32} rx={6}
          fill={C.sin + '15'} stroke={C.sin} strokeWidth={1.2} />
        <text x={100} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.sin}>PE(pos)</text>
        <text x={100} y={56} textAnchor="middle" fontSize={7} fill={C.sin}>위치 p</text>
      </motion.g>
      <motion.line x1={162} y1={44} x2={220} y2={44} stroke={C.dim} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={172} y={30} width={66} height={16} rx={3}
          fill="#fff" stroke={C.dim} strokeWidth={0.6} />
        <text x={205} y={41} textAnchor="middle" fontSize={7} fill={C.dim} fontWeight={600}>
          Linear T
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, ...sp }}>
        <rect x={222} y={28} width={140} height={32} rx={6}
          fill={C.cos + '15'} stroke={C.cos} strokeWidth={1.2} />
        <text x={292} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cos}>PE(pos+k)</text>
        <text x={292} y={56} textAnchor="middle" fontSize={7} fill={C.cos}>k만큼 이동</text>
      </motion.g>
      {/* sin/cos addition theorem */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={72} width={360} height={24} rx={5}
          fill={C.muted + '08'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={87} textAnchor="middle" fontSize={8} fill={C.muted}>
          sin/cos 덧셈 정리 → k 떨어진 위치가 행렬 곱으로 표현
        </text>
      </motion.g>
      {/* Properties */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={80} y={116} fontSize={8} fill={C.sin}>최대 길이 제한 없음</text>
        <text x={240} y={116} fontSize={8} fill={C.cos}>학습 불필요</text>
        <text x={370} y={116} fontSize={8} fill={C.dim}>직접 덧셈</text>
      </motion.g>
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        최종 입력 = 임베딩 벡터 + PE 벡터
      </motion.text>
    </g>
  );
}

function AlternativesStep() {
  const methods = [
    { name: 'Learned PE', model: 'BERT, GPT-2', note: 'max_len 고정', color: C.dim },
    { name: 'Relative PE', model: 'T5', note: '상대 거리 bias', color: C.cos },
    { name: 'RoPE', model: 'LLaMA', note: '복소수 회전', color: C.sin },
    { name: 'ALiBi', model: 'BLOOM', note: 'PE 불필요', color: '#ef4444' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        PE 진화: Sinusoidal → RoPE → ALiBi
      </text>
      {methods.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.1, ...sp }}>
          <rect x={40} y={22 + i * 28} width={400} height={22} rx={5}
            fill={m.color + '10'} stroke={m.color} strokeWidth={0.8} />
          <text x={60} y={36 + i * 28} fontSize={9} fontWeight={600} fill={m.color}>{m.name}</text>
          <text x={220} y={36 + i * 28} textAnchor="middle" fontSize={8} fill={m.color}>{m.model}</text>
          <text x={380} y={36 + i * 28} textAnchor="end" fontSize={8} fill={C.muted}>{m.note}</text>
        </motion.g>
      ))}
      {/* Current standard */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={100} y={136} width={280} height={18} rx={4}
          fill={C.sin + '18'} stroke={C.sin} strokeWidth={1.2} />
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.sin} fontWeight={600}>
          2024 표준: RoPE (상대 위치 자연 표현 + 수학적 깔끔)
        </text>
      </motion.g>
    </g>
  );
}

export default function InputEmbDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <RequirementsStep />;
    case 1: return <FrequencyStep />;
    case 2: return <RelativePositionStep />;
    case 3: return <AlternativesStep />;
    default: return <g />;
  }
}

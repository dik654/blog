import { motion } from 'framer-motion';
import { C } from './MultiHeadDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function FormulaStep() {
  const heads = [
    { id: 0, role: '구문 (S-V)', color: C.head },
    { id: 1, role: '의미 (유의어)', color: '#8b5cf6' },
    { id: 2, role: '위치 (직전)', color: '#3b82f6' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.head}>
        Multi-Head: 병렬 어텐션
      </text>
      {/* head boxes */}
      {heads.map((h, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1, ...sp }}>
          <rect x={15 + i * 120} y={24} width={105} height={48} rx={6}
            fill={h.color + '12'} stroke={h.color} strokeWidth={1.2} />
          <text x={67 + i * 120} y={40} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={h.color}>Head {h.id}</text>
          <text x={67 + i * 120} y={54} textAnchor="middle" fontSize={7}
            fill={h.color} opacity={0.7}>{h.role}</text>
          <text x={67 + i * 120} y={66} textAnchor="middle" fontSize={7}
            fill={C.muted}>d_k=64</text>
        </motion.g>
      ))}
      {/* ... more */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={387} y={50} fontSize={10} fill={C.muted}>···</text>
        <rect x={400} y={24} width={65} height={48} rx={6}
          fill={C.head + '06'} stroke={C.head} strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={432} y={48} textAnchor="middle" fontSize={8} fill={C.head}>Head 7</text>
        <text x={432} y={62} textAnchor="middle" fontSize={7} fill={C.muted}>d_k=64</text>
      </motion.g>
      {/* Formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={40} y={84} width={400} height={22} rx={5}
          fill={C.muted + '08'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={98} textAnchor="middle" fontSize={8} fill={C.head}>
          head_i = Attention(X·W_Q^i, X·W_K^i, X·W_V^i)
        </text>
      </motion.g>
      <motion.text x={240} y={126} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        8개 헤드가 64차원에서 독립 어텐션 수행
      </motion.text>
      <motion.text x={240} y={142} textAnchor="middle" fontSize={7} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        단일 512차원 헤드보다 다양한 패턴 포착
      </motion.text>
    </g>
  );
}

function ConcatStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.concat}>
        Concat + W_O: 차원 복원
      </text>
      {/* 8 head slots */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.04, ...sp }}>
          <rect x={20 + i * 55} y={26} width={50} height={28} rx={4}
            fill={C.head + '12'} stroke={C.head} strokeWidth={0.6} />
          <text x={45 + i * 55} y={38} textAnchor="middle" fontSize={7}
            fontWeight={600} fill={C.head}>h{i}</text>
          <text x={45 + i * 55} y={49} textAnchor="middle" fontSize={6}
            fill={C.muted}>64</text>
        </motion.g>
      ))}
      {/* Concat arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={240} y1={56} x2={240} y2={66} stroke={C.concat} strokeWidth={1} />
        <polygon points="240,68 236,62 244,62" fill={C.concat} />
      </motion.g>
      {/* Concat result */}
      <motion.rect x={60} y={70} width={360} height={24} rx={6}
        fill={C.concat + '12'} stroke={C.concat} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, ...sp }} />
      <text x={240} y={85} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.concat}>
        Concat: 8 × 64 = 512차원
      </text>
      {/* W_O */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={240} y1={94} x2={240} y2={104} stroke={C.wo} strokeWidth={1} />
        <polygon points="240,106 236,100 244,100" fill={C.wo} />
      </motion.g>
      <motion.rect x={100} y={108} width={280} height={24} rx={6}
        fill={C.wo + '12'} stroke={C.wo} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, ...sp }} />
      <text x={240} y={123} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.wo}>
        × W_O (512, 512) → 출력 (n, 512)
      </text>
      <motion.text x={240} y={150} textAnchor="middle" fontSize={7} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        헤드별 정보를 섞어 통합된 표현 생성 → Add & Norm 전달
      </motion.text>
    </g>
  );
}

function ParamsStep() {
  const items = [
    { name: 'W_Q^i × 8', calc: '(512×64)×8 = 262K', color: C.head },
    { name: 'W_K^i × 8', calc: '(512×64)×8 = 262K', color: C.head },
    { name: 'W_V^i × 8', calc: '(512×64)×8 = 262K', color: C.head },
    { name: 'W_O', calc: '(512×512) = 262K', color: C.wo },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.param}>
        파라미터 수: 단일 헤드와 동일
      </text>
      {items.map((it, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08, ...sp }}>
          <rect x={60} y={24 + i * 24} width={360} height={18} rx={4}
            fill={it.color + '10'} stroke={it.color} strokeWidth={0.6} />
          <text x={140} y={36 + i * 24} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={it.color}>{it.name}</text>
          <text x={340} y={36 + i * 24} textAnchor="middle" fontSize={8} fill={C.muted}>
            {it.calc}
          </text>
        </motion.g>
      ))}
      {/* Total */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={100} y={124} width={280} height={22} rx={5}
          fill={C.param + '15'} stroke={C.param} strokeWidth={1.2} />
        <text x={240} y={138} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.param}>
          블록당 총: ~1.05M 파라미터
        </text>
      </motion.g>
      <motion.text x={240} y={155} textAnchor="middle" fontSize={7} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        단일 헤드 (512, 512) × 4와 동일 — 차원 분할의 마법
      </motion.text>
    </g>
  );
}

function ImplStep() {
  const lines = [
    { code: 'Q = W_Q(x).view(B,N,h,d_k).transpose(1,2)', note: '(B,8,N,64)', color: C.head },
    { code: 'scores = Q @ K^T / √64', note: '(B,8,N,N)', color: C.param },
    { code: 'attn = softmax(scores)', note: '(B,8,N,N)', color: C.concat },
    { code: 'out = (attn @ V).transpose(1,2).view(B,N,512)', note: '(B,N,512)', color: C.wo },
    { code: 'return W_O(out)', note: '(B,N,512)', color: C.wo },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        PyTorch: reshape로 헤드 분리
      </text>
      {lines.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08, ...sp }}>
          <rect x={30} y={22 + i * 24} width={420} height={18} rx={4}
            fill={l.color + '08'} stroke={l.color} strokeWidth={0.5} />
          <text x={40} y={34 + i * 24} fontSize={7.5} fill={l.color} fontFamily="monospace">
            {l.code}
          </text>
          <text x={440} y={34 + i * 24} textAnchor="end" fontSize={7} fill={C.muted}>
            {l.note}
          </text>
        </motion.g>
      ))}
      <motion.text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        view + transpose로 헤드 분리 → 하나의 matmul로 8헤드 병렬
      </motion.text>
    </g>
  );
}

export default function MultiHeadDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <FormulaStep />;
    case 1: return <ConcatStep />;
    case 2: return <ParamsStep />;
    case 3: return <ImplStep />;
    default: return <g />;
  }
}

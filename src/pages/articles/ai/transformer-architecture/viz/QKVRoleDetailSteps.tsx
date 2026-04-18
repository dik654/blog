import { motion } from 'framer-motion';
import { C } from './QKVRoleDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function SearchAnalogyStep() {
  const roles = [
    { key: 'Q', label: 'Query', desc: '무엇을 찾고 싶은가?', sub: '검색어', color: C.q },
    { key: 'K', label: 'Key', desc: '어떤 내용을 가졌는가?', sub: '인덱스', color: C.k },
    { key: 'V', label: 'Value', desc: '실제로 전달할 내용', sub: '데이터', color: C.v },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        Q, K, V: 정보 검색 비유
      </text>
      {roles.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.12, ...sp }}>
          <rect x={30 + i * 150} y={26} width={130} height={60} rx={6}
            fill={r.color + '12'} stroke={r.color} strokeWidth={1.2} />
          <text x={95 + i * 150} y={42} textAnchor="middle" fontSize={11}
            fontWeight={700} fill={r.color}>{r.key}</text>
          <text x={95 + i * 150} y={56} textAnchor="middle" fontSize={7}
            fill={r.color} opacity={0.8}>{r.desc}</text>
          <text x={95 + i * 150} y={70} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={r.color}>{r.sub} 역할</text>
        </motion.g>
      ))}
      {/* Example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={100} width={360} height={30} rx={5}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={114} textAnchor="middle" fontSize={8} fill={C.q}>
          예: "it"의 Q가 "cat"의 K와 높은 유사도
        </text>
        <text x={240} y={126} textAnchor="middle" fontSize={7} fill={C.muted}>
          → "cat"의 V 정보를 많이 가져옴 (대명사 해소)
        </text>
      </motion.g>
    </g>
  );
}

function SameInputStep() {
  const projections = [
    { w: 'W_Q', role: '관점 1: 무엇을 찾을까', color: C.q },
    { w: 'W_K', role: '관점 2: 나는 무엇인가', color: C.k },
    { w: 'W_V', role: '관점 3: 내 정보는 무엇', color: C.v },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        같은 입력 X → 다른 투영
      </text>
      {/* X box */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={180} y={22} width={120} height={24} rx={5}
          fill={C.muted + '10'} stroke={C.muted} strokeWidth={1} />
        <text x={240} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
          입력 X (n, d)
        </text>
      </motion.g>
      {/* Three projections */}
      {projections.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1, ...sp }}>
          <line x1={240} y1={46} x2={80 + i * 160} y2={60} stroke={p.color} strokeWidth={0.8} />
          <rect x={20 + i * 160} y={60} width={120} height={34} rx={6}
            fill={p.color + '12'} stroke={p.color} strokeWidth={1} />
          <text x={80 + i * 160} y={76} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={p.color}>{p.w}</text>
          <text x={80 + i * 160} y={88} textAnchor="middle" fontSize={7}
            fill={p.color} opacity={0.7}>{p.role}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={115} textAnchor="middle" fontSize={8} fill={C.muted}>
          같은 단어도 세 가지 "얼굴"을 가짐
        </text>
        <text x={240} y={132} textAnchor="middle" fontSize={7} fill={C.muted}>
          d_k = d_v = d_model/h │ h=8이면 d_k=64
        </text>
      </motion.g>
    </g>
  );
}

function SelfVsCrossStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        Self vs Cross Attention
      </text>
      {/* Self-Attention box */}
      <motion.rect x={20} y={24} width={210} height={90} rx={6}
        fill={C.q + '08'} stroke={C.q} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={125} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.q}>
        Self-Attention
      </text>
      <text x={125} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        Q, K, V 모두 같은 시퀀스
      </text>
      <text x={125} y={70} textAnchor="middle" fontSize={7} fill={C.q}>
        Encoder: 소스 내부 관계
      </text>
      <text x={125} y={84} textAnchor="middle" fontSize={7} fill={C.q}>
        Decoder: 타겟 내부 + mask
      </text>
      <text x={125} y={98} textAnchor="middle" fontSize={7} fill={C.muted}>
        양방향 (Enc) / 단방향 (Dec)
      </text>
      {/* Cross-Attention box */}
      <motion.rect x={250} y={24} width={210} height={90} rx={6}
        fill={C.cross + '08'} stroke={C.cross} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, ...sp }} />
      <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cross}>
        Cross-Attention
      </text>
      <text x={355} y={56} textAnchor="middle" fontSize={7} fill={C.muted}>
        Q=디코더, K/V=인코더
      </text>
      <text x={355} y={70} textAnchor="middle" fontSize={7} fill={C.cross}>
        디코더 → 인코더 정보 조회
      </text>
      <text x={355} y={84} textAnchor="middle" fontSize={7} fill={C.cross}>
        번역: 소스 관련 단어 참조
      </text>
      <text x={355} y={98} textAnchor="middle" fontSize={7} fill={C.muted}>
        Encoder-Decoder 전용
      </text>
      <motion.text x={240} y={138} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        GPT (Decoder-only) = Self만 │ T5 = Self + Cross
      </motion.text>
    </g>
  );
}

function DimensionsStep() {
  const dims = [
    { item: 'X', shape: '(n, d_model)', val: '(n, 512)', color: C.muted },
    { item: 'W_Q, W_K', shape: '(d_model, d_k)', val: '(512, 64)', color: C.q },
    { item: 'W_V', shape: '(d_model, d_v)', val: '(512, 64)', color: C.v },
    { item: 'Q, K', shape: '(n, d_k)', val: '(n, 64)', color: C.q },
    { item: 'Q·K^T', shape: '(n, n)', val: '(n, n)', color: C.k },
    { item: '×V → 출력', shape: '(n, d_v)', val: '(n, 64)', color: C.v },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        차원 정리: 입력 → 출력
      </text>
      {dims.map((d, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 + i * 0.07, ...sp }}>
          <rect x={50} y={22 + i * 20} width={380} height={16} rx={4}
            fill={d.color + '08'} stroke={d.color} strokeWidth={0.5} />
          <text x={120} y={33 + i * 20} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={d.color}>{d.item}</text>
          <text x={240} y={33 + i * 20} textAnchor="middle" fontSize={8} fill={d.color}>
            {d.shape}
          </text>
          <text x={380} y={33 + i * 20} textAnchor="end" fontSize={7} fill={C.muted}>
            {d.val}
          </text>
        </motion.g>
      ))}
      <motion.text x={240} y={150} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Multi-Head 출력: Concat → (n, h·d_v) → W_O → (n, d_model)
      </motion.text>
    </g>
  );
}

export default function QKVRoleDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <SearchAnalogyStep />;
    case 1: return <SameInputStep />;
    case 2: return <SelfVsCrossStep />;
    case 3: return <DimensionsStep />;
    default: return <g />;
  }
}

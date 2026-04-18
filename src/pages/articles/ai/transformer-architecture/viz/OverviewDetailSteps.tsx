import { motion } from 'framer-motion';
import { C } from './OverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function EncoderStackStep() {
  const subs = [
    { label: 'Multi-Head Self-Attention', color: C.enc },
    { label: 'Add & Norm', color: C.norm },
    { label: 'Feed-Forward (d_ff=2048)', color: C.ffn },
    { label: 'Add & Norm', color: C.norm },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.enc}>
        Encoder: 6 레이어 × 2 서브블록
      </text>
      {/* Layer box */}
      <motion.rect x={80} y={20} width={320} height={110} rx={8}
        fill={C.enc + '08'} stroke={C.enc} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={92} y={34} fontSize={8} fill={C.enc} fontWeight={600}>Layer i (×6 반복)</text>
      {subs.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.1, ...sp }}>
          <rect x={100} y={40 + i * 22} width={280} height={18} rx={4}
            fill={s.color + '15'} stroke={s.color} strokeWidth={0.8} />
          <text x={240} y={52 + i * 22} textAnchor="middle" fontSize={8} fill={s.color}
            fontWeight={500}>{s.label}</text>
        </motion.g>
      ))}
      {/* Residual arrows */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={420} y={55} fontSize={7} fill={C.muted}>Residual</text>
        <line x1={410} y1={58} x2={410} y2={90} stroke={C.muted} strokeWidth={0.8}
          strokeDasharray="3 2" />
        <polygon points="410,92 407,86 413,86" fill={C.muted} />
      </motion.g>
      <motion.text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        출력 → Decoder Cross-Attention의 K, V로 전달
      </motion.text>
    </g>
  );
}

function DecoderStackStep() {
  const subs = [
    { label: 'Masked Self-Attention', color: C.dec },
    { label: 'Add & Norm', color: C.norm },
    { label: 'Cross-Attention (Q=Dec, K/V=Enc)', color: C.enc },
    { label: 'Add & Norm', color: C.norm },
    { label: 'Feed-Forward', color: C.ffn },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.dec}>
        Decoder: 6 레이어 × 3 서브블록
      </text>
      <motion.rect x={60} y={20} width={360} height={118} rx={8}
        fill={C.dec + '08'} stroke={C.dec} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={72} y={34} fontSize={8} fill={C.dec} fontWeight={600}>Layer j (×6 반복)</text>
      {subs.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.08, ...sp }}>
          <rect x={80} y={38 + i * 20} width={320} height={16} rx={4}
            fill={s.color + '15'} stroke={s.color} strokeWidth={0.8} />
          <text x={240} y={49 + i * 20} textAnchor="middle" fontSize={7.5} fill={s.color}
            fontWeight={500}>{s.label}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        총 6 × 3 = 18 서브블록 (Encoder보다 1.5배)
      </motion.text>
    </g>
  );
}

function ModelSizeStep() {
  const params = [
    { key: 'd_model', val: '512', desc: '은닉 차원' },
    { key: 'd_ff', val: '2048', desc: 'FFN 확장 (4×)' },
    { key: 'h', val: '8', desc: '어텐션 헤드' },
    { key: 'N', val: '6', desc: '레이어 수' },
    { key: 'Total', val: '~65M', desc: '파라미터' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        원 논문 모델 크기 (base)
      </text>
      {params.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, ...sp }}>
          <rect x={80} y={22 + i * 24} width={320} height={20} rx={5}
            fill={i === 4 ? C.enc + '18' : C.muted + '08'}
            stroke={i === 4 ? C.enc : C.muted} strokeWidth={i === 4 ? 1.2 : 0.6} />
          <text x={140} y={35 + i * 24} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={i === 4 ? C.enc : C.muted}>{p.key}</text>
          <text x={260} y={35 + i * 24} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={i === 4 ? C.enc : '#1e293b'}>{p.val}</text>
          <text x={360} y={35 + i * 24} textAnchor="middle" fontSize={8}
            fill={C.muted}>{p.desc}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Big 모델: d=1024, h=16, N=6 → ~213M
      </motion.text>
    </g>
  );
}

function RnnCompareStep() {
  const pros = ['완전 병렬화', 'O(1) 경로 길이', 'GPU/TPU 친화'];
  const cons = ['O(n²) 복잡도', '메모리 사용량 큼', '10K+ 시퀀스 어려움'];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
        RNN 대비 장점 / 단점
      </text>
      {/* Pros */}
      <motion.rect x={30} y={22} width={200} height={90} rx={6}
        fill={C.norm + '08'} stroke={C.norm} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={130} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.norm}>장점</text>
      {pros.map((p, i) => (
        <motion.text key={i} x={130} y={52 + i * 18} textAnchor="middle" fontSize={8} fill={C.norm}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
          {p}
        </motion.text>
      ))}
      {/* Cons */}
      <motion.rect x={250} y={22} width={200} height={90} rx={6}
        fill={'#ef4444' + '08'} stroke={'#ef4444'} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, ...sp }} />
      <text x={350} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={'#ef4444'}>단점</text>
      {cons.map((c, i) => (
        <motion.text key={i} x={350} y={52 + i * 18} textAnchor="middle" fontSize={8} fill={'#ef4444'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
          {c}
        </motion.text>
      ))}
      <motion.text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.enc}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        GPT = Decoder │ BERT = Encoder │ T5 = 둘 다
      </motion.text>
      <motion.text x={240} y={148} textAnchor="middle" fontSize={7} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        No Recurrence: Attention만으로 시퀀스 처리 → 병렬화 혁명
      </motion.text>
    </g>
  );
}

export default function OverviewDetailSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <EncoderStackStep />;
    case 1: return <DecoderStackStep />;
    case 2: return <ModelSizeStep />;
    case 3: return <RnnCompareStep />;
    default: return <g />;
  }
}

import { motion } from 'framer-motion';
import { C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 핵심 원리 — attract / repel 시각화 */
export function Step0() {
  return (
    <g>
      {/* 중앙 Anchor */}
      <motion.circle cx={240} cy={100} r={22} fill={`${C.anchor}20`} stroke={C.anchor} strokeWidth={1.5}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={sp} />
      <text x={240} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.anchor}>Anchor</text>

      {/* Positive — 가까이 당겨짐 */}
      <motion.circle cx={150} cy={70} r={18} fill={`${C.positive}20`} stroke={C.positive} strokeWidth={1.2}
        initial={{ cx: 80, cy: 40, opacity: 0 }} animate={{ cx: 150, cy: 70, opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <motion.text x={150} y={74} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.positive}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>Positive</motion.text>

      {/* Positive 2 */}
      <motion.circle cx={180} cy={140} r={16} fill={`${C.positive}15`} stroke={C.positive} strokeWidth={1}
        initial={{ cx: 100, cy: 180, opacity: 0 }} animate={{ cx: 180, cy: 140, opacity: 1 }} transition={{ ...sp, delay: 0.25 }} />
      <motion.text x={180} y={144} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.positive}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>Pos</motion.text>

      {/* attract 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={168} y1={78} x2={220} y2={94} stroke={C.positive} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#cl-arr-pos)" />
        <line x1={194} y1={134} x2={222} y2={112} stroke={C.positive} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#cl-arr-pos)" />
        <text x={175} y={56} textAnchor="middle" fontSize={8} fill={C.positive}>attract</text>
      </motion.g>

      {/* Negative — 멀리 밀림 */}
      <motion.circle cx={360} cy={60} r={18} fill={`${C.negative}20`} stroke={C.negative} strokeWidth={1.2}
        initial={{ cx: 300, cy: 80, opacity: 0 }} animate={{ cx: 360, cy: 60, opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
      <motion.text x={360} y={64} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.negative}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>Negative</motion.text>

      {/* Negative 2 */}
      <motion.circle cx={340} cy={155} r={16} fill={`${C.negative}15`} stroke={C.negative} strokeWidth={1}
        initial={{ cx: 290, cy: 130, opacity: 0 }} animate={{ cx: 340, cy: 155, opacity: 1 }} transition={{ ...sp, delay: 0.35 }} />
      <motion.text x={340} y={159} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.negative}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>Neg</motion.text>

      {/* repel 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={260} y1={92} x2={342} y2={66} stroke={C.negative} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#cl-arr-neg)" />
        <line x1={258} y1={110} x2={326} y2={148} stroke={C.negative} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#cl-arr-neg)" />
        <text x={370} y={120} textAnchor="middle" fontSize={8} fill={C.negative}>repel</text>
      </motion.g>

      {/* 임베딩 공간 라벨 */}
      <motion.text x={240} y={190} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        임베딩 공간: d(a,p) ↓  d(a,n) ↑
      </motion.text>

      <defs>
        <marker id="cl-arr-pos" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.positive} />
        </marker>
        <marker id="cl-arr-neg" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.negative} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: Anchor / Positive / Negative 정의 */
export function Step1() {
  const items = [
    { x: 80, y: 50, label: 'Anchor', sub: '기준 샘플', c: C.anchor, icon: '●' },
    { x: 240, y: 50, label: 'Positive', sub: '유사 샘플', c: C.positive, icon: '●' },
    { x: 400, y: 50, label: 'Negative', sub: '다른 샘플', c: C.negative, icon: '●' },
  ];

  return (
    <g>
      {items.map((item, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={item.x - 50} y={item.y} width={100} height={55} rx={8}
            fill={`${item.c}10`} stroke={item.c} strokeWidth={1} />
          <circle cx={item.x} cy={item.y + 18} r={8} fill={`${item.c}25`} stroke={item.c} strokeWidth={1} />
          <text x={item.x} y={item.y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={item.c}>{item.icon}</text>
          <text x={item.x} y={item.y + 40} textAnchor="middle" fontSize={10} fontWeight={600} fill={item.c}>{item.label}</text>
          <text x={item.x} y={item.y + 52} textAnchor="middle" fontSize={8} fill={C.muted}>{item.sub}</text>
        </motion.g>
      ))}

      {/* 거리 관계 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={130} y1={78} x2={190} y2={78} stroke={C.positive} strokeWidth={1.2} markerEnd="url(#cl-ov-arr)" />
        <rect x={136} y={68} width={48} height={14} rx={3} fill="var(--card)" stroke="none" />
        <text x={160} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.positive}>가깝게</text>

        <line x1={290} y1={78} x2={350} y2={78} stroke={C.negative} strokeWidth={1.2} markerEnd="url(#cl-ov-arr2)" />
        <rect x={296} y={68} width={48} height={14} rx={3} fill="var(--card)" stroke="none" />
        <text x={320} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.negative}>멀게</text>
      </motion.g>

      {/* 수식 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.55 }}>
        <rect x={120} y={130} width={240} height={30} rx={6} fill={`${C.anchor}08`} stroke={C.anchor} strokeWidth={0.8} />
        <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.anchor}>
          d(a, p) + margin {'<'} d(a, n)
        </text>
      </motion.g>

      <defs>
        <marker id="cl-ov-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.positive} />
        </marker>
        <marker id="cl-ov-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.negative} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: Self-supervised vs Supervised */
export function Step2() {
  return (
    <g>
      {/* Self-supervised 영역 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={20} y={20} width={200} height={160} rx={10} fill={`${C.self}06`} stroke={C.self} strokeWidth={1} />
        <text x={120} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.self}>Self-supervised</text>
        <text x={120} y={55} textAnchor="middle" fontSize={8} fill={C.muted}>라벨 불필요</text>

        {/* 같은 이미지 → 2개 augmentation */}
        <rect x={45} y={70} width={60} height={35} rx={6} fill={`${C.self}12`} stroke={C.self} strokeWidth={0.8} />
        <text x={75} y={83} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.self}>이미지 x</text>
        <text x={75} y={95} textAnchor="middle" fontSize={7} fill={C.muted}>원본</text>

        <line x1={105} y1={80} x2={135} y2={72} stroke={C.self} strokeWidth={0.8} markerEnd="url(#cl-ov-self)" />
        <line x1={105} y1={95} x2={135} y2={103} stroke={C.self} strokeWidth={0.8} markerEnd="url(#cl-ov-self)" />

        <rect x={137} y={60} width={65} height={22} rx={5} fill={`${C.positive}15`} stroke={C.positive} strokeWidth={0.8} />
        <text x={170} y={75} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.positive}>aug₁ (pos)</text>

        <rect x={137} y={92} width={65} height={22} rx={5} fill={`${C.positive}15`} stroke={C.positive} strokeWidth={0.8} />
        <text x={170} y={107} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.positive}>aug₂ (pos)</text>

        <text x={120} y={140} textAnchor="middle" fontSize={8} fill={C.muted}>다른 이미지 = negative</text>
        <text x={120} y={155} textAnchor="middle" fontSize={8} fill={C.self}>SimCLR, MoCo, BYOL</text>
      </motion.g>

      {/* Supervised 영역 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={260} y={20} width={200} height={160} rx={10} fill={`${C.sup}06`} stroke={C.sup} strokeWidth={1} />
        <text x={360} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sup}>Supervised</text>
        <text x={360} y={55} textAnchor="middle" fontSize={8} fill={C.muted}>라벨 활용</text>

        {/* 같은 클래스 = positive */}
        <circle cx={295} cy={90} r={12} fill={`${C.positive}20`} stroke={C.positive} strokeWidth={1} />
        <text x={295} y={94} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.positive}>A</text>

        <circle cx={330} cy={80} r={12} fill={`${C.positive}20`} stroke={C.positive} strokeWidth={1} />
        <text x={330} y={84} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.positive}>A</text>

        <circle cx={320} cy={108} r={12} fill={`${C.positive}20`} stroke={C.positive} strokeWidth={1} />
        <text x={320} y={112} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.positive}>A</text>

        {/* 다른 클래스 = negative */}
        <circle cx={390} cy={85} r={12} fill={`${C.negative}20`} stroke={C.negative} strokeWidth={1} />
        <text x={390} y={89} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.negative}>B</text>

        <circle cx={420} cy={105} r={12} fill={`${C.negative}20`} stroke={C.negative} strokeWidth={1} />
        <text x={420} y={109} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.negative}>B</text>

        <text x={360} y={140} textAnchor="middle" fontSize={8} fill={C.muted}>같은 클래스 전부 = positive</text>
        <text x={360} y={155} textAnchor="middle" fontSize={8} fill={C.sup}>SupCon Loss</text>
      </motion.g>

      <defs>
        <marker id="cl-ov-self" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.self} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: 활용 범위 4개 도메인 */
export function Step3() {
  const domains = [
    { x: 60, label: 'Vision', sub: 'SimCLR / MoCo', metric: '76.5%', c: C.anchor },
    { x: 180, label: 'NLP', sub: 'SimCSE', metric: '+5% STS', c: C.positive },
    { x: 300, label: 'Genomics', sub: 'gLM + CL', metric: 'ρ=0.62', c: C.sup },
    { x: 420, label: 'RecSys', sub: 'CL4Rec', metric: '희소 강건', c: C.negative },
  ];

  return (
    <g>
      {domains.map((d, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={d.x - 45} y={35} width={90} height={85} rx={8}
            fill={`${d.c}08`} stroke={d.c} strokeWidth={1} />
          <rect x={d.x - 45} y={35} width={90} height={5} rx={2.5} fill={d.c} opacity={0.7} />
          <text x={d.x} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={d.c}>{d.label}</text>
          <text x={d.x} y={73} textAnchor="middle" fontSize={8} fill={C.muted}>{d.sub}</text>
          <rect x={d.x - 28} y={82} width={56} height={18} rx={9} fill={`${d.c}15`} />
          <text x={d.x} y={95} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.c}>{d.metric}</text>
        </motion.g>
      ))}

      <motion.text x={240} y={150} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        "좋은 표현" → 모든 downstream task 성능 향상
      </motion.text>
    </g>
  );
}

import { motion } from 'framer-motion';
import { C } from './TripletVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 임베딩 공간에서 A-P-N 시각화 */
export function Step0() {
  return (
    <g>
      {/* 임베딩 공간 배경 원 */}
      <motion.circle cx={240} cy={100} r={85} fill="none" stroke={C.muted} strokeWidth={0.5} strokeDasharray="4 3"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={sp} />

      {/* Anchor */}
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={sp}>
        <circle cx={220} cy={100} r={16} fill={`${C.anchor}25`} stroke={C.anchor} strokeWidth={1.5} />
        <text x={220} y={96} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.anchor}>A</text>
        <text x={220} y={108} textAnchor="middle" fontSize={7} fill={C.anchor}>Anchor</text>
      </motion.g>

      {/* Positive — 가까이 */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
        <circle cx={185} cy={70} r={14} fill={`${C.pos}25`} stroke={C.pos} strokeWidth={1.5} />
        <text x={185} y={67} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.pos}>P</text>
        <text x={185} y={79} textAnchor="middle" fontSize={7} fill={C.pos}>Positive</text>
      </motion.g>

      {/* d(a,p) 거리 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={197} y1={78} x2={212} y2={92} stroke={C.pos} strokeWidth={1} strokeDasharray="3 2" />
        <rect x={188} y={80} width={36} height={13} rx={3} fill="var(--card)" stroke="none" />
        <text x={206} y={90} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pos}>d(a,p)</text>
      </motion.g>

      {/* Negative — 멀리 */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
        <circle cx={330} cy={80} r={14} fill={`${C.neg}25`} stroke={C.neg} strokeWidth={1.5} />
        <text x={330} y={77} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.neg}>N</text>
        <text x={330} y={89} textAnchor="middle" fontSize={7} fill={C.neg}>Negative</text>
      </motion.g>

      {/* d(a,n) 거리 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <line x1={236} y1={96} x2={316} y2={82} stroke={C.neg} strokeWidth={1} strokeDasharray="3 2" />
        <rect x={258} y={80} width={36} height={13} rx={3} fill="var(--card)" stroke="none" />
        <text x={276} y={90} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.neg}>d(a,n)</text>
      </motion.g>

      {/* Margin 영역 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <circle cx={220} cy={100} r={50} fill="none" stroke={C.margin} strokeWidth={1} strokeDasharray="6 3" opacity={0.6} />
        <text x={272} y={140} fontSize={8} fontWeight={600} fill={C.margin}>margin α</text>
      </motion.g>

      {/* 목표 수식 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.55 }}>
        <rect x={120} y={175} width={240} height={22} rx={6} fill={`${C.anchor}08`} stroke={C.anchor} strokeWidth={0.8} />
        <text x={240} y={190} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.anchor}>
          d(a,p) + α {'<'} d(a,n)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: Triplet Loss 수식과 수치 예시 */
export function Step1() {
  const examples = [
    { dap: 0.3, dan: 0.8, a: 0.2, loss: 0, type: 'easy', c: C.pos },
    { dap: 0.4, dan: 0.5, a: 0.2, loss: 0.1, type: 'semi-hard', c: C.semi },
    { dap: 0.5, dan: 0.3, a: 0.2, loss: 0.4, type: 'hard', c: C.neg },
  ];

  return (
    <g>
      {/* 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={90} y={10} width={300} height={28} rx={6} fill={`${C.anchor}08`} stroke={C.anchor} strokeWidth={1} />
        <text x={240} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.anchor}>
          L = max(0,  d(a,p) - d(a,n) + α)
        </text>
      </motion.g>

      {/* 예시 테이블 */}
      {examples.map((ex, i) => {
        const y = 55 + i * 50;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
            <rect x={30} y={y} width={420} height={38} rx={6}
              fill={`${ex.c}06`} stroke={ex.c} strokeWidth={0.8} />

            {/* 유형 라벨 */}
            <rect x={38} y={y + 8} width={65} height={20} rx={10} fill={`${ex.c}18`} />
            <text x={70} y={y + 22} textAnchor="middle" fontSize={8} fontWeight={600} fill={ex.c}>{ex.type}</text>

            {/* 수치 */}
            <text x={130} y={y + 16} fontSize={8} fill={C.pos}>d(a,p)={ex.dap}</text>
            <text x={210} y={y + 16} fontSize={8} fill={C.neg}>d(a,n)={ex.dan}</text>
            <text x={290} y={y + 16} fontSize={8} fill={C.margin}>α={ex.a}</text>

            {/* 계산 결과 */}
            <text x={130} y={y + 30} fontSize={7} fill={C.muted}>
              max(0, {ex.dap}-{ex.dan}+{ex.a}) = max(0, {(ex.dap - ex.dan + ex.a).toFixed(1)})
            </text>

            {/* Loss 값 */}
            <rect x={370} y={y + 8} width={60} height={20} rx={4} fill={`${ex.c}15`} />
            <text x={400} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={ex.c}>
              L={ex.loss}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 2: Easy / Semi-hard / Hard 시각화 */
export function Step2() {
  const types = [
    {
      x: 80, label: 'Easy', c: C.pos,
      ap: 25, an: 60,  /* 거리 표현용 */
    },
    {
      x: 240, label: 'Semi-hard', c: C.semi,
      ap: 25, an: 38,
    },
    {
      x: 400, label: 'Hard', c: C.neg,
      ap: 35, an: 20,
    },
  ];

  return (
    <g>
      {types.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          {/* 영역 배경 */}
          <rect x={t.x - 65} y={15} width={130} height={165} rx={8}
            fill={`${t.c}04`} stroke={t.c} strokeWidth={0.8} />
          <text x={t.x} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={t.c}>{t.label}</text>

          {/* Anchor 중심 */}
          <circle cx={t.x} cy={90} r={10} fill={`${C.anchor}25`} stroke={C.anchor} strokeWidth={1.2} />
          <text x={t.x} y={94} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.anchor}>A</text>

          {/* Positive */}
          <circle cx={t.x - t.ap} cy={72} r={8} fill={`${C.pos}25`} stroke={C.pos} strokeWidth={1} />
          <text x={t.x - t.ap} y={76} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pos}>P</text>
          <line x1={t.x - 8} y1={85} x2={t.x - t.ap + 6} y2={76} stroke={C.pos} strokeWidth={0.6} strokeDasharray="2 2" />

          {/* Negative */}
          <circle cx={t.x + t.an} cy={108} r={8} fill={`${C.neg}25`} stroke={C.neg} strokeWidth={1} />
          <text x={t.x + t.an} y={112} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.neg}>N</text>
          <line x1={t.x + 8} y1={95} x2={t.x + t.an - 6} y2={106} stroke={C.neg} strokeWidth={0.6} strokeDasharray="2 2" />

          {/* Margin 원 */}
          <circle cx={t.x} cy={90} r={t.ap + 12} fill="none" stroke={C.margin} strokeWidth={0.6} strokeDasharray="4 2" opacity={0.5} />

          {/* Loss 표시 */}
          <text x={t.x} y={155} textAnchor="middle" fontSize={8} fontWeight={600} fill={t.c}>
            {i === 0 ? 'loss = 0' : i === 1 ? 'loss > 0 (작음)' : 'loss >> 0'}
          </text>
          <text x={t.x} y={170} textAnchor="middle" fontSize={7} fill={C.muted}>
            {i === 0 ? '학습 기여 없음' : i === 1 ? '적절한 신호' : '불안정 위험'}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

/* Step 3: Online Batch Hard Mining */
export function Step3() {
  /* PK 샘플링 그리드 */
  const classes = [
    { label: 'Class A', c: '#6366f1', samples: 4 },
    { label: 'Class B', c: '#10b981', samples: 4 },
    { label: 'Class C', c: '#ef4444', samples: 4 },
  ];

  return (
    <g>
      <motion.text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        PK 샘플링: P=3 클래스 × K=4 샘플 = 배치 12
      </motion.text>

      {/* 클래스별 샘플 그리드 */}
      {classes.map((cls, ci) => {
        const startX = 60 + ci * 140;
        return (
          <motion.g key={ci} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: ci * 0.12 }}>
            <rect x={startX - 10} y={30} width={120} height={75} rx={6}
              fill={`${cls.c}06`} stroke={cls.c} strokeWidth={0.8} />
            <text x={startX + 50} y={45} textAnchor="middle" fontSize={9} fontWeight={600} fill={cls.c}>{cls.label}</text>

            {/* K개 샘플 */}
            {Array.from({ length: cls.samples }).map((_, si) => (
              <circle key={si} cx={startX + 10 + si * 28} cy={72} r={10}
                fill={`${cls.c}18`} stroke={cls.c} strokeWidth={si === 0 ? 1.5 : 0.8} />
            ))}
            {/* 첫 번째를 anchor로 표시 */}
            <text x={startX + 10} y={76} textAnchor="middle" fontSize={7} fontWeight={700} fill={cls.c}>a</text>
            <text x={startX + 38} y={76} textAnchor="middle" fontSize={7} fill={cls.c}>·</text>
            <text x={startX + 66} y={76} textAnchor="middle" fontSize={7} fill={cls.c}>·</text>
            <text x={startX + 94} y={76} textAnchor="middle" fontSize={7} fill={cls.c}>·</text>
          </motion.g>
        );
      })}

      {/* Mining 과정 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={40} y={118} width={180} height={35} rx={6} fill={`${C.pos}08`} stroke={C.pos} strokeWidth={0.8} />
        <text x={130} y={133} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.pos}>가장 먼 Positive 선택</text>
        <text x={130} y={146} textAnchor="middle" fontSize={7} fill={C.muted}>max d(a, p) within class</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={260} y={118} width={180} height={35} rx={6} fill={`${C.neg}08`} stroke={C.neg} strokeWidth={0.8} />
        <text x={350} y={133} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.neg}>가장 가까운 Negative 선택</text>
        <text x={350} y={146} textAnchor="middle" fontSize={7} fill={C.muted}>min d(a, n) across classes</text>
      </motion.g>

      {/* 결과 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={100} y={165} width={280} height={28} rx={6} fill={`${C.margin}10`} stroke={C.margin} strokeWidth={0.8} />
        <text x={240} y={183} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.margin}>
          → 가장 어려운 삼중항으로 효율적 학습
        </text>
      </motion.g>
    </g>
  );
}

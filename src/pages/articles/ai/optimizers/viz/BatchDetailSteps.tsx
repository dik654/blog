import { motion } from 'framer-motion';
import { COLORS } from './BatchDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

/* ── Step 0: 3가지 변형 비교 테이블 ── */
export function VariantsCompare() {
  const variants = [
    {
      label: 'Full Batch', color: COLORS.full,
      samples: '전체 N', updates: '1/epoch', noise: '없음',
      pro: '안정적', con: '느림, 메모리↑', use: '<10K 데이터',
    },
    {
      label: 'SGD', color: COLORS.sgd,
      samples: '1개', updates: 'N/epoch', noise: '매우 높음',
      pro: '탈출 용이', con: '진동 큼', use: '온라인 학습',
    },
    {
      label: 'Mini-batch', color: COLORS.mini,
      samples: '32~256', updates: 'N/B/epoch', noise: '적절',
      pro: 'GPU 효율', con: 'B 튜닝', use: '99% 실무',
    },
  ];

  const cols = [
    { key: 'samples' as const, label: '샘플/스텝' },
    { key: 'updates' as const, label: '업데이트/에폭' },
    { key: 'noise' as const, label: '노이즈' },
    { key: 'pro' as const, label: '장점' },
    { key: 'con' as const, label: '단점' },
    { key: 'use' as const, label: '적용' },
  ];

  const rowH = 40;
  const headerH = 24;
  const colW = [82, 62, 62, 50, 62, 62, 60];
  const startX = 20;

  function cx(ci: number) {
    let x = startX;
    for (let i = 0; i < ci; i++) x += colW[i];
    return x + colW[ci] / 2;
  }

  return (
    <g>
      {/* 헤더 */}
      <rect x={startX} y={4} width={colW.reduce((a, b) => a + b, 0)} height={headerH}
        rx={4} fill="var(--muted)" opacity={0.5} />
      <text x={cx(0)} y={20} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">방식</text>
      {cols.map((c, i) => (
        <text key={c.key} x={cx(i + 1)} y={20} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--muted-foreground)">{c.label}</text>
      ))}

      {/* 행 */}
      {variants.map((v, ri) => {
        const y = headerH + 8 + ri * rowH;
        return (
          <motion.g key={v.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: ri * 0.1 }}>
            {/* 행 배경 */}
            <rect x={startX} y={y} width={colW.reduce((a, b) => a + b, 0)} height={rowH - 4}
              rx={5} fill={v.color} fillOpacity={0.07} stroke={v.color} strokeWidth={0.6} />
            {/* 좌측 컬러바 */}
            <rect x={startX} y={y + 2} width={3} height={rowH - 8} rx={1.5} fill={v.color} />
            {/* 방식 이름 */}
            <text x={cx(0)} y={y + rowH / 2 + 1} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={v.color}>{v.label}</text>
            {/* 각 열 */}
            {cols.map((c, ci) => (
              <text key={c.key} x={cx(ci + 1)} y={y + rowH / 2 + 1} textAnchor="middle"
                fontSize={8} fill="var(--foreground)">{v[c.key]}</text>
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}

/* ── Step 1: 배치 크기 효과 스펙트럼 ── */
export function BatchSizeSpectrum() {
  const bands = [
    { label: 'Small', range: '8~32', color: COLORS.sgd, x: 30, w: 95,
      pros: ['노이즈 탐색', '일반화↑'], cons: ['에폭 느림', 'GPU 유휴'] },
    { label: 'Medium', range: '64~256', color: COLORS.mini, x: 140, w: 95,
      pros: ['GPU 효율', '수렴 균형'], cons: ['튜닝 필요'] },
    { label: 'Large', range: '512~8K', color: COLORS.full, x: 250, w: 95,
      pros: ['안정 기울기', '에폭 빠름'], cons: ['일반화↓', 'LR 스케일'] },
    { label: 'Very Large', range: '32K+', color: COLORS.accum, x: 360, w: 95,
      pros: ['분산 학습'], cons: ['warmup 필수', 'LAMB/LARS'] },
  ];

  return (
    <g>
      {/* 스펙트럼 바 */}
      <defs>
        <linearGradient id="bd-spectrum" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.sgd} stopOpacity={0.6} />
          <stop offset="35%" stopColor={COLORS.mini} stopOpacity={0.6} />
          <stop offset="65%" stopColor={COLORS.full} stopOpacity={0.6} />
          <stop offset="100%" stopColor={COLORS.accum} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect x={30} y={10} width={425} height={6} rx={3} fill="url(#bd-spectrum)" />
      <text x={30} y={8} fontSize={7} fill={COLORS.dim}>노이즈 ↑  일반화 ↑</text>
      <text x={455} y={8} textAnchor="end" fontSize={7} fill={COLORS.dim}>안정 ↑  속도 ↑</text>

      {/* 각 밴드 카드 */}
      {bands.map((b, i) => (
        <motion.g key={b.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          {/* 연결선 */}
          <line x1={b.x + b.w / 2} y1={16} x2={b.x + b.w / 2} y2={26}
            stroke={b.color} strokeWidth={0.8} />
          {/* 카드 */}
          <rect x={b.x} y={26} width={b.w} height={120} rx={6}
            fill="var(--card)" stroke={b.color} strokeWidth={0.8} />
          <rect x={b.x} y={26} width={b.w} height={5} rx={3} fill={b.color} opacity={0.8} />
          {/* 레이블 */}
          <text x={b.x + b.w / 2} y={44} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={b.color}>{b.label}</text>
          <text x={b.x + b.w / 2} y={55} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">{b.range}</text>
          {/* 장점 */}
          <text x={b.x + 8} y={72} fontSize={7.5} fontWeight={600} fill={COLORS.mini}>+</text>
          {b.pros.map((p, pi) => (
            <text key={pi} x={b.x + 16} y={72 + pi * 12} fontSize={8}
              fill="var(--foreground)">{p}</text>
          ))}
          {/* 단점 */}
          <text x={b.x + 8} y={100 + (b.pros.length - 1) * 4} fontSize={7.5} fontWeight={600}
            fill={COLORS.sgd}>−</text>
          {b.cons.map((c, ci) => (
            <text key={ci} x={b.x + 16} y={100 + (b.pros.length - 1) * 4 + ci * 12}
              fontSize={8} fill="var(--foreground)">{c}</text>
          ))}
        </motion.g>
      ))}
    </g>
  );
}

/* ── Step 2: Gradient Accumulation 흐름 ── */
export function GradAccumulation() {
  const steps = [
    { label: 'batch 1', grad: '∇L₁' },
    { label: 'batch 2', grad: '∇L₂' },
    { label: 'batch 3', grad: '∇L₃' },
    { label: 'batch 4', grad: '∇L₄' },
  ];
  const accX = 310;
  const updateX = 420;

  return (
    <g>
      <defs>
        <marker id="bd-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L4,2.5 L0,5" fill={COLORS.accum} />
        </marker>
        <marker id="bd-arr2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L4,2.5 L0,5" fill={COLORS.mini} />
        </marker>
      </defs>

      {/* 제목 */}
      <text x={10} y={14} fontSize={9} fontWeight={600} fill="var(--foreground)">
        effective batch = 4 × 8 = 32  (GPU 메모리는 8만 사용)
      </text>

      {/* 미니배치 4개 */}
      {steps.map((s, i) => {
        const y = 28 + i * 30;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            {/* 배치 박스 */}
            <rect x={20} y={y} width={70} height={22} rx={4}
              fill={COLORS.accum} fillOpacity={0.1} stroke={COLORS.accum} strokeWidth={0.7} />
            <text x={55} y={y + 14} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={COLORS.accum}>{s.label}</text>
            {/* forward+backward */}
            <line x1={95} y1={y + 11} x2={145} y2={y + 11}
              stroke={COLORS.dim} strokeWidth={0.7} strokeDasharray="3 2" />
            <text x={120} y={y + 7} textAnchor="middle" fontSize={7} fill={COLORS.dim}>fwd+bwd</text>
            {/* 그래디언트 */}
            <rect x={150} y={y} width={55} height={22} rx={11}
              fill={COLORS.accum} fillOpacity={0.15} stroke={COLORS.accum} strokeWidth={0.6} />
            <text x={177} y={y + 14} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={COLORS.accum}>{s.grad}</text>
            {/* 누적 화살표 */}
            <line x1={210} y1={y + 11} x2={accX - 8} y2={80}
              stroke={COLORS.accum} strokeWidth={0.6} markerEnd="url(#bd-arr)" />
          </motion.g>
        );
      })}

      {/* 누적 합산 박스 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={accX - 10} y={60} width={80} height={40} rx={8}
          fill={COLORS.accum} fillOpacity={0.15} stroke={COLORS.accum} strokeWidth={1} />
        <text x={accX + 30} y={77} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={COLORS.accum}>Σ∇L / 4</text>
        <text x={accX + 30} y={91} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">평균 그래디언트</text>
      </motion.g>

      {/* 업데이트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.65 }}>
        <line x1={accX + 75} y1={80} x2={updateX - 8} y2={80}
          stroke={COLORS.mini} strokeWidth={1} markerEnd="url(#bd-arr2)" />
        <rect x={updateX - 5} y={64} width={60} height={32} rx={6}
          fill={COLORS.mini} fillOpacity={0.12} stroke={COLORS.mini} strokeWidth={0.8} />
        <text x={updateX + 25} y={78} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={COLORS.mini}>θ 업데이트</text>
        <text x={updateX + 25} y={90} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">optimizer.step()</text>
      </motion.g>

      {/* zero_grad 안내 */}
      <motion.text x={updateX + 25} y={110} textAnchor="middle"
        fontSize={7.5} fill={COLORS.dim}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        → zero_grad()
      </motion.text>
    </g>
  );
}

/* ── Step 3: 실전 권장 ── */
export function Recommendations() {
  const tasks = [
    { task: 'Transformer', batch: '32~128', lr: 'Linear', color: COLORS.full },
    { task: 'CNN', batch: '128~512', lr: 'Linear', color: COLORS.mini },
    { task: 'LLM', batch: '1~4 + accum', lr: 'sqrt', color: COLORS.accum },
  ];

  return (
    <g>
      {/* 태스크별 배치 크기 */}
      {tasks.map((t, i) => {
        const y = 8 + i * 42;
        return (
          <motion.g key={t.task}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            {/* 카드 */}
            <rect x={16} y={y} width={200} height={34} rx={6}
              fill="var(--card)" stroke={t.color} strokeWidth={0.7} />
            <rect x={16} y={y} width={4} height={34} rx={2} fill={t.color} />
            <text x={30} y={y + 15} fontSize={10} fontWeight={700}
              fill={t.color}>{t.task}</text>
            <text x={30} y={y + 27} fontSize={8}
              fill="var(--muted-foreground)">batch: {t.batch}</text>
            {/* LR 규칙 뱃지 */}
            <rect x={170} y={y + 8} width={38} height={18} rx={9}
              fill={t.color} fillOpacity={0.12} stroke={t.color} strokeWidth={0.5} />
            <text x={189} y={y + 20} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={t.color}>{t.lr}</text>
          </motion.g>
        );
      })}

      {/* LR 스케일링 규칙 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={245} y={4} width={220} height={56} rx={8}
          fill="var(--card)" stroke={COLORS.full} strokeWidth={0.6} />
        <rect x={245} y={4} width={220} height={5} rx={3} fill={COLORS.full} opacity={0.7} />
        <text x={355} y={24} textAnchor="middle"
          fontSize={9} fontWeight={700} fill="var(--foreground)">LR 스케일링 규칙</text>
        <text x={275} y={40} fontSize={9} fill={COLORS.full} fontWeight={600}>Linear</text>
        <text x={325} y={40} fontSize={8} fill="var(--foreground)">LR × (B/B₀)</text>
        <text x={385} y={40} fontSize={9} fill={COLORS.accum} fontWeight={600}>Sqrt</text>
        <text x={432} y={40} fontSize={8} fill="var(--foreground)">LR × √(B/B₀)</text>
        <text x={355} y={54} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">B₀ = 기준 배치, B = 실제 배치</text>
      </motion.g>

      {/* GPU 메모리 가이드 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={245} y={70} width={220} height={50} rx={8}
          fill="var(--card)" stroke={COLORS.mini} strokeWidth={0.6} />
        <text x={355} y={88} textAnchor="middle"
          fontSize={9} fontWeight={700} fill="var(--foreground)">GPU VRAM 가이드</text>
        {/* 프로그레스 바 */}
        <rect x={265} y={96} width={180} height={8} rx={4}
          fill="var(--border)" opacity={0.3} />
        <rect x={265} y={96} width={120} height={8} rx={4}
          fill={COLORS.mini} opacity={0.7} />
        <text x={265} y={114} fontSize={7.5} fill={COLORS.dim}>0%</text>
        <text x={325} y={114} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.mini}>50~80% sweet spot</text>
        <text x={445} y={114} textAnchor="end" fontSize={7.5} fill={COLORS.sgd}>OOM</text>
      </motion.g>

      {/* 권장 흐름 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.65 }}>
        <text x={16} y={142} fontSize={8} fill="var(--muted-foreground)">
          시작: batch=32 → LR 비례 스케일 → OOM이면 accumulation → val/train gap 관찰
        </text>
      </motion.g>
    </g>
  );
}

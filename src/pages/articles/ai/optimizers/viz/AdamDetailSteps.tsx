import { motion } from 'framer-motion';
import { COLORS } from './AdamDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ─── Step 0: Adam 수식 4단계 — 데이터 흐름 시각화 ─── */
export function StepFormulas() {
  /* 좌: gradient 입력 → 중앙: m/v 계산 흐름 → 우: 최종 업데이트 */

  return (
    <g>
      {/* gradient 입력 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp }}>
        <rect x={10} y={40} width={60} height={36} rx={18}
          fill={`${COLORS.dim}15`} stroke={COLORS.dim} strokeWidth={1} />
        <text x={40} y={55} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.dim}>∇L</text>
        <text x={40} y={67} textAnchor="middle" fontSize={7} fill={COLORS.dim}>gradient</text>
      </motion.g>

      {/* 분기 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <line x1={72} y1={50} x2={100} y2={30} stroke={COLORS.moment} strokeWidth={1} />
        <line x1={72} y1={66} x2={100} y2={86} stroke={COLORS.rmsprop} strokeWidth={1} />
      </motion.g>

      {/* 1차 모멘트 m (방향) */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={95} y={10} width={160} height={44} rx={7}
          fill={`${COLORS.moment}10`} stroke={COLORS.moment} strokeWidth={1.2} />
        <text x={105} y={26} fontSize={9} fontWeight={700} fill={COLORS.moment}>① 1차 모멘트 (방향)</text>
        <text x={105} y={40} fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          m = 0.9·m + 0.1·∇L
        </text>
        <text x={105} y={50} fontSize={7} fill={COLORS.dim}>gradient EMA → 이동 방향</text>
      </motion.g>

      {/* 2차 모멘트 v (크기) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={95} y={64} width={160} height={44} rx={7}
          fill={`${COLORS.rmsprop}10`} stroke={COLORS.rmsprop} strokeWidth={1.2} />
        <text x={105} y={80} fontSize={9} fontWeight={700} fill={COLORS.rmsprop}>② 2차 모멘트 (크기)</text>
        <text x={105} y={94} fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          v = 0.999·v + 0.001·∇L²
        </text>
        <text x={105} y={104} fontSize={7} fill={COLORS.dim}>gradient² EMA → 스케일 조정</text>
      </motion.g>

      {/* 편향 보정 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <line x1={257} y1={32} x2={275} y2={50} stroke={COLORS.adam} strokeWidth={1} />
        <line x1={257} y1={86} x2={275} y2={68} stroke={COLORS.adam} strokeWidth={1} />

        <rect x={278} y={36} width={100} height={46} rx={7}
          fill={`${COLORS.adam}10`} stroke={COLORS.adam} strokeWidth={1.2} />
        <text x={328} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.adam}>③ 편향 보정</text>
        <text x={328} y={65} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          m̂ = m/(1−β₁ᵗ)
        </text>
        <text x={328} y={76} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          v̂ = v/(1−β₂ᵗ)
        </text>
      </motion.g>

      {/* 최종 업데이트 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        <line x1={380} y1={59} x2={395} y2={59} stroke={COLORS.adam} strokeWidth={1} />

        <rect x={398} y={30} width={75} height={58} rx={8}
          fill={`${COLORS.adam}15`} stroke={COLORS.adam} strokeWidth={1.5} />
        <text x={435} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.adam}>④ 업데이트</text>
        <text x={435} y={62} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          θ−η·m̂/√v̂
        </text>
        <text x={435} y={78} textAnchor="middle" fontSize={7} fill={COLORS.dim}>η=0.001</text>
      </motion.g>

      {/* 핵심 인사이트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={10} y={122} width={462} height={28} rx={5}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.6} />
        <text x={20} y={138} fontSize={8} fontWeight={600} fill={COLORS.moment}>m → 방향(Momentum)</text>
        <text x={170} y={138} fontSize={8} fontWeight={600} fill={COLORS.rmsprop}>v → 크기 조절(RMSProp)</text>
        <text x={340} y={138} fontSize={8} fontWeight={600} fill={COLORS.adam}>합치면 → 파라미터별 적응 LR</text>
      </motion.g>
    </g>
  );
}

/* ─── Step 1: 적응적 학습률 직관 ─── */
export function StepAdaptive() {
  const params = [
    { label: '희소 파라미터', sub: '드문 그래디언트', grad: 0.3, effLr: 0.9, color: COLORS.adam },
    { label: '보통 파라미터', sub: '중간 빈도', grad: 1.5, effLr: 0.5, color: COLORS.moment },
    { label: '빈번한 파라미터', sub: '항상 큰 그래디언트', grad: 6.0, effLr: 0.15, color: COLORS.rmsprop },
  ];
  const barW = 80, gap = 44, left = 70, baseY = 120, maxH = 80;

  return (
    <g>
      {/* 축 */}
      <line x1={left - 12} y1={baseY} x2={left + 3 * (barW + gap) - gap + 12} y2={baseY}
        stroke={COLORS.dim} strokeWidth={0.5} />
      <text x={left - 8} y={18} fontSize={8} fill="var(--muted-foreground)">
        막대 높이 = 유효 학습률 (√v̂로 나눈 뒤)
      </text>

      {params.map((p, i) => {
        const x = left + i * (barW + gap);
        const h = p.effLr * maxH;
        return (
          <g key={i}>
            <motion.rect x={x} width={barW} rx={5}
              initial={{ y: baseY, height: 0 }}
              animate={{ y: baseY - h, height: h }}
              fill={p.color + '25'} stroke={p.color} strokeWidth={1.2}
              transition={{ ...sp, delay: i * 0.12 }} />
            {/* 유효 학습률 값 */}
            <motion.text x={x + barW / 2} y={baseY - h - 6} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={p.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: i * 0.12 + 0.2 }}>
              η×{p.effLr.toFixed(2)}
            </motion.text>
            {/* 레이블 */}
            <text x={x + barW / 2} y={baseY + 12} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={p.color}>{p.label}</text>
            <text x={x + barW / 2} y={baseY + 22} textAnchor="middle"
              fontSize={7.5} fill={COLORS.dim}>{p.sub}</text>
            {/* 그래디언트 크기 표시 */}
            <text x={x + barW / 2} y={baseY + 32} textAnchor="middle"
              fontSize={7.5} fill={COLORS.dim}>|g|={p.grad}</text>
          </g>
        );
      })}

      {/* 핵심 인사이트 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={390} y={38} fontSize={8} fill={COLORS.adam} fontWeight={600}>핵심</text>
        <text x={390} y={50} fontSize={7.5} fill="var(--muted-foreground)">작은 g → 큰 스텝</text>
        <text x={390} y={60} fontSize={7.5} fill="var(--muted-foreground)">큰 g → 작은 스텝</text>
        <text x={390} y={72} fontSize={7.5} fill={COLORS.dim}>자기 정규화 효과</text>
      </motion.g>
    </g>
  );
}

/* ─── Step 2: Adam = Momentum + RMSProp ─── */
export function StepComponents() {
  const boxW = 120, boxH = 44;

  return (
    <g>
      {/* Momentum 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.05 }}>
        <rect x={30} y={14} width={boxW} height={boxH} rx={8}
          fill="var(--card)" stroke={COLORS.moment} strokeWidth={1.5} />
        <rect x={30} y={14} width={boxW} height={5} rx={2.5} fill={COLORS.moment} opacity={0.8} />
        <text x={90} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.moment}>
          Momentum
        </text>
        <text x={90} y={50} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          1차 모멘트 m (방향)
        </text>
      </motion.g>

      {/* RMSProp 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={30} y={82} width={boxW} height={boxH} rx={8}
          fill="var(--card)" stroke={COLORS.rmsprop} strokeWidth={1.5} />
        <rect x={30} y={82} width={boxW} height={5} rx={2.5} fill={COLORS.rmsprop} opacity={0.8} />
        <text x={90} y={106} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.rmsprop}>
          RMSProp
        </text>
        <text x={90} y={118} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          2차 모멘트 v (크기)
        </text>
      </motion.g>

      {/* 결합 화살표 — Momentum → Adam */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <defs>
          <marker id="adam-arr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6" fill={COLORS.adam} />
          </marker>
        </defs>
        <line x1={150} y1={36} x2={218} y2={64}
          stroke={COLORS.moment} strokeWidth={1.2} markerEnd="url(#adam-arr)" />
        <line x1={150} y1={104} x2={218} y2={78}
          stroke={COLORS.rmsprop} strokeWidth={1.2} markerEnd="url(#adam-arr)" />
        {/* + 기호 */}
        <circle cx={190} cy={70} r={10} fill="var(--card)" stroke={COLORS.adam} strokeWidth={1} />
        <text x={190} y={74} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.adam}>+</text>
      </motion.g>

      {/* Adam 박스 */}
      <motion.g initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={224} y={48} width={boxW + 20} height={boxH + 8} rx={10}
          fill="var(--card)" stroke={COLORS.adam} strokeWidth={2} />
        <rect x={224} y={48} width={boxW + 20} height={6} rx={3} fill={COLORS.adam} opacity={0.85} />
        <text x={294} y={74} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.adam}>
          Adam
        </text>
        <text x={294} y={88} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          η · m̂ / (√v̂ + ε)
        </text>
      </motion.g>

      {/* 우측 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <text x={378} y={52} fontSize={8} fill={COLORS.moment}>m → 어디로 갈지 (방향)</text>
        <text x={378} y={65} fontSize={8} fill={COLORS.rmsprop}>v → 얼마나 갈지 (스케일)</text>
        <line x1={374} y1={76} x2={460} y2={76} stroke={COLORS.dim} strokeWidth={0.4} />
        <text x={378} y={90} fontSize={8} fill={COLORS.adam} fontWeight={600}>
          두 정보 결합 → 적응적 업데이트
        </text>
        <text x={378} y={104} fontSize={7.5} fill={COLORS.dim}>RMSProp은 v만 사용 (방향 없음)</text>
        <text x={378} y={116} fontSize={7.5} fill={COLORS.dim}>Momentum은 m만 사용 (스케일 없음)</text>
      </motion.g>
    </g>
  );
}

/* ─── Step 3: 변형들 + 메모리 비용 ─── */
export function StepVariants() {
  const variants = [
    { name: 'Adamax', desc: '∞-norm → 이상치에 강건', color: COLORS.variant },
    { name: 'Nadam', desc: 'Adam + NAG (미래 그래디언트 선반영)', color: COLORS.variant },
    { name: 'AdamW', desc: '분리된 weight decay (Transformer 표준)', color: COLORS.variant },
    { name: 'Lion', desc: 'sign(m)만 사용, 메모리 절약 (2023)', color: COLORS.variant },
  ];

  /* 메모리 비용 비교 */
  const memItems = [
    { label: 'SGD', blocks: 1, color: COLORS.dim },
    { label: 'Momentum', blocks: 2, color: COLORS.moment },
    { label: 'Adam', blocks: 3, color: COLORS.adam },
  ];

  return (
    <g>
      {/* 변형 리스트 (좌측) */}
      <text x={14} y={14} fontSize={9} fontWeight={600} fill={COLORS.variant}>Adam 변형</text>
      {variants.map((v, i) => {
        const y = 24 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={14} y={y} width={238} height={24} rx={5}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            {/* 좌측 도트 */}
            <circle cx={28} cy={y + 12} r={3.5} fill={v.color} opacity={0.7} />
            <text x={38} y={y + 15} fontSize={9} fontWeight={600} fill={v.color}>
              {v.name}
            </text>
            <text x={100} y={y + 15} fontSize={8} fill={COLORS.dim}>
              {v.desc}
            </text>
          </motion.g>
        );
      })}

      {/* 메모리 비교 (우측) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={274} y={14} fontSize={9} fontWeight={600} fill={COLORS.adam}>메모리 비용</text>
        {memItems.map((m, i) => {
          const y = 24 + i * 34;
          return (
            <g key={i}>
              <text x={274} y={y + 14} fontSize={9} fontWeight={500} fill={m.color}>{m.label}</text>
              {/* 블록 표현 */}
              {Array.from({ length: m.blocks }).map((_, bi) => (
                <motion.rect key={bi} x={332 + bi * 36} y={y + 3} width={30} height={18} rx={4}
                  fill={m.color + '20'} stroke={m.color} strokeWidth={1}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ ...sp, delay: 0.5 + bi * 0.08 }} />
              ))}
              {/* 블록 레이블 */}
              <text x={332 + 15} y={y + 15.5} textAnchor="middle" fontSize={7} fill={m.color}>θ</text>
              {m.blocks >= 2 && (
                <text x={332 + 36 + 15} y={y + 15.5} textAnchor="middle" fontSize={7} fill={m.color}>
                  {m.label === 'Adam' ? 'm' : 'v'}
                </text>
              )}
              {m.blocks >= 3 && (
                <text x={332 + 72 + 15} y={y + 15.5} textAnchor="middle" fontSize={7} fill={m.color}>v</text>
              )}
            </g>
          );
        })}
        {/* 비용 요약 */}
        <text x={274} y={134} fontSize={8} fill={COLORS.adam} fontWeight={600}>
          Adam: SGD 대비 메모리 3배
        </text>
        <text x={274} y={146} fontSize={7.5} fill={COLORS.dim}>
          대형 모델(LLM)에서 병목 요인
        </text>
      </motion.g>
    </g>
  );
}

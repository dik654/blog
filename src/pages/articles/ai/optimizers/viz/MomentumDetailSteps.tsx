import { motion } from 'framer-motion';
import { COLORS } from './MomentumDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: Momentum 수식 + 공 비유 ── */
export function FormulaStep() {
  /* 언덕 경사면 포인트 */
  const hill = 'M20,130 Q80,125 140,110 Q200,90 260,65 Q320,40 380,25 Q420,15 460,12';
  /* 공 위치들 (시간순) */
  const balls = [
    { cx: 80, cy: 122, r: 7 },
    { cx: 160, cy: 102, r: 8.5 },
    { cx: 260, cy: 65, r: 10.5 },
    { cx: 370, cy: 28, r: 13 },
  ];
  return (
    <g>
      {/* 수식 — 데이터 흐름 다이어그램 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        {/* 이전 속도 */}
        <rect x={10} y={4} width={58} height={26} rx={13}
          fill={`${COLORS.mom}15`} stroke={COLORS.mom} strokeWidth={1} />
        <text x={39} y={21} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.mom}>v_(t-1)</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.08 }}>
        <text x={75} y={21} fontSize={9} fill={COLORS.beta} fontWeight={700}>×β</text>
        <line x1={92} y1={17} x2={108} y2={17} stroke={COLORS.dim} strokeWidth={1} />
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.12 }}>
        <text x={112} y={21} fontSize={10} fill={COLORS.dim}>+</text>
      </motion.g>

      {/* gradient */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.16 }}>
        <rect x={125} y={4} width={50} height={26} rx={13}
          fill={`${COLORS.dim}12`} stroke={COLORS.dim} strokeWidth={1} />
        <text x={150} y={21} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.dim}>∇L</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <text x={183} y={21} fontSize={9} fill={COLORS.dim}>=</text>
      </motion.g>

      {/* 새 속도 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.24 }}>
        <rect x={195} y={2} width={60} height={30} rx={7}
          fill={`${COLORS.mom}20`} stroke={COLORS.mom} strokeWidth={1.5} />
        <text x={225} y={21} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.mom}>v_t</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.28 }}>
        <line x1={258} y1={17} x2={278} y2={17} stroke={COLORS.mom} strokeWidth={1} />
        <text x={268} y={12} textAnchor="middle" fontSize={7} fill={COLORS.mom}>θ−η·v</text>
      </motion.g>

      {/* 범례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.32 }}>
        <rect x={290} y={2} width={180} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
        <text x={300} y={16} fontSize={8} fill={COLORS.mom} fontWeight={600}>v = 속도 (이전 방향 기억)</text>
        <text x={300} y={28} fontSize={8} fill={COLORS.beta} fontWeight={600}>β = 관성 계수 (0.9 표준)</text>
        <text x={300} y={40} fontSize={8} fill={COLORS.dim}>같은 방향 → 가속, 반대 → 상쇄</text>
      </motion.g>

      {/* 언덕 */}
      <path d={hill} fill="none" stroke={COLORS.dim} strokeWidth={1.2} opacity={0.4} />
      {/* 언덕 아래쪽 채우기 */}
      <path d={`${hill} L460,155 L20,155 Z`} fill={COLORS.dim} opacity={0.05} />

      {/* 공이 굴러가는 과정: 점점 커지는 원 = 속도 증가 */}
      {balls.map((b, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          <circle cx={b.cx} cy={b.cy - b.r - 3} r={b.r}
            fill={`${COLORS.mom}30`} stroke={COLORS.mom} strokeWidth={1} />
          <text x={b.cx} y={b.cy - b.r - 1} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={COLORS.mom}>
            {i === 0 ? 't=1' : i === 1 ? 't=5' : i === 2 ? 't=10' : 't=20'}
          </text>
          {/* 속도 화살표 — 길이가 증가 */}
          {i > 0 && (
            <line x1={b.cx + b.r + 2} y1={b.cy - b.r - 3}
              x2={b.cx + b.r + 6 + i * 8} y2={b.cy - b.r - 6 - i * 2}
              stroke={COLORS.beta} strokeWidth={1} markerEnd="url(#momArrow)" />
          )}
        </motion.g>
      ))}

      {/* 화살표 마커 */}
      <defs>
        <marker id="momArrow" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill={COLORS.beta} />
        </marker>
      </defs>

      {/* 라벨 */}
      <text x={80} y={148} fontSize={8} fill={COLORS.dim} textAnchor="middle">느림</text>
      <text x={370} y={148} fontSize={8} fill={COLORS.mom} textAnchor="middle" fontWeight={600}>가속!</text>
      <text x={225} y={148} fontSize={8} fill={COLORS.dim} textAnchor="middle">
        같은 방향이 반복 → 속도(v) 누적 → 가속
      </text>
    </g>
  );
}

/* ── Step 1: β 효과 비교 ── */
export function BetaEffectStep() {
  const configs = [
    { beta: '0', label: '순수 SGD', ema: '기억 없음', color: COLORS.sgd, barH: 8 },
    { beta: '0.9', label: '표준', ema: '~10스텝 EMA', color: COLORS.mom, barH: 60 },
    { beta: '0.99', label: 'LLM 등', ema: '~100스텝 EMA', color: COLORS.beta, barH: 100 },
  ];
  const baseY = 130;
  const barW = 60;
  const gap = 100;
  const startX = 80;

  return (
    <g>
      {/* 제목 */}
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        β 값에 따른 "기억 범위"
      </text>

      {/* 축 */}
      <line x1={startX - 15} y1={baseY} x2={startX + 3 * gap - 20} y2={baseY}
        stroke={COLORS.dim} strokeWidth={0.5} />
      <line x1={startX - 15} y1={baseY} x2={startX - 15} y2={22}
        stroke={COLORS.dim} strokeWidth={0.5} />
      <text x={startX - 30} y={75} fontSize={8} fill={COLORS.dim}
        transform={`rotate(-90 ${startX - 30} 75)`}>기억 범위</text>

      {configs.map((c, i) => {
        const x = startX + i * gap;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* 막대 */}
            <motion.rect x={x} width={barW} rx={4}
              initial={{ y: baseY, height: 0 }}
              animate={{ y: baseY - c.barH, height: c.barH }}
              transition={{ ...sp, delay: i * 0.15 }}
              fill={`${c.color}25`} stroke={c.color} strokeWidth={1} />
            {/* β 값 */}
            <text x={x + barW / 2} y={baseY - c.barH - 8} textAnchor="middle"
              fontSize={11} fontWeight={700} fill={c.color}>β={c.beta}</text>
            {/* 라벨 */}
            <text x={x + barW / 2} y={baseY + 12} textAnchor="middle"
              fontSize={8} fontWeight={500} fill={c.color}>{c.label}</text>
            <text x={x + barW / 2} y={baseY + 23} textAnchor="middle"
              fontSize={7.5} fill={COLORS.dim}>{c.ema}</text>
          </motion.g>
        );
      })}

      {/* β≥1 경고 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={350} y={40} width={115} height={34} rx={6}
          fill="none" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={408} y={55} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">β ≥ 1 → 발산</text>
        <text x={408} y={67} textAnchor="middle" fontSize={7.5} fill={COLORS.dim}>에너지 무한 증가</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: SGD vs Momentum vs NAG 궤적 비교 ── */
export function TrajectoryStep() {
  /* 등고선 중심 */
  const cx = 380, cy = 90;
  const rings = [90, 65, 42, 22];

  /* SGD: 지그재그 */
  const sgdPath = [
    { x: 40, y: 35 }, { x: 75, y: 130 }, { x: 115, y: 45 },
    { x: 155, y: 120 }, { x: 195, y: 60 }, { x: 230, y: 108 },
    { x: 265, y: 75 }, { x: 300, y: 95 },
    { x: 330, y: 85 }, { x: 355, y: 92 }, { x: 375, y: 90 },
  ];
  /* Momentum: 부드럽게 */
  const momPath = [
    { x: 40, y: 35 }, { x: 90, y: 65 }, { x: 140, y: 80 },
    { x: 195, y: 87 }, { x: 250, y: 90 }, { x: 310, y: 91 },
    { x: 350, y: 90 }, { x: 378, y: 90 },
  ];
  /* NAG: 더 날카롭게 보정 */
  const nagPath = [
    { x: 40, y: 35 }, { x: 100, y: 60 }, { x: 160, y: 78 },
    { x: 220, y: 85 }, { x: 280, y: 89 }, { x: 340, y: 90 },
    { x: 378, y: 90 },
  ];

  const paths = [
    { pts: sgdPath, color: COLORS.sgd, label: 'SGD', lx: 300, ly: 100 },
    { pts: momPath, color: COLORS.mom, label: 'Momentum', lx: 310, ly: 72 },
    { pts: nagPath, color: COLORS.nag, label: 'NAG', lx: 340, ly: 55 },
  ];

  return (
    <g>
      {/* 등고선 */}
      {rings.map((r, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r * 1.1} ry={r * 0.7}
          fill="none" stroke={COLORS.dim} strokeWidth={0.5} opacity={0.2 + i * 0.1} />
      ))}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={8} fill={COLORS.dim} opacity={0.5}>최솟값</text>

      {/* 궤적 */}
      {paths.map((p, pi) => (
        <motion.g key={pi} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: pi * 0.2 }}>
          {p.pts.map((pt, i) => {
            if (i === 0) return null;
            const prev = p.pts[i - 1];
            return (
              <line key={i} x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y}
                stroke={p.color} strokeWidth={1.2} opacity={0.6} />
            );
          })}
          <motion.circle r={3.5} fill={p.color}
            animate={{ cx: p.pts[p.pts.length - 1].x, cy: p.pts[p.pts.length - 1].y }}
            transition={sp} />
        </motion.g>
      ))}

      {/* 범례 */}
      <g transform="translate(10, 6)">
        {paths.map((p, i) => (
          <g key={i} transform={`translate(0, ${i * 14})`}>
            <line x1={0} y1={5} x2={16} y2={5} stroke={p.color} strokeWidth={1.5} />
            <text x={20} y={8.5} fontSize={8.5} fontWeight={500} fill={p.color}>{p.label}</text>
          </g>
        ))}
      </g>

      {/* NAG look-ahead 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={10} y={108} width={200} height={40} rx={5}
          fill="var(--card)" stroke={COLORS.nag} strokeWidth={0.6} />
        <text x={20} y={123} fontSize={8.5} fontWeight={600} fill={COLORS.nag}>NAG (Nesterov)</text>
        <text x={20} y={136} fontSize={8} fill={COLORS.dim}>v_t = β·v + ∇L(θ − β·v)</text>
        <text x={130} y={136} fontSize={7.5} fill={COLORS.nag}>← "미래 위치"에서 보정</text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 장단점 · 사용 시점 ── */
export function ProsConsStep() {
  const pros = [
    { text: '진동 감소', sub: '반대 방향 상쇄' },
    { text: '평탄 구간 탈출', sub: '관성으로 돌파' },
    { text: 'ill-conditioning 완화', sub: '다수 스텝 평균' },
  ];
  const cons = [
    { text: '파라미터별 적응 불가', sub: '→ Adam이 해결' },
    { text: '오버슈팅 가능', sub: '복잡한 지형에서' },
  ];
  const uses = ['CNN (이미지)', '깊은 네트워크', 'LR decay와 함께'];

  return (
    <g>
      {/* 장점 영역 */}
      <rect x={8} y={4} width={155} height={105} rx={7}
        fill="var(--card)" stroke={COLORS.nag} strokeWidth={0.6} />
      <rect x={8} y={4} width={155} height={18} rx={7} fill={`${COLORS.nag}18`} />
      <rect x={8} y={16} width={155} height={6} fill={`${COLORS.nag}18`} />
      <text x={86} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.nag}>장점</text>
      {pros.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <circle cx={22} cy={38 + i * 28} r={3} fill={COLORS.nag} opacity={0.7} />
          <text x={30} y={41 + i * 28} fontSize={9} fontWeight={600} fill="var(--foreground)">{p.text}</text>
          <text x={30} y={53 + i * 28} fontSize={7.5} fill={COLORS.dim}>{p.sub}</text>
        </motion.g>
      ))}

      {/* 단점 영역 */}
      <rect x={172} y={4} width={145} height={105} rx={7}
        fill="var(--card)" stroke="#ef4444" strokeWidth={0.6} />
      <rect x={172} y={4} width={145} height={18} rx={7} fill="#ef444418" />
      <rect x={172} y={16} width={145} height={6} fill="#ef444418" />
      <text x={244} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">한계</text>
      {cons.map((c, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.3 + i * 0.12 }}>
          <circle cx={186} cy={38 + i * 36} r={3} fill="#ef4444" opacity={0.7} />
          <text x={194} y={41 + i * 36} fontSize={9} fontWeight={600} fill="var(--foreground)">{c.text}</text>
          <text x={194} y={53 + i * 36} fontSize={7.5} fill={COLORS.dim}>{c.sub}</text>
        </motion.g>
      ))}

      {/* 사용 시점 영역 */}
      <rect x={326} y={4} width={145} height={105} rx={7}
        fill="var(--card)" stroke={COLORS.mom} strokeWidth={0.6} />
      <rect x={326} y={4} width={145} height={18} rx={7} fill={`${COLORS.mom}18`} />
      <rect x={326} y={16} width={145} height={6} fill={`${COLORS.mom}18`} />
      <text x={398} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.mom}>사용 시점</text>
      {uses.map((u, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.5 + i * 0.12 }}>
          <circle cx={340} cy={40 + i * 26} r={3} fill={COLORS.mom} opacity={0.7} />
          <text x={348} y={43 + i * 26} fontSize={9} fontWeight={500} fill="var(--foreground)">{u}</text>
        </motion.g>
      ))}

      {/* 하단: 역사적 위치 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={8} y={118} width={463} height={30} rx={6}
          fill="var(--card)" stroke={COLORS.dim} strokeWidth={0.4} />
        <text x={240} y={137} textAnchor="middle" fontSize={8.5} fill={COLORS.dim}>
          Polyak (1964) → SGD+Momentum이 기초 → Adam(적응적 모멘텀)으로 발전 → 현재도 CNN/ResNet에서 활발히 사용
        </text>
      </motion.g>
    </g>
  );
}

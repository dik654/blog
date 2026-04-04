import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './SyncLoopVizData';

/* ── 화살표 헬퍼 ── */
function CurvedArrow({ d, color, delay = 0, dashed = false }: {
  d: string; color: string; delay?: number; dashed?: boolean;
}) {
  return (
    <motion.path
      d={d} fill="none" stroke={color} strokeWidth={1}
      strokeDasharray={dashed ? '4 3' : undefined}
      markerEnd="url(#slArrow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   Step 0: Sync Loop 전체 구조 — 순환 다이어그램
   Store(중앙) → poll → receive → validate → apply → Store
   ══════════════════════════════════════════════════════ */
export function Step0() {
  const cx = 240;
  const cy = 100;

  return (
    <g>
      {/* 화살표 마커 */}
      <defs>
        <marker id="slArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.store} />
        </marker>
      </defs>

      {/* 중앙 Store */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}>
        <ModuleBox x={cx - 45} y={cy - 24} w={90} h={48} label="Store" sub="light client 상태" color={C.store} />
      </motion.g>

      {/* 12s timer badge */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={cx - 22} y={cy - 38} width={44} height={14} rx={7} fill={C.store} opacity={0.15} />
        <rect x={cx - 22} y={cy - 38} width={44} height={14} rx={7}
          fill="none" stroke={C.store} strokeWidth={0.8} />
        <text x={cx} y={cy - 28} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.store}>
          12s 주기
        </text>
      </motion.g>

      {/* ── 상단 반원: Store → poll → receive → validate ── */}
      {/* poll Beacon API (상단 왼쪽) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <ActionBox x={50} y={18} w={90} h={34} label="poll API" sub="3개 엔드포인트" color={C.opt} />
      </motion.g>

      {/* receive Update (상단 중앙) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <DataBox x={208} y={-5} w={64} h={26} label="Update" sub="헤더+서명" color={C.fin} />
      </motion.g>

      {/* validate (상단 오른쪽) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <ActionBox x={340} y={18} w={90} h={34} label="validate" sub="슬롯+BLS 검증" color={C.fin} />
      </motion.g>

      {/* ── 하단: apply ── */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}>
        <ActionBox x={340} y={148} w={90} h={34} label="apply" sub="Store 갱신" color={C.store} />
      </motion.g>

      {/* ── 순환 화살표들 ── */}
      {/* Store → poll: 왼쪽으로 나감 */}
      <CurvedArrow d="M 195 88 Q 155 55 140 45" color={C.store} delay={0.35} />

      {/* poll → receive: 위로 올라감 */}
      <CurvedArrow d="M 140 22 Q 170 0 206 8" color={C.opt} delay={0.55} />

      {/* receive → validate: 오른쪽으로 */}
      <CurvedArrow d="M 272 12 Q 310 15 338 28" color={C.fin} delay={0.75} />

      {/* validate → apply: 아래로 */}
      <CurvedArrow d="M 420 52 Q 430 100 420 146" color={C.fin} delay={0.95} />

      {/* apply → Store: 왼쪽 하단 → 중앙 */}
      <CurvedArrow d="M 340 170 Q 280 185 250 130" color={C.store} delay={1.1} dashed />

      {/* 루프 순서 번호 */}
      {[
        { x: 165, y: 58, n: '1' },
        { x: 185, y: 8, n: '2' },
        { x: 310, y: 14, n: '3' },
        { x: 435, y: 96, n: '4' },
        { x: 290, y: 185, n: '5' },
      ].map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.2 }}>
          <circle cx={p.x} cy={p.y} r={8} fill="var(--card)" stroke={C.store} strokeWidth={0.8} />
          <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={8}
            fontWeight={700} fill={C.store}>{p.n}</text>
        </motion.g>
      ))}

      {/* 검증 실패 분기 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <rect x={50} y={138} width={110} height={20} rx={4}
          fill="var(--card)" stroke={C.err} strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={105} y={152} textAnchor="middle" fontSize={7.5} fill={C.err}>
          실패 → skip, 루프 계속
        </text>
        <line x1={160} y1={148} x2={190} y2={130} stroke={C.err} strokeWidth={0.6} strokeDasharray="3 2" />
      </motion.g>
    </g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 1: 3가지 API 타임라인 — 빈도 차이 시각화
   상: OptimisticUpdate (매 12초, 빽빽한 점)
   중: FinalityUpdate (~6.4분, 듬성듬성)
   하: LightClientUpdates (~27시간, 매우 드문)
   ══════════════════════════════════════════════════════ */
export function Step1() {
  const tlX = 90;
  const tlW = 360;

  /* 점 위치 계산 */
  const optDots = Array.from({ length: 30 }, (_, i) => tlX + i * (tlW / 30));
  const finDots = [tlX, tlX + tlW * 0.32, tlX + tlW * 0.64, tlX + tlW * 0.96];
  const lcuDots = [tlX + tlW * 0.5];

  const rows = [
    {
      label: 'OptimisticUpdate',
      path: '/optimistic_update',
      y: 42,
      color: C.opt,
      dots: optDots,
      freq: '매 12초',
    },
    {
      label: 'FinalityUpdate',
      path: '/finality_update',
      y: 100,
      color: C.fin,
      dots: finDots,
      freq: '~6.4분',
    },
    {
      label: 'LightClientUpdates',
      path: '/updates?period=...',
      y: 158,
      color: C.lcu,
      dots: lcuDots,
      freq: '~27시간',
    },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">
        API 폴링 빈도 비교 (동일 시간 범위)
      </text>

      {rows.map((row, ri) => (
        <motion.g key={row.label}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ri * 0.25 }}>
          {/* 라벨 */}
          <text x={8} y={row.y - 5} fontSize={8} fontWeight={600} fill={row.color}>
            {row.label}
          </text>
          <text x={8} y={row.y + 6} fontSize={7} fill="var(--muted-foreground)">
            {row.freq}
          </text>

          {/* 타임라인 축 */}
          <line x1={tlX} y1={row.y} x2={tlX + tlW} y2={row.y}
            stroke="var(--border)" strokeWidth={0.8} />

          {/* 점들 */}
          {row.dots.map((dx, di) => (
            <motion.circle key={di} cx={dx} cy={row.y} r={3.5}
              fill={row.color} opacity={0.8}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: ri * 0.25 + di * 0.02 + 0.1 }}
            />
          ))}

          {/* API path */}
          <motion.text
            x={tlX + tlW + 6} y={row.y + 3} fontSize={7}
            fill="var(--muted-foreground)" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
            transition={{ delay: ri * 0.25 + 0.3 }}>
            {row.path}
          </motion.text>
        </motion.g>
      ))}

      {/* 시간 축 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <text x={tlX} y={185} fontSize={7} fill="var(--muted-foreground)">0</text>
        <text x={tlX + tlW} y={185} textAnchor="end" fontSize={7}
          fill="var(--muted-foreground)">시간 →</text>
        <line x1={tlX} y1={178} x2={tlX + tlW} y2={178}
          stroke="var(--border)" strokeWidth={0.4} strokeDasharray="2 2" />
      </motion.g>
    </g>
  );
}

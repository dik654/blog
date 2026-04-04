import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── 화살표 헬퍼 ── */
function Arrow({ x1, y1, x2, y2, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <line x1={x1} y1={y1} x2={x2 - 4} y2={y2} stroke="var(--border)" strokeWidth={1} />
      <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 3} ${x2 - 5},${y2 + 3}`} fill="var(--border)" />
    </motion.g>
  );
}

/* 수직 화살표 */
function VArrow({ x, y1, y2, delay = 0, color = 'var(--border)' }: {
  x: number; y1: number; y2: number; delay?: number; color?: string;
}) {
  const down = y2 > y1;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <line x1={x} y1={y1} x2={x} y2={down ? y2 - 4 : y2 + 4} stroke={color} strokeWidth={1} />
      {down
        ? <polygon points={`${x},${y2} ${x - 3},${y2 - 5} ${x + 3},${y2 - 5}`} fill={color} />
        : <polygon points={`${x},${y2} ${x - 3},${y2 + 5} ${x + 3},${y2 + 5}`} fill={color} />
      }
    </motion.g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 0: Update Loop 순환 흐름
   [Store] → 매 12초 → [Beacon API] → [Update 수신] → [검증] → [Store 갱신]
   순환 화살표로 루프 표현
   ══════════════════════════════════════════════════════ */
export function Step0() {
  return (
    <g>
      {/* 중앙 타이틀 */}
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
        Update Loop — 매 12초 반복
      </text>

      {/* Store (시작점) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <ModuleBox x={10} y={34} w={90} h={46} label="LightClientStore" sub="finalized + optimistic" color={C.loop} />
      </motion.g>

      {/* Store → Beacon API */}
      <Arrow x1={100} y1={57} x2={118} y2={57} delay={0.2} />

      {/* 타이머 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={102} y={38} width={14} height={14} rx={7} fill="var(--card)" stroke={C.loop} strokeWidth={0.8} />
        <text x={109} y={48} textAnchor="middle" fontSize={7} fill={C.loop}>12s</text>
      </motion.g>

      {/* Beacon API */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
        <ModuleBox x={118} y={34} w={86} h={46} label="Beacon API" sub="HTTP 폴링" color={C.muted} />
      </motion.g>

      {/* Beacon API → Update 수신 */}
      <Arrow x1={204} y1={57} x2={222} y2={57} delay={0.35} />

      {/* Update 수신 */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <DataBox x={222} y={41} w={80} h={32} label="Update 수신" sub="헤더+서명" color={C.loop} />
      </motion.g>

      {/* Update → 검증 */}
      <Arrow x1={302} y1={57} x2={320} y2={57} delay={0.5} />

      {/* 검증 */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
        <ActionBox x={320} y={38} w={70} h={38} label="검증" sub="validate()" color={C.fin} />
      </motion.g>

      {/* 검증 → Store 갱신 */}
      <Arrow x1={390} y1={57} x2={408} y2={57} delay={0.65} />

      {/* Store 갱신 */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        <ActionBox x={408} y={38} w={62} h={38} label="적용" sub="apply()" color={C.opt} />
      </motion.g>

      {/* 순환 화살표: Store 갱신 → 다시 Store (아래쪽 경로) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
        {/* 아래쪽으로 내려감 */}
        <line x1={439} y1={76} x2={439} y2={100} stroke={C.loop} strokeWidth={1} strokeDasharray="4 2" />
        {/* 좌측으로 이동 */}
        <line x1={439} y1={100} x2={55} y2={100} stroke={C.loop} strokeWidth={1} strokeDasharray="4 2" />
        {/* 위로 올라감 */}
        <line x1={55} y1={100} x2={55} y2={84} stroke={C.loop} strokeWidth={1} strokeDasharray="4 2" />
        <polygon points="55,80 52,86 58,86" fill={C.loop} />
        {/* 라벨 */}
        <rect x={200} y={92} width={80} height={16} rx={3} fill="var(--card)" />
        <text x={240} y={103} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.loop}>
          다음 슬롯 대기
        </text>
      </motion.g>

      {/* 부트스트랩 이후 즉시 시작 */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.9 }}
        x={240} y={128} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        부트스트랩 완료 직후 즉시 시작 — 멈추면 Store가 과거에 고정됨
      </motion.text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 1: OptimisticUpdate vs FinalityUpdate
   상단 타임라인: Optimistic (12초 간격, 빈번한 점)
   하단 타임라인: Finality (~12.8분 간격, 드문 점)
   ══════════════════════════════════════════════════════ */
export function Step1() {
  const tlX = 40;
  const tlW = 400;

  /* Optimistic 슬롯 (12초마다 = 빈번) */
  const optSlots = Array.from({ length: 16 }, (_, i) => tlX + 10 + i * (tlW / 17));

  /* Finality 슬롯 (~64 슬롯 = 12.8분마다 = 드문) */
  const finSlots = [tlX + 10, tlX + 10 + tlW * 0.5, tlX + 10 + tlW * 0.98];

  return (
    <g>
      {/* ── Optimistic 영역 ── */}
      <text x={tlX} y={18} fontSize={9} fontWeight={700} fill={C.opt}>OptimisticUpdate</text>
      <text x={tlX + 160} y={18} fontSize={7.5} fill="var(--muted-foreground)">매 12초 · 빠르지만 reorg 가능</text>

      {/* 타임라인 축 */}
      <line x1={tlX} y1={40} x2={tlX + tlW} y2={40} stroke="var(--border)" strokeWidth={0.5} />

      {/* 슬롯 점 */}
      {optSlots.map((x, i) => (
        <motion.g key={`opt-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.04 }}
        >
          <circle cx={x} cy={40} r={4} fill={C.opt} opacity={0.75} />
          {i % 4 === 0 && (
            <text x={x} y={54} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              +{i * 12}s
            </text>
          )}
        </motion.g>
      ))}

      {/* 용도 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={tlX + tlW - 130} y={24} width={130} height={14} rx={3} fill="var(--card)" stroke={C.opt} strokeWidth={0.5} />
        <text x={tlX + tlW - 65} y={34} textAnchor="middle" fontSize={7} fill={C.opt}>
          eth_getBlockByNumber("latest")
        </text>
      </motion.g>

      {/* ── 구분선 ── */}
      <line x1={tlX} y1={72} x2={tlX + tlW} y2={72} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={190} y={64} width={100} height={16} rx={3} fill="var(--card)" />
        <text x={240} y={75} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
          optimistic vs finalized
        </text>
      </motion.g>

      {/* ── Finality 영역 ── */}
      <text x={tlX} y={98} fontSize={9} fontWeight={700} fill={C.fin}>FinalityUpdate</text>
      <text x={tlX + 130} y={98} fontSize={7.5} fill="var(--muted-foreground)">~12.8분 · 느리지만 되돌릴 수 없음</text>

      {/* 타임라인 축 */}
      <line x1={tlX} y1={118} x2={tlX + tlW} y2={118} stroke="var(--border)" strokeWidth={0.5} />

      {/* 슬롯 점 */}
      {finSlots.map((x, i) => (
        <motion.g key={`fin-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.15 }}
        >
          <circle cx={x} cy={118} r={6} fill={C.fin} opacity={0.7} />
          {/* 자물쇠 표시 — finalized는 확정 */}
          <text x={x} y={121} textAnchor="middle" fontSize={7} fill="white" fontWeight={700}>F</text>
        </motion.g>
      ))}

      {/* 간격 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <line x1={finSlots[0]} y1={132} x2={finSlots[1]} y2={132}
          stroke={C.fin} strokeWidth={0.5} strokeDasharray="2 2" />
        <text x={(finSlots[0] + finSlots[1]) / 2} y={142} textAnchor="middle"
          fontSize={7} fill={C.fin}>~12.8분 (2 에폭)</text>
      </motion.g>

      {/* 용도 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <rect x={tlX + tlW - 130} y={108} width={130} height={14} rx={3} fill="var(--card)" stroke={C.fin} strokeWidth={0.5} />
        <text x={tlX + tlW - 65} y={118} textAnchor="middle" fontSize={7} fill={C.fin}>
          eth_getBalance, eth_call
        </text>
      </motion.g>

      {/* 하단 비교 요약 */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.2 }}
        x={240} y={165} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        두 타입 병행: 빠른 추적(Optimistic) + 안전한 상태 증명(Finality)
      </motion.text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 2: 처리 파이프라인 — validate → apply → best_valid_update
   상단: 3단계 파이프라인 (수평 흐름)
   하단: 각 단계의 핵심 연산
   ══════════════════════════════════════════════════════ */
export function Step2() {
  const stages = [
    {
      label: 'validate_update()',
      color: C.fin,
      sub: '유효성 검증',
      ops: ['슬롯 순서 검사', 'BLS 서명 검증', 'finality 증명'],
      x: 10,
    },
    {
      label: 'apply_update()',
      color: C.opt,
      sub: 'Store 반영',
      ops: ['finalized 헤더 교체', '위원회 교체 (period)', 'optimistic 헤더 교체'],
      x: 175,
    },
    {
      label: 'best_valid_update',
      color: C.loop,
      sub: '최선 선택',
      ops: ['참여자 수 비교', 'Finality > Optimistic', '최신 슬롯 우선'],
      x: 340,
    },
  ];

  return (
    <g>
      {/* 타이틀 */}
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
        Update 수신 후 처리 파이프라인
      </text>

      {/* Update 입력 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <DataBox x={10} y={28} w={75} h={28} label="Update" sub="" color={C.loop} />
      </motion.g>

      <Arrow x1={85} y1={42} x2={100} y2={42} delay={0.1} />

      {/* 3단계 파이프라인 */}
      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.2 }}
        >
          {/* 메인 박스 */}
          <ActionBox x={s.x + 90} y={28} w={120} h={30} label={s.label} sub={s.sub} color={s.color} />

          {/* 아래로 내려가는 상세 연산 */}
          <VArrow x={s.x + 150} y1={58} y2={72} delay={0.25 + i * 0.2} color={s.color} />

          {/* 연산 목록 박스 */}
          <rect x={s.x + 92} y={74} width={116} height={60} rx={6}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          {s.ops.map((op, j) => (
            <g key={op}>
              <circle cx={s.x + 104} cy={89 + j * 17} r={2.5} fill={s.color} opacity={0.6} />
              <text x={s.x + 112} y={92 + j * 17} fontSize={8} fill="var(--foreground)">
                {op}
              </text>
            </g>
          ))}

          {/* 단계 간 화살표 */}
          {i < 2 && (
            <Arrow x1={s.x + 210} y1={42} x2={s.x + 255} y2={42} delay={0.3 + i * 0.2} />
          )}
        </motion.g>
      ))}

      {/* 하단 주석 */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.9 }}
        x={240} y={152} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        검증 없이 적용하면 악의적 헤더 수용 가능 — validate가 반드시 선행
      </motion.text>
    </g>
  );
}

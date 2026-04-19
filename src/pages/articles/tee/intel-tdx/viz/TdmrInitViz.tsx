import { motion } from 'framer-motion';

const SYS = '#8b5cf6';
const TDMR = '#3b82f6';
const PAMT = '#f59e0b';
const COST = '#ef4444';

interface Step { num: number; api: string; scope: string; effect: string; color: string; }

const STEPS: Step[] = [
  { num: 1, api: 'TDH.SYS.INIT', scope: '전역 (1회)', effect: 'TDX 시스템 전체 초기화', color: SYS },
  { num: 2, api: 'TDH.SYS.LP.INIT', scope: '논리 CPU별', effect: '각 LP에서 SEAM 초기화', color: SYS },
  { num: 3, api: 'TDH.SYS.CONFIG', scope: '시스템 설정', effect: 'TDMR 영역 지정', color: TDMR },
  { num: 4, api: 'TDH.SYS.TDMR.INIT', scope: '각 TDMR', effect: 'PAMT 초기화 + 메타데이터 설정', color: PAMT },
];

export default function TdmrInitViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 360" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD Module 초기화 — TDMR + PAMT 셋업</text>

        {/* Steps */}
        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.12 }}>
            <rect x={20} y={36 + i * 42} width={440} height={36} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.6} />
            <rect x={20} y={36 + i * 42} width={3.5} height={36} fill={s.color} />

            <circle cx={42} cy={54 + i * 42} r={10} fill={s.color} />
            <text x={42} y={58 + i * 42} textAnchor="middle"
              fontSize={9.5} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={60} y={42 + i * 42} width={150} height={14} rx={3}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={135} y={52 + i * 42} textAnchor="middle"
              fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={s.color}>
              {s.api}
            </text>

            <rect x={215} y={42 + i * 42} width={70} height={14} rx={2}
              fill="var(--muted)" opacity={0.4} />
            <text x={250} y={52 + i * 42} textAnchor="middle"
              fontSize={6.5} fontWeight={600} fill="var(--muted-foreground)">
              {s.scope}
            </text>

            <text x={60} y={67 + i * 42} fontSize={7} fill="var(--muted-foreground)">
              {s.effect}
            </text>
          </motion.g>
        ))}

        {/* TDMR concept */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <text x={30} y={222} fontSize={9} fontWeight={700} fill={TDMR}>
            TDMR (TD Memory Range) — TDX가 관리하는 물리 메모리 범위
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <rect x={30} y={230} width={205} height={50} rx={5}
            fill={TDMR} fillOpacity={0.08} stroke={TDMR} strokeWidth={0.6} />
          <text x={132} y={248} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={TDMR}>
            TDMR (예: 64GB 청크)
          </text>
          <text x={132} y={262} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            연속 물리 메모리 영역
          </text>
          <text x={132} y={273} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            TD 페이지 후보
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.78 }}>
          <rect x={245} y={230} width={205} height={50} rx={5}
            fill={PAMT} fillOpacity={0.08} stroke={PAMT} strokeWidth={0.6} />
          <text x={347} y={248} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={PAMT}>
            PAMT (per TDMR)
          </text>
          <text x={347} y={262} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            페이지당 소유권 · 타입 · MAC
          </text>
          <text x={347} y={273} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={PAMT}>
            ~16B per 4KB page
          </text>
        </motion.g>

        {/* Memory cost */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <rect x={30} y={295} width={420} height={56} rx={6}
            fill={COST} fillOpacity={0.06} stroke={COST} strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={240} y={312} textAnchor="middle" fontSize={9} fontWeight={700} fill={COST}>
            메모리 비용 (BIOS 예약)
          </text>
          <text x={240} y={328} textAnchor="middle"
            fontSize={7.5} fontFamily="monospace" fill={COST}>
            TDMR 1GB → PAMT ~16MB
          </text>
          <text x={240} y={342} textAnchor="middle"
            fontSize={7.5} fontFamily="monospace" fill={COST}>
            전체 시스템 메모리의 ~1.5% 영구 예약
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

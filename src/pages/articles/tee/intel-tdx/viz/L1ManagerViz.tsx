import { motion } from 'framer-motion';

const L1 = '#3b82f6';
const L2 = '#10b981';
const ATTR = '#8b5cf6';
const API = '#f59e0b';

interface ApiCall { name: string; purpose: string; }

const APIS: ApiCall[] = [
  { name: 'TDG.VP.ENTER', purpose: 'L2 vCPU 진입 (L1 → L2)' },
  { name: 'TDG.VP.INVEPT', purpose: 'L2 S-EPT 무효화' },
  { name: 'TDG.VP.INVGLA', purpose: 'L2 TLB 플러시' },
  { name: 'TDG.VP.RD/WR', purpose: 'L2 상태 읽기/쓰기' },
  { name: 'TDG.MEM.PAGE.ATTR', purpose: 'L2 페이지 속성 변경' },
];

const SEQ: { num: number; call: string; effect: string }[] = [
  { num: 1, call: 'alloc_l2_control_structure()', effect: 'L2_TDCS 페이지 할당' },
  { num: 2, call: 'tdg_vp_create(l2_tdcs)', effect: 'L2 TD 생성' },
  { num: 3, call: 'tdg_vp_init(l2_tdcs, params)', effect: 'L2 초기화' },
  { num: 4, call: 'tdg_mem_page_add(l2, gpa) ×n', effect: 'L2 메모리 적재' },
  { num: 5, call: 'tdg_mr_finalize(l2_tdcs)', effect: 'L2 MRTD 확정' },
  { num: 6, call: 'tdg_vp_enter(l2_vcpu)', effect: 'L2 실행 시작', },
];

export default function L1ManagerViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 410" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">L1 TD — Partitioning Manager (TDX 1.5)</text>

        {/* Attributes */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill="var(--foreground)">
            L1 TD 속성 (TD_ATTRIBUTES)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <rect x={30} y={50} width={205} height={32} rx={5}
            fill={L1} fillOpacity={0.08} stroke={L1} strokeWidth={0.6} />
          <text x={42} y={66} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={L1}>
            PARTITIONING = 1
          </text>
          <text x={42} y={77} fontSize={6.5} fill="var(--muted-foreground)">
            ← 핵심: 신규 TDG 호출 활성화
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <rect x={245} y={50} width={205} height={32} rx={5}
            fill={ATTR} fillOpacity={0.08} stroke={ATTR} strokeWidth={0.6} />
          <text x={257} y={66} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={ATTR}>
            PERFMON = 0
          </text>
          <text x={257} y={77} fontSize={6.5} fill="var(--muted-foreground)">
            성능 카운터 별도 TD에 위임
          </text>
        </motion.g>

        {/* New TDCALL APIs */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <text x={30} y={102} fontSize={9} fontWeight={700} fill={API}>
            L1 전용 신규 TDCALL
          </text>
        </motion.g>

        {APIS.map((a, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}>
            <rect x={30} y={110 + i * 22} width={420} height={20} rx={3}
              fill={API} fillOpacity={0.06} stroke={API} strokeWidth={0.4} />
            <rect x={42} y={114 + i * 22} width={130} height={12} rx={2}
              fill={API} fillOpacity={0.18} stroke={API} strokeWidth={0.3} />
            <text x={107} y={123 + i * 22} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fontWeight={700} fill={API}>
              {a.name}
            </text>
            <text x={185} y={123 + i * 22} fontSize={7} fill="var(--muted-foreground)">
              {a.purpose}
            </text>
          </motion.g>
        ))}

        {/* L2 creation sequence */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.78 }}>
          <text x={30} y={244} fontSize={9} fontWeight={700} fill={L2}>
            L2 생성 흐름 (L1 내부에서 실행)
          </text>
        </motion.g>

        {SEQ.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85 + i * 0.08 }}>
            <rect x={20} y={252 + i * 26} width={440} height={22} rx={4}
              fill={L2} fillOpacity={0.06} stroke={L2} strokeWidth={0.4} />
            <circle cx={36} cy={263 + i * 26} r={8} fill={L2} />
            <text x={36} y={266 + i * 26} textAnchor="middle"
              fontSize={8} fontWeight={700} fill="white">
              {s.num}
            </text>
            <text x={52} y={266 + i * 26} fontSize={7} fontFamily="monospace" fontWeight={600} fill={L2}>
              {s.call}
            </text>
            <text x={290} y={266 + i * 26} fontSize={7} fill="var(--muted-foreground)">
              {s.effect}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

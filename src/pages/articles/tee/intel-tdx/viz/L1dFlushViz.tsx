import { motion } from 'framer-motion';

const TD = '#10b981';
const SEAM = '#8b5cf6';
const HOST = '#ef4444';
const FLUSH = '#f59e0b';

interface Step { phase: string; op: string; reason: string; color: string; }

const STEPS: Step[] = [
  { phase: '1) Save TD State', op: 'save_td_state()', reason: 'VMCS · GPR · XMM 저장', color: TD },
  { phase: '2) Microarch Flush', op: 'verw  zero_word', reason: 'MDS 완화 (store buf · fill buf)', color: FLUSH },
  { phase: '3) L1D Flush', op: 'wrmsr FLUSH_CMD = L1D_FLUSH', reason: 'L1TF 완화 (L1 캐시 비움)', color: FLUSH },
  { phase: '4) IBPB', op: 'wrmsr PRED_CMD = IBPB', reason: 'Indirect Branch Predictor barrier', color: FLUSH },
  { phase: '5) Restore Host', op: 'restore_host_state()', reason: 'Host VMCS · 레지스터 복원', color: HOST },
  { phase: '6) SEAMRET', op: '__seamret()', reason: 'VMX Root 복귀', color: SEAM },
];

export default function L1dFlushViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 350" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">L1D Flush — SEAMRET 시 사이드채널 차단 시퀀스</text>

        {/* Header bar */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={36} width={210} height={28} rx={6}
            fill={TD} fillOpacity={0.15} stroke={TD} strokeWidth={1} />
          <text x={125} y={54} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={TD}>
            TD Guest 실행 중
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <rect x={250} y={36} width={210} height={28} rx={6}
            fill={HOST} fillOpacity={0.15} stroke={HOST} strokeWidth={1} />
          <text x={355} y={54} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={HOST}>
            Host (VMX Root) 복귀 후
          </text>
        </motion.g>

        {/* Center: SEAM gate */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <text x={240} y={82} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEAM}>
            SEAMRET 시 TD Module이 자동 수행 (seamret_to_host)
          </text>
        </motion.g>

        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <rect x={20} y={92 + i * 36} width={440} height={32} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.6} />
            <rect x={20} y={92 + i * 36} width={3.5} height={32} fill={s.color} />
            <text x={32} y={106 + i * 36} fontSize={8.5} fontWeight={700} fill={s.color}>
              {s.phase}
            </text>
            <rect x={130} y={97 + i * 36} width={170} height={20} rx={3}
              fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={0.4} />
            <text x={215} y={110 + i * 36} textAnchor="middle"
              fontSize={7.5} fontFamily="monospace" fontWeight={600} fill={s.color}>
              {s.op}
            </text>
            <text x={310} y={110 + i * 36} fontSize={7} fill="var(--muted-foreground)">
              {s.reason}
            </text>
          </motion.g>
        ))}

        {/* Cost note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <rect x={30} y={314} width={420} height={28} rx={6}
            fill={FLUSH} fillOpacity={0.1} stroke={FLUSH} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={330} textAnchor="middle" fontSize={7.5} fill={FLUSH}>
            성능 비용: SEAMRET마다 ~200 cycles · 핫패스(IRQ, TDVMCALL)에 누적 오버헤드
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

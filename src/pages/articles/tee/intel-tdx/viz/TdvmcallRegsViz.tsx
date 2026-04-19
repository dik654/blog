import { motion } from 'framer-motion';

const TD = '#10b981';
const SEAM = '#8b5cf6';
const HOST = '#ef4444';
const HIDE = '#6b7280';
const RES = '#f59e0b';

interface Reg { name: string; role: string; visible: boolean; color: string; }

const REGS: Reg[] = [
  { name: 'R10', role: 'TDX_HYPERCALL_STANDARD = 0', visible: true, color: TD },
  { name: 'R11', role: 'sub-function (EXIT_REASON_*)', visible: true, color: TD },
  { name: 'R12', role: 'arg 0 (exit_qual)', visible: true, color: TD },
  { name: 'R13', role: 'arg 1 (ext_exit_qual)', visible: true, color: TD },
  { name: 'R14', role: 'arg 2', visible: true, color: TD },
  { name: 'R15', role: 'arg 3', visible: true, color: TD },
  { name: 'RAX/RBX/RCX/RDX', role: 'TD 비밀 — Host 노출 금지', visible: false, color: HIDE },
  { name: 'XMM/YMM/ZMM', role: 'TD 비밀 — SEAM이 zeroize', visible: false, color: HIDE },
];

export default function TdvmcallRegsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDVMCALL 레지스터 — Host 노출 vs TD 비밀</text>

        {/* Three actors */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={36} width={130} height={26} rx={4}
            fill={TD} fillOpacity={0.15} stroke={TD} strokeWidth={1} />
          <text x={85} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={TD}>
            TD Guest
          </text>
          <text x={85} y={62} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            R10..R15 세팅
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <rect x={175} y={36} width={130} height={26} rx={4}
            fill={SEAM} fillOpacity={0.15} stroke={SEAM} strokeWidth={1} />
          <text x={240} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEAM}>
            TD Module
          </text>
          <text x={240} y={62} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            레지스터 필터링 + zeroize
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <rect x={330} y={36} width={130} height={26} rx={4}
            fill={HOST} fillOpacity={0.15} stroke={HOST} strokeWidth={1} />
          <text x={395} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={HOST}>
            Host (KVM)
          </text>
          <text x={395} y={62} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            R10..R15만 수신
          </text>
        </motion.g>

        {/* Register table */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <text x={30} y={88} fontSize={9} fontWeight={700} fill="var(--foreground)">
            레지스터 노출 정책
          </text>
        </motion.g>

        {REGS.map((r, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 + i * 0.06 }}>
            <rect x={20} y={94 + i * 24} width={440} height={22} rx={4}
              fill={r.color} fillOpacity={0.06} stroke={r.color} strokeWidth={0.4}
              strokeDasharray={r.visible ? 'none' : '3 2'} />
            <rect x={32} y={98 + i * 24} width={130} height={14} rx={2}
              fill={r.color} fillOpacity={0.18} stroke={r.color} strokeWidth={0.4} />
            <text x={97} y={108 + i * 24} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fontWeight={700} fill={r.color}>
              {r.name}
            </text>
            <text x={175} y={108 + i * 24} fontSize={7} fill="var(--muted-foreground)">
              {r.role}
            </text>
            <rect x={400} y={98 + i * 24} width={50} height={14} rx={2}
              fill={r.visible ? TD : HIDE} fillOpacity={0.2} />
            <text x={425} y={108 + i * 24} textAnchor="middle"
              fontSize={6.5} fontWeight={700} fill={r.visible ? TD : HIDE}>
              {r.visible ? 'EXPOSED' : 'HIDDEN'}
            </text>
          </motion.g>
        ))}

        {/* Host receives */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <rect x={30} y={296} width={420} height={42} rx={6}
            fill={HOST} fillOpacity={0.06} stroke={HOST} strokeWidth={0.6} />
          <text x={240} y={312} textAnchor="middle" fontSize={9} fontWeight={700} fill={HOST}>
            struct vcpu_tdx (KVM 측 수신)
          </text>
          <text x={240} y={326} textAnchor="middle"
            fontSize={7} fontFamily="monospace" fill={HOST}>
            exit_reason = R11 · exit_qual = R12 · ext_exit_qual = R13
          </text>
        </motion.g>

        {/* Return */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <rect x={30} y={344} width={420} height={28} rx={6}
            fill={RES} fillOpacity={0.08} stroke={RES} strokeWidth={0.6} />
          <text x={240} y={360} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={RES}>
            반환: R10 (상태 — 0=성공 / TDX_VMCALL_RETRY) · R11..R15 (응답 데이터)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

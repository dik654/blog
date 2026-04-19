import { motion } from 'framer-motion';

const HOST = '#ef4444';
const SEAM = '#8b5cf6';
const TD = '#10b981';
const ASYNC = '#f59e0b';
const VMC = '#3b82f6';

interface ExitCase { num: number; name: string; trigger: string; reason: string; color: string; }

const CASES: ExitCase[] = [
  { num: 1, name: 'Async Exit', trigger: '외부 IRQ · Timer · NMI', reason: 'INTR', color: ASYNC },
  { num: 2, name: 'EPT Violation', trigger: 'TD가 매핑 안 된 페이지 접근', reason: 'EPT_VIOLATION', color: SEAM },
  { num: 3, name: 'TDVMCALL', trigger: 'TD가 의도적으로 Host 서비스 요청', reason: 'TDG_VP_VMCALL', color: VMC },
];

export default function TdEnterExitDetailViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 360" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDENTER / TDEXIT — 진입과 3가지 탈출 경로</text>

        <defs>
          <marker id="te-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={SEAM} />
          </marker>
        </defs>

        {/* Enter chain */}
        <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill="var(--foreground)">
            TD 진입 (Host → TD)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <rect x={20} y={50} width={130} height={30} rx={5}
            fill={HOST} fillOpacity={0.15} stroke={HOST} strokeWidth={1} />
          <text x={85} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={HOST}>
            Host (KVM)
          </text>
          <text x={85} y={76} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">
            tdh_vp_enter()
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <line x1={150} y1={65} x2={185} y2={65}
            stroke={SEAM} strokeWidth={1.2} markerEnd="url(#te-arr)" />
          <text x={167} y={58} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill={SEAM}>
            SEAMCALL
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <rect x={185} y={50} width={130} height={30} rx={5}
            fill={SEAM} fillOpacity={0.15} stroke={SEAM} strokeWidth={1} />
          <text x={250} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEAM}>
            TD Module
          </text>
          <text x={250} y={76} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            레지스터 복원 + resume
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <line x1={315} y1={65} x2={350} y2={65}
            stroke={SEAM} strokeWidth={1.2} markerEnd="url(#te-arr)" />
          <text x={332} y={58} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill={SEAM}>
            TDENTER
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <rect x={350} y={50} width={110} height={30} rx={5}
            fill={TD} fillOpacity={0.15} stroke={TD} strokeWidth={1} />
          <text x={405} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={TD}>
            TD Guest
          </text>
          <text x={405} y={76} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            코드 실행
          </text>
        </motion.g>

        {/* Exit cases */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <text x={30} y={108} fontSize={9} fontWeight={700} fill="var(--foreground)">
            TD 탈출 경로 — 어떤 경로든 TD Module이 중재
          </text>
        </motion.g>

        {CASES.map((c, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.15 }}>
            <rect x={20} y={120 + i * 60} width={440} height={50} rx={6}
              fill={c.color} fillOpacity={0.08} stroke={c.color} strokeWidth={1} />
            <rect x={20} y={120 + i * 60} width={3.5} height={50} fill={c.color} />

            <circle cx={42} cy={144 + i * 60} r={11} fill={c.color} />
            <text x={42} y={148 + i * 60} textAnchor="middle"
              fontSize={10} fontWeight={700} fill="white">
              {c.num}
            </text>

            <text x={62} y={140 + i * 60} fontSize={9.5} fontWeight={700} fill={c.color}>
              {c.name}
            </text>
            <text x={62} y={155 + i * 60} fontSize={7.5} fill="var(--muted-foreground)">
              Trigger: {c.trigger}
            </text>
            <rect x={62} y={159 + i * 60} width={120} height={9} rx={2}
              fill={c.color} fillOpacity={0.18} />
            <text x={122} y={166 + i * 60} textAnchor="middle"
              fontSize={6.5} fontFamily="monospace" fontWeight={700} fill={c.color}>
              exit_reason: {c.reason}
            </text>
          </motion.g>
        ))}

        {/* Common rule */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <rect x={30} y={310} width={420} height={40} rx={6}
            fill={SEAM} fillOpacity={0.08} stroke={SEAM} strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={240} y={328} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEAM}>
            공통 보증
          </text>
          <text x={240} y={342} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            Host는 TD 내부 레지스터 직접 못 봄 — TD Module이 GPR 필터링 + XMM 자동 zeroize
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

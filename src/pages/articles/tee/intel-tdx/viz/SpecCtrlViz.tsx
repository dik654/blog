import { motion } from 'framer-motion';

const TD = '#10b981';
const MOD = '#8b5cf6';
const HOST = '#3b82f6';
const WARN = '#f59e0b';

interface Mitigation { name: string; layer: string; bit: string; color: string; }

const MITS: Mitigation[] = [
  { name: 'IBRS', layer: 'TD 진입 시 SPEC_CTRL', bit: 'bit 0', color: TD },
  { name: 'STIBP', layer: 'TD 진입 시 SPEC_CTRL', bit: 'bit 1', color: TD },
  { name: 'eIBRS', layer: 'CPU (Sapphire Rapids+)', bit: '기본 enable', color: HOST },
  { name: 'retpoline', layer: 'TD Module 컴파일', bit: '간접 분기 sanitize', color: MOD },
  { name: 'LFENCE', layer: 'TD Module 분기', bit: 'speculative 차단', color: MOD },
];

export default function SpecCtrlViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 340" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Transient Execution 방어 — IBRS/STIBP + TCB Status</text>

        {/* TD entry MSR write */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill="var(--foreground)">
            TD 진입 시 MSR 세팅
          </text>
          <rect x={30} y={50} width={420} height={36} rx={5}
            fill={TD} fillOpacity={0.1} stroke={TD} strokeWidth={0.8} />
          <text x={240} y={66} textAnchor="middle"
            fontSize={8.5} fontFamily="monospace" fontWeight={600} fill={TD}>
            wrmsrl(MSR_IA32_SPEC_CTRL, SPEC_CTRL_IBRS | SPEC_CTRL_STIBP)
          </text>
          <text x={240} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            Spectre v2 — 간접 분기 예측 격리
          </text>
        </motion.g>

        {/* Mitigations */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <text x={30} y={108} fontSize={9} fontWeight={700} fill="var(--foreground)">
            완화 항목
          </text>
        </motion.g>

        {MITS.map((m, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}>
            <rect x={30} y={118 + i * 26} width={420} height={22} rx={4}
              fill={m.color} fillOpacity={0.08} stroke={m.color} strokeWidth={0.5} />
            <rect x={30} y={118 + i * 26} width={3.5} height={22} fill={m.color} />
            <text x={42} y={133 + i * 26} fontSize={8} fontFamily="monospace" fontWeight={700} fill={m.color}>
              {m.name}
            </text>
            <text x={130} y={133 + i * 26} fontSize={7.5} fill="var(--muted-foreground)">
              {m.layer}
            </text>
            <text x={310} y={133 + i * 26} fontSize={7} fontFamily="monospace" fill={m.color}>
              {m.bit}
            </text>
          </motion.g>
        ))}

        {/* TCB Status warning */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <rect x={30} y={258} width={420} height={75} rx={8}
            fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1} strokeDasharray="3 2" />
          <text x={240} y={276} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={WARN}>
            Quote TCB Status: SWHardeningNeeded
          </text>
          <text x={240} y={292} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            Guest OS도 매칭 패치 필요 — kernel/microcode 둘 다
          </text>
          <text x={240} y={306} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            미패치 시 Relying Party가 attestation 검증에서 warning 처리
          </text>
          <text x={240} y={322} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={WARN}>
            policy: warn_on(SWHardeningNeeded) | reject_on(Revoked)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

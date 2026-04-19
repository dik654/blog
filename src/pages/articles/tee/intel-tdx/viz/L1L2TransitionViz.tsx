import { motion } from 'framer-motion';

const SEAM = '#8b5cf6';
const HOST = '#ef4444';
const L1 = '#3b82f6';
const L2 = '#10b981';

interface Layer { name: string; sub: string; color: string; }

const LAYERS: Layer[] = [
  { name: 'SEAM (TD Module)', sub: '최고 권한 · 모든 전환 중재', color: SEAM },
  { name: 'Host VMM (KVM)', sub: 'VMX Root', color: HOST },
  { name: 'L1 TD (Partitioning Manager)', sub: 'L2 생성·관리·exit 처리', color: L1 },
  { name: 'L2 TD (workload)', sub: 'L1만 신뢰 — pod·function 단위', color: L2 },
];

const TRANS: { from: string; to: string; api: string; color: string }[] = [
  { from: 'Host', to: 'L1', api: 'TDH.VP.ENTER', color: HOST },
  { from: 'L1', to: 'L2', api: 'TDG.VP.ENTER (l2_vcpu)', color: L1 },
  { from: 'L2', to: 'L1', api: 'L2 exit (TDVMCALL · IRQ)', color: L2 },
  { from: 'L1', to: 'L1', api: 'L1이 처리 후 재진입', color: L1 },
];

export default function L1L2TransitionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">L1 ↔ L2 전환 — 3-계층 권한 + TDX Module 중재</text>

        <defs>
          <marker id="ll-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#6b7280" />
          </marker>
        </defs>

        {/* Layer stack */}
        {LAYERS.map((l, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.12 }}>
            <rect x={50} y={36 + i * 50} width={380} height={42} rx={6}
              fill={l.color} fillOpacity={0.1} stroke={l.color} strokeWidth={1} />
            <rect x={50} y={36 + i * 50} width={3.5} height={42} fill={l.color} />
            <text x={62} y={56 + i * 50} fontSize={10} fontWeight={700} fill={l.color}>
              {l.name}
            </text>
            <text x={62} y={70 + i * 50} fontSize={7.5} fill="var(--muted-foreground)">
              {l.sub}
            </text>
            <text x={420} y={62 + i * 50} textAnchor="end"
              fontSize={9} fontWeight={700} fill={l.color}>
              Lv {i}
            </text>
          </motion.g>
        ))}

        {/* Vertical transitions */}
        {[0, 1, 2].map(i => (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}>
            <line x1={20} y1={78 + i * 50} x2={20} y2={86 + i * 50}
              stroke="#6b7280" strokeWidth={0.8} />
            <line x1={20} y1={86 + i * 50} x2={48} y2={86 + i * 50}
              stroke="#6b7280" strokeWidth={0.8} markerEnd="url(#ll-arr)" />
            <line x1={460} y1={78 + i * 50} x2={460} y2={86 + i * 50}
              stroke="#6b7280" strokeWidth={0.8} />
            <line x1={460} y1={86 + i * 50} x2={432} y2={86 + i * 50}
              stroke="#6b7280" strokeWidth={0.8} markerEnd="url(#ll-arr)" />
          </motion.g>
        ))}

        {/* Transition table */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <text x={30} y={258} fontSize={9} fontWeight={700} fill="var(--foreground)">
            전환 시퀀스 (모두 TD Module 경유)
          </text>
        </motion.g>

        {TRANS.map((t, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 + i * 0.08 }}>
            <rect x={20} y={266 + i * 26} width={440} height={22} rx={4}
              fill={t.color} fillOpacity={0.06} stroke={t.color} strokeWidth={0.4} />
            <rect x={32} y={270 + i * 26} width={45} height={14} rx={2}
              fill={t.color} fillOpacity={0.2} />
            <text x={54} y={280 + i * 26} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={t.color}>
              {t.from}
            </text>
            <text x={84} y={280 + i * 26} fontSize={9} fill="var(--muted-foreground)">→</text>
            <rect x={97} y={270 + i * 26} width={45} height={14} rx={2}
              fill={t.color} fillOpacity={0.2} />
            <text x={119} y={280 + i * 26} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={t.color}>
              {t.to}
            </text>
            <text x={155} y={280 + i * 26} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {t.api}
            </text>
          </motion.g>
        ))}

        {/* Key insight */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <rect x={30} y={372} width={420} height={4} fill={SEAM} opacity={0.5} />
          <text x={240} y={372} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">
            L2의 "hypervisor" = L1 TD (Host VMM 아님) → L1 벤더가 TCB 범위 결정
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

import { motion } from 'framer-motion';

const SEAM = '#8b5cf6';
const HOST = '#ef4444';
const TD = '#10b981';
const VM = '#6b7280';
const MEM = '#f59e0b';

interface Layer {
  name: string;
  desc: string;
  color: string;
  indent: number;
  items?: string[];
}

const TREE: Layer[] = [
  { name: 'SEAM (최상위)', desc: 'TD Module · P-SEAMLDR', color: SEAM, indent: 0 },
  { name: '└─ VMX Root (Ring 0-3)', desc: '하이퍼바이저 — KVM · Hyper-V · ESXi', color: HOST, indent: 1 },
  { name: '   └─ VMX Non-Root (Ring 0-3)', desc: '게스트 VM 영역', color: VM, indent: 2 },
  { name: '      ├─ Trust Domain (TD)', desc: 'TDX 보호 (KeyID 분리)', color: TD, indent: 3 },
  { name: '      └─ 일반 VM', desc: '비보호 (KeyID 0)', color: VM, indent: 3 },
];

export default function SeamHierarchyViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">SEAM 권한 계층 — Ring -2 + SEAMRR</text>

        {TREE.map((l, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}>
            <rect x={20 + l.indent * 20} y={36 + i * 38} width={440 - l.indent * 20} height={32} rx={5}
              fill={l.color} fillOpacity={0.08} stroke={l.color} strokeWidth={0.6} />
            <rect x={20 + l.indent * 20} y={36 + i * 38} width={3.5} height={32} fill={l.color} />

            <text x={32 + l.indent * 20} y={51 + i * 38} fontSize={8.5} fontFamily="monospace" fontWeight={700} fill={l.color}>
              {l.name}
            </text>
            <text x={32 + l.indent * 20} y={63 + i * 38} fontSize={7} fill="var(--muted-foreground)">
              {l.desc}
            </text>
          </motion.g>
        ))}

        {/* SEAMRR */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <rect x={30} y={236} width={420} height={42} rx={8}
            fill={MEM} fillOpacity={0.1} stroke={MEM} strokeWidth={1} strokeDasharray="3 2" />
          <text x={240} y={254} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={MEM}>
            SEAMRR (SEAM Range Register) — BIOS 예약 메모리 영역
          </text>
          <text x={240} y={268} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            보통 256MB · 오직 SEAM 모드만 접근 · 하이퍼바이저조차 read/write 불가
          </text>
        </motion.g>

        {/* Bottom note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <text x={240} y={296} textAnchor="middle" fontSize={8} fontWeight={700} fill={SEAM}>
            핵심: TD 보호 로직이 하이퍼바이저 위 — 악성 VMM도 무력화 못함
          </text>
          <text x={240} y={310} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            CPU 마이크로아키텍처가 SEAM 경계를 강제
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

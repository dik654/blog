import { motion } from 'framer-motion';

const HOST = '#ef4444';
const GUEST = '#10b981';
const SEAM = '#8b5cf6';
const BUS = '#3b82f6';

interface FileRow { path: string; note: string; }

const HOST_FILES: FileRow[] = [
  { path: 'arch/x86/kvm/vmx/tdx.c', note: 'KVM-TDX 통합 (vCPU run, exit 처리)' },
  { path: 'arch/x86/virt/vmx/tdx/tdx.c', note: 'TDH.* host SEAMCALL 래퍼' },
  { path: 'arch/x86/virt/vmx/tdx/seamcall.S', note: 'ASM SEAMCALL trampoline' },
];

const GUEST_FILES: FileRow[] = [
  { path: 'arch/x86/coco/tdx/tdx.c', note: 'TDCALL 래퍼 + page accept' },
  { path: 'arch/x86/coco/tdx/tdcall.S', note: 'ASM TDCALL trampoline' },
  { path: 'drivers/virt/coco/tdx-guest/', note: '/dev/tdx_guest 인터페이스' },
];

export default function LinuxKernelViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Linux 커널 — KVM-TDX (Host) & coco/tdx (Guest)</text>

        <defs>
          <marker id="lk-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={BUS} />
          </marker>
        </defs>

        {/* Host column */}
        <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={40} width={195} height={20} rx={4}
            fill={HOST} fillOpacity={0.18} stroke={HOST} strokeWidth={1} />
          <text x={117} y={54} textAnchor="middle" fontSize={10} fontWeight={700} fill={HOST}>
            Host: CONFIG_INTEL_TDX_HOST
          </text>
        </motion.g>

        {HOST_FILES.map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.08 }}>
            <rect x={20} y={68 + i * 42} width={195} height={36} rx={4}
              fill="var(--card)" stroke={HOST} strokeWidth={0.6} strokeOpacity={0.5} />
            <rect x={20} y={68 + i * 42} width={3} height={36} fill={HOST} />
            <text x={28} y={82 + i * 42} fontSize={7.5} fontFamily="monospace" fontWeight={600} fill={HOST}>
              {f.path}
            </text>
            <text x={28} y={96 + i * 42} fontSize={7} fill="var(--muted-foreground)">
              {f.note}
            </text>
          </motion.g>
        ))}

        {/* Guest column */}
        <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={265} y={40} width={195} height={20} rx={4}
            fill={GUEST} fillOpacity={0.18} stroke={GUEST} strokeWidth={1} />
          <text x={362} y={54} textAnchor="middle" fontSize={10} fontWeight={700} fill={GUEST}>
            Guest: CONFIG_INTEL_TDX_GUEST
          </text>
        </motion.g>

        {GUEST_FILES.map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.08 }}>
            <rect x={265} y={68 + i * 42} width={195} height={36} rx={4}
              fill="var(--card)" stroke={GUEST} strokeWidth={0.6} strokeOpacity={0.5} />
            <rect x={265} y={68 + i * 42} width={3} height={36} fill={GUEST} />
            <text x={273} y={82 + i * 42} fontSize={7.5} fontFamily="monospace" fontWeight={600} fill={GUEST}>
              {f.path}
            </text>
            <text x={273} y={96 + i * 42} fontSize={7} fill="var(--muted-foreground)">
              {f.note}
            </text>
          </motion.g>
        ))}

        {/* SEAM in middle bottom */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={140} y={210} width={200} height={50} rx={8}
            fill={SEAM} fillOpacity={0.15} stroke={SEAM} strokeWidth={1.5} />
          <text x={240} y={228} textAnchor="middle" fontSize={10} fontWeight={700} fill={SEAM}>
            TDX Module (SEAM)
          </text>
          <text x={240} y={244} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            Intel 서명 · SEAMRR 내부
          </text>
          <text x={240} y={255} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            TDH.* / TDG.* 함수 디스패치
          </text>
        </motion.g>

        {/* Arrows host -> SEAM */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <line x1={170} y1={195} x2={195} y2={210}
            stroke={HOST} strokeWidth={1.2} markerEnd="url(#lk-arr)" />
          <text x={130} y={206} fontSize={7} fontFamily="monospace" fill={HOST}>
            __seamcall(fn,args)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <line x1={310} y1={195} x2={285} y2={210}
            stroke={GUEST} strokeWidth={1.2} markerEnd="url(#lk-arr)" />
          <text x={310} y={206} fontSize={7} fontFamily="monospace" fill={GUEST}>
            __tdcall(fn,args)
          </text>
        </motion.g>

        {/* Bottom: signatures */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <rect x={40} y={278} width={400} height={32} rx={5}
            fill="var(--muted)" opacity={0.25} stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={292} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fontWeight={600}
            fill="var(--foreground)">
            u64 __seamcall(u64 fn, struct tdx_module_args *args);
          </text>
          <text x={240} y={304} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fontWeight={600}
            fill="var(--foreground)">
            u64 __tdcall(u64 fn, struct tdx_module_args *args);
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

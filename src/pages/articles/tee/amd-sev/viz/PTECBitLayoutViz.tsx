import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  meta: '#8b5cf6',
  pa_high: '#0ea5e9',
  cbit: '#ef4444',
  pa_low: '#10b981',
  perms: '#f59e0b',
};

const STEPS = [
  { label: 'AMD64 PTE 64비트 레이아웃', body: '비트 구획: 메타 / PA 상위 / C-bit / PA 하위 / 권한' },
  { label: 'C-bit 위치 — CPUID로 조회', body: 'cpuid(0x8000_001f).EBX[5:0] = 보통 비트 47' },
  { label: 'C-bit = 1 → 메모리 컨트롤러가 암호화', body: '해당 PTE가 가리키는 페이지가 SEV 키로 암호화' },
  { label: 'C-bit = 0 → 평문 (shared 영역)', body: 'virtio, DMA, GHCB 등 host와 공유하는 페이지' },
];

const FIELDS = [
  { x: 20, w: 70, label: 'NX·PK·메타', sub: '63..52', color: C.meta },
  { x: 92, w: 130, label: 'PA[51:C+1]', sub: '상위 PA', color: C.pa_high },
  { x: 224, w: 24, label: 'C', sub: 'bit 47', color: C.cbit },
  { x: 250, w: 130, label: 'PA[C-1:12]', sub: '하위 PA', color: C.pa_low },
  { x: 382, w: 78, label: 'Perms', sub: 'R/W/U..', color: C.perms },
];

export default function PTECBitLayoutViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            PTE — 64-bit (msb 63 ← → lsb 0)
          </text>

          {FIELDS.map((f, i) => {
            const highlight = (step === 1 && i === 2) || (step >= 2 && i === 2);
            return (
              <motion.g key={f.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <motion.rect x={f.x} y={28} width={f.w} height={50} rx={4}
                  animate={{
                    fill: `${f.color}${highlight ? '30' : '15'}`,
                    stroke: f.color,
                    strokeWidth: highlight ? 2 : 0.8,
                  }} />
                <text x={f.x + f.w / 2} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={f.color}>{f.label}</text>
                <text x={f.x + f.w / 2} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{f.sub}</text>
              </motion.g>
            );
          })}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={150} y={96} w={180} h={36} label="cpuid(0x8000_001f)" sub="EBX[5:0] = C-bit pos" color={C.cbit} />
              <line x1={236} y1={78} x2={236} y2={96} stroke={C.cbit} strokeWidth={1} strokeDasharray="2 2" />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <DataBox x={120} y={104} w={240} h={32} label="C-bit = 1 → SEV 키 암호화" color={C.cbit} outlined />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                메모리 컨트롤러가 PTE 통과 시 C-bit 보고 암호화 결정
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <DataBox x={20} y={104} w={210} h={32} label="C-bit = 0 → 평문" color="#888" outlined />
              <DataBox x={250} y={104} w={210} h={32} label="용도: virtio, DMA, GHCB" color="#888" outlined />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                guest가 mmap_decrypted()로 명시 요청
              </text>
            </motion.g>
          )}

          {/* Examples row */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 0.85 : 0 }}>
            <text x={20} y={188} fontSize={9} fontWeight={700} fill="var(--foreground)">예시 — AMD64 일반 (C=47)</text>
            <text x={20} y={204} fontSize={8} fill="var(--muted-foreground)">PA 상위 = 비트 51..48 / C = 비트 47 / PA 하위 = 비트 46..12</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}

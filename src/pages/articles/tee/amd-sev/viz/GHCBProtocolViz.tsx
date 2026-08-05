import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  guest: '#0ea5e9',
  ghcb: '#10b981',
  host: '#f59e0b',
};

const STEPS = [
  { label: 'GHCB — guest와 host 공유 평문 페이지 (C-bit=0)', body: 'SEV-ES에서 레지스터 암호화 → 새 통신 채널 필요' },
  { label: '① Guest가 GHCB에 MSR 번호 + value 기입', body: 'save 영역에 selective fields 채움' },
  { label: '② valid_bitmap에 해당 필드 표시', body: 'Host에게 어떤 필드가 의미 있는지 알림' },
  { label: '③ vmmcall — VMEXIT 발생', body: 'sw_exit_code로 의도 명시' },
  { label: '④ Host가 GHCB 읽고 처리 → VMRUN', body: 'WRMSR/PIO/MMIO 등 emulation 후 복귀' },
];

const GHCB_FIELDS = [
  { label: 'reserved_1[0x800]', sub: 'pad' },
  { label: 'valid_bitmap[16]', sub: '필드 표시' },
  { label: 'ghcb_save_area', sub: '공유할 레지스터' },
  { label: 'sw_exit_code', sub: 'VMEXIT code' },
  { label: 'sw_exit_info_1/2', sub: '추가 정보' },
  { label: 'sw_scratch', sub: 'scratch' },
];

export default function GHCBProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={26} w={120} h={42} label="Guest" sub="vCPU" color={C.guest} />
          <ModuleBox x={180} y={26} w={120} h={42} label="GHCB Page" sub="C-bit = 0 (shared)" color={C.ghcb} />
          <ModuleBox x={340} y={26} w={120} h={42} label="Host (KVM)" sub="hypervisor" color={C.host} />

          {/* GHCB structure breakdown */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {GHCB_FIELDS.map((f, i) => (
                <motion.g key={f.label}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <DataBox x={20 + (i % 3) * 150} y={86 + Math.floor(i / 3) * 36} w={140} h={28}
                    label={f.label} sub={f.sub} color={C.ghcb} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={140} y1={48} x2={180} y2={48}
                stroke={C.guest} strokeWidth={1.2} markerEnd="url(#gh1)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <ActionBox x={150} y={86} w={210} h={50}
                label="MSR_idx + value → ghcb.save"
                sub="필요한 필드만 평문 노출"
                color={C.guest} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={150} y={86} w={210} h={50}
                label="valid_bitmap |= MSR_BIT"
                color={C.ghcb} outlined />
              <text x={240} y={154} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Host에게 "이 필드 읽어라" 신호
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={86} w={120} h={50}
                label="vmmcall" sub="→ VMEXIT" color={C.guest} />
              <motion.line x1={140} y1={111} x2={340} y2={111}
                stroke={C.host} strokeWidth={1.2} markerEnd="url(#gh2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={240} y={104} textAnchor="middle" fontSize={9} fill={C.host}>sw_exit_code 표시</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={340} y={86} w={120} h={50}
                label="emulate" sub="WRMSR/PIO/MMIO" color={C.host} />
              <motion.line x1={340} y1={130} x2={140} y2={130}
                stroke={C.guest} strokeWidth={1.2} markerEnd="url(#gh3)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill={C.guest}>VMRUN 복귀</text>
            </motion.g>
          )}

          {step >= 1 && step !== 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={60} y={196} w={360} h={36}
                label="MSR_AMD64_SEV_ES_GHCB → ghcb_paddr | GHCB_MSR_PROTOCOL"
                color={C.ghcb} outlined />
            </motion.g>
          )}

          <defs>
            <marker id="gh1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.guest} />
            </marker>
            <marker id="gh2" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.host} />
            </marker>
            <marker id="gh3" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.guest} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  host: '#6366f1',
  vmA: '#0ea5e9',
  vmB: '#10b981',
  attack: '#ef4444',
  ok: '#10b981',
};

const STEPS = [
  { label: 'SME만 — 단일 키로 모든 메모리 암호화', body: 'Host와 VM 모두 K_SME 공유, cross-VM 격리 없음' },
  { label: 'Hypervisor 공격 → 평문 노출', body: '같은 K_SME로 다른 VM 페이지 복호화 가능 — 격리 실패' },
  { label: 'SEV 추가 — VM별 독립 키', body: 'Host K_H, VM_A K_A, VM_B K_B 각자 다른 AES 키' },
  { label: 'Hypervisor가 VM 페이지 접근 → 랜덤 바이트', body: 'K_H로 복호화 시도 → 의미 없는 데이터' },
];

export default function SMELimitsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 1 && (
            <>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">SME 단독</text>
              <ModuleBox x={20} y={28} w={130} h={48} label="Host" sub="K_SME 사용" color={C.host} />
              <ModuleBox x={175} y={28} w={130} h={48} label="VM_A" sub="K_SME 사용" color={C.vmA} />
              <ModuleBox x={330} y={28} w={130} h={48} label="VM_B" sub="K_SME 사용" color={C.vmB} />

              <motion.g animate={{ opacity: 1 }}>
                <DataBox x={170} y={92} w={140} h={28} label="K_SME (단일 키)" color="#888" outlined />
                <line x1={85} y1={76} x2={210} y2={92} stroke="#888" strokeWidth={0.6} strokeDasharray="2 2" />
                <line x1={240} y1={76} x2={240} y2={92} stroke="#888" strokeWidth={0.6} strokeDasharray="2 2" />
                <line x1={395} y1={76} x2={270} y2={92} stroke="#888" strokeWidth={0.6} strokeDasharray="2 2" />
              </motion.g>

              {step === 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertBox x={20} y={140} w={440} h={48} label="Hypervisor가 VM_A 페이지 읽기" sub="K_SME로 복호화 → 평문 누출 (격리 없음)" color={C.attack} />
                  <motion.line x1={85} y1={76} x2={240} y2={140} stroke={C.attack} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} markerEnd="url(#a1)" />
                </motion.g>
              )}
            </>
          )}

          {step >= 2 && (
            <>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">SEV 추가 (VM별 키)</text>
              <ModuleBox x={20} y={28} w={130} h={48} label="Host" sub="K_H" color={C.host} />
              <ModuleBox x={175} y={28} w={130} h={48} label="VM_A" sub="K_A (독립)" color={C.vmA} />
              <ModuleBox x={330} y={28} w={130} h={48} label="VM_B" sub="K_B (독립)" color={C.vmB} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={20} y={92} w={130} h={26} label="K_H" color={C.host} outlined />
                <DataBox x={175} y={92} w={130} h={26} label="K_A" color={C.vmA} outlined />
                <DataBox x={330} y={92} w={130} h={26} label="K_B" color={C.vmB} outlined />
              </motion.g>

              {step === 3 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ActionBox x={20} y={138} w={440} h={36} label="Hypervisor → VM_A 페이지 접근" sub="K_H로 복호화 → 랜덤 바이트" color={C.ok} />
                  <motion.line x1={85} y1={118} x2={240} y2={138} stroke={C.ok} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} markerEnd="url(#a2)" />
                  <text x={240} y={196} textAnchor="middle" fontSize={10} fill={C.ok} fontWeight={600}>
                    Cross-VM 격리 보장 → SEV가 SME의 한계 보완
                  </text>
                </motion.g>
              )}
            </>
          )}

          <defs>
            <marker id="a1" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill={C.attack} />
            </marker>
            <marker id="a2" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill={C.ok} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

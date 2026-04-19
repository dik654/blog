import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  host: '#ef4444',
  guest: '#10b981',
  rmp: '#0ea5e9',
  cpu: '#6366f1',
};

const STEPS = [
  { label: '① Host가 페이지 할당 + RMP 등록', body: 'guest 소유로 RMP 엔트리 설정 (ASID + GPA)' },
  { label: '② Guest가 PVALIDATE 명령 실행', body: 'asm pvalidate(vaddr, page_size, validate=1)' },
  { label: '③ CPU — RMP.gpa == current GPA?', body: 'guest의 page table이 가리키는 GPA와 RMP 비교' },
  { label: '④ 일치 시 validated 비트 셋 → rc=0', body: '이후 접근에서 RMP 검사 통과' },
  { label: '실패 시 fault — 재매핑 공격 차단', body: '악의적 host가 다른 guest 페이지를 재할당하면 검출' },
];

export default function PvalidateFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={26} w={120} h={42} label="Host (KVM)" sub="hypervisor" color={C.host} />
          <ModuleBox x={180} y={26} w={120} h={42} label="Guest" sub="SNP-aware" color={C.guest} />
          <ModuleBox x={340} y={26} w={120} h={42} label="CPU + RMP" sub="hardware" color={C.cpu} />

          {/* Step 0: Host writes RMP */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <motion.line x1={140} y1={48} x2={340} y2={48} stroke={C.host} strokeWidth={1.2}
              strokeDasharray="3 2" markerEnd="url(#pv1)" />
            <text x={240} y={42} textAnchor="middle" fontSize={8} fill={C.host}>RMP 엔트리 등록</text>
          </motion.g>

          {/* Step 1: Guest runs PVALIDATE */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
            <ActionBox x={170} y={86} w={140} h={36} label="pvalidate(vaddr,…)" sub="guest 명령" color={C.guest} />
            {step >= 1 && (
              <motion.line x1={310} y1={104} x2={340} y2={68}
                stroke={C.guest} strokeWidth={1.2} markerEnd="url(#pv2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}
          </motion.g>

          {/* Step 2: CPU checks RMP */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.2 }}>
            <DataBox x={340} y={86} w={120} h={36} label="RMP.gpa == GPA ?" color={C.rmp} outlined />
          </motion.g>

          {/* Step 3 / 4: outcome */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={140} y={140} w={210} h={50} label="validated = 1, rc = 0" sub="이후 RMP 검사 통과" color={C.guest} />
              <text x={245} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Guest가 명시적으로 "이 페이지 받겠다" 표시
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <AlertBox x={70} y={140} w={150} h={50} label="GPA 불일치" sub="host 재매핑 시도" color={C.host} />
              <ActionBox x={240} y={140} w={210} h={50} label="PVALIDATE fault" sub="공격 차단" color="#10b981" />
              <text x={245} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                악의적 host가 다른 guest의 페이지를 재할당해도 검출
              </text>
            </motion.g>
          )}

          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0 }}>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CPU가 RMP를 직접 조회 (host 우회 불가)
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="pv1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.host} />
            </marker>
            <marker id="pv2" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.guest} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

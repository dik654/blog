import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_FLUSH = '#ef4444';
const C_WAIT = '#f59e0b';
const C_RELOAD = '#10b981';
const C_SHARED = '#6366f1';

const STEPS = [
  {
    label: 'FLUSH — 공격자가 shared address를 캐시에서 축출',
    body: '_mm_clflush(shared_addr) 호출.\n해당 라인이 모든 캐시 level에서 제거된다.',
  },
  {
    label: 'WAIT — Victim 실행 (몰래 shared_addr 접근?)',
    body: 'Victim이 그 주소를 접근하면 캐시로 돌아온다.\n접근하지 않으면 캐시는 여전히 비어 있다.',
  },
  {
    label: 'RELOAD — 공격자가 재접근 시간 측정',
    body: 'time < THRESHOLD → victim이 접근했음.\nPrime+Probe보다 정확 (target 1 address). 단점: shared memory 필요.',
  },
  {
    label: 'TEE 환경 — KSM page sharing이 위험',
    body: 'SGX는 동적 링킹 제한이라 비교적 안전.\nSEV VM은 zero-page dedup·KSM으로 page sharing 가능 → 클라우드는 KSM 비활성화 권장.',
  },
];

export default function FlushReloadViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_SHARED}>
            shared memory page (lib, syscall 경유)
          </text>
          <DataBox x={150} y={24} w={180} h={26} label="shared_addr" color={C_SHARED} outlined />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={170} h={36} label="공격자: clflush" sub="cache line 축출" color={C_FLUSH} />
              <line x1={210} y1={88} x2={240} y2={50} stroke={C_FLUSH} strokeWidth={0.8} markerEnd="url(#arrh)" />
              <DataBox x={250} y={70} w={180} h={36} label="cache line: EMPTY" color={C_FLUSH} outlined />
              <defs>
                <marker id="arrh" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={C_FLUSH} />
                </marker>
              </defs>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={170} h={36} label="공격자: wait" sub="가만히" color={C_WAIT} />
              <ActionBox x={250} y={70} w={180} h={36} label="Victim 실행" sub="shared_addr 접근?" color={C_SHARED} />
              <DataBox x={150} y={130} w={180} h={28} label="cache line: ?? (비어있을 수도, 채워질 수도)" color={C_WAIT} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={170} h={36} label="공격자: reload + RDTSCP" sub="time 측정" color={C_RELOAD} />
              <DataBox x={250} y={60} w={180} h={26} label="time < 40 cycles → HIT" color={C_RELOAD} outlined />
              <DataBox x={250} y={92} w={180} h={26} label="time > 200 cycles → MISS" color={C_FLUSH} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_RELOAD}>
                HIT → victim이 접근했다 (1-bit leak)
              </text>
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Prime+Probe보다 정밀. 단, shared memory 필요
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={50} y={70} w={170} h={28} label="SGX enclave" color={C_RELOAD} outlined />
              <text x={135} y={114} textAnchor="middle" fontSize={8.5} fill={C_RELOAD}>동적 링킹 제한 → 비교적 안전</text>
              <AlertBox x={260} y={70} w={170} h={28} label="SEV VM" color={C_FLUSH} />
              <text x={345} y={114} textAnchor="middle" fontSize={8.5} fill={C_FLUSH}>KSM dedup → page sharing</text>
              <DataBox x={120} y={150} w={240} h={32} label="권장: KSM 비활성화 (클라우드)" color={C_FLUSH} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

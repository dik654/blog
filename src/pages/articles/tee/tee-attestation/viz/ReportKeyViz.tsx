import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_CPU = '#6366f1';
const C_KEY = '#10b981';
const C_BAD = '#ef4444';

const STEPS = [
  {
    label: 'Report Key — CPU 하드웨어 root에서 파생',
    body: 'EGETKEY(REPORT) 입력: RootReportKey + MRENCLAVE + 기타 속성.\n같은 CPU에서만 같은 key 파생 → CPU가 trust anchor.',
  },
  {
    label: '다른 CPU → 다른 key → MAC 검증 실패',
    body: 'RootReportKey가 chip별 다름.\nReport를 다른 머신으로 복사하면 MAC 검증이 실패한다.',
  },
  {
    label: '일방적 인증 — 반대 방향은 별도 EREPORT 필요',
    body: 'EREPORT는 임의의 target으로 생성 가능.\nA → B 검증과 B → A 검증은 별개 → bidirectional은 2회 수행.',
  },
];

export default function ReportKeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={150} y={20} w={180} h={36} label="CPU Hardware" sub="RootReportKey" color={C_CPU} />
              <ActionBox x={40} y={80} w={170} h={32} label="EGETKEY (REPORT)" color={C_KEY} />
              <DataBox x={250} y={80} w={170} h={32} label="MRENCLAVE 입력" color={C_CPU} outlined />
              <DataBox x={120} y={130} w={240} h={36} label="report_key (chip + enclave 바운드)" color={C_KEY} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill={C_CPU}>
                CPU = local attestation의 trust anchor
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={20} w={170} h={42} label="CPU #1" sub="RootKey1" color={C_KEY} />
              <ModuleBox x={290} y={20} w={170} h={42} label="CPU #2" sub="RootKey2 (다름)" color={C_BAD} />
              <DataBox x={40} y={80} w={130} h={28} label="report_key_1" color={C_KEY} outlined />
              <DataBox x={310} y={80} w={130} h={28} label="report_key_2" color={C_BAD} outlined />
              <line x1={170} y1={94} x2={310} y2={94} stroke={C_BAD} strokeWidth={1} strokeDasharray="3 2" />
              <AlertBox x={120} y={130} w={240} h={36} label="report 복사 → MAC 검증 실패" color={C_BAD} />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill={C_BAD}>
                물리적 격리 보장
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="A → B: EREPORT(target=B) → B 검증" color={C_KEY} />
              <ActionBox x={40} y={56} w={400} h={28} label="B → A: EREPORT(target=A) → A 검증" color={C_KEY} />
              <DataBox x={120} y={104} w={240} h={32} label="2회 수행 → 상호 인증" color={C_KEY} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                EREPORT는 단방향 — bidirectional은 명시적 2회 호출
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

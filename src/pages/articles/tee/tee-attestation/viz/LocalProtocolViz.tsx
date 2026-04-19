import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_A = '#6366f1';
const C_B = '#10b981';
const C_FLOW = '#f59e0b';
const C_OK = '#10b981';

const STEPS = [
  {
    label: 'Step 1-2: B → A에 TARGETINFO 전달, A가 report 생성',
    body: 'B → A: target_info_B = {MRENCLAVE_B, ATTRIBUTES_B}.\nA: report_A = EREPORT(target_info_B, report_data_A) — MAC은 B의 report_key로 계산됨.',
  },
  {
    label: 'Step 3-4: A → B로 report 전송, B가 EGETKEY로 같은 key 파생',
    body: 'A → B: report_A.\nB: report_key_B = EGETKEY({REPORT, MRENCLAVE_B}). 같은 CPU → 같은 key.',
  },
  {
    label: 'Step 5-6: B가 MAC 검증, 반대 방향도 수행',
    body: 'expected_mac = AES-CMAC(report_key_B, report_A[0..384]).\n일치 시 A의 identity (MRENCLAVE_A) 확인. 반대 방향(B → A)도 동일하게 수행 → 상호 인증.',
  },
];

export default function LocalProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={140} h={42} label="Enclave A" color={C_A} />
          <ModuleBox x={320} y={20} w={140} h={42} label="Enclave B" color={C_B} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={84} w={400} h={28} label="B → A: target_info_B (MRENCLAVE_B + ATTR)" color={C_B} />
              <ActionBox x={40} y={120} w={400} h={28} label="A: EREPORT(target_info_B, report_data_A)" color={C_A} />
              <DataBox x={130} y={158} w={220} h={32} label="report_A (MAC by B's report_key)" color={C_A} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={84} w={400} h={28} label="A → B: report_A" color={C_FLOW} />
              <ActionBox x={40} y={120} w={400} h={28} label="B: EGETKEY({REPORT, MRENCLAVE_B})" color={C_B} />
              <DataBox x={130} y={158} w={220} h={32} label="report_key_B (same as A used)" color={C_B} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C_B}>
                같은 CPU → 같은 key 파생
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={84} w={400} h={28} label="expected = AES-CMAC(report_key_B, report_A[0..384])" color={C_B} />
              <DataBox x={40} y={120} w={400} h={28} label="if expected == report_A.mac → A의 MRENCLAVE 확인 ✓" color={C_OK} outlined />
              <ActionBox x={40} y={156} w={400} h={28} label="반대 방향(B → A) 수행 → 상호 인증" color={C_FLOW} />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_OK}>
                양방향 완료 → 세션 키 교환 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

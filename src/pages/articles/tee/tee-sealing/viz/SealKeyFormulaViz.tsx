import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_ROOT = '#6366f1';
const C_INPUT = '#10b981';
const C_OUT = '#f59e0b';
const C_BAD = '#ef4444';

const INPUTS = [
  'keyname (SEAL)',
  'isvprodid',
  'isvsvn',
  'ownerepoch (16B)',
  'attributes & mask',
  'miscselect & mask',
  'conditional_measurement',
  'configid / configsvn',
  'cetattributes',
  'keyid (32B)',
];

const STEPS = [
  {
    label: 'SealKey = AES-CMAC(RootKey, derivation_input)',
    body: 'CPU 하드웨어가 내부에서 수행.\n10개 입력 파라미터를 직렬화한 derivation_input.',
  },
  {
    label: 'conditional_measurement — keypolicy로 결정',
    body: 'MRENCLAVE 정책 → current.MRENCLAVE.\nMRSIGNER 정책 → current.MRSIGNER. combined → 둘의 hash.',
  },
  {
    label: '결정성 — 같은 입력 = 같은 키, 하나라도 다르면 완전히 다른 키',
    body: '같은 CPU + 같은 코드 + 같은 정책 → 동일 키 보장.\n어느 하나라도 바뀌면 → 완전히 다른 키 (avalanche).',
  },
];

export default function SealKeyFormulaViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={130} y={20} w={220} h={32} label="RootKey (e-fuse, per-chip)" color={C_ROOT} outlined />
              <ActionBox x={130} y={70} w={220} h={32} label="AES-CMAC" color={C_OUT} />
              {INPUTS.slice(0, 5).map((inp, i) => (
                <motion.text key={i} x={40} y={130 + i * 18} fontSize={9} fill={C_INPUT}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 40 }} transition={{ delay: i * 0.05 }}>
                  • {inp}
                </motion.text>
              ))}
              {INPUTS.slice(5).map((inp, i) => (
                <motion.text key={i} x={250} y={130 + i * 18} fontSize={9} fill={C_INPUT}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 250 }} transition={{ delay: (i + 5) * 0.05 }}>
                  • {inp}
                </motion.text>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={130} y={20} w={220} h={32} label="if keypolicy == ?" color={C_OUT} />
              <DataBox x={40} y={70} w={130} h={42} label="MRENCLAVE" sub="current binary hash" color={C_INPUT} outlined />
              <DataBox x={175} y={70} w={130} h={42} label="MRSIGNER" sub="current signer hash" color={C_INPUT} outlined />
              <DataBox x={310} y={70} w={130} h={42} label="combined" sub="hash(both)" color={C_INPUT} outlined />
              <ActionBox x={130} y={130} w={220} h={32} label="conditional_measurement" color={C_OUT} />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                정책 선택이 SealKey 분리를 결정
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={30} w={195} h={36} label="같은 CPU + 코드 + 정책" sub="→ 결정적, 항상 동일 key" color={C_OUT} outlined />
              <DataBox x={245} y={30} w={195} h={36} label="입력 1 byte 변경" sub="→ 완전히 다른 key (avalanche)" color={C_BAD} outlined />
              <ActionBox x={40} y={88} w={400} h={32} label="AES-CMAC 출력 = 16B 균일 분포" color={C_ROOT} />
              <text x={240} y={148} textAnchor="middle" fontSize={9} fill={C_OUT}>
                결정성 + 격리 동시 보장
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                → sealing의 보안 모델 핵심
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

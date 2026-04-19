import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_REG = '#6366f1';
const C_FIELD = '#10b981';
const C_KEY = '#f59e0b';

const FIELDS = [
  { name: 'keyname', size: '2B', desc: '어떤 키 원하는지' },
  { name: 'keypolicy', size: '2B', desc: 'MRENCLAVE / MRSIGNER' },
  { name: 'isvsvn', size: '2B', desc: '요청자 SVN 하한' },
  { name: 'cpusvn', size: '16B', desc: 'CPU SVN' },
  { name: 'attributemask', size: '16B', desc: '어떤 ATTR bit 사용' },
  { name: 'keyid', size: '32B', desc: 'fresh nonce' },
  { name: 'miscmask', size: '8B', desc: 'MISCSELECT mask' },
];

const KEYNAMES = [
  { val: 0x0000, name: 'EINITTOKEN' },
  { val: 0x0001, name: 'PROVISION' },
  { val: 0x0002, name: 'PROVISION_SEAL' },
  { val: 0x0003, name: 'REPORT' },
  { val: 0x0004, name: 'SEAL', highlight: true },
];

const STEPS = [
  {
    label: '호출 규약 — RAX/RBX/RCX',
    body: 'RAX = 1 (EGETKEY leaf), RBX = KEYREQUEST 주소, RCX = output key (16B).\nRing 3, enclave 내부에서만 호출 가능.',
  },
  {
    label: 'KEYREQUEST 구조체 — 7개 필드',
    body: 'keyname / keypolicy / isvsvn / cpusvn / attributemask / keyid / miscmask.\n전체 512B (reserved 포함).',
  },
  {
    label: 'Key names — 5종 중 SEAL이 sealing 용도',
    body: 'EINITTOKEN / PROVISION / PROVISION_SEAL / REPORT / SEAL.\nPROVISION 계열은 Intel 서명 enclave만 사용 가능.',
  },
];

export default function EgetkeyStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={32} label="EGETKEY (Ring 3)" color={C_REG} />
              <DataBox x={40} y={60} w={130} h={32} label="RAX = 1" sub="leaf" color={C_REG} outlined />
              <DataBox x={175} y={60} w={130} h={32} label="RBX = &request" sub="input" color={C_REG} outlined />
              <DataBox x={310} y={60} w={130} h={32} label="RCX = &out_key" sub="output 16B" color={C_KEY} outlined />
              <ActionBox x={40} y={108} w={400} h={32} label="enclave 내부에서만 호출 가능" color={C_REG} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {FIELDS.map((f, i) => {
                const x = 40 + (i % 2) * 220;
                const y = 24 + Math.floor(i / 2) * 50;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}>
                    <DataBox x={x} y={y} w={210} h={42} label={`${f.name} (${f.size})`} sub={f.desc} color={C_FIELD} outlined />
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {KEYNAMES.map((k, i) => {
                const y = 30 + i * 32;
                const color = k.highlight ? C_KEY : C_REG;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <DataBox x={40} y={y} w={130} h={26} label={`0x${k.val.toString(16).padStart(4, '0')}`} color={color} outlined />
                    <text x={195} y={y + 17} fontSize={10} fontWeight={600} fill={color}>{k.name}</text>
                    {k.highlight && <text x={350} y={y + 17} fontSize={9} fill={color}>← Sealing key</text>}
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

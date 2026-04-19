import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_ROOT = '#6366f1';
const C_DERIVED = '#10b981';
const C_SEAL = '#f59e0b';

const ROOTS = [
  { name: 'ROOT_PROVISION_KEY', sub: 'e-fuse, Intel 서명' },
  { name: 'ROOT_SEAL_KEY', sub: 'e-fuse, per-chip random' },
  { name: 'ROOT_OWNER_EPOCH', sub: 'BIOS 설정' },
];

const DERIVED = [
  { name: 'PROVISION_KEY', sub: 'provision enclave만', highlight: false },
  { name: 'PROVISION_SEAL_KEY', sub: 'provision sealing', highlight: false },
  { name: 'EINITTOKEN_KEY', sub: 'Launch Enclave 전용', highlight: false },
  { name: 'REPORT_KEY', sub: 'Local attestation', highlight: false },
  { name: 'SEAL_KEY', sub: '앱 sealing', highlight: true },
];

const STEPS = [
  {
    label: 'Root Layer — 하드웨어 고정 3종',
    body: 'ROOT_PROVISION_KEY / ROOT_SEAL_KEY / ROOT_OWNER_EPOCH.\nperfuse 또는 BIOS 설정으로 고정, SW 접근 불가.',
  },
  {
    label: 'KDF chain → Derived Keys 5종',
    body: 'PROVISION_KEY, PROVISION_SEAL_KEY, EINITTOKEN_KEY, REPORT_KEY, SEAL_KEY.\n각 enclave는 자기 SEAL_KEY만 얻을 수 있다.',
  },
  {
    label: 'Provision 계열 — Intel 서명 특권 필요',
    body: 'Provision Enclave는 특권 enclave (Intel 서명).\n일반 앱은 SEAL_KEY와 REPORT_KEY만 사용 가능.',
  },
];

export default function KeyTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_ROOT}>
                Root Layer (하드웨어 고정)
              </text>
              {ROOTS.map((r, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ModuleBox x={40} y={40 + i * 56} w={400} h={42} label={r.name} sub={r.sub} color={C_ROOT} />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={28} label="Root Layer" color={C_ROOT} />
              <text x={240} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">↓ KDF chain</text>
              {DERIVED.map((d, i) => {
                const color = d.highlight ? C_SEAL : C_DERIVED;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <DataBox x={40} y={70 + i * 32} w={250} h={26} label={d.name} color={color} outlined />
                    <text x={310} y={87 + i * 32} fontSize={9} fill={color}>{d.sub}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={30} w={195} h={36} label="일반 앱 enclave" sub="SEAL_KEY + REPORT_KEY" color={C_SEAL} outlined />
              <DataBox x={245} y={30} w={195} h={36} label="Provision Enclave" sub="Intel 서명, PROVISION_*" color={C_ROOT} outlined />
              <ModuleBox x={120} y={88} w={240} h={42} label="EGETKEY (keyname dispatch)" color={C_DERIVED} />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                권한이 keyname별로 분리됨
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

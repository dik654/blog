import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  hw: '#10b981',
  fw: '#6366f1',
  tee: '#f59e0b',
  os: '#ef4444',
  vmm: '#8b5cf6',
  excl: '#9ca3af',
  intel: '#0ea5e9',
  amd: '#ec4899',
  arm: '#22c55e',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Intel SGX (Process-level): 가장 작은 TCB',
    body: 'CPU + microcode + Enclave 코드 + Trusted Runtime + QE/PE만 신뢰. OS·Hypervisor·BIOS·드라이버 모두 제외. ~50K LOC.',
  },
  {
    label: 'AMD SEV/SEV-SNP (VM-level): VM 전체 신뢰',
    body: 'CPU + AMD PSP firmware + Guest VM 전체(kernel + userspace + bootloader + firmware). Hypervisor만 제외. ~수백만 LOC.',
  },
  {
    label: 'Intel TDX (VM-level): SEAM 모듈 추가',
    body: 'CPU + TDX module(SEAM) + Trust Domain 전체. Host Hypervisor·Host OS 제외. SEV와 유사하지만 SEAM 모듈이 추가 신뢰 지점.',
  },
  {
    label: 'ARM TrustZone (Partition-level): 두 세계 분리',
    body: 'CPU(Secure World) + Trusted OS(OP-TEE/Trusty) + TA + Secure Monitor. Normal World OS(Android/Linux) 제외. ~30K LOC.',
  },
  {
    label: 'Trust 비교: 누가 TCB를 통제하는가',
    body: 'SGX/TDX = Intel microcode/SEAM, SEV = AMD PSP, TrustZone = SoC vendor. 모두 하드웨어 vendor 신뢰 필수. Open source TEE(Keystone, OpenTitan)가 대안.',
  },
];

interface Block {
  label: string;
  sub?: string;
  color: string;
  excluded?: boolean;
}

const STACKS: Record<string, Block[]> = {
  sgx: [
    { label: 'CPU hardware', color: C.hw },
    { label: 'SGX microcode (Intel)', color: C.fw },
    { label: 'Quoting Enclave (Intel)', color: C.tee },
    { label: 'Trusted Runtime (SDK)', color: C.tee },
    { label: 'Enclave code (user)', color: C.tee },
  ],
  sev: [
    { label: 'CPU hardware', color: C.hw },
    { label: 'AMD PSP firmware', color: C.fw },
    { label: 'Guest firmware', color: C.tee },
    { label: 'Guest bootloader', color: C.tee },
    { label: 'Guest VM (kernel + user)', color: C.tee },
  ],
  tdx: [
    { label: 'CPU hardware', color: C.hw },
    { label: 'TDX module (SEAM)', color: C.fw },
    { label: 'Trust Domain (guest VM)', color: C.tee },
    { label: 'Guest OS + apps', color: C.tee },
  ],
  tz: [
    { label: 'CPU (Secure World)', color: C.hw },
    { label: 'Secure Monitor', color: C.fw },
    { label: 'Trusted OS (OP-TEE)', color: C.tee },
    { label: 'Trusted Applications', color: C.tee },
  ],
};

const EXCLUDED: Record<string, Block[]> = {
  sgx: [
    { label: 'OS', color: C.excl, excluded: true },
    { label: 'Hypervisor', color: C.excl, excluded: true },
    { label: 'BIOS / Drivers', color: C.excl, excluded: true },
  ],
  sev: [{ label: 'Hypervisor', color: C.excl, excluded: true }],
  tdx: [
    { label: 'Host Hypervisor', color: C.excl, excluded: true },
    { label: 'Host OS', color: C.excl, excluded: true },
  ],
  tz: [{ label: 'Normal World OS (Android/Linux)', color: C.excl, excluded: true }],
};

const TITLES: Record<string, { name: string; sub: string; loc: string; color: string }> = {
  sgx: { name: 'Intel SGX', sub: 'Process-level', loc: '~50K LOC', color: C.intel },
  sev: { name: 'AMD SEV / SEV-SNP', sub: 'VM-level', loc: '~수백만 LOC', color: C.amd },
  tdx: { name: 'Intel TDX', sub: 'VM-level', loc: '~100K + guest', color: C.intel },
  tz: { name: 'ARM TrustZone', sub: 'Partition-level', loc: '~30K~100K LOC', color: C.arm },
};

function StackViz({ key_ }: { key_: string }) {
  const stack = STACKS[key_];
  const excl = EXCLUDED[key_];
  const t = TITLES[key_];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={t.color}>
        {t.name} <tspan fill={C.muted} fontWeight={400}>· {t.sub} · {t.loc}</tspan>
      </text>
      {/* TCB included */}
      <motion.rect x={20} y={22} width={260} height={100} rx={6}
        fill={`${t.color}08`} stroke={t.color} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <text x={150} y={36} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={t.color}>
        TCB (신뢰 경계)
      </text>
      {stack.map((b, i) => (
        <motion.g key={b.label} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}>
          <rect x={32} y={42 + i * 15} width={236} height={13} rx={2}
            fill={`${b.color}25`} stroke={b.color} strokeWidth={0.6} />
          <text x={42} y={52 + i * 15} fontSize={8.5} fontWeight={500} fill={b.color}>
            {b.label}
          </text>
        </motion.g>
      ))}
      {/* Excluded */}
      <motion.rect x={300} y={22} width={160} height={100} rx={6}
        fill={`${C.excl}08`} stroke={C.excl} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <text x={380} y={36} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.excl}>
        제외 (untrusted)
      </text>
      {excl.map((b, i) => (
        <motion.g key={b.label} initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.08 }}>
          <rect x={310} y={48 + i * 18} width={140} height={15} rx={2}
            fill="transparent" stroke={C.excl} strokeWidth={0.6} strokeDasharray="2 2" />
          <text x={380} y={59 + i * 18} textAnchor="middle" fontSize={8.5} fill={C.excl}>
            X {b.label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

const VENDORS = [
  { tee: 'SGX', who: 'Intel', what: 'microcode', color: C.intel },
  { tee: 'SEV', who: 'AMD', what: 'PSP firmware', color: C.amd },
  { tee: 'TDX', who: 'Intel', what: 'SEAM module', color: C.intel },
  { tee: 'TrustZone', who: 'SoC vendor', what: 'Qualcomm 등', color: C.arm },
];

function VendorTrust() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        누가 TCB를 통제하는가 — 모두 하드웨어 vendor 신뢰 필요
      </text>
      {VENDORS.map((v, i) => {
        const y = 28 + i * 22;
        return (
          <motion.g key={v.tee} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={20} y={y} width={440} height={18} rx={3}
              fill={`${v.color}10`} stroke={`${v.color}50`} strokeWidth={0.6} />
            <text x={70} y={y + 12} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={v.color}>{v.tee}</text>
            <line x1={130} y1={y + 4} x2={130} y2={y + 14} stroke={C.muted} strokeWidth={0.4} />
            <text x={210} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">{v.who}</text>
            <line x1={290} y1={y + 4} x2={290} y2={y + 14} stroke={C.muted} strokeWidth={0.4} />
            <text x={370} y={y + 12} textAnchor="middle" fontSize={9} fill={C.muted}>{v.what}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={120} width={440} height={20} rx={3}
          fill={`${C.hw}12`} stroke={C.hw} strokeWidth={0.8} />
        <text x={240} y={134} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.hw}>
          Open source TEE 대안: Keystone, OpenTitan, Sanctum (RISC-V)
        </text>
      </motion.g>
    </g>
  );
}

export default function TeeArchTcbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StackViz key_="sgx" />}
          {step === 1 && <StackViz key_="sev" />}
          {step === 2 && <StackViz key_="tdx" />}
          {step === 3 && <StackViz key_="tz" />}
          {step === 4 && <VendorTrust />}
        </svg>
      )}
    </StepViz>
  );
}

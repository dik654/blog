import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  intel: '#0ea5e9',
  ms: '#06b6d4',
  rust: '#f59e0b',
  fortanix: '#8b5cf6',
  libos: '#ec4899',
  attest: '#10b981',
  use: '#6366f1',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: '5가지 SDK / Runtime',
    body: 'Intel SGX SDK(공식, C/C++) · Open Enclave(MS, cross-platform) · Teaclave(Rust) · Fortanix EDP(Rust-native) · Gramine/MesaTEE(Library OS).',
  },
  {
    label: 'Intel SGX SDK 구성',
    body: 'tRTS(Trusted Runtime) · uRTS(Untrusted Runtime) · sgxtlibc(표준 C++ lib) · Edger8r(EDL → marshaling code generator).',
  },
  {
    label: 'Attestation Services',
    body: 'IAS(Intel Attestation Service): EPID 기반, deprecated. DCAP(Data Center Attestation Primitives): ECDSA, on-prem 가능. Azure Attestation Service.',
  },
  {
    label: '실제 사용 사례 6가지',
    body: 'CCC(Confidential Computing Consortium) · Signal Contact Discovery · Blockchain(Secret Network, Oasis) · ML model protection · DRM/key mgmt · EdgelessDB.',
  },
];

interface Sdk { name: string; lang: string; vendor: string; feat: string; color: string; }

const SDKS: Sdk[] = [
  { name: 'Intel SGX SDK', lang: 'C/C++', vendor: 'Intel', feat: '공식, tRTS+uRTS+Edger8r', color: C.intel },
  { name: 'Open Enclave', lang: 'C/C++', vendor: 'Microsoft', feat: 'Cross-platform (SGX + OP-TEE)', color: C.ms },
  { name: 'Teaclave SGX SDK', lang: 'Rust', vendor: 'Apache', feat: 'Memory safety', color: C.rust },
  { name: 'Fortanix EDP', lang: 'Rust', vendor: 'Fortanix', feat: 'Rust-native, std target', color: C.fortanix },
  { name: 'Gramine / MesaTEE', lang: '-', vendor: 'OSS', feat: 'Library OS, unmodified bin', color: C.libos },
];

function SdkGrid() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        SGX SDK / Runtime 5종
      </text>
      {SDKS.map((s, i) => (
        <motion.g key={s.name} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={20} y={26 + i * 22} width={440} height={20} rx={3}
            fill={`${s.color}10`} stroke={s.color} strokeWidth={0.6} />
          <text x={32} y={40 + i * 22} fontSize={9.5} fontWeight={700} fill={s.color}>{s.name}</text>
          <text x={170} y={40 + i * 22} fontSize={8.5} fill="var(--foreground)">{s.lang} · {s.vendor}</text>
          <text x={290} y={40 + i * 22} fontSize={8.5} fill={C.muted}>{s.feat}</text>
        </motion.g>
      ))}
    </g>
  );
}

function IntelSdkComponents() {
  const comps = [
    { name: 'tRTS', desc: 'Trusted Runtime\n(enclave 내부)', color: C.intel },
    { name: 'uRTS', desc: 'Untrusted Runtime\n(host 측)', color: C.ms },
    { name: 'sgxtlibc', desc: 'C++ standard library\n(enclave 안전 버전)', color: C.rust },
    { name: 'Edger8r', desc: 'EDL → marshaling\ncode generator', color: C.fortanix },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.intel}>
        Intel SGX SDK — 4 Components
      </text>
      {comps.map((c, i) => {
        const x = 18 + i * 116;
        return (
          <motion.g key={c.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={28} width={108} height={86} rx={6}
              fill={`${c.color}12`} stroke={c.color} strokeWidth={1} />
            <text x={x + 54} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={c.color}>
              {c.name}
            </text>
            {c.desc.split('\n').map((line, li) => (
              <text key={li} x={x + 54} y={70 + li * 12} textAnchor="middle"
                fontSize={8} fill={C.muted}>{line}</text>
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}

interface Att { name: string; algo: string; desc: string; status: string; color: string; }

const ATTS: Att[] = [
  { name: 'IAS', algo: 'EPID', desc: 'Intel Attestation Service', status: 'deprecated', color: C.muted },
  { name: 'DCAP', algo: 'ECDSA', desc: 'Data Center Attestation Primitives', status: 'on-prem 가능', color: C.attest },
  { name: 'Azure Attestation', algo: 'multi', desc: 'MAA — Microsoft Azure Attestation', status: 'cloud-managed', color: C.ms },
];

function AttestationServices() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.attest}>
        Attestation Services — Quote 검증
      </text>
      {ATTS.map((a, i) => (
        <motion.g key={a.name} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20} y={28 + i * 32} width={440} height={26} rx={5}
            fill={`${a.color}10`} stroke={a.color} strokeWidth={0.8} />
          <text x={32} y={46 + i * 32} fontSize={10} fontWeight={700} fill={a.color}>{a.name}</text>
          <text x={120} y={46 + i * 32} fontSize={9} fontFamily="monospace" fontWeight={600} fill={a.color}>{a.algo}</text>
          <text x={190} y={46 + i * 32} fontSize={9} fill="var(--foreground)">{a.desc}</text>
          <text x={400} y={46 + i * 32} fontSize={8} fill={C.muted}>{a.status}</text>
        </motion.g>
      ))}
    </g>
  );
}

const USE_CASES = [
  { name: 'CCC', desc: 'Confidential Computing Consortium', color: C.use },
  { name: 'Signal', desc: 'Contact Discovery', color: C.attest },
  { name: 'Blockchain', desc: 'Secret Network, Oasis', color: C.fortanix },
  { name: 'ML model', desc: 'inference 보호 + 모델 secrecy', color: C.intel },
  { name: 'DRM / KMS', desc: 'key 보관 + license 검증', color: C.ms },
  { name: 'EdgelessDB', desc: 'Confidential databases', color: C.libos },
];

function UseCases() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        실제 사용 사례 — 6개 도메인
      </text>
      {USE_CASES.map((u, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 18 + col * 152;
        const y = 26 + row * 50;
        return (
          <motion.g key={u.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}>
            <rect x={x} y={y} width={144} height={42} rx={5}
              fill={`${u.color}10`} stroke={u.color} strokeWidth={0.8} />
            <text x={x + 8} y={y + 16} fontSize={9.5} fontWeight={700} fill={u.color}>{u.name}</text>
            <text x={x + 8} y={y + 32} fontSize={7.5} fill={C.muted}>{u.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function SgxEcosystemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SdkGrid />}
          {step === 1 && <IntelSdkComponents />}
          {step === 2 && <AttestationServices />}
          {step === 3 && <UseCases />}
        </svg>
      )}
    </StepViz>
  );
}

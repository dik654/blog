import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_INTEL = '#6366f1';
const C_AMD = '#ef4444';
const C_ARM = '#10b981';
const C_IETF = '#f59e0b';
const C_TCG = '#a855f7';

const STEPS = [
  {
    label: '벤더 표준 — Intel / AMD / ARM',
    body: 'Intel: EPID(deprecated) → DCAP → TDX DCAP.\nAMD: SEV Reports → SNP Attestation (VCEK).\nARM: CCA Token (CBOR/COSE/EAT) + PSA Token.',
  },
  {
    label: '범용 표준 — IETF RATS / TCG',
    body: 'IETF RATS Architecture (RFC 9334) + EAT (Entity Attestation Token).\nTCG TPM Quote (2003~), DICE (Device Identifier Composition Engine).',
  },
  {
    label: '추세 — vendor → 표준, 중앙 → 분산',
    body: 'Vendor-specific format → 표준 EAT.\n중앙 verifier (IAS) → 분산 verifier (Veraison).\nCloud-specific → cross-platform.',
  },
];

const VENDORS = [
  { name: 'Intel', items: ['EPID (deprecated)', 'DCAP (현재)', 'TDX DCAP'], color: C_INTEL },
  { name: 'AMD', items: ['SEV Reports', 'SNP (VCEK)'], color: C_AMD },
  { name: 'ARM', items: ['CCA Token (EAT)', 'PSA Token (IoT)'], color: C_ARM },
];

const STANDARDS = [
  { name: 'IETF RATS', items: ['RFC 9334 Architecture', 'EAT (draft-ietf-rats)'], color: C_IETF },
  { name: 'TCG', items: ['TPM Quote (2003~)', 'DICE'], color: C_TCG },
];

export default function AttestationStandardsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {VENDORS.map((v, i) => {
                const x = 40 + i * 145;
                return (
                  <motion.g key={v.name} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    <ModuleBox x={x} y={20} w={130} h={32} label={v.name} color={v.color} />
                    {v.items.map((item, j) => (
                      <DataBox key={j} x={x} y={64 + j * 42} w={130} h={34} label={item} color={v.color} outlined />
                    ))}
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {STANDARDS.map((s, i) => {
                const x = 40 + i * 220;
                return (
                  <motion.g key={s.name} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    <ModuleBox x={x} y={20} w={200} h={32} label={s.name} color={s.color} />
                    {s.items.map((item, j) => (
                      <DataBox key={j} x={x} y={64 + j * 42} w={200} h={34} label={item} color={s.color} outlined />
                    ))}
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                ['Vendor-specific format', '→', '표준 EAT'],
                ['중앙 verifier (IAS)', '→', '분산 verifier (Veraison)'],
                ['Cloud-specific', '→', 'Cross-platform'],
              ].map(([from, arr, to], i) => {
                const y = 40 + i * 56;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                    <DataBox x={40} y={y} w={170} h={36} label={from} color={C_INTEL} outlined />
                    <text x={235} y={y + 22} textAnchor="middle" fontSize={14} fill={C_IETF}>{arr}</text>
                    <DataBox x={270} y={y} w={170} h={36} label={to} color={C_ARM} outlined />
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

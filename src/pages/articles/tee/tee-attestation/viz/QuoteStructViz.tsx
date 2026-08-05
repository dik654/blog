import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_HEAD = '#6366f1';
const C_BODY = '#10b981';
const C_SIG = '#f59e0b';

const HEADER = [
  { name: 'version', size: '2B', val: '3' },
  { name: 'att_key_type', size: '2B', val: '2 (ECDSA P-256)' },
  { name: 'tee_type', size: '4B', val: '0 = SGX' },
  { name: 'qe_svn / pce_svn', size: '4B', val: '' },
  { name: 'vendor_id', size: '4B', val: 'Intel' },
  { name: 'user_data', size: '20B', val: '' },
];

const BODY = [
  { name: 'cpu_svn', size: '16B' },
  { name: 'misc_select', size: '4B' },
  { name: 'attributes', size: '16B' },
  { name: 'mr_enclave', size: '32B' },
  { name: 'mr_signer', size: '32B' },
  { name: 'isv_prod_id / svn', size: '4B' },
  { name: 'report_data', size: '64B' },
];

const SIG = [
  { name: 'ecdsa_sig', size: '64B' },
  { name: 'ecdsa_attestation_key', size: '64B' },
  { name: 'qe_report + sig', size: '128B' },
  { name: 'cert_data (PCK chain)', size: 'flex' },
];

const STEPS = [
  { label: 'SGX Quote 3.0 — Header', body: '6개 필드. version=3, att_key_type=2 (ECDSA), tee_type=0 (SGX).' },
  { label: 'Report Body — measurement + platform info', body: 'cpu_svn, attributes, mr_enclave/mr_signer, isv*, report_data 64B.' },
  { label: 'Signature Data — ECDSA + cert chain', body: 'ecdsa_sig 64B + AK 64B + qe_report+sig + PCK cert chain.\n전체 크기 ~4KB.' },
];

function FieldList({ fields, color }: { fields: { name: string; size: string; val?: string }[]; color: string }) {
  return (
    <g>
      {fields.map((f, i) => {
        const y = 50 + i * 24;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}>
            <DataBox x={40} y={y} w={200} h={20} label={f.name} color={color} outlined />
            <text x={250} y={y + 13} fontSize={9} fontWeight={600} fill={color}>{f.size}</text>
            {f.val && <text x={300} y={y + 13} fontSize={9} fill="var(--muted-foreground)">{f.val}</text>}
          </motion.g>
        );
      })}
    </g>
  );
}

export default function QuoteStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={28} label="Quote Header" color={C_HEAD} />
              <FieldList fields={HEADER} color={C_HEAD} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={28} label="Report Body" color={C_BODY} />
              <FieldList fields={BODY} color={C_BODY} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={28} label="Signature Data" color={C_SIG} />
              <FieldList fields={SIG} color={C_SIG} />
              <text x={240} y={172} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C_SIG}>
                전체 Quote ~4KB (cert chain 포함)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

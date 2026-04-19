import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_PCS = '#6366f1';
const C_PCCS = '#10b981';
const C_QVL = '#f59e0b';
const C_APP = '#a855f7';

const STATUS = [
  { name: 'UpToDate', color: '#10b981', desc: '최신 TCB' },
  { name: 'OutOfDate', color: '#f59e0b', desc: '패치 필요' },
  { name: 'SWHardeningNeeded', color: '#f59e0b', desc: 'SW 완화 적용' },
  { name: 'Revoked', color: '#ef4444', desc: '거부' },
];

const STEPS = [
  {
    label: 'PCS (Intel 운영) — Provisioning Service',
    body: 'api.trustedservices.intel.com.\nPCK 인증서, CRL, TCB info, QE identity 제공.',
  },
  {
    label: 'PCCS — 운영자 자체 cache (Docker)',
    body: 'intel/pccs Docker image.\nIntel PCS를 proxy + cache → 내부망 오프라인 접근 가능.',
  },
  {
    label: 'QVL + Application — Quote 검증 + 정책 적용',
    body: 'Quote Verification Library (intel-sgx-ssl).\n결과: UpToDate / OutOfDate / SWHardeningNeeded / Revoked.',
  },
];

export default function DcapInfraViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={20} w={220} h={42} label="Intel PCS" sub="api.trustedservices.intel.com" color={C_PCS} />
              {['/pckcert', '/pckcrl', '/tcb', '/qe/identity'].map((ep, i) => {
                const x = 30 + i * 110;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <DataBox x={x} y={86} w={100} h={36} label={ep} color={C_PCS} outlined />
                  </motion.g>
                );
              })}
              <text x={240} y={166} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Intel이 PCK·CRL·TCB·QE identity 제공
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={20} w={140} h={36} label="Intel PCS" sub="외부 인터넷" color={C_PCS} />
              <ModuleBox x={170} y={20} w={140} h={36} label="PCCS Docker" sub="proxy + cache" color={C_PCCS} />
              <ModuleBox x={320} y={20} w={140} h={36} label="내부 앱" color={C_APP} />
              <ActionBox x={40} y={80} w={400} h={28} label="docker run -p 8081:8081 intel/pccs:latest" color={C_PCCS} />
              <text x={240} y={134} textAnchor="middle" fontSize={9} fill={C_PCCS}>
                내부 네트워크에서 오프라인 접근 가능
              </text>
              <DataBox x={120} y={156} w={240} h={32} label="API_KEY로 Intel PCS 인증" color={C_PCS} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={20} w={220} h={36} label="QVL (Quote Verification Library)" color={C_QVL} />
              <ActionBox x={40} y={70} w={400} h={28} label="result = qvl_verify_quote(quote, cert_chain)" color={C_QVL} />
              {STATUS.map((s, i) => {
                const x = 40 + (i % 2) * 210;
                const y = 110 + Math.floor(i / 2) * 50;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                    <DataBox x={x} y={y} w={200} h={36} label={s.name} sub={s.desc} color={s.color} outlined />
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

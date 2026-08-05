import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_AZURE = '#6366f1';
const C_GCP = '#10b981';
const C_AWS = '#f59e0b';
const C_ONPREM = '#a855f7';

const CLOUDS = [
  {
    name: 'Azure',
    sub: 'Microsoft Azure Attestation (MAA)',
    detail: 'Intel DCAP 백엔드, JWT 반환',
    color: C_AZURE,
  },
  {
    name: 'GCP',
    sub: 'Confidential Computing',
    detail: 'Intel DCAP 표준, AMD SEV-SNP 우선',
    color: C_GCP,
  },
  {
    name: 'AWS',
    sub: 'Nitro Enclaves',
    detail: '자체 시스템 (Nitro Secure Module)',
    color: C_AWS,
  },
  {
    name: 'On-prem',
    sub: 'PCCS Docker',
    detail: '운영자 자체 policy 관리',
    color: C_ONPREM,
  },
];

const STEPS = [
  {
    label: '클라우드별 DCAP 통합 — 각자 wrapper 제공',
    body: 'Azure, GCP, AWS, On-prem 4개 패턴.\n공통 기반은 Intel DCAP, AWS만 자체 시스템.',
  },
  {
    label: 'Azure MAA — JWT 반환',
    body: 'POST /attest/SgxEnclave with quote.\nMAA가 검증된 claims를 JWT로 반환 → 표준 OAuth/OIDC 연동.',
  },
  {
    label: '추세 — Intel DCAP이 사실상 표준',
    body: '각 클라우드가 wrapper 제공.\nCross-cloud verifier (Veraison, Attestation as Service) 등장.',
  },
];

export default function CloudIntegrationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {CLOUDS.map((c, i) => {
                const x = 30 + (i % 2) * 220;
                const y = 20 + Math.floor(i / 2) * 100;
                return (
                  <motion.g key={c.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}>
                    <ModuleBox x={x} y={y} w={210} h={42} label={c.name} sub={c.sub} color={c.color} />
                    <text x={x + 105} y={y + 64} textAnchor="middle" fontSize={9} fill={c.color}>
                      {c.detail}
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={20} w={220} h={36} label="Azure MAA" color={C_AZURE} />
              <DataBox x={40} y={80} w={400} h={28} label="POST .../attest/SgxEnclave { quote }" color={C_AZURE} outlined />
              <DataBox x={40} y={120} w={400} h={28} label="response: JWT with verified claims" color={C_AZURE} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_AZURE}>
                JWT → 표준 OAuth/OIDC 인프라 연동 가능
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={120} y={30} w={240} h={32} label="Intel DCAP = de-facto 표준" color={C_AZURE} outlined />
              <DataBox x={120} y={80} w={240} h={32} label="각 클라우드가 wrapper 제공" color={C_GCP} outlined />
              <DataBox x={120} y={130} w={240} h={32} label="Cross-cloud verifier (Veraison)" color={C_ONPREM} outlined />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Attestation-as-a-Service (3rd party)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

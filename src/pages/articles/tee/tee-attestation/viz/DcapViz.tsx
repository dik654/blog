import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_ROOT = '#6366f1';
const C_PCK = '#10b981';
const C_AK = '#f59e0b';
const C_QUOTE = '#a855f7';

const CHAIN = [
  { name: 'Intel Root CA', sub: 'CPU eFuse', color: C_ROOT },
  { name: 'Intel SGX Root CA', sub: 'PCS', color: C_ROOT },
  { name: 'Platform CA', sub: 'PCS', color: C_PCK },
  { name: 'PCK Cert', sub: 'per-chip, per-TCB', color: C_PCK },
  { name: 'Attestation Key', sub: 'runtime 생성', color: C_AK },
  { name: 'Quote', sub: '실제 서명 대상', color: C_QUOTE },
];

const STEPS = [
  {
    label: 'DCAP — ECDSA 기반, 분산 검증',
    body: 'PCK(Provisioning Certification Key) 각 CPU chip 고유.\nAttestation Key는 runtime 생성, PCK로 보증.',
  },
  {
    label: '인증서 체인 — Intel Root → Quote (6단계)',
    body: 'eFuse Intel Root → SGX Root → Platform CA → PCK → AK → Quote.\n표준 X.509 / ECDSA 사용 → 기존 PKI 인프라 재활용.',
  },
  {
    label: '오프라인 검증 — PCK 캐시',
    body: '운영자가 PCK cert를 한 번 다운로드 → 캐시 (Intel PCCS).\nQuote 받으면 로컬 캐시로 검증, PCS 재방문은 TCB 갱신 시만.',
  },
];

export default function DcapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={20} w={170} h={42} label="PCK" sub="per-chip, per-TCB" color={C_PCK} />
              <ModuleBox x={270} y={20} w={170} h={42} label="Attestation Key" sub="runtime, PCK 보증" color={C_AK} />
              <line x1={210} y1={42} x2={270} y2={42} stroke={C_AK} strokeWidth={1} />
              <DataBox x={130} y={90} w={220} h={36} label="ECDSA P-256 서명 체계" color={C_QUOTE} outlined />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                중앙 verifier 없음 — 운영자가 직접 검증
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {CHAIN.map((c, i) => {
                const y = 18 + i * 35;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <DataBox x={50 + i * 5} y={y} w={300} h={28} label={c.name} sub={c.sub} color={c.color} outlined />
                    {i < CHAIN.length - 1 && (
                      <text x={365 + i * 5} y={y + 18} fontSize={11} fill={c.color}>↓ signs</text>
                    )}
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="1. 운영자: PCK 다운로드 (PCS, 1회)" color={C_PCK} />
              <DataBox x={40} y={56} w={400} h={28} label="2. Intel PCCS에 캐시" color={C_PCK} outlined />
              <ActionBox x={40} y={92} w={400} h={28} label="3. Quote 받으면 로컬 캐시로 검증" color={C_AK} />
              <DataBox x={40} y={128} w={400} h={28} label="4. TCB 갱신 시만 PCS 재방문" color={C_QUOTE} outlined />
              <text x={240} y={184} textAnchor="middle" fontSize={9} fill={C_QUOTE}>
                ✓ Intel 서버 의존성 제거 ✓ 분산 verifier ✓ scale out
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

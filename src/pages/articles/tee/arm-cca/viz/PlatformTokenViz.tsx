import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Step 1 — RMM이 EL3 호출',
    body: 'plat_get_cca_attest_token(buf, len, hash_buf, hash_size).\nhash_buf = RAK 공개키 SHA → platform 토큰의 challenge로 사용.',
  },
  {
    label: 'Step 2 — HW RoT에서 IAK 추출',
    body: 'Initial Attestation Key는 SiP가 silicon에 fuse.\nProvisioning 단계에서 IAK 공개키 인증서가 SiP CA로 서명됨.',
  },
  {
    label: 'Step 3 — Platform claims 수집',
    body: 'profile / impl_id / instance_id / lifecycle / sw_components 등 플랫폼 측 정적 정보.\nchallenge에는 RAK pub key hash → 두 토큰 결박.',
  },
  {
    label: 'Step 4 — IAK로 COSE_Sign1',
    body: 'cose_sign1_with_iak(buf, &pc, len) → CCA-SSD 프로파일 EAT.\nRMM에 반환되어 outer 토큰 안에 nested로 들어감.',
  },
];

export default function PlatformTokenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">EL3 Platform Token 발급 — TF-A rmmd</text>

          <defs>
            <marker id="pt-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
            </marker>
          </defs>

          <ModuleBox x={15} y={45} w={100} h={45}
            label="RMM (EL2)" sub="요청자" color="#f59e0b" />
          <ModuleBox x={190} y={45} w={100} h={45}
            label="TF-A BL31" sub="EL3 Monitor" color="#ef4444" />
          <ModuleBox x={365} y={45} w={100} h={45}
            label="HW RoT" sub="IAK fuse" color="#8b5cf6" />

          {step >= 0 && (
            <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
              x1={115} y1={67} x2={190} y2={67}
              stroke={step === 0 ? '#f59e0b' : '#94a3b8'} strokeWidth={1.4}
              markerEnd="url(#pt-arr)" />
          )}
          <text x={152} y={62} textAnchor="middle" fontSize={6.5}
            fill="var(--muted-foreground)">SMC + hash_buf</text>

          {step >= 1 && (
            <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
              x1={290} y1={67} x2={365} y2={67}
              stroke={step === 1 ? '#ef4444' : '#94a3b8'} strokeWidth={1.4}
              markerEnd="url(#pt-arr)" />
          )}
          <text x={328} y={62} textAnchor="middle" fontSize={6.5}
            fill="var(--muted-foreground)">read IAK</text>

          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <DataBox x={130} y={120} w={220} h={40}
                label="platform_claims" sub="profile / impl / instance / lifecycle"
                color="#06b6d4" outlined />
            </motion.g>
          )}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={130} y={170} w={220} h={42}
                label="cose_sign1_with_iak" sub="CCA-SSD profile EAT (CBOR)"
                color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

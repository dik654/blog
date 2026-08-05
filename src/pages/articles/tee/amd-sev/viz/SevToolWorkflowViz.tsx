import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  build: '#8b5cf6',
  status: '#0ea5e9',
  pdh: '#10b981',
  oca: '#f59e0b',
  attest: '#ef4444',
  flow: '#6366f1',
};

const STEPS = [
  { label: '설치 — autoreconf + configure + make', body: 'AMDESE/sev-tool 빌드' },
  { label: '--platform_status — 현재 SEV 상태', body: 'api_major/minor, build_id, state, owner, guest_count' },
  { label: '--pdh_cert_export — PDH 인증서 발급', body: '클라우드가 테넌트에게 제공하는 기본 인증서' },
  { label: '--generate_oca — 자체 OCA 생성', body: '테넌트 자체 인증 체인 구축' },
  { label: '--generate_attestation_report — quote 요청', body: 'nonce를 포함한 SNP report 받기' },
  { label: '실전 — 클라우드 + 테넌트 협업 흐름', body: 'Cloud PDH → Tenant OCA → PEK 교체 → Attestation' },
];

const COMMANDS = [
  { cmd: '--platform_status', sub: 'state, guest_count', color: C.status },
  { cmd: '--pdh_cert_export', sub: 'cloud-provided cert', color: C.pdh },
  { cmd: '--generate_oca', sub: 'tenant CA', color: C.oca },
  { cmd: '--validate_cert_chain', sub: '체인 검증', color: C.attest },
  { cmd: '--generate_attestation_report', sub: 'nonce + report', color: C.attest },
];

export default function SevToolWorkflowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            github.com/AMDESE/sev-tool — 사용자 유틸리티
          </text>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={20} y={26} w={210} h={42} label="git clone" sub="AMDESE/sev-tool" color={C.build} />
              <ActionBox x={250} y={26} w={210} h={42} label="autoreconf + configure + make" sub="" color={C.build} />
              <DataBox x={60} y={86} w={360} h={42} label="$ ./sevtool 실행 가능" color={C.build} outlined />
            </motion.g>
          )}

          {step >= 1 && step <= 4 && (
            <>
              {COMMANDS.map((c, i) => {
                const active = step - 1 === i;
                return (
                  <motion.g key={c.cmd} animate={{ opacity: active ? 1 : 0.25 }}>
                    <ActionBox x={20} y={26 + i * 36} w={440} h={30} label={`./sevtool ${c.cmd}`} sub={c.sub} color={c.color} />
                  </motion.g>
                );
              })}

              {step === 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DataBox x={20} y={216} w={440} h={20}
                    label='{ "api_major": 1, "state": "Working", "guest_count": 3 }'
                    color={C.status} outlined />
                </motion.g>
              )}
              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DataBox x={20} y={216} w={440} h={20}
                    label="PDH cert (cloud-provided) → 테넌트가 검증 가능"
                    color={C.pdh} outlined />
                </motion.g>
              )}
              {step === 3 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DataBox x={20} y={216} w={440} h={20}
                    label="oca_priv_key 파일 생성 → 자체 PEK 교체 가능"
                    color={C.oca} outlined />
                </motion.g>
              )}
              {step === 4 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DataBox x={20} y={216} w={440} h={20}
                    label="report.bin (1184B, VCEK signed)"
                    color={C.attest} outlined />
                </motion.g>
              )}
            </>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleBox x={20} y={26} w={130} h={50} label="① Cloud PDH" sub="기본 cert 제공" color={C.pdh} />
              <ModuleBox x={170} y={26} w={130} h={50} label="② Tenant OCA" sub="자체 생성" color={C.oca} />
              <ModuleBox x={320} y={26} w={140} h={50} label="③ PEK 교체" sub="own chain" color={C.flow} />
              <ModuleBox x={170} y={86} w={140} h={50} label="④ Attestation" sub="pre-launch 검증" color={C.attest} />
              {[
                { x1: 150, y1: 50, x2: 170, y2: 50 },
                { x1: 300, y1: 50, x2: 320, y2: 50 },
                { x1: 390, y1: 76, x2: 240, y2: 86 },
              ].map((a, i) => (
                <motion.line key={i} {...a} stroke={C.flow} strokeWidth={1.2} strokeDasharray="2 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 + i * 0.15 }} />
              ))}
              <DataBox x={60} y={156} w={360} h={32} label="자체 인증 체인 + pre-launch 검증 워크플로우" color={C.flow} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

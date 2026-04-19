import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Loader & 번들 경로 설정', body: 'sgx_loader: oasis-core-runtime-loader 바이너리.\npaths: 로딩할 .orc 번들 목록.' },
  { label: 'Attestation 정책 — DCAP QVL', body: 'quote_policy: tdx_or_sgx (혼합 허용).\npccs_url: PCS 프록시 (옵션).' },
  { label: 'Expected MRENCLAVE — governance 승인값', body: 'expected_mrenclave 목록과 매칭되어야 등록 통과.\n신규 enclave 는 거버넌스 갱신 후 추가.' },
  { label: 'TCB 정책 — min evaluation status', body: 'min_tcb_evaluation_status: up_to_date.\n구버전 microcode 는 거부, 보안 패치 강제.' },
  { label: 'Registry 등록 — 3가지 검증', body: 'Quote validator check + MRENCLAVE governance + TCB status policy.\n전부 통과해야 컴퓨트 노드로 동작.' },
];

const FIELDS = [
  { name: 'sgx_loader',         color: '#6366f1', value: 'runtime-loader path' },
  { name: 'paths[]',            color: '#3b82f6', value: '.orc bundles' },
  { name: 'quote_policy',       color: '#10b981', value: 'tdx_or_sgx' },
  { name: 'pccs_url',           color: '#10b981', value: 'pccs.oasis.network' },
  { name: 'expected_mrenclave', color: '#f59e0b', value: '0x3e1c1c7e...' },
  { name: 'min_tcb_status',     color: '#a855f7', value: 'up_to_date' },
];

const HIGHLIGHT = [
  [0, 1],
  [2, 3],
  [4],
  [5],
  [], // step 4 = registration
];

export default function TeeNodeConfigViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* config.yaml block */}
          <ModuleBox x={20} y={15} w={250} h={200} label="config.yaml" color="#6366f1" />

          {FIELDS.map((f, i) => {
            const lit = HIGHLIGHT[step].includes(i);
            return (
              <g key={f.name}>
                <motion.g animate={{ opacity: lit ? 1 : 0.4 }}>
                  <DataBox x={35} y={45 + i * 28} w={220} h={22}
                    label={`${f.name}: ${f.value}`} color={f.color} outlined={lit} />
                </motion.g>
              </g>
            );
          })}

          {/* Right side: registration check */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={290} y={20} w={170} h={44}
                label="Registry validate" color="#a855f7" />
              <ActionBox x={290} y={80} w={170} h={32}
                label="Quote validator" sub="signature ok" color="#10b981" />
              <ActionBox x={290} y={120} w={170} h={32}
                label="MRENCLAVE governance" sub="approved" color="#f59e0b" />
              <ActionBox x={290} y={160} w={170} h={32}
                label="TCB status policy" sub="up_to_date" color="#3b82f6" />
              <text x={375} y={210} textAnchor="middle" fontSize={9}
                fill="#10b981" fontWeight={600}>모두 통과 → 활성</text>
            </motion.g>
          )}

          {/* per step description */}
          {step !== 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {step === 0 && (
                <text x={375} y={130} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                  loader + paths 가 노드의 시작점
                </text>
              )}
              {step === 1 && (
                <text x={375} y={130} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                  PCS proxy → quote 검증
                </text>
              )}
              {step === 2 && (
                <text x={375} y={130} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                  governance 승인값과 매칭
                </text>
              )}
              {step === 3 && (
                <text x={375} y={130} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                  미패치 노드 거부
                </text>
              )}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

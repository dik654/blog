import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  src: '#0ea5e9',
  tgt: '#10b981',
  cert: '#8b5cf6',
  tek: '#f59e0b',
  bad: '#ef4444',
};

const STEPS = [
  { label: '① Target ASP가 PDH cert 발급', body: 'OCA → PEK → PDH 체인, PEK로 서명' },
  { label: '② Source가 PDH 체인 검증 (AMD root까지)', body: 'Target이 진짜 AMD platform인지 확인 + policy 체크' },
  { label: '③ Source도 자신의 PDH cert 생성', body: '양쪽 신원 교환 완료' },
  { label: '④ ECDH로 공통 세션 키(TEK) 도출', body: '양쪽이 동일한 TEK 산출 — 상호 인증 완료' },
];

export default function MigrationAuthViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={26} w={140} h={50} label="Source ASP" sub="송신측" color={C.src} />
          <ModuleBox x={320} y={26} w={140} h={50} label="Target ASP" sub="수신측" color={C.tgt} />

          {/* Step 0: target → source PDH */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.15 }}>
            <motion.line x1={320} y1={50} x2={160} y2={50}
              stroke={C.cert} strokeWidth={1.2} markerEnd="url(#ma1)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <text x={240} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cert}>Target PDH cert</text>
          </motion.g>

          {/* Step 1: source verifies */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }}>
            <ActionBox x={20} y={86} w={210} h={42} label="verify_cert_chain" sub="OCA→PEK→PDH→AMD root" color={C.cert} />
            {step >= 1 && (
              <motion.text x={20} y={140} fontSize={9} fill={C.cert} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ✓ AMD genuine + policy OK
              </motion.text>
            )}
          </motion.g>

          {/* Step 2: source PDH out */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
            <motion.line x1={160} y1={70} x2={320} y2={70}
              stroke={C.cert} strokeWidth={1.2} markerEnd="url(#ma2)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
            <text x={240} y={66} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cert}>Source PDH cert</text>
          </motion.g>

          {/* Step 3: ECDH */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={20} y={150} w={210} h={42} label="ecdh(src_priv, tgt_pub)" sub="= TEK_src" color={C.tek} />
              <ActionBox x={250} y={150} w={210} h={42} label="ecdh(tgt_priv, src_pub)" sub="= TEK_tgt" color={C.tek} />
              <motion.line x1={120} y1={200} x2={240} y2={216}
                stroke={C.tek} strokeWidth={0.8} strokeDasharray="2 2" />
              <motion.line x1={360} y1={200} x2={240} y2={216}
                stroke={C.tek} strokeWidth={0.8} strokeDasharray="2 2" />
              <DataBox x={170} y={210} w={140} h={26} label="TEK 동일!" color={C.tek} outlined />
            </motion.g>
          )}

          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={140} y={156} w={210} h={36}
                label="실패 시 ERR_INVALID_PLATFORM"
                color={C.bad} outlined />
            </motion.g>
          )}

          <defs>
            <marker id="ma1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.cert} />
            </marker>
            <marker id="ma2" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.cert} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}

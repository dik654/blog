import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'NEW — 생성 직후',
    body: 'RMI_REALM_CREATE 결과.\nDATA_CREATE / RTT_CREATE / REC_CREATE 가능.\n측정값(RIM)이 누적되는 단계.',
  },
  {
    label: 'NEW → ACTIVE',
    body: 'RMI_REALM_ACTIVATE 호출 → RIM 확정 (이후 변경 불가).\nREC_ENTER 가능해짐.',
  },
  {
    label: 'ACTIVE → SYSTEM_OFF',
    body: 'Realm 내부에서 PSCI_SYSTEM_OFF 호출 시 또는 Host의 DESTROY 요청.\nACTIVE 상태에선 REC를 먼저 destroy 해야 함.',
  },
  {
    label: 'NEW → DELETED',
    body: 'NEW 상태에서 미활성화 채로 RMI_REALM_DESTROY.\nACTIVE 거치지 않은 폐기 경로.',
  },
];

export default function RealmStateMachineViz() {
  const NEW_HL = '#3b82f6';
  const ACT_HL = '#10b981';
  const OFF_HL = '#ef4444';

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">enum realm_state — 전이 그래프</text>

          <defs>
            <marker id="rsm-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
            </marker>
          </defs>

          <motion.g animate={{ scale: step === 0 ? 1.05 : 1 }} transition={{ duration: 0.3 }}>
            <ModuleBox x={30} y={70} w={110} h={50}
              label="REALM_NEW" sub="DATA/RTT/REC 추가 가능" color={NEW_HL} />
          </motion.g>

          <motion.g animate={{ scale: step === 1 ? 1.05 : 1 }} transition={{ duration: 0.3 }}>
            <ModuleBox x={185} y={70} w={110} h={50}
              label="REALM_ACTIVE" sub="REC_ENTER 가능" color={ACT_HL} />
          </motion.g>

          <motion.g animate={{ scale: step === 2 ? 1.05 : 1 }} transition={{ duration: 0.3 }}>
            <ModuleBox x={340} y={70} w={120} h={50}
              label="SYSTEM_OFF" sub="종료" color={OFF_HL} />
          </motion.g>

          {/* Edges */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.3 }}>
            <line x1={140} y1={95} x2={185} y2={95}
              stroke={step === 1 ? '#10b981' : '#94a3b8'} strokeWidth={1.4}
              markerEnd="url(#rsm-arr)" />
            <text x={162} y={88} textAnchor="middle" fontSize={6.5} fontWeight={700}
              fill="#10b981">ACTIVATE</text>
          </motion.g>

          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <line x1={295} y1={95} x2={340} y2={95}
              stroke={step === 2 ? '#ef4444' : '#94a3b8'} strokeWidth={1.4}
              markerEnd="url(#rsm-arr)" />
            <text x={317} y={88} textAnchor="middle" fontSize={6.5} fontWeight={700}
              fill="#ef4444">PSCI_OFF</text>
          </motion.g>

          {/* DELETED path */}
          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.3 }}>
            <path d="M 85 120 Q 85 170 240 170" stroke={step === 3 ? '#ef4444' : '#94a3b8'}
              strokeWidth={1.2} fill="none" strokeDasharray="3 3" markerEnd="url(#rsm-arr)" />
            <text x={160} y={165} textAnchor="middle" fontSize={6.5} fontWeight={700}
              fill="#ef4444">RMI_REALM_DESTROY</text>
            <ActionBox x={240} y={155} w={120} h={32}
              label="DELETED" sub="미활성화 폐기" color="#94a3b8" />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}

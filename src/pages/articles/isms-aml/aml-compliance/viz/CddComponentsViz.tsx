import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  id: '#6366f1',
  verify: '#10b981',
  bo: '#f59e0b',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: 'CDD 3요소 흐름',
    body: '신원확인(수집) → 신원검증(대조) → 실제소유자 확인(법인). 세 요소가 순차적으로 완료되어야 CDD 성립.',
  },
  {
    label: 'CDD 미이행 시 자동 제한',
    body: 'CDD 미완료 계정은 자동으로 제한 상태 전환. 입출금·거래 불가, 기간 초과 시 계정 해지까지 진행.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cdd-comp-arrow)" />;
}

export default function CddComponentsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cdd-comp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 3요소 순차 흐름</text>

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={35} w={120} h={55} label="1. 신원확인" sub="이름·생년·주소 수집" color={C.id} />
              </motion.g>
              <Arrow x1={140} y1={62} x2={170} y2={62} color={C.id} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <ActionBox x={173} y={35} w={130} h={55} label="2. 신원검증" sub="신분증 대조·eKYC" color={C.verify} />
              </motion.g>
              <Arrow x1={303} y1={62} x2={333} y2={62} color={C.verify} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={336} y={35} w={130} h={55} label="3. 실제소유자" sub="25% 이상 지분자 추적" color={C.bo} />
              </motion.g>

              {/* 하단: 법인 특화 */}
              <rect x={336} y={95} width={130} height={1} stroke={C.bo} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={401} y={110} textAnchor="middle" fontSize={8} fill={C.bo}>법인 고객 필수</text>
              <text x={401} y={122} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">다단계 구조 시 최상위까지</text>

              <DataBox x={150} y={140} w={180} h={32} label="3요소 모두 완료 → CDD 성립" color={C.verify} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 미이행 시 자동 제한 절차</text>

              <ActionBox x={170} y={35} w={140} h={40} label="CDD 미완료 감지" sub="시스템 자동 판별" color={C.id} />
              <Arrow x1={240} y1={75} x2={240} y2={90} color={C.warn} />

              <AlertBox x={155} y={93} w={170} h={35} label="계정 제한 상태 전환" sub="자동 적용" color={C.warn} />

              <Arrow x1={155} y1={128} x2={70} y2={143} color={C.warn} />
              <Arrow x1={240} y1={128} x2={240} y2={143} color={C.warn} />
              <Arrow x1={325} y1={128} x2={400} y2={143} color={C.warn} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <AlertBox x={15} y={146} w={115} h={40} label="신규 가입 중단" sub="실명인증 전까지" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={170} y={146} w={140} h={40} label="입출금·거래 정지" sub="재확인 완료 전까지" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <AlertBox x={350} y={146} w={115} h={40} label="계정 해지" sub="기간 초과 시" color={C.warn} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

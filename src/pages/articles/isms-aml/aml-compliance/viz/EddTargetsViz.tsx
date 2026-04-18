import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  pep: '#ef4444',
  risk: '#f59e0b',
  law: '#6366f1',
  accept: '#10b981',
};

const STEPS = [
  {
    label: 'EDD 대상과 추가 확인',
    body: 'PEP, 고위험국 거주자, 복잡한 법인, 비대면 거래 — 각 대상별로 자금 출처, 지배구조, 추가 검증이 요구된다.',
  },
  {
    label: '고객수용정책 판단 흐름',
    body: 'CDD 결과에 따라 수용/거절/종료를 결정. 위조 신분증, 제재 대상, 자금출처 미소명 등이 거절 사유.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#edd-tgt-arrow)" />;
}

export default function EddTargetsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="edd-tgt-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">EDD 대상별 추가 확인 항목</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <AlertBox x={15} y={35} w={100} h={45} label="PEP" sub="정치적 주요인물" color={C.pep} />
              </motion.g>
              <Arrow x1={115} y1={57} x2={135} y2={57} color={C.pep} />
              <DataBox x={138} y={42} w={110} h={30} label="자금출처·재산형성" color={C.pep} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <AlertBox x={15} y={92} w={100} h={45} label="고위험국" sub="이란·북한 등" color={C.risk} />
              </motion.g>
              <Arrow x1={115} y1={114} x2={135} y2={114} color={C.risk} />
              <DataBox x={138} y={99} w={110} h={30} label="거래목적·지속감시" color={C.risk} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={270} y={35} w={100} h={45} label="복잡 법인" sub="다단계 구조" color={C.law} />
              </motion.g>
              <Arrow x1={370} y1={57} x2={390} y2={57} color={C.law} />
              <DataBox x={393} y={42} w={75} h={30} label="지배구조도" color={C.law} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <AlertBox x={270} y={92} w={100} h={45} label="비대면" sub="사칭 위험" color={C.law} />
              </motion.g>
              <Arrow x1={370} y1={114} x2={390} y2={114} color={C.law} />
              <DataBox x={393} y={99} w={75} h={30} label="영상통화" color={C.law} />

              <rect x={15} y={153} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={173} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">일반 CDD로는 위험 통제 불가 → EDD로 강화</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">고객수용정책 판단 흐름</text>

              <ActionBox x={180} y={30} w={120} h={38} label="CDD 결과 확인" sub="신원·검증·위험" color={C.law} />

              <Arrow x1={180} y1={55} x2={70} y2={85} color={C.accept} />
              <Arrow x1={240} y1={68} x2={240} y2={85} color={C.risk} />
              <Arrow x1={300} y1={55} x2={400} y2={85} color={C.pep} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <ModuleBox x={15} y={88} w={110} h={45} label="수용" sub="정상 거래 개시" color={C.accept} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <AlertBox x={175} y={88} w={130} h={45} label="거절" sub="위조·제재·미소명" color={C.risk} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <AlertBox x={350} y={88} w={115} h={45} label="거래 종료" sub="갱신 거부·반복 의심" color={C.pep} />
              </motion.g>

              <text x={240} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래 종료 시에도 STR 보고 필요 여부 검토 + 기록 5년 보관</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

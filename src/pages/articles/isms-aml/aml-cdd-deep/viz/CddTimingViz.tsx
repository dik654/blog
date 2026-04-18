import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  trigger: '#6366f1',
  action: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: 'CDD 이행 시점 4가지',
    body: '계좌 신규 개설, 일회성 고액 거래, 자금세탁 의심, 기존 정보 의심 — 각 시점마다 CDD를 수행해야 한다.',
  },
  {
    label: 'CDD 3요소와 미이행 제재',
    body: '신원확인 + 신원검증 + 거래목적 확인. 3가지 모두 충족해야 적법. 미이행 시 과태료부터 신고 취소까지.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cdd-timing-arrow)" />;
}

export default function CddTimingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cdd-timing-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 수행 트리거 4가지</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={35} w={100} h={50} label="계좌 개설" sub="진입 통제" color={C.trigger} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={140} y={35} w={100} h={50} label="고액 거래" sub="기준 초과 시" color={C.trigger} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={260} y={35} w={100} h={50} label="세탁 의심" sub="FDS/수동 감지" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={380} y={35} w={85} h={50} label="정보 의심" sub="신뢰도 하락" color={C.warn} />
              </motion.g>

              {/* 모두 CDD 수행으로 연결 */}
              <Arrow x1={70} y1={85} x2={200} y2={115} color={C.trigger} />
              <Arrow x1={190} y1={85} x2={220} y2={115} color={C.trigger} />
              <Arrow x1={310} y1={85} x2={260} y2={115} color={C.warn} />
              <Arrow x1={422} y1={85} x2={280} y2={115} color={C.warn} />

              <DataBox x={160} y={118} w={160} h={32} label="CDD 수행 (재수행)" color={C.action} />
              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"한 번 하고 끝"이 아닌 지속적 의무</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 3요소 → 미이행 제재</text>

              <ActionBox x={30} y={35} w={120} h={40} label="신원확인" sub="정보 수집" color={C.trigger} />
              <Arrow x1={150} y1={55} x2={170} y2={55} color={C.trigger} />
              <ActionBox x={173} y={35} w={120} h={40} label="신원검증" sub="독립 출처 대조" color={C.action} />
              <Arrow x1={293} y1={55} x2={313} y2={55} color={C.action} />
              <ActionBox x={316} y={35} w={130} h={40} label="거래목적 확인" sub="baseline 설정" color={C.action} />

              <rect x={30} y={95} width={416} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>미이행 시 다단계 제재</text>

              <AlertBox x={20} y={120} w={100} h={38} label="과태료" sub="최대 3천만 원" color={C.warn} />
              <Arrow x1={120} y1={139} x2={135} y2={139} color={C.warn} />
              <AlertBox x={138} y={120} w={100} h={38} label="영업정지" sub="6개월 이내" color={C.warn} />
              <Arrow x1={238} y1={139} x2={253} y2={139} color={C.warn} />
              <AlertBox x={256} y={120} w={100} h={38} label="신고 취소" sub="폐업" color={C.warn} />
              <Arrow x1={356} y1={139} x2={371} y2={139} color={C.warn} />
              <AlertBox x={374} y={120} w={85} h={38} label="형사처벌" sub="5년/5천만" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

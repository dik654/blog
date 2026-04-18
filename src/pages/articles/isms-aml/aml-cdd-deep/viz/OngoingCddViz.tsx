import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  periodic: '#6366f1',
  trigger: '#f59e0b',
  risk: '#ef4444',
};

const STEPS = [
  {
    label: '지속적 고객확인 3가지 방식',
    body: '정기 갱신(위험등급별 주기) + 위험등급 재평가(패턴 변화) + 트리거 기반 갱신(이벤트 즉시). 세 방식 병행.',
  },
  {
    label: 'CDD 거부 시 대응 흐름',
    body: '고객이 정보 제공을 거부하면 거래 거절 → 기존 관계 종료(off-boarding) → 거부 자체가 STR 사유가 될 수 있음.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ongoing-cdd-arrow)" />;
}

export default function OngoingCddViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ongoing-cdd-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">지속적 CDD 3가지 방식</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={35} w={130} h={55} label="정기 갱신" sub="고위험 1년/중 2년/저 3년" color={C.periodic} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={175} y={35} w={130} h={55} label="위험등급 재평가" sub="패턴·상대방·탐지 종합" color={C.trigger} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={330} y={35} w={130} h={55} label="트리거 기반" sub="고액·제재변경·보도" color={C.risk} />
              </motion.g>

              {/* 모두 CDD 재수행으로 연결 */}
              <Arrow x1={85} y1={90} x2={200} y2={115} color={C.periodic} />
              <Arrow x1={240} y1={90} x2={240} y2={115} color={C.trigger} />
              <Arrow x1={395} y1={90} x2={280} y2={115} color={C.risk} />

              <DataBox x={160} y={118} w={160} h={30} label="CDD 재수행" color={C.periodic} />

              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">저위험 → 고위험 전환 예: 고위험국과 빈번한 거래 시작</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 거부 시 대응</text>

              <ActionBox x={170} y={35} w={140} h={38} label="고객 정보 제공 거부" sub="" color={C.risk} />

              <Arrow x1={170} y1={60} x2={75} y2={90} color={C.risk} />
              <Arrow x1={240} y1={73} x2={240} y2={90} color={C.risk} />
              <Arrow x1={310} y1={60} x2={395} y2={90} color={C.trigger} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <AlertBox x={15} y={93} w={120} h={42} label="거래 거절" sub="신규 거래 불가" color={C.risk} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <AlertBox x={175} y={93} w={130} h={42} label="거래 관계 종료" sub="off-boarding" color={C.risk} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <AlertBox x={345} y={93} w={120} h={42} label="STR 검토" sub="거부 자체가 사유" color={C.trigger} />
              </motion.g>

              <rect x={15} y={155} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">갱신 거부 = 의심 신호. 기존 고객이라도 예외 없이 적용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  step: '#6366f1',
  risk: '#f59e0b',
  ctrl: '#10b981',
};

const STEPS = [
  {
    label: '위험평가 4단계 흐름',
    body: '식별(어디서) → 분석(얼마나) → 평가(잔여위험) → 지속(반복). 고유위험에서 통제 효과를 빼면 잔여위험.',
  },
  {
    label: '잔여위험 산출 원리',
    body: '잔여위험 = 고유위험 - 통제 효과. 통제가 강하면 잔여위험이 낮아지지만 "0"은 불가능.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rsk-step-arrow)" />;
}

export default function RiskAssessmentStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rsk-step-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">위험평가 4단계</text>

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={35} w={95} h={50} label="1. 식별" sub="위험 발생지 탐색" color={C.step} />
              </motion.g>
              <Arrow x1={110} y1={60} x2={130} y2={60} color={C.step} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={133} y={35} w={95} h={50} label="2. 분석" sub="가능성 x 영향" color={C.risk} />
              </motion.g>
              <Arrow x1={228} y1={60} x2={248} y2={60} color={C.risk} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={251} y={35} w={95} h={50} label="3. 평가" sub="잔여위험 산출" color={C.ctrl} />
              </motion.g>
              <Arrow x1={346} y1={60} x2={366} y2={60} color={C.ctrl} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={369} y={35} w={95} h={50} label="4. 지속" sub="연 1회+ 반복" color={C.step} />
              </motion.g>

              {/* 순환 화살표 표시 */}
              <path d="M 464 60 Q 472 130 240 140 Q 8 130 5 60" fill="none" stroke={C.step} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#rsk-step-arrow)" />
              <text x={240} y={158} textAnchor="middle" fontSize={8} fill={C.step}>연 1회 이상 전사 재평가</text>

              {/* 4차원 위험 요소 */}
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">위험 4차원: 고객 · 상품/서비스 · 지역 · 거래 채널</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">잔여위험 산출</text>

              <StatusBox x={40} y={40} w={130} h={50} label="고유위험(Inherent)" sub="통제 전 위험 수준" color={C.risk} progress={0.85} />

              <text x={195} y={70} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--muted-foreground)">-</text>

              <StatusBox x={215} y={40} w={130} h={50} label="통제 효과(Control)" sub="FDS·EDD·정책 등" color={C.ctrl} progress={0.6} />

              <text x={370} y={70} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--muted-foreground)">=</text>

              <StatusBox x={390} y={40} w={80} h={50} label="잔여위험" sub="수용 가능?" color={C.risk} progress={0.25} />

              <rect x={40} y={115} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={120} y={125} w={240} h={42} label="잔여위험은 절대 0이 될 수 없다" sub="목표: 수용 가능 수준까지 낮추기" color={C.risk} />
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">새로운 세탁 수법 · 시스템 장애 · 인적 오류 → 항상 잔여위험 존재</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

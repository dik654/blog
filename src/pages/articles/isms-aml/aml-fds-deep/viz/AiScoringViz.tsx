import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  feature: '#6366f1',
  model: '#f59e0b',
  score: '#ef4444',
  act: '#10b981',
};

const STEPS = [
  {
    label: '실시간 스코어링 파이프라인',
    body: '특성 추출(수백 개) → 모델 추론(100ms 이내) → 점수 매핑(0~100) → 경보 연동(자동 배정).',
  },
  {
    label: 'XAI — 설명 가능성의 필요',
    body: '"왜 의심스러운지" 설명 불가하면 규제 적정성 인정 못 받음. SHAP·LIME으로 개별 예측 근거를 수치화.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ai-score-arrow)" />;
}

export default function AiScoringViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ai-score-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">실시간 스코어링 4단계</text>

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={35} w={95} h={55} label="특성 추출" sub="수백 개 실시간" color={C.feature} />
              </motion.g>
              <Arrow x1={110} y1={62} x2={130} y2={62} color={C.feature} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={133} y={35} w={95} h={55} label="모델 추론" sub="100ms 이내" color={C.model} />
              </motion.g>
              <Arrow x1={228} y1={62} x2={248} y2={62} color={C.model} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <StatusBox x={251} y={35} w={95} h={55} label="점수 매핑" sub="0~100점" color={C.score} progress={0.7} />
              </motion.g>
              <Arrow x1={346} y1={62} x2={366} y2={62} color={C.score} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={369} y={35} w={95} h={55} label="경보 연동" sub="자동 배정" color={C.act} />
              </motion.g>

              {/* 임계값 */}
              <rect x={251} y={100} width={95} height={1} stroke={C.score} strokeWidth={0.5} strokeDasharray="3 2" />
              <DataBox x={15} y={110} w={140} h={25} label="70+: 높음 (정지 검토)" color={C.score} />
              <DataBox x={170} y={110} w={140} h={25} label="40~69: 중간 (모니터링)" color={C.model} />
              <DataBox x={325} y={110} w={140} h={25} label="39 이하: 낮음 (정상)" color={C.act} />

              <text x={240} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 입출금을 실시간 검사 — 누적 수천억 원 규모 이상거래 차단</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">XAI: 설명 가능한 AI</text>

              <ActionBox x={30} y={40} w={120} h={45} label="AI 모델 예측" sub="위험 확률 산출" color={C.model} />
              <Arrow x1={150} y1={62} x2={180} y2={62} color={C.model} />

              <text x={170} y={55} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">왜?</text>

              {/* SHAP */}
              <ActionBox x={183} y={35} w={130} h={25} label="SHAP" sub="" color={C.feature} />
              <text x={248} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">특성별 기여도 수치화</text>

              {/* LIME */}
              <ActionBox x={183} y={75} w={130} h={25} label="LIME" sub="" color={C.feature} />
              <text x={248} y={112} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">로컬 근사 모델로 설명</text>

              <Arrow x1={313} y1={62} x2={343} y2={62} color={C.feature} />

              <DataBox x={346} y={45} w={120} h={35} label="판단 근거 제시" color={C.act} />

              <rect x={30} y={130} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={80} y={140} w={320} h={42} label="설명 불가 모델 = 규제 적정성 인정 불가" sub="사람이 최종 판단, AI는 근거를 제공" color={C.score} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

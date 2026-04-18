import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = {
  cluster: '#6366f1',
  graph: '#10b981',
  label: '#f59e0b',
  score: '#ef4444',
};

const STEPS = [
  {
    label: '온체인 분석 4기법',
    body: '클러스터링(동일 소유자 묶기) → 그래프 추적(경로 시각화) → 라벨링(엔티티 태깅) → 위험 점수(자동 산정).',
  },
  {
    label: 'AI 에이전트의 등장',
    body: '2026년 현재 가장 주목할 변화. 자연어 질의로 분석, 수백만 건 조사 데이터 학습, 숙련 분석가 수준의 패턴 인식 자동화.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#onchain-tech-arrow)" />;
}

export default function OnchainTechniquesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="onchain-tech-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">온체인 분석 4기법</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={35} w={100} h={55} label="1. 클러스터링" sub="동일 소유자 묶기" color={C.cluster} />
              </motion.g>
              <Arrow x1={120} y1={62} x2={140} y2={62} color={C.cluster} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={143} y={35} w={100} h={55} label="2. 그래프 추적" sub="경로 시각화" color={C.graph} />
              </motion.g>
              <Arrow x1={243} y1={62} x2={263} y2={62} color={C.graph} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={266} y={35} w={95} h={55} label="3. 라벨링" sub="엔티티 태깅" color={C.label} />
              </motion.g>
              <Arrow x1={361} y1={62} x2={381} y2={62} color={C.label} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={384} y={35} w={80} h={55} label="4. 위험 점수" sub="0~100 산정" color={C.score} />
              </motion.g>

              {/* 세부 설명 */}
              <rect x={20} y={108} width={444} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={20} y={118} w={100} h={25} label="공통 입력 소유권" color={C.cluster} />
              <DataBox x={143} y={118} w={100} h={25} label="홉(hop) 추적" color={C.graph} />
              <DataBox x={266} y={118} w={95} h={25} label="수억 개 주소" color={C.label} />
              <DataBox x={384} y={118} w={80} h={25} label="임계값 설정" color={C.score} />

              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">클러스터링 정확도가 전체 분석 신뢰도를 결정 — CoinJoin은 의도적 무력화 수법</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">AI 에이전트 기반 분석 (2026~)</text>

              <ModuleBox x={30} y={40} w={180} h={50} label="자연어 질의" sub='"이 주소에서 믹서 경유 거래 조회"' color={C.cluster} />
              <Arrow x1={210} y1={65} x2={245} y2={65} color={C.cluster} />

              <ModuleBox x={248} y={40} w={200} h={50} label="AI 에이전트" sub="수백만 건 조사 데이터 학습" color={C.score} />

              <Arrow x1={348} y1={90} x2={200} y2={115} color={C.score} />
              <Arrow x1={348} y1={90} x2={348} y2={115} color={C.score} />

              <DataBox x={110} y={118} w={180} h={28} label="결정론적 모드 (규제 검증)" color={C.graph} />
              <DataBox x={310} y={118} w={150} h={28} label="탐색적 모드 (신규 위협)" color={C.label} />

              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">숙련 분석가 수준 패턴 인식 자동화 — 인력 확장의 병목 해소</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

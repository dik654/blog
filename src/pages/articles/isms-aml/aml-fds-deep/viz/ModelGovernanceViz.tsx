import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  perf: '#6366f1',
  drift: '#f59e0b',
  retrain: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '모델 검증 5항목 주기',
    body: '성능 지표(월) → 드리프트 감지(월) → 설명 가능성(분기) → 편향 검사(반기) → 재학습(연). 배포 후에도 지속 모니터링.',
  },
  {
    label: '블랙리스트 실시간 갱신 체계',
    body: 'OFAC SDN, FATF 목록, 분석 업체 인텔리전스, 내부 블랙리스트 — 최선은 실시간 API, 최소 일 1회.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#model-gov-arrow)" />;
}

export default function ModelGovernanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="model-gov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">모델 검증 주기</text>

              {/* 타임라인 바 */}
              <line x1={30} y1={55} x2={450} y2={55} stroke="var(--border)" strokeWidth={1.5} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <circle cx={65} cy={55} r={5} fill={C.perf} />
                <text x={65} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.perf}>월 1회</text>
                <text x={65} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">성능 지표</text>
                <text x={65} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">P/R/F1</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <circle cx={155} cy={55} r={5} fill={C.drift} />
                <text x={155} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.drift}>월 1회</text>
                <text x={155} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">드리프트</text>
                <text x={155} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">감지</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <circle cx={245} cy={55} r={5} fill={C.perf} />
                <text x={245} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.perf}>분기 1회</text>
                <text x={245} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">설명 가능성</text>
                <text x={245} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">SHAP/LIME</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <circle cx={335} cy={55} r={5} fill={C.drift} />
                <text x={335} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.drift}>반기 1회</text>
                <text x={335} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">편향 검사</text>
                <text x={335} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">특정 고객군</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <circle cx={425} cy={55} r={5} fill={C.retrain} />
                <text x={425} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.retrain}>연 1회+</text>
                <text x={425} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">모델</text>
                <text x={425} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">재학습</text>
              </motion.g>

              <DataBox x={110} y={110} w={260} h={30} label="배포 후에도 지속 모니터링 = 모델 거버넌스" color={C.perf} />
              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래 패턴 변화 시 모델 성능 급감(데이터 드리프트) → 조기 감지 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">블랙리스트 갱신 체계</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={40} w={100} h={45} label="OFAC SDN" sub="제재 주소 (수시)" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={140} y={40} w={100} h={45} label="FATF 목록" sub="고위험국 (정기)" color={C.drift} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={260} y={40} w={100} h={45} label="분석 업체" sub="위협 인텔리전스" color={C.perf} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={380} y={40} w={85} h={45} label="내부" sub="자체 조사 결과" color={C.retrain} />
              </motion.g>

              <Arrow x1={70} y1={85} x2={190} y2={110} color={C.warn} />
              <Arrow x1={190} y1={85} x2={210} y2={110} color={C.drift} />
              <Arrow x1={310} y1={85} x2={260} y2={110} color={C.perf} />
              <Arrow x1={422} y1={85} x2={280} y2={110} color={C.retrain} />

              <StatusBox x={155} y={113} w={170} h={45} label="FDS 실시간 반영" sub="최선: API / 최소: 일 1회" color={C.warn} progress={0.9} />

              <AlertBox x={90} y={170} w={300} h={25} label="갱신 지연 = 제재 주소 거래 놓침" sub="" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

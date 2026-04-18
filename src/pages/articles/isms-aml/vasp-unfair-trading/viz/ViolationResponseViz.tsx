import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  step1: '#ef4444',
  step2: '#f59e0b',
  step3: '#6366f1',
  step4: '#10b981',
};

const STEPS = [
  { label: '위반 시 내부 조치 5단계', body: '초동조치(즉시차단) → 내부조사(증거수집) → 인사조치(징계) → 외부신고(수사기관) → 재발방지(규정보강).' },
  { label: '5층 방어 체계', body: '제도적 예방 → 기술적 탐지 → 인적 통제 → 내부 제재 → 외부 제재. 각 층이 독립적으로 작동하며 서로 보완.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#vr-arrow)" />;
}

export default function ViolationResponseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="vr-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">위반 시 내부 조치 흐름</text>

              <AlertBox x={5} y={30} w={82} h={42} label="1.초동조치" sub="접근 즉시 차단" color={C.step1} />
              <Arrow x1={87} y1={51} x2={99} y2={51} color={C.step1} />

              <ActionBox x={101} y={30} w={82} h={42} label="2.내부조사" sub="증거 수집·분석" color={C.step2} />
              <Arrow x1={183} y1={51} x2={195} y2={51} color={C.step2} />

              <ActionBox x={197} y={30} w={82} h={42} label="3.인사조치" sub="경고~해고" color={C.step3} />
              <Arrow x1={279} y1={51} x2={291} y2={51} color={C.step3} />

              <ActionBox x={293} y={30} w={82} h={42} label="4.외부신고" sub="수사기관·금감원" color={C.step1} />
              <Arrow x1={375} y1={51} x2={387} y2={51} color={C.step4} />

              <ActionBox x={389} y={30} w={82} h={42} label="5.재발방지" sub="규정·시스템 보강" color={C.step4} />

              {/* Key points */}
              <rect x={20} y={90} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={20} y={105} w={200} h={30} label="초동 속도가 핵심" color={C.step1} />
              <text x={20} y={150} fontSize={8} fill="var(--muted-foreground)">증거 인멸·추가 부정 방지를 위해 즉시 차단</text>

              <DataBox x={260} y={105} w={200} h={30} label="수사기관 동시 진행 권장" color={C.step2} />
              <text x={260} y={150} fontSize={8} fill="var(--muted-foreground)">내부 조사 완료 대기 중 증거 훼손 방지</text>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">포렌식 보전(forensic preservation): 관련 데이터 즉시 보전</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">5층 중첩 방어 체계</text>

              {/* Layered defense */}
              <rect x={40} y={30} width={400} height={30} rx={6} fill={`${C.step4}15`} stroke={C.step4} strokeWidth={0.6} />
              <text x={50} y={50} fontSize={9} fontWeight={600} fill={C.step4}>1층 제도적 예방</text>
              <text x={200} y={50} fontSize={8} fill="var(--muted-foreground)">거래 제한 / 차단벽 / 자기발행 금지</text>

              <rect x={40} y={65} width={400} height={30} rx={6} fill={`${C.step3}15`} stroke={C.step3} strokeWidth={0.6} />
              <text x={50} y={85} fontSize={9} fontWeight={600} fill={C.step3}>2층 기술적 탐지</text>
              <text x={200} y={85} fontSize={8} fill="var(--muted-foreground)">자동 감시 / 규칙·AI 패턴 탐지</text>

              <rect x={40} y={100} width={400} height={30} rx={6} fill={`${C.step2}15`} stroke={C.step2} strokeWidth={0.6} />
              <text x={50} y={120} fontSize={9} fontWeight={600} fill={C.step2}>3층 인적 통제</text>
              <text x={200} y={120} fontSize={8} fill="var(--muted-foreground)">준법감시인 / 내부 신고 / 정기 교육</text>

              <rect x={40} y={135} width={400} height={30} rx={6} fill={`${C.step1}15`} stroke={C.step1} strokeWidth={0.6} />
              <text x={50} y={155} fontSize={9} fontWeight={600} fill={C.step1}>4층 내부 제재</text>
              <text x={200} y={155} fontSize={8} fill="var(--muted-foreground)">인사징계 / 해고 / 손해배상</text>

              <rect x={40} y={170} width={400} height={30} rx={6} fill={`${C.step1}25`} stroke={C.step1} strokeWidth={0.8} />
              <text x={50} y={190} fontSize={9} fontWeight={600} fill={C.step1}>5층 외부 제재</text>
              <text x={200} y={190} fontSize={8} fill="var(--muted-foreground)">형사처벌 / 과징금 / 업무 정지</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

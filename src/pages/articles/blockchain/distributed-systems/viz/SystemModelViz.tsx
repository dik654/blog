import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '분산 시스템 통신 모델', body: '동기, 비동기, 부분 동기 — 메시지 전달 시간에 대한 가정이 합의 가능성을 결정.' },
  { label: '동기 (Synchronous)', body: '메시지 전달 상한 Δ가 알려짐. 타임아웃 기반 프로토콜 가능. 비현실적이나 분석에 유용.' },
  { label: '비동기 (Asynchronous)', body: '메시지 전달 시간에 상한 없음. FLP 불가능성으로 결정적 합의 불가. 실제 인터넷에 가까움.' },
  { label: '부분 동기 (Partial Synchrony)', body: 'GST(Global Stabilization Time) 이후 Δ 보장. BFT 프로토콜 대부분이 이 모델 채택.' },
];

const MODELS = [
  { label: '동기', sub: 'Δ known', x: 70, color: C1 },
  { label: '부분 동기', sub: 'GST 이후 Δ', x: 210, color: C2 },
  { label: '비동기', sub: 'Δ = ∞', x: 350, color: C3 },
];

export default function SystemModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Timeline */}
          <line x1={30} y1={85} x2={390} y2={85} stroke="var(--border)" strokeWidth={0.8} />
          <text x={30} y={100} fontSize={10} fill="var(--muted-foreground)">제약 강함</text>
          <text x={390} y={100} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">제약 약함</text>
          {/* Model nodes */}
          {MODELS.map((m, i) => {
            const stepMap = [1, 3, 2]; // step 순서: 동기=1, 비동기=2, 부분동기=3
            const active = step === stepMap[i];
            const op = step === 0 || active ? 1 : 0.25;
            return (
              <motion.g key={m.label} animate={{ opacity: op }} transition={{ duration: 0.3 }}>
                <motion.rect x={m.x - 50} y={30} width={100} height={40} rx={6}
                  fill={`${m.color}${active ? '15' : '08'}`} stroke={m.color}
                  strokeWidth={active ? 1.5 : 0.8} />
                <text x={m.x} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={m.color}>
                  {m.label}
                </text>
                <text x={m.x} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                  {m.sub}
                </text>
                {/* Dot on timeline */}
                <circle cx={m.x} cy={85} r={4} fill={m.color} opacity={active ? 1 : 0.4} />
              </motion.g>
            );
          })}
          {/* Arrows between */}
          <line x1={125} y1={50} x2={155} y2={50} stroke="var(--border)" strokeWidth={0.6} />
          <line x1={265} y1={50} x2={295} y2={50} stroke="var(--border)" strokeWidth={0.6} />
          {/* Bottom label */}
          <text x={210} y={125} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            실제 블록체인 — 대부분 부분 동기 모델 채택
          </text>
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: '탐지 방식 3가지: 시그니처 vs 이상행위 vs 프로토콜',
    body: '시그니처 기반은 알려진 공격에 높은 정확도(오탐 적음), 이상행위는 제로데이 탐지 가능(오탐 많음), 프로토콜 분석은 RFC 표준 위반 탐지(암호화 트래픽 한계).',
  },
  {
    label: '배치: 인라인(IPS) vs 미러링(IDS) + 전환 전략',
    body: '초기에 미러링(IDS)으로 시그니처 튜닝 → 오탐 충분히 줄면 인라인(IPS) 전환. IPS 장애 대비 바이패스 모드 설정.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-id-arrow)" />;
}

export default function IdsDetectionInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-id-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={8} w={140} h={36} label="시그니처 기반" sub="Signature-based" color={C.green} />
              <ModuleBox x={170} y={8} w={140} h={36} label="이상행위 기반" sub="Anomaly-based" color={C.amber} />
              <ModuleBox x={330} y={8} w={140} h={36} label="프로토콜 분석" sub="Protocol Analysis" color={C.blue} />

              <Arrow x1={80} y1={46} x2={80} y2={65} color={C.green} />
              <Arrow x1={240} y1={46} x2={240} y2={65} color={C.amber} />
              <Arrow x1={400} y1={46} x2={400} y2={65} color={C.blue} />

              <rect x={10} y={67} width={140} height={40} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={80} y={82} textAnchor="middle" fontSize={9} fill={C.green}>높은 정확도</text>
              <text x={80} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">제로데이 탐지 불가</text>

              <rect x={170} y={67} width={140} height={40} rx={4} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={240} y={82} textAnchor="middle" fontSize={9} fill={C.amber}>제로데이 탐지</text>
              <text x={240} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">오탐 많음 / 학습 필요</text>

              <rect x={330} y={67} width={140} height={40} rx={4} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={400} y={82} textAnchor="middle" fontSize={9} fill={C.blue}>RFC 위반 탐지</text>
              <text x={400} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">HTTPS 분석 한계</text>

              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">세 방식을 병행하여 탐지 범위를 극대화</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={10} w={160} h={34} label="미러링 (IDS 모드)" sub="SPAN 포트 복사본 분석" color={C.blue} />
              <Arrow x1={182} y1={27} x2={218} y2={27} color={C.amber} />
              <text x={200} y={18} textAnchor="middle" fontSize={8} fill={C.amber}>튜닝</text>
              <text x={200} y={40} textAnchor="middle" fontSize={8} fill={C.amber}>2~4주</text>
              <ModuleBox x={220} y={10} w={160} h={34} label="인라인 (IPS 모드)" sub="트래픽 직접 통과·차단" color={C.green} />

              <Arrow x1={100} y1={46} x2={100} y2={68} color={C.blue} />
              <Arrow x1={300} y1={46} x2={300} y2={68} color={C.green} />

              <rect x={20} y={70} width={160} height={36} rx={4} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={100} y={85} textAnchor="middle" fontSize={9} fill="var(--foreground)">서비스 영향 없음</text>
              <text x={100} y={99} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">차단 불가 (탐지만)</text>

              <rect x={220} y={70} width={160} height={36} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={300} y={85} textAnchor="middle" fontSize={9} fill="var(--foreground)">즉시 차단 가능</text>
              <text x={300} y={99} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">오탐 = 서비스 장애</text>

              <AlertBox x={400} y={50} w={70} h={40} label="바이패스" sub="장애 대비" color={C.red} />
              <Arrow x1={382} y1={70} x2={398} y2={70} color={C.red} />

              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">초기 IDS → 오탐 줄면 IPS 전환이 실무 전략</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

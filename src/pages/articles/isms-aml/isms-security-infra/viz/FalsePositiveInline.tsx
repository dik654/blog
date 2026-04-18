import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '오탐 관리: 학습 → 화이트리스트 → 시그니처 튜닝',
    body: '도입 후 2~4주 IDS 모드로 정상 패턴 파악. 반복 오탐은 예외 등록(과다하면 보안 구멍). 시그니처 민감도를 환경에 맞게 조정.',
  },
  {
    label: 'VASP 특화 탐지 규칙',
    body: '비정상 출금 API 대량 호출, 크리덴셜 스터핑(분산 IP 포함), 내부 측면 이동(비표준 포트 스캔), DNS 터널링(비정상 도메인 길이).',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-fp-arrow)" />;
}

export default function FalsePositiveInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-fp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={10} y={15} w={110} h={30} label="초기 학습 기간" sub="2~4주 IDS 모드" color={C.blue} />
              <Arrow x1={122} y1={30} x2={148} y2={30} color={C.blue} />
              <ActionBox x={150} y={15} w={110} h={30} label="화이트리스트" sub="반복 오탐 예외" color={C.amber} />
              <Arrow x1={262} y1={30} x2={288} y2={30} color={C.amber} />
              <ActionBox x={290} y={15} w={110} h={30} label="시그니처 튜닝" sub="민감도 조정" color={C.green} />
              <Arrow x1={402} y1={30} x2={420} y2={30} color={C.green} />
              <DataBox x={422} y={15} w={50} h={30} label="운영" sub="IPS" color={C.green} />

              <Arrow x1={205} y1={47} x2={205} y2={68} color={C.amber} />
              <AlertBox x={120} y={70} w={170} h={30} label="예외 과다 시 보안 구멍" sub="주기적 재검토 필수" color={C.red} />

              <Arrow x1={345} y1={47} x2={345} y2={68} color={C.green} />
              <rect x={260} y={70} width={170} height={30} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={345} y={85} textAnchor="middle" fontSize={9} fill="var(--foreground)">너무 민감 → 오탐 증가</text>
              <text x={345} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">너무 둔감 → 미탐 증가</text>

              <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">오탐(정상을 공격 판단)과 미탐(공격을 놓침) 사이 균형</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={5} w={180} h={26} label="VASP 특화 커스텀 규칙" color={C.red} />
              <Arrow x1={200} y1={33} x2={80} y2={50} color={C.red} />
              <Arrow x1={220} y1={33} x2={200} y2={50} color={C.red} />
              <Arrow x1={280} y1={33} x2={320} y2={50} color={C.red} />
              <Arrow x1={300} y1={33} x2={430} y2={50} color={C.red} />

              <AlertBox x={15} y={52} w={130} h={32} label="비정상 API 호출" sub="출금 API N회/분 초과" color={C.red} />
              <AlertBox x={155} y={52} w={130} h={32} label="크리덴셜 스터핑" sub="순차 로그인 실패" color={C.amber} />
              <AlertBox x={295} y={52} w={100} h={32} label="측면 이동" sub="비표준 포트 스캔" color={C.blue} />
              <AlertBox x={405} y={52} w={65} h={32} label="DNS 터널" sub="비정상 길이" color={C.green} />

              <text x={240} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">일반 웹과 다른 VASP 고유 공격 벡터에 커스텀 규칙 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

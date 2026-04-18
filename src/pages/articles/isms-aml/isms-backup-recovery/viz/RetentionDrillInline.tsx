import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, StatusBox, ActionBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '보존 기간: 법적 의무에 따른 차등 설정',
    body: '일반 운영 데이터 6개월, 전자금융 거래 기록 5년(전자금융거래법), 개인정보 접속 기록 1~2년. CCTV는 전용 NAS에 별도 보관.',
  },
  {
    label: '정기 훈련: 시나리오 → 실제 복원 → 측정 → 보고',
    body: '연 1회+ 복구 모의훈련. 실제 RTO/RPO 측정, 목표 초과 시 빈도·절차·인프라 보강. 결과 보고서는 경영진 보고하여 예산 근거로 활용.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-rd-arrow)" />;
}

export default function RetentionDrillInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-rd-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* timeline bar */}
              <line x1={40} y1={50} x2={460} y2={50} stroke="var(--border)" strokeWidth={1.5} />
              <text x={40} y={40} fontSize={9} fill="var(--muted-foreground)">0</text>
              <text x={130} y={40} fontSize={9} fill="var(--muted-foreground)">6개월</text>
              <text x={230} y={40} fontSize={9} fill="var(--muted-foreground)">1년</text>
              <text x={340} y={40} fontSize={9} fill="var(--muted-foreground)">3년</text>
              <text x={440} y={40} fontSize={9} fill="var(--muted-foreground)">5년</text>

              {/* segments */}
              <rect x={40} y={60} width={90} height={22} rx={3} fill={C.green} opacity={0.2} stroke={C.green} strokeWidth={0.6} />
              <text x={85} y={75} textAnchor="middle" fontSize={8} fill={C.green}>일반 운영</text>

              <rect x={40} y={88} width={190} height={22} rx={3} fill={C.blue} opacity={0.2} stroke={C.blue} strokeWidth={0.6} />
              <text x={135} y={103} textAnchor="middle" fontSize={8} fill={C.blue}>개인정보 접속기록</text>

              <rect x={40} y={116} width={400} height={22} rx={3} fill={C.red} opacity={0.2} stroke={C.red} strokeWidth={0.6} />
              <text x={240} y={131} textAnchor="middle" fontSize={8} fill={C.red}>전자금융 거래 기록 (5년)</text>

              <rect x={40} y={144} width={300} height={22} rx={3} fill={C.amber} opacity={0.2} stroke={C.amber} strokeWidth={0.6} />
              <text x={190} y={159} textAnchor="middle" fontSize={8} fill={C.amber}>보안 이벤트 로그 (권장 3년)</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">법적 요구에 따라 보존 기간 차등 설정</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={10} y={15} w={100} h={30} label="시나리오 설정" sub="가상 장애" color={C.blue} />
              <Arrow x1={112} y1={30} x2={128} y2={30} color={C.blue} />
              <ActionBox x={130} y={15} w={100} h={30} label="실제 복원 수행" sub="테스트 환경" color={C.green} />
              <Arrow x1={232} y1={30} x2={248} y2={30} color={C.green} />
              <ActionBox x={250} y={15} w={100} h={30} label="RTO/RPO 측정" sub="목표 vs 실제" color={C.amber} />
              <Arrow x1={352} y1={30} x2={368} y2={30} color={C.amber} />
              <ActionBox x={370} y={15} w={100} h={30} label="결과 보고서" sub="경영진 보고" color={C.red} />

              <Arrow x1={300} y1={47} x2={240} y2={70} color={C.amber} />
              <rect x={100} y={72} width={280} height={36} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={240} y={87} textAnchor="middle" fontSize={9} fill="var(--foreground)">목표 초과 시 조치</text>
              <text x={240} y={101} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">백업 빈도 증가 / 절차 간소화 / 인프라 보강</text>

              <Arrow x1={420} y1={47} x2={350} y2={118} color={C.red} />
              <DataBox x={200} y={118} w={240} h={30} label="예산·인력 확보 근거로 활용" sub="훈련 미실시 = ISMS 결함" color={C.red} />

              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">연 1회 이상 복구 모의훈련 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

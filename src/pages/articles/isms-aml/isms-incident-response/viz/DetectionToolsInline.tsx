import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: '탐지 수단: IDS/IPS → WAF → SIEM → FDS',
    body: 'IDS는 시그니처 매칭으로 알려진 공격 탐지, WAF는 HTTP 요청 분석으로 웹 공격 차단, SIEM은 로그 상관분석으로 복합 공격 탐지, FDS는 거래 이상 패턴 감시.',
  },
  {
    label: '로그 모니터링: 수집 → 동기화 → 보관',
    body: 'NTP로 시간 동기화 선행. 시스템·네트워크·애플리케이션 로그를 중앙 수집. 최소 6개월 보관, WORM 스토리지나 해시 체인으로 무결성 보장.',
  },
  {
    label: '초동 대응: 격리 → 포렌식 → 영향 범위 파악',
    body: '감염 시스템을 즉시 격리하여 추가 침투와 전파를 차단. 메모리 덤프·디스크 이미지를 쓰기 방지 장치로 확보. 로그 분석으로 유출 범위를 파악한다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-dt-arrow)" />;
}

export default function DetectionToolsInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-dt-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={180} y={5} w={120} h={26} label="외부 트래픽 유입" color={C.red} />
              <Arrow x1={240} y1={33} x2={80} y2={55} color={C.red} />
              <Arrow x1={240} y1={33} x2={240} y2={55} color={C.amber} />
              <Arrow x1={240} y1={33} x2={400} y2={55} color={C.blue} />
              <ModuleBox x={15} y={56} w={130} h={36} label="IDS/IPS" sub="시그니처 매칭" color={C.green} />
              <ModuleBox x={175} y={56} w={130} h={36} label="WAF" sub="HTTP L7 검사" color={C.amber} />
              <ModuleBox x={335} y={56} w={130} h={36} label="FDS" sub="거래 이상 패턴" color={C.purple} />
              <Arrow x1={80} y1={94} x2={240} y2={120} color={C.green} />
              <Arrow x1={240} y1={94} x2={240} y2={120} color={C.amber} />
              <Arrow x1={400} y1={94} x2={240} y2={120} color={C.purple} />
              <ModuleBox x={160} y={120} w={160} h={36} label="SIEM" sub="로그 수집 + 상관분석" color={C.blue} />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">개별 이벤트를 연결하면 공격 체인이 드러난다</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={170} y={5} w={140} h={26} label="NTP 시간 동기화" sub="선행 필수" color={C.blue} />
              <Arrow x1={240} y1={33} x2={80} y2={55} color={C.blue} />
              <Arrow x1={240} y1={33} x2={240} y2={55} color={C.blue} />
              <Arrow x1={240} y1={33} x2={400} y2={55} color={C.blue} />
              <DataBox x={15} y={56} w={130} h={34} label="시스템 로그" sub="OS 이벤트" color={C.green} />
              <DataBox x={175} y={56} w={130} h={34} label="네트워크 로그" sub="방화벽·라우터" color={C.amber} />
              <DataBox x={335} y={56} w={130} h={34} label="애플리케이션 로그" sub="웹·API·DB" color={C.purple} />
              <Arrow x1={80} y1={92} x2={240} y2={115} color={C.green} />
              <Arrow x1={240} y1={92} x2={240} y2={115} color={C.amber} />
              <Arrow x1={400} y1={92} x2={240} y2={115} color={C.purple} />
              <ModuleBox x={140} y={115} w={200} h={34} label="중앙 로그 수집" sub="6개월+ 보관 / WORM 무결성" color={C.blue} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시간이 어긋나면 타임라인 재구성 불가</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={10} y={20} w={100} h={34} label="사고 확인" sub="침해 확정" color={C.red} />
              <Arrow x1={112} y1={37} x2={138} y2={37} color={C.red} />
              <ActionBox x={140} y={20} w={100} h={34} label="네트워크 격리" sub="전파 차단" color={C.red} />
              <Arrow x1={242} y1={37} x2={268} y2={37} color={C.amber} />
              <ActionBox x={270} y={20} w={100} h={34} label="포렌식 착수" sub="증거 보전" color={C.amber} />
              <Arrow x1={372} y1={37} x2={398} y2={37} color={C.green} />
              <ActionBox x={400} y={20} w={70} h={34} label="영향 파악" sub="범위 추적" color={C.green} />

              <Arrow x1={190} y1={56} x2={110} y2={82} color={C.red} />
              <Arrow x1={320} y1={56} x2={240} y2={82} color={C.amber} />
              <Arrow x1={435} y1={56} x2={370} y2={82} color={C.green} />

              <rect x={40} y={84} width={140} height={40} rx={5} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={110} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">케이블 분리 / 스위치 비활성화</text>
              <text x={110} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">측면 이동 차단</text>

              <rect x={170} y={84} width={140} height={40} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">메모리 덤프 + 디스크 이미지</text>
              <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">SHA-256 무결성 검증</text>

              <rect x={300} y={84} width={140} height={40} rx={5} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={370} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">접근 서버·DB·외부 서비스</text>
              <text x={370} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">유출 종류·규모 확인</text>

              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">격리와 증거 보전은 동시 진행</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

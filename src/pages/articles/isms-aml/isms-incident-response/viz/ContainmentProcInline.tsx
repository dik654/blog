import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, ModuleBox, DataBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: '봉쇄: 공격 경로 차단',
    body: '취약점 임시 패치, 서비스 일시 중단, 침해 계정 잠금, 백도어(웹셸·SSH키·악성 스크립트) 전수 점검.',
  },
  {
    label: '내부 사고: VASP 자산 유출 대응',
    body: '비정상 출금 감지 → 지갑 출금 정지 → 연관 계정 동결 → 블록체인 분석으로 자산 이동 경로 추적.',
  },
  {
    label: '외부 사고: FDS 자동 보류 → 계정 정지',
    body: 'FDS 이상 감지 → 거래 자동 보류 → 계정 정지 → 본인 확인 → 피해 확인 시 고객 통지 + MFA 재설정.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-cp-arrow)" />;
}

export default function ContainmentProcInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-cp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={170} y={5} w={140} h={28} label="봉쇄 (Containment)" sub="공격 경로 차단" color={C.red} />
              <Arrow x1={200} y1={35} x2={70} y2={58} color={C.red} />
              <Arrow x1={240} y1={35} x2={240} y2={58} color={C.amber} />
              <Arrow x1={280} y1={35} x2={410} y2={58} color={C.blue} />

              <ActionBox x={10} y={60} w={120} h={34} label="임시 패치 적용" sub="취약점 Hotfix" color={C.red} />
              <ActionBox x={180} y={60} w={120} h={34} label="계정 잠금" sub="비밀번호 초기화" color={C.amber} />
              <ActionBox x={350} y={60} w={120} h={34} label="백도어 점검" sub="전체 시스템 스캔" color={C.blue} />

              <Arrow x1={410} y1={96} x2={410} y2={118} color={C.blue} />
              <rect x={320} y={120} width={180} height={40} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={410} y={136} textAnchor="middle" fontSize={9} fill="var(--foreground)">웹셸 / 변조 SSH 키</text>
              <text x={410} y={150} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">크론탭 악성 스크립트 확인</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">재침입을 위한 숨겨진 경로를 반드시 제거</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={10} y={25} w={100} h={30} label="비정상 출금" sub="감지" color={C.red} />
              <Arrow x1={112} y1={40} x2={128} y2={40} color={C.red} />
              <ActionBox x={130} y={25} w={90} h={30} label="출금 정지" sub="지갑 잠금" color={C.red} />
              <Arrow x1={222} y1={40} x2={238} y2={40} color={C.amber} />
              <ActionBox x={240} y={25} w={90} h={30} label="계정 동결" sub="추가 이체 차단" color={C.amber} />
              <Arrow x1={332} y1={40} x2={348} y2={40} color={C.blue} />
              <ModuleBox x={350} y={25} w={110} h={30} label="블록체인 분석" sub="경로 추적" color={C.blue} />

              <Arrow x1={405} y1={57} x2={405} y2={80} color={C.blue} />
              <rect x={250} y={82} width={210} height={50} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={355} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">온체인 데이터 분석</text>
              <text x={355} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분산 주소 추적 → 입금 거래소 파악</text>

              <DataBox x={80} y={90} w={140} h={30} label="자산 이동 경로 문서화" color={C.green} />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">VASP에서 내부 사고는 자산 유출에 직결</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={20} w={80} h={30} label="FDS 탐지" sub="이상 패턴" color={C.purple} />
              <Arrow x1={92} y1={35} x2={108} y2={35} color={C.purple} />
              <ActionBox x={110} y={20} w={80} h={30} label="거래 보류" sub="자동 Hold" color={C.red} />
              <Arrow x1={192} y1={35} x2={208} y2={35} color={C.red} />
              <ActionBox x={210} y={20} w={80} h={30} label="계정 정지" sub="접근 차단" color={C.amber} />
              <Arrow x1={292} y1={35} x2={308} y2={35} color={C.amber} />
              <ActionBox x={310} y={20} w={80} h={30} label="본인 확인" sub="소유자 검증" color={C.green} />
              <Arrow x1={392} y1={35} x2={408} y2={35} color={C.green} />
              <ActionBox x={410} y={20} w={60} h={30} label="통지" sub="고객·기관" color={C.blue} />

              <Arrow x1={350} y1={52} x2={240} y2={80} color={C.green} />
              <rect x={140} y={82} width={200} height={46} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">본인 아닌 거래 확인 시</text>
              <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비밀번호 변경 + MFA 재설정 안내</text>

              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">FDS 자동 보류 → 수동 확인 → 조치의 순서</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

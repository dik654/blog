import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  primary: '#6366f1',
  action: '#f59e0b',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '최소 권한 — Default Deny 원칙',
    body: '기본: 모든 접근 차단(DENY ALL). 필요한 것만 명시적으로 허용.\n하나의 계정 탈취가 전체 시스템 위험으로 이어지지 않도록 접근 범위를 제한.',
  },
  {
    label: '직무 분리 — 단독 수행 방지',
    body: '하나의 중요 업무를 한 사람이 단독 수행 불가. 요청자/승인자/실행자를 분리.\nVASP 핵심: 출금은 멀티시그로 기술 분리, 상장 심사는 합의제로 제도 분리.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#lp-viz-arr)" />;
}

export default function LeastPrivilegeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="lp-viz-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>Default Deny: 기본 거부 원칙</text>

              {/* 기본 거부 영역 */}
              <rect x={10} y={28} width={460} height={75} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>모든 접근 차단 (기본 상태)</text>

              {/* 허용 구멍 3개 */}
              <rect x={30} y={52} width={120} height={42} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={1} />
              <text x={90} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>허용 1</text>
              <text x={90} y={82} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">자기 데이터 조회</text>

              <rect x={170} y={52} width={140} height={42} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={1} />
              <text x={240} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>허용 2</text>
              <text x={240} y={82} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">업무 시간 내 관리 페이지</text>

              <rect x={330} y={52} width={120} height={42} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={1} />
              <text x={390} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>허용 3</text>
              <text x={390} y={82} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">승인된 DB 쿼리</text>

              <rect x={10} y={115} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 3원칙 */}
              <ActionBox x={15} y={128} w={140} h={36} label="Default Deny" sub="허용 목록만 통과" color={C.danger} />
              <ActionBox x={170} y={128} w={140} h={36} label="Need-to-Know" sub="업무 필요 정보만 접근" color={C.action} />
              <ActionBox x={325} y={128} w={140} h={36} label="시간 제한" sub="업무 외 시간 차단" color={C.primary} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">명시적으로 허용되지 않은 모든 접근은 차단 — 방화벽, 서버, DB 모두 동일 원칙</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>직무 분리: 출금 프로세스</text>

              {/* 출금 3단계 분리 */}
              <DataBox x={10} y={35} w={80} h={30} label="출금 요청" color={C.primary} />
              <Arrow x1={90} y1={50} x2={118} y2={50} color={C.action} />
              <text x={105} y={43} fontSize={7} fill={C.action}>요청자</text>

              <ActionBox x={120} y={33} w={90} h={34} label="1차 승인" sub="MFA 인증" color={C.action} />
              <Arrow x1={210} y1={50} x2={238} y2={50} color={C.action} />
              <text x={225} y={43} fontSize={7} fill={C.action}>승인자 A</text>

              <ActionBox x={240} y={33} w={90} h={34} label="2차 승인" sub="MFA 인증" color={C.action} />
              <Arrow x1={330} y1={50} x2={358} y2={50} color={C.safe} />
              <text x={345} y={43} fontSize={7} fill={C.safe}>승인자 B</text>

              <StatusBox x={360} y={33} w={110} h={34} label="출금 실행" sub="멀티시그 서명" color={C.safe} progress={1} />

              <rect x={10} y={80} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>분리 위반 시 위험</text>

              {/* 위반 시나리오 */}
              <AlertBox x={30} y={105} w={190} h={45} label="한 명이 요청+승인" sub="내부 횡령 가능: 자기가 요청하고 자기가 승인" color={C.danger} />
              <AlertBox x={250} y={105} w={200} h={45} label="한 명이 코드+배포" sub="악의적 코드 삽입 후 자가 승인/배포 방지 불가" color={C.danger} />

              <rect x={80} y={162} width={320} height={30} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={181} textAnchor="middle" fontSize={8} fill={C.safe}>직무 분리 = 내부자 위협(Insider Threat) + 실수 동시 방지</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

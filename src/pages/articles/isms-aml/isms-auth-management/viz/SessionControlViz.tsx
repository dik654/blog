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
    label: '권한 분리 흐름 — RBAC 매핑',
    body: '개인에게 직접 권한을 부여하지 않고, 역할(Role)에 권한을 연결.\n사용자 → 역할 매핑만 변경하면 부서 이동 시에도 권한이 자동으로 정리된다.',
  },
  {
    label: 'PAM — 특권 계정 활성화 절차',
    body: '슈퍼관리자 권한은 평소 비활성화. 필요 시 CISO 승인 → 시간 제한 활성화 → 작업 수행 → 자동 비활성화.\n모든 사용 내역을 기록하고 사후 검토를 거친다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#sess-ctrl-arr)" />;
}

export default function SessionControlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sess-ctrl-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>RBAC: 역할 기반 권한 매핑</text>

              {/* 사용자들 */}
              <DataBox x={10} y={30} w={70} h={24} label="직원 A" color={C.primary} />
              <DataBox x={10} y={60} w={70} h={24} label="직원 B" color={C.primary} />
              <DataBox x={10} y={90} w={70} h={24} label="직원 C" color={C.primary} />

              {/* 화살표 → 역할 */}
              <Arrow x1={80} y1={42} x2={118} y2={52} color={C.action} />
              <Arrow x1={80} y1={72} x2={118} y2={52} color={C.action} />
              <Arrow x1={80} y1={102} x2={118} y2={92} color={C.action} />

              {/* 역할 */}
              <ActionBox x={120} y={32} w={110} h={38} label="KYC 심사자" sub="고객 정보 조회" color={C.action} />
              <ActionBox x={120} y={76} w={110} h={38} label="월렛 운영자" sub="출금 승인 권한" color={C.danger} />

              {/* 화살표 → 권한 */}
              <Arrow x1={230} y1={51} x2={268} y2={42} color={C.safe} />
              <Arrow x1={230} y1={51} x2={268} y2={68} color={C.safe} />
              <Arrow x1={230} y1={95} x2={268} y2={95} color={C.safe} />
              <Arrow x1={230} y1={95} x2={268} y2={120} color={C.safe} />

              {/* 권한 */}
              <StatusBox x={270} y={26} w={100} h={30} label="고객 DB 읽기" sub="" color={C.safe} progress={1} />
              <StatusBox x={270} y={58} w={100} h={30} label="KYC 문서 열람" sub="" color={C.safe} progress={1} />
              <StatusBox x={270} y={84} w={100} h={30} label="출금 API 호출" sub="" color={C.danger} progress={1} />
              <StatusBox x={270} y={110} w={100} h={30} label="잔고 조회" sub="" color={C.safe} progress={1} />

              {/* 장점 */}
              <rect x={390} y={30} width={85} height={110} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={432} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.primary}>RBAC 장점</text>
              <text x={432} y={64} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">역할만 재배정</text>
              <text x={432} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">개별 권한 관리</text>
              <text x={432} y={92} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">부담 최소화</text>
              <text x={432} y={110} textAnchor="middle" fontSize={7.5} fill={C.safe}>부서 이동 시</text>
              <text x={432} y={124} textAnchor="middle" fontSize={7.5} fill={C.safe}>역할 교체만</text>

              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개인 → 역할 → 권한: 3계층 구조로 관리 복잡도를 줄이고 감사 추적을 단순화</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>PAM: 특권 계정 활성화 절차</text>

              {/* 단계별 흐름 */}
              <DataBox x={10} y={35} w={80} h={28} label="작업 필요" color={C.primary} />
              <Arrow x1={90} y1={49} x2={108} y2={49} color={C.action} />

              <ActionBox x={110} y={33} w={80} h={32} label="CISO 승인" sub="사유 기록" color={C.action} />
              <Arrow x1={190} y1={49} x2={208} y2={49} color={C.danger} />

              <ActionBox x={210} y={33} w={80} h={32} label="권한 활성화" sub="시간 제한" color={C.danger} />
              <Arrow x1={290} y1={49} x2={308} y2={49} color={C.danger} />

              <ActionBox x={310} y={33} w={75} h={32} label="작업 수행" sub="전체 기록" color={C.danger} />
              <Arrow x1={385} y1={49} x2={403} y2={49} color={C.safe} />

              <StatusBox x={405} y={31} w={70} h={36} label="자동 회수" sub="비활성화" color={C.safe} progress={1} />

              {/* 타임라인 */}
              <rect x={10} y={82} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>시간 제한 예시</text>

              {/* 타이머 바 */}
              <rect x={40} y={110} width={400} height={12} rx={6} fill="var(--border)" opacity={0.2} />
              <rect x={40} y={110} width={300} height={12} rx={6} fill={C.danger} opacity={0.7} />
              <rect x={340} y={110} width={100} height={12} rx={6} fill={C.safe} opacity={0.5} />
              <text x={190} y={119} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="#ffffff">활성 구간 (최대 4시간)</text>
              <text x={390} y={119} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="var(--foreground)">자동 비활성화</text>

              {/* 사후 검토 */}
              <rect x={80} y={140} width={320} height={48} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={240} y={157} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>사후 검토 (48시간 이내)</text>
              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실행 쿼리/명령 전수 확인 → 승인 사유와 일치 여부 검증</text>
              <text x={240} y={184} textAnchor="middle" fontSize={7.5} fill={C.danger}>불일치 발견 시 보안 사고 조사 개시</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

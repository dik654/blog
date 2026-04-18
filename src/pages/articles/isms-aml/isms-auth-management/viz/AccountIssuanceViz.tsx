import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  primary: '#6366f1',
  action: '#f59e0b',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '계정 발급 — 최소 권한 흐름',
    body: '신청서 작성(사유 명시) → 부서장 1차 승인 → 정보보호팀 2차 승인 → RBAC 역할 매핑 → 계정 발급.\n관리자급은 CISO 추가 승인. ID와 임시 PW는 별도 채널로 전달.',
  },
  {
    label: '권한 변경 — 임시 권한과 자동 회수',
    body: '영구 권한 추가 대신 임시 권한이 원칙. 만료일 설정 → 자동 회수(Auto-revocation).\n프로젝트 종료, 장애 대응 완료 시 시스템이 자동으로 권한을 비활성화.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#acct-iss-arr)" />;
}

export default function AccountIssuanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="acct-iss-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>계정 발급 승인 흐름</text>

              {/* 메인 흐름 */}
              <DataBox x={5} y={30} w={72} h={28} label="신청서" color={C.primary} />
              <Arrow x1={77} y1={44} x2={93} y2={44} color={C.action} />

              <ActionBox x={95} y={28} w={78} h={32} label="부서장" sub="1차 승인" color={C.action} />
              <Arrow x1={173} y1={44} x2={189} y2={44} color={C.action} />

              <ActionBox x={191} y={28} w={78} h={32} label="정보보호팀" sub="2차 승인" color={C.action} />
              <Arrow x1={269} y1={44} x2={285} y2={44} color={C.safe} />

              <ActionBox x={287} y={28} w={78} h={32} label="RBAC 매핑" sub="역할 배정" color={C.safe} />
              <Arrow x1={365} y1={44} x2={381} y2={44} color={C.safe} />

              <StatusBox x={383} y={28} w={90} h={32} label="계정 발급" sub="임시 PW" color={C.safe} progress={1} />

              {/* 관리자급 추가 */}
              <rect x={191} y={68} width={78} height={22} rx={4} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={230} y={83} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.danger}>CISO 추가 승인</text>
              <Arrow x1={230} y1={60} x2={230} y2={68} color={C.danger} />

              <rect x={10} y={100} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 초기 로그인 절차 */}
              <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>첫 로그인 시 필수 절차</text>
              <ActionBox x={30} y={128} w={120} h={30} label="임시 PW 변경" sub="즉시 강제" color={C.action} />
              <Arrow x1={150} y1={143} x2={168} y2={143} color={C.primary} />
              <ActionBox x={170} y={128} w={120} h={30} label="보안 서약서 동의" sub="전자 서명" color={C.primary} />
              <Arrow x1={290} y1={143} x2={308} y2={143} color={C.safe} />
              <ActionBox x={310} y={128} w={120} h={30} label="MFA 등록" sub="OTP 앱 설정" color={C.safe} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">ID와 임시 PW는 별도 채널(이메일/문자 분리)로 전달 — 한 채널 유출 시에도 계정 보호</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.action}>임시 권한과 자동 회수</text>

              {/* 3가지 시나리오 */}
              <rect x={5} y={28} width={155} height={70} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={82} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>프로젝트 투입</text>
              <text x={82} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">추가 역할 부여</text>
              <text x={82} y={72} textAnchor="middle" fontSize={8} fill={C.safe}>종료일 자동 회수</text>
              <StatusBox x={25} y={78} w={115} h={16} label="" sub="" color={C.safe} progress={0.7} />

              <rect x={168} y={28} width={145} height={70} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={240} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>장애 대응</text>
              <text x={240} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">긴급 특권 접근</text>
              <text x={240} y={72} textAnchor="middle" fontSize={8} fill={C.danger}>최대 24시간 타이머</text>
              <StatusBox x={188} y={78} w={105} h={16} label="" sub="" color={C.danger} progress={0.3} />

              <rect x={321} y={28} width={155} height={70} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={398} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>외부 감사</text>
              <text x={398} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">읽기 전용 임시 계정</text>
              <text x={398} y={72} textAnchor="middle" fontSize={8} fill={C.primary}>감사 종료일 만료</text>
              <StatusBox x={341} y={78} w={115} h={16} label="" sub="" color={C.primary} progress={0.5} />

              {/* 자동 회수 강조 */}
              <rect x={10} y={112} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <rect x={60} y={125} width={360} height={60} rx={8} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={240} y={143} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.danger}>핵심: 자동 회수(Auto-revocation)</text>
              <text x={240} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"기간 끝나면 회수해 주세요" → 잊혀지는 것이 현실</text>
              <text x={240} y={176} textAnchor="middle" fontSize={8} fill={C.safe}>시스템 수준 만료일 설정 → 자동 비활성화가 유일한 해법</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

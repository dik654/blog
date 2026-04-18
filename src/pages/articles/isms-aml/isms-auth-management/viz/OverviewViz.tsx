import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  auth: '#6366f1',   // 인디고 — 인증 체계
  mfa: '#f59e0b',    // 앰버 — MFA/동작
  safe: '#10b981',   // 에메랄드 — 통과/안전
  danger: '#ef4444', // 레드 — 위험/차단
};

const STEPS = [
  {
    label: '인증 3요소 — 지식·소유·생체',
    body: '인증(Authentication) = "너는 누구인가" 확인. 각 요소는 취약점이 다르므로 서로 다른 범주를 조합해야 효과적.\n같은 범주(비밀번호+보안질문)는 MFA가 아니다 — 비밀번호(지식)+OTP(소유)가 진정한 MFA.',
  },
  {
    label: 'MFA 필수 적용 4개 영역',
    body: '관리자 페이지(PW+OTP), VPN 접속(인증서+OTP), 월렛 서명(다단계 MFA), DB 접근(세션+OTP).\nVASP에서 MFA 미적용 시: 관리자 탈취 → 핫월렛 출금 승인까지 단일 경로로 돌파 가능.',
  },
  {
    label: '중복 로그인 제한 — 세션 탈취 방지',
    body: '관리자: 단일 세션만 허용, 새 로그인 시 기존 강제 종료. 일반: 최대 3개, 비정상 동시접속 알림.\n위험: 계정 공유(행위 추적 불가) + 세션 하이재킹(정상/공격자 동시 접속 탐지 불가).',
  },
  {
    label: '3단계 권한 분리 + RBAC',
    body: '일반(자기 데이터만) → 관리자(업무 범위 내, PW+OTP 필수) → 슈퍼관리자(계정 생성/삭제, IP 제한 추가).\nPAM(특권 계정 관리): 슈퍼관리자 권한은 필요 시만 활성화, 사유 기록 + 사후 검토 필수.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#amo-arrow)" />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="amo-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 인증 3요소 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 사용자 → 인증 게이트 */}
              <ModuleBox x={10} y={10} w={80} h={48} label="사용자" sub="접근 요청" color={C.auth} />
              <Arrow x1={90} y1={34} x2={118} y2={34} color={C.mfa} />
              <ActionBox x={120} y={8} w={100} h={50} label="인증 게이트" sub="3요소 검증" color={C.mfa} />
              <Arrow x1={220} y1={34} x2={248} y2={34} color={C.safe} />
              <StatusBox x={250} y={8} w={90} h={50} label="접근 허용" sub="인증 완료" color={C.safe} progress={1} />

              {/* 인증 실패 경로 */}
              <Arrow x1={170} y1={58} x2={170} y2={73} color={C.danger} />
              <AlertBox x={120} y={75} w={100} h={36} label="접근 거부" sub="인증 실패" color={C.danger} />

              {/* 구분선 */}
              <rect x={10} y={125} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 3요소 상세 */}
              <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">인증 3요소</text>

              <ModuleBox x={10} y={150} w={140} h={40} label="지식 (Knowledge)" sub="비밀번호, PIN, 보안 질문" color={C.auth} />
              <ModuleBox x={165} y={150} w={150} h={40} label="소유 (Possession)" sub="OTP 앱, 보안 토큰, 스마트카드" color={C.mfa} />
              <ModuleBox x={330} y={150} w={140} h={40} label="생체 (Inherence)" sub="지문, 홍채, 안면 인식" color={C.safe} />

              {/* 취약점 */}
              <text x={80} y={205} textAnchor="middle" fontSize={7.5} fill={C.danger}>피싱, 무차별 대입</text>
              <text x={240} y={205} textAnchor="middle" fontSize={7.5} fill={C.danger}>분실, SIM 스와핑</text>
              <text x={400} y={205} textAnchor="middle" fontSize={7.5} fill={C.danger}>위조, 변경 불가</text>

              {/* 올바른 MFA 예시 */}
              <rect x={350} y={10} width={120} height={48} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={410} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>올바른 MFA</text>
              <text x={410} y={39} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">비밀번호(지식)</text>
              <text x={410} y={50} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">+ OTP(소유)</text>
            </motion.g>
          )}

          {/* ── Step 1: MFA 필수 적용 영역 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.mfa}>MFA 필수 적용 영역</text>

              {/* 4개 영역 */}
              <ActionBox x={10} y={28} w={105} h={50} label="관리자 페이지" sub="PW + OTP 2차 인증" color={C.auth} />
              <ActionBox x={125} y={28} w={105} h={50} label="VPN 접속" sub="인증서 + OTP" color={C.mfa} />
              <ActionBox x={250} y={28} w={105} h={50} label="월렛 서명" sub="다단계 MFA 승인" color={C.danger} />
              <ActionBox x={365} y={28} w={105} h={50} label="DB 접근" sub="세션 인증 + OTP" color={C.safe} />

              {/* 월렛 서명 상세 흐름 */}
              <rect x={10} y={95} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>월렛 출금: 다단계 구조</text>

              <DataBox x={10} y={120} w={88} h={30} label="출금 요청" color={C.auth} />
              <Arrow x1={98} y1={135} x2={118} y2={135} color={C.mfa} />

              <ActionBox x={120} y={118} w={95} h={34} label="1차 승인자" sub="MFA 인증" color={C.mfa} />
              <Arrow x1={215} y1={135} x2={235} y2={135} color={C.mfa} />

              <ActionBox x={237} y={118} w={95} h={34} label="2차 승인자" sub="MFA 인증" color={C.mfa} />
              <Arrow x1={332} y1={135} x2={352} y2={135} color={C.safe} />

              <StatusBox x={354} y={118} w={85} h={34} label="출금 실행" sub="승인 완료" color={C.safe} progress={1} />

              {/* OTP 방식 비교 */}
              <rect x={10} y={165} width={220} height={48} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={120} y={180} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>SMS OTP — 비권장</text>
              <text x={120} y={192} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">SIM 스와핑 위험</text>
              <text x={120} y={204} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">통신사 속여 번호 탈취</text>

              <rect x={250} y={165} width={220} height={48} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={360} y={180} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>TOTP / FIDO2 — 권장</text>
              <text x={360} y={192} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">시간 기반 일회용 PW</text>
              <text x={360} y={204} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">생체/보안키 기반 표준</text>
            </motion.g>
          )}

          {/* ── Step 2: 중복 로그인 제한 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.auth}>중복 로그인 제한</text>

              {/* 관리자 — 단일 세션 */}
              <rect x={5} y={25} width={230} height={85} rx={8} fill={`${C.auth}08`} stroke={C.auth} strokeWidth={0.6} />
              <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.auth}>관리자: 단일 세션</text>

              <DataBox x={15} y={48} w={80} h={26} label="기존 세션 A" color={C.danger} />
              <Arrow x1={95} y1={61} x2={115} y2={61} color={C.danger} />
              <text x={105} y={56} fontSize={7} fill={C.danger}>종료</text>

              <DataBox x={117} y={48} w={80} h={26} label="새 로그인 B" color={C.safe} />
              <Arrow x1={197} y1={61} x2={215} y2={50} color={C.safe} />
              <StatusBox x={130} y={80} w={95} h={24} label="B만 활성" sub="" color={C.safe} progress={1} />

              {/* 일반 사용자 — 3개 제한 */}
              <rect x={250} y={25} width={225} height={85} rx={8} fill={`${C.mfa}08`} stroke={C.mfa} strokeWidth={0.6} />
              <text x={362} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mfa}>일반: 최대 3개</text>

              <DataBox x={260} y={48} w={62} h={26} label="세션 1" color={C.safe} />
              <DataBox x={328} y={48} w={62} h={26} label="세션 2" color={C.safe} />
              <DataBox x={396} y={48} w={62} h={26} label="세션 3" color={C.safe} />

              <AlertBox x={295} y={80} w={120} h={24} label="4번째 → 차단" sub="" color={C.danger} />

              {/* 구분선 */}
              <rect x={10} y={122} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>중복 로그인 허용 시 위험</text>

              {/* 위험 시나리오 */}
              <AlertBox x={10} y={148} w={220} h={60} label="계정 공유" sub="하나의 관리자 계정을 여러 명 사용 → 행위 추적 불가 → 사고 발생 시 책임자 특정 불가" color={C.danger} />
              <AlertBox x={250} y={148} w={220} h={60} label="세션 하이재킹" sub="공격자가 세션 토큰 탈취 → 정상 사용자와 동시 접속 → 탐지 어려움" color={C.danger} />
            </motion.g>
          )}

          {/* ── Step 3: 권한 분리 + RBAC ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.auth}>3단계 권한 분리</text>

              {/* 3단계 피라미드 형태 — 좌→우 점진적 상승 */}
              <ModuleBox x={10} y={28} w={140} h={48} label="일반 사용자" sub="자기 데이터 조회/수정만" color={C.safe} />
              <text x={80} y={88} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">PW + OTP(선택)</text>

              <Arrow x1={150} y1={52} x2={170} y2={52} color={C.mfa} />

              <ModuleBox x={172} y={28} w={140} h={48} label="관리자" sub="담당 업무 범위 내 운영" color={C.mfa} />
              <text x={242} y={88} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">PW + OTP(필수)</text>

              <Arrow x1={312} y1={52} x2={332} y2={52} color={C.danger} />

              <ModuleBox x={334} y={28} w={140} h={48} label="슈퍼관리자" sub="계정 생성/삭제, 시스템 설정" color={C.danger} />
              <text x={404} y={88} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">PW + OTP + IP 제한</text>

              {/* 구분선 */}
              <rect x={10} y={100} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* PAM 영역 */}
              <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.auth}>PAM (특권 계정 관리)</text>

              <DataBox x={10} y={126} w={100} h={28} label="일상 업무" color={C.safe} />
              <Arrow x1={110} y1={140} x2={130} y2={140} color={C.safe} />
              <StatusBox x={132} y={124} w={105} h={32} label="관리자 계정" sub="평상시 사용" color={C.safe} progress={0.5} />

              <Arrow x1={237} y1={140} x2={255} y2={140} color={C.mfa} />
              <text x={246} y={135} fontSize={7} fill={C.mfa}>필요 시</text>

              <ActionBox x={257} y={124} w={105} h={32} label="슈퍼관리자" sub="권한 활성화" color={C.danger} />

              <Arrow x1={362} y1={140} x2={380} y2={140} color={C.danger} />

              <DataBox x={382} y={126} w={88} h={28} label="사유 기록" color={C.auth} />

              {/* RBAC 설명 */}
              <rect x={10} y={168} width={460} height={44} rx={6} fill="var(--card)" stroke={C.auth} strokeWidth={0.5} />
              <text x={240} y={184} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.auth}>RBAC (역할 기반 접근제어)</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개인이 아닌 역할(Role)에 권한 부여 → 부서 이동 시 역할만 재배정</text>
              <text x={240} y={210} textAnchor="middle" fontSize={7.5} fill={C.mfa}>VASP 역할 예시: 거래 모니터링 담당자, 월렛 운영자, KYC 심사자</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

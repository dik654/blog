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
    label: 'MFA 인증 흐름 — 비밀번호 단계',
    body: '사용자가 아이디+비밀번호(지식 요소)를 입력. 서버가 해시 비교로 1차 검증.\n1차만 통과하면 아직 "인증 완료"가 아니다 — 2차 인증 대기 상태로 전환.',
  },
  {
    label: 'MFA 인증 흐름 — OTP 단계',
    body: '서버가 OTP 입력을 요구. TOTP 앱이 30초마다 6자리 코드를 생성.\n서버도 동일한 시드(Seed)로 코드를 계산하여 비교 — 일치하면 인증 완료.',
  },
  {
    label: 'MFA 실패 시나리오',
    body: '비밀번호 5회 오류 → 계정 잠금(30분). OTP 3회 오류 → 세션 무효화.\n공격자가 비밀번호를 탈취해도 OTP 없이는 2차를 통과할 수 없다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#mfa-flow-arr)" />;
}

export default function MfaFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="mfa-flow-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={20} w={80} h={44} label="사용자" sub="ID + PW 입력" color={C.primary} />
              <Arrow x1={90} y1={42} x2={118} y2={42} color={C.action} />
              <ActionBox x={120} y={18} w={110} h={48} label="1차 검증" sub="해시 비교(bcrypt)" color={C.action} />
              <Arrow x1={230} y1={42} x2={258} y2={42} color={C.action} />
              <DataBox x={260} y={26} w={100} h={32} label="2차 대기" color={C.action} />
              <Arrow x1={360} y1={42} x2={388} y2={42} color={C.primary} />
              <AlertBox x={390} y={18} w={80} h={48} label="OTP 요구" sub="30초 제한" color={C.primary} />

              {/* 흐름 설명 */}
              <rect x={10} y={85} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>1차: 지식(Knowledge) 요소</text>
              <DataBox x={60} y={115} w={140} h={30} label="비밀번호 → bcrypt" color={C.primary} />
              <Arrow x1={200} y1={130} x2={228} y2={130} color={C.safe} />
              <StatusBox x={230} y={113} w={100} h={34} label="해시 일치" sub="1차 통과" color={C.safe} progress={0.5} />
              <Arrow x1={330} y1={130} x2={350} y2={130} color={C.action} />
              <text x={415} y={126} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.action}>아직 인증 미완료</text>
              <text x={415} y={140} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">2차 OTP 필요</text>

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비밀번호만으로는 접근 불가 — 반드시 다른 범주(소유)를 추가 검증</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>2차 인증: TOTP 검증 흐름</text>

              <ModuleBox x={10} y={28} w={90} h={44} label="TOTP 앱" sub="30초 코드 생성" color={C.action} />
              <Arrow x1={100} y1={50} x2={128} y2={50} color={C.action} />
              <DataBox x={130} y={36} w={80} h={28} label="6자리 코드" color={C.action} />
              <Arrow x1={210} y1={50} x2={238} y2={50} color={C.primary} />
              <ActionBox x={240} y={28} w={110} h={44} label="서버 검증" sub="동일 시드로 계산" color={C.primary} />
              <Arrow x1={350} y1={50} x2={378} y2={50} color={C.safe} />
              <StatusBox x={380} y={28} w={90} h={44} label="인증 완료" sub="세션 발급" color={C.safe} progress={1} />

              <rect x={10} y={90} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>TOTP 원리</text>

              <DataBox x={20} y={118} w={100} h={28} label="공유 시드" color={C.primary} />
              <text x={130} y={134} fontSize={8} fill="var(--muted-foreground)">+</text>
              <DataBox x={140} y={118} w={100} h={28} label="현재 시간(30s)" color={C.action} />
              <Arrow x1={240} y1={132} x2={268} y2={132} color={C.safe} />
              <ActionBox x={270} y={116} w={90} h={32} label="HMAC-SHA1" sub="해시 변환" color={C.safe} />
              <Arrow x1={360} y1={132} x2={388} y2={132} color={C.safe} />
              <DataBox x={390} y={118} w={80} h={28} label="6자리 OTP" color={C.safe} />

              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">클라이언트와 서버가 동일 시드를 보유 → 같은 시간에 같은 코드를 독립 계산</text>
              <text x={240} y={186} textAnchor="middle" fontSize={7.5} fill={C.action}>코드는 30초 후 만료 → 탈취해도 재사용 불가</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>MFA 실패 시나리오</text>

              {/* PW 실패 */}
              <rect x={5} y={28} width={230} height={80} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={120} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>비밀번호 오류</text>
              <DataBox x={15} y={52} w={80} h={24} label="1회~4회" color={C.action} />
              <Arrow x1={95} y1={64} x2={118} y2={64} color={C.action} />
              <text x={160} y={60} fontSize={8} fill={C.action}>재시도 허용</text>
              <text x={160} y={72} fontSize={7.5} fill="var(--muted-foreground)">시도 간격 증가</text>
              <DataBox x={15} y={82} w={80} h={20} label="5회 오류" color={C.danger} />
              <Arrow x1={95} y1={92} x2={118} y2={92} color={C.danger} />
              <AlertBox x={120} y={80} w={100} h={24} label="계정 잠금 30분" sub="" color={C.danger} />

              {/* OTP 실패 */}
              <rect x={250} y={28} width={225} height={80} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={362} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>OTP 오류</text>
              <DataBox x={260} y={52} w={80} h={24} label="1회~2회" color={C.action} />
              <Arrow x1={340} y1={64} x2={363} y2={64} color={C.action} />
              <text x={410} y={60} fontSize={8} fill={C.action}>재입력 허용</text>
              <text x={410} y={72} fontSize={7.5} fill="var(--muted-foreground)">코드 갱신 대기</text>
              <DataBox x={260} y={82} w={80} h={20} label="3회 오류" color={C.danger} />
              <Arrow x1={340} y1={92} x2={363} y2={92} color={C.danger} />
              <AlertBox x={365} y={80} w={100} h={24} label="세션 무효화" sub="" color={C.danger} />

              <rect x={10} y={122} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <rect x={40} y={135} width={400} height={52} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={152} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>MFA의 방어 효과</text>
              <text x={240} y={166} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">공격자가 비밀번호를 탈취해도 OTP(소유 요소) 없이는 2차를 통과 불가</text>
              <text x={240} y={180} textAnchor="middle" fontSize={7.5} fill={C.safe}>두 요소가 독립적이므로 동시에 탈취해야 공격 성공 → 난이도 기하급수적 증가</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

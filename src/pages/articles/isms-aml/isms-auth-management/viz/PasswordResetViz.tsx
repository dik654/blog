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
    label: '비밀번호 초기화 절차',
    body: '초기화 요청 → 본인 확인 → 임시 비밀번호 발급(24시간 유효) → 첫 로그인 시 즉시 변경 강제.\n관리자 계정은 대면/영상 확인 필수. 모든 초기화 이력을 로그에 기록.',
  },
  {
    label: '장기 미접속 계정 처리',
    body: '6개월 미로그인 → 자동 잠금. 복구 시 본인 확인 + 비밀번호 즉시 변경.\n유출된 자격증명이 오래된 계정에서 유효할 확률이 높으므로 미사용 계정은 잠금이 원칙.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pw-reset-arr)" />;
}

export default function PasswordResetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pw-reset-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.action}>비밀번호 초기화 흐름</text>

              <DataBox x={10} y={32} w={80} h={26} label="초기화 요청" color={C.primary} />
              <Arrow x1={90} y1={45} x2={108} y2={45} color={C.action} />

              <ActionBox x={110} y={30} w={85} h={30} label="본인 확인" sub="이메일/SMS" color={C.action} />
              <Arrow x1={195} y1={45} x2={213} y2={45} color={C.action} />

              <ActionBox x={215} y={30} w={85} h={30} label="임시 PW 발급" sub="24시간 유효" color={C.danger} />
              <Arrow x1={300} y1={45} x2={318} y2={45} color={C.safe} />

              <ActionBox x={320} y={30} w={80} h={30} label="첫 로그인" sub="즉시 변경" color={C.safe} />
              <Arrow x1={400} y1={45} x2={418} y2={45} color={C.safe} />

              <StatusBox x={420} y={28} w={55} h={34} label="완료" sub="" color={C.safe} progress={1} />

              <rect x={10} y={75} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 일반 vs 관리자 */}
              <rect x={10} y={85} width={220} height={50} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={120} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>일반 사용자</text>
              <text x={120} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">셀프 서비스 (이메일 인증)</text>
              <text x={120} y={128} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">자동 처리 가능</text>

              <rect x={250} y={85} width={220} height={50} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={360} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>관리자 계정</text>
              <text x={360} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">대면/영상 확인 필수</text>
              <text x={360} y={128} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">슈퍼관리자 또는 CISO 승인</text>

              {/* 이력 기록 */}
              <AlertBox x={120} y={148} w={240} h={38} label="모든 초기화 이력 기록" sub="요청자, 승인자, 일시, 사유 → 분기별 검토" color={C.primary} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>장기 미접속 계정 처리</text>

              {/* 타임라인 */}
              <rect x={30} y={35} width={420} height={10} rx={5} fill="var(--border)" opacity={0.2} />
              <rect x={30} y={35} width={280} height={10} rx={5} fill={C.safe} opacity={0.4} />
              <rect x={310} y={35} width={140} height={10} rx={5} fill={C.danger} opacity={0.4} />

              <text x={170} y={60} textAnchor="middle" fontSize={8} fill={C.safe}>정상 활동 구간</text>
              <text x={380} y={60} textAnchor="middle" fontSize={8} fill={C.danger}>6개월 미접속</text>

              <Arrow x1={380} y1={64} x2={380} y2={78} color={C.danger} />
              <AlertBox x={320} y={80} w={120} h={28} label="자동 잠금 처리" sub="" color={C.danger} />

              {/* 복구 절차 */}
              <rect x={10} y={120} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>잠금 해제 절차</text>

              <DataBox x={20} y={148} w={80} h={26} label="복구 요청" color={C.primary} />
              <Arrow x1={100} y1={161} x2={118} y2={161} color={C.action} />
              <ActionBox x={120} y={146} w={80} h={30} label="본인 확인" sub="신분 검증" color={C.action} />
              <Arrow x1={200} y1={161} x2={218} y2={161} color={C.action} />
              <ActionBox x={220} y={146} w={90} h={30} label="PW 즉시 변경" sub="새 비밀번호" color={C.safe} />
              <Arrow x1={310} y1={161} x2={328} y2={161} color={C.safe} />
              <StatusBox x={330} y={146} w={80} h={30} label="잠금 해제" sub="" color={C.safe} progress={1} />

              <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill={C.danger}>ISMS: "사용하지 않는 활성 계정" 존재 자체가 부적합 사유</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

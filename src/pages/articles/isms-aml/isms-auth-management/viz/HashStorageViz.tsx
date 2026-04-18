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
    label: '평문 저장 vs 해시 저장',
    body: '평문 저장: DB 유출 시 모든 비밀번호 즉시 노출 → ISMS 부적합.\n해시 저장: 단방향 변환으로 원문 복구 불가능. DB가 유출돼도 비밀번호는 안전.',
  },
  {
    label: 'bcrypt의 salt + cost factor',
    body: 'salt: 매번 랜덤 문자열을 추가하여 동일 비밀번호도 다른 해시값 생성. 레인보우 테이블 무력화.\ncost factor: 반복 횟수를 높여 해시 계산에 수백 ms 소요 → 초당 수십억 회 무차별 대입을 불가능하게.',
  },
  {
    label: '레거시 마이그레이션 전략',
    body: 'MD5/SHA-1 해시가 남아 있으면 로그인 시점에 bcrypt로 재해시.\n미로그인 계정은 다음 접속 시 비밀번호 강제 변경 유도. 마이그레이션 진행률을 추적.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#hash-st-arr)" />;
}

export default function HashStorageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="hash-st-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>평문 vs 해시: DB 유출 시 비교</text>

              {/* 평문 경로 */}
              <rect x={5} y={28} width={230} height={80} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={120} y={43} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>평문 저장</text>
              <DataBox x={15} y={50} w={80} h={24} label="password1" color={C.danger} />
              <Arrow x1={95} y1={62} x2={118} y2={62} color={C.danger} />
              <ModuleBox x={120} y={48} w={60} h={28} label="DB" sub="" color={C.danger} />
              <Arrow x1={180} y1={62} x2={198} y2={62} color={C.danger} />
              <AlertBox x={140} y={82} w={90} h={22} label="즉시 노출!" sub="" color={C.danger} />

              {/* 해시 경로 */}
              <rect x={250} y={28} width={225} height={80} rx={8} fill={`${C.safe}06`} stroke={C.safe} strokeWidth={0.5} />
              <text x={362} y={43} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>해시 저장</text>
              <DataBox x={260} y={50} w={80} h={24} label="password1" color={C.primary} />
              <Arrow x1={340} y1={62} x2={358} y2={62} color={C.safe} />
              <ActionBox x={360} y={48} w={55} h={28} label="bcrypt" sub="" color={C.safe} />
              <Arrow x1={415} y1={62} x2={430} y2={62} color={C.safe} />
              <DataBox x={260} y={82} w={180} h={22} label="$2b$12$xK...7fE" color={C.safe} />

              <rect x={10} y={125} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={145} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">해시 함수는 단방향: 해시값 → 원문 복원 불가능</text>
              <text x={240} y={162} textAnchor="middle" fontSize={8} fill={C.safe}>DB가 유출돼도 공격자가 얻는 것은 해시 문자열뿐</text>
              <text x={240} y={179} textAnchor="middle" fontSize={7.5} fill={C.danger}>MD5/SHA-1은 연산 속도가 빨라 무차별 대입에 취약 → bcrypt/scrypt/Argon2 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>bcrypt: salt + cost factor</text>

              {/* salt 효과 */}
              <rect x={5} y={28} width={225} height={90} rx={8} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={118} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>salt: 동일 PW → 다른 해시</text>

              <DataBox x={15} y={52} w={80} h={22} label="abc123" color={C.primary} />
              <text x={105} y={64} fontSize={8} fill={C.action}>+ salt_A</text>
              <Arrow x1={145} y1={63} x2={153} y2={63} color={C.action} />
              <DataBox x={155} y={52} w={65} h={22} label="$2b..xK" color={C.safe} />

              <DataBox x={15} y={80} w={80} h={22} label="abc123" color={C.primary} />
              <text x={105} y={92} fontSize={8} fill={C.action}>+ salt_B</text>
              <Arrow x1={145} y1={91} x2={153} y2={91} color={C.action} />
              <DataBox x={155} y={80} w={65} h={22} label="$2b..mQ" color={C.safe} />

              <text x={118} y={113} textAnchor="middle" fontSize={7.5} fill={C.danger}>레인보우 테이블 무력화</text>

              {/* cost factor */}
              <rect x={245} y={28} width={230} height={90} rx={8} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>cost factor: 의도적 느림</text>

              <text x={360} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">cost=10 → 약 100ms/해시</text>
              <text x={360} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">cost=12 → 약 250ms/해시</text>
              <text x={360} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">cost=14 → 약 1000ms/해시</text>

              <StatusBox x={275} y={96} w={170} h={20} label="로그인은 1회 → 사용자 무영향" sub="" color={C.safe} progress={0.8} />

              <rect x={10} y={135} width={460} height={50} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={153} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>효과</text>
              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">무차별 대입: 초당 수십억 회 시도 → cost=12 기준 초당 4회로 제한</text>
              <text x={240} y={180} textAnchor="middle" fontSize={7.5} fill={C.primary}>8자 비밀번호도 해독에 수십 년 소요</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.action}>레거시 해시 마이그레이션</text>

              {/* 로그인 시 마이그레이션 */}
              <DataBox x={10} y={32} w={80} h={28} label="사용자 로그인" color={C.primary} />
              <Arrow x1={90} y1={46} x2={108} y2={46} color={C.action} />

              <ActionBox x={110} y={30} w={85} h={32} label="MD5 검증" sub="기존 해시 비교" color={C.danger} />
              <Arrow x1={195} y1={46} x2={213} y2={46} color={C.safe} />

              <ActionBox x={215} y={30} w={85} h={32} label="bcrypt 재해시" sub="평문 → bcrypt" color={C.safe} />
              <Arrow x1={300} y1={46} x2={318} y2={46} color={C.safe} />

              <StatusBox x={320} y={30} w={85} h={32} label="DB 갱신" sub="bcrypt 저장" color={C.safe} progress={1} />

              <Arrow x1={405} y1={46} x2={423} y2={46} color={C.safe} />
              <DataBox x={425} y={32} w={50} h={28} label="완료" color={C.safe} />

              {/* 미로그인 계정 */}
              <rect x={10} y={80} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>미로그인 계정 처리</text>

              <DataBox x={30} y={110} w={100} h={28} label="장기 미접속" color={C.danger} />
              <Arrow x1={130} y1={124} x2={158} y2={124} color={C.action} />
              <ActionBox x={160} y={108} w={100} h={32} label="강제 변경 유도" sub="다음 로그인 시" color={C.action} />
              <Arrow x1={260} y1={124} x2={288} y2={124} color={C.safe} />
              <ActionBox x={290} y={108} w={100} h={32} label="새 PW 설정" sub="bcrypt로 저장" color={C.safe} />

              {/* 진행률 추적 */}
              <rect x={60} y={155} width={360} height={38} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>마이그레이션 진행률 추적</text>
              <text x={240} y={184} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">ISMS 심사: "구 해시 잔존 비율" 확인 → 100% bcrypt 전환 목표</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

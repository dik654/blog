import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  policy: '#6366f1',   // 인디고 — 정책/규칙
  action: '#f59e0b',   // 앰버 — 동작/프로세스
  safe: '#10b981',     // 에메랄드 — 안전/통과
  danger: '#ef4444',   // 레드 — 위험/거부
};

const STEPS = [
  {
    label: '생성 규칙 — 길이·조합·금지패턴·유사도',
    body: '8자+(관리자 10자+), 3종 이상 조합. 연속(abc/123)·반복(aaa)·아이디 포함·사전 단어 금지.\n유사도 80% 이상 거부. 엔트로피: 8자 소문자 ≈ 2,000억 vs 12자 ≈ 9.5경 (47만 배 차이).',
  },
  {
    label: '변경 주기 + 저장 — 해시 알고리즘 선택',
    body: '일반 90일, 관리자 60일, 서비스 계정은 Vault 자동 교체(반기 1회). 재사용 5회 금지.\n저장: 단방향 해시 필수. MD5/SHA-1 부적합 → bcrypt/Argon2 적합. cost factor로 연산 시간 조절.',
  },
  {
    label: '장기 미접속 + 잠금 — 6개월 미사용 계정 처리',
    body: '6개월 미접속 → 자동 잠금 → 본인 확인 후 복구 → PW 즉시 변경 강제.\n위험: 퇴직자 계정 활성, 유출 자격증명 유효, 미사용 활성 계정 = ISMS 부적합 사유.',
  },
  {
    label: '초기화 절차 — 본인확인·임시PW·강제변경',
    body: '본인확인(이메일/휴대폰, 관리자=대면). 임시 PW 발급(24시간 유효) → 첫 로그인 시 변경 강제.\n초기화 권한: 일반=셀프, 관리자=CISO 승인. 이력 기록 필수.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#pp-arrow)" />
  );
}

export default function PasswordPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 생성 규칙 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 입력 → 검증 흐름 */}
              <ModuleBox x={10} y={10} w={85} h={48} label="PW 입력" sub="사용자 생성 요청" color={C.policy} />
              <Arrow x1={95} y1={34} x2={118} y2={34} color={C.action} />

              {/* 검증 게이트 */}
              <ActionBox x={120} y={8} w={100} h={52} label="검증 게이트" sub="4단계 필터링" color={C.action} />
              <Arrow x1={220} y1={34} x2={248} y2={34} color={C.safe} />

              {/* 통과 시 */}
              <StatusBox x={250} y={8} w={95} h={50} label="통과" sub="PW 등록 완료" color={C.safe} progress={1} />

              {/* 거부 분기 */}
              <Arrow x1={170} y1={60} x2={170} y2={75} color={C.danger} />
              <AlertBox x={120} y={77} w={100} h={38} label="거부" sub="규칙 위반 안내" color={C.danger} />

              {/* 4가지 규칙 상세 */}
              <rect x={10} y={130} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={10} y={140} w={105} h={28} label="8자+ (관리자 10+)" color={C.policy} />
              <DataBox x={125} y={140} w={105} h={28} label="3종 이상 조합" color={C.policy} />
              <DataBox x={240} y={140} w={115} h={28} label="금지패턴 차단" color={C.danger} />
              <DataBox x={365} y={140} w={105} h={28} label="유사도 <80%" color={C.action} />

              {/* 엔트로피 비교 */}
              <rect x={355} y={8} width={118} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={414} y={24} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">엔트로피 비교</text>
              <text x={414} y={37} textAnchor="middle" fontSize={7.5} fill={C.danger}>8자 소문자 = 2,000억</text>
              <text x={414} y={49} textAnchor="middle" fontSize={7.5} fill={C.safe}>12자 소문자 = 9.5경</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">길이 4자 증가 → 탐색 공간 47만 배 확대. 복잡도보다 길이가 엔트로피 기여도 높음</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.policy}>금지: abc/123(연속), aaa(반복), 아이디 포함, 사전 단어, qwerty(키보드 배열)</text>
            </motion.g>
          )}

          {/* ── Step 1: 변경 주기 + 저장 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 변경 주기 3가지 */}
              <text x={120} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">변경 주기</text>

              <DataBox x={10} y={22} w={90} h={30} label="일반: 90일" color={C.policy} />
              <DataBox x={110} y={22} w={90} h={30} label="관리자: 60일" color={C.action} />
              <DataBox x={210} y={22} w={110} h={30} label="서비스: Vault 자동" color={C.safe} />

              <ActionBox x={340} y={20} w={120} h={34} label="재사용 5회 금지" sub="해시 이력 비교" color={C.danger} />

              {/* 구분선 */}
              <rect x={10} y={68} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={83} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">비밀번호 저장: 해시 알고리즘</text>

              {/* 해시 비교 흐름 */}
              <ModuleBox x={10} y={92} w={85} h={48} label="평문 PW" sub="사용자 입력" color={C.policy} />
              <Arrow x1={95} y1={116} x2={118} y2={116} color={C.action} />

              <ActionBox x={120} y={95} w={90} h={42} label="해시 함수" sub="단방향 변환" color={C.action} />

              {/* 부적합 경로 */}
              <Arrow x1={210} y1={105} x2={250} y2={97} color={C.danger} />
              <AlertBox x={252} y={80} w={105} h={36} label="MD5 / SHA-1" sub="부적합 — 취약" color={C.danger} />

              {/* 적합 경로 */}
              <Arrow x1={210} y1={126} x2={250} y2={134} color={C.safe} />
              <StatusBox x={252} y={120} w={105} h={44} label="bcrypt / Argon2" sub="적합 — 느린 해시" color={C.safe} progress={1} />

              {/* cost factor 설명 */}
              <Arrow x1={357} y1={142} x2={380} y2={142} color={C.safe} />
              <rect x={382} y={125} width={90} height={36} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={427} y={140} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>cost factor</text>
              <text x={427} y={152} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">연산 시간 조절</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bcrypt: salt 자동 포함 → 동일 PW라도 다른 해시. cost factor↑ → 수백ms/회</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>평문 저장·복호화 가능 형태 = ISMS 부적합 사유</text>
            </motion.g>
          )}

          {/* ── Step 2: 장기 미접속 + 잠금 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 메인 흐름 */}
              <DataBox x={10} y={15} w={90} h={30} label="last_login" color={C.policy} />
              <Arrow x1={100} y1={30} x2={123} y2={30} color={C.action} />

              <ActionBox x={125} y={10} w={115} h={40} label="6개월 경과 체크" sub="현재일 - last_login" color={C.action} />

              {/* 정상 분기 */}
              <Arrow x1={240} y1={20} x2={275} y2={15} color={C.safe} />
              <text x={253} y={16} fontSize={7.5} fill={C.safe}>N</text>
              <StatusBox x={278} y={0} w={90} h={38} label="정상 접속" sub="로그인 허용" color={C.safe} progress={1} />

              {/* 잠금 분기 */}
              <Arrow x1={240} y1={40} x2={275} y2={48} color={C.danger} />
              <text x={253} y={47} fontSize={7.5} fill={C.danger}>Y</text>
              <AlertBox x={278} y={35} w={90} h={38} label="자동 잠금" sub="계정 비활성화" color={C.danger} />

              {/* 복구 흐름 */}
              <Arrow x1={368} y1={54} x2={395} y2={54} color={C.action} />
              <ActionBox x={397} y={35} w={75} h={38} label="본인확인" sub="신원 검증" color={C.action} />

              <Arrow x1={434} y1={73} x2={434} y2={88} color={C.safe} />
              <ActionBox x={380} y={90} w={95} h={34} label="PW 즉시 변경" sub="복구 조건" color={C.safe} />

              {/* 위험 요소 3가지 */}
              <rect x={10} y={135} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={152} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>미처리 시 위험</text>

              <AlertBox x={10} y={160} w={140} h={40} label="퇴직자 계정 활성" sub="외부 악용 가능" color={C.danger} />
              <AlertBox x={165} y={160} w={150} h={40} label="유출 자격증명 유효" sub="PW 변경 이력 없음" color={C.danger} />
              <AlertBox x={330} y={160} w={140} h={40} label="미사용 활성 계정" sub="= ISMS 부적합 사유" color={C.danger} />
            </motion.g>
          )}

          {/* ── Step 3: 초기화 절차 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 초기화 요청 → 본인확인 → 임시PW → 강제변경 */}
              <ModuleBox x={5} y={10} w={80} h={48} label="초기화 요청" sub="PW 분실/잠금" color={C.policy} />
              <Arrow x1={85} y1={34} x2={108} y2={34} color={C.action} />

              <ActionBox x={110} y={12} w={95} h={44} label="본인확인" sub="이메일/휴대폰" color={C.action} />
              <Arrow x1={205} y1={34} x2={228} y2={34} color={C.action} />

              <DataBox x={230} y={18} w={95} h={32} label="임시 PW 발급" color={C.action} />
              <Arrow x1={325} y1={34} x2={348} y2={34} color={C.safe} />

              <ActionBox x={350} y={12} w={120} h={44} label="첫 로그인 변경" sub="다른 기능 차단" color={C.safe} />

              {/* 유효 시간 */}
              <rect x={230} y={55} width={95} height={18} rx={4} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={277} y={67} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.danger}>24시간 유효</text>

              {/* 구분선 */}
              <rect x={10} y={90} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 초기화 권한 분기 */}
              <text x={130} y={107} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">초기화 권한</text>

              <DataBox x={15} y={114} w={110} h={30} label="일반 = 셀프서비스" color={C.safe} />
              <DataBox x={140} y={114} w={130} h={30} label="관리자 = CISO 승인" color={C.action} />
              <DataBox x={285} y={114} w={120} h={30} label="관리자 확인 = 대면" color={C.danger} />

              {/* 이력 기록 */}
              <text x={350} y={107} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">이력 기록</text>

              <rect x={285} y={155} width={180} height={48} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={375} y={172} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">필수 기록 항목</text>
              <text x={375} y={185} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">요청자 · 승인자 · 일시 · 사유</text>
              <text x={375} y={197} textAnchor="middle" fontSize={7.5} fill={C.policy}>분기별 검토 대상</text>

              {/* 흐름도 요약 */}
              <rect x={15} y={155} width={255} height={48} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={142} y={172} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>임시 PW 상태 제약</text>
              <text x={142} y={185} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">PW 변경 화면만 접근 가능</text>
              <text x={142} y={197} textAnchor="middle" fontSize={7.5} fill={C.danger}>다른 모든 기능 접근 차단</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

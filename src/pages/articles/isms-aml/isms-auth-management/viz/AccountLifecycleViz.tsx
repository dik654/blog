import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  proc: '#6366f1',   // 절차/프로세스 (indigo)
  warn: '#f59e0b',   // 주의/임시 (amber)
  done: '#10b981',   // 완료/정상 (emerald)
  deny: '#ef4444',   // 차단/폐기 (red)
};

const STEPS = [
  {
    label: '신규 발급 — 최소 권한 원칙',
    body: '신청서 → 부서장 승인 → 정보보호팀 승인 → RBAC 역할 매핑 → 임시 PW 발급 → 첫 로그인 변경 강제.\n"일단 넓게 주고 나중에 줄인다"는 사고 원인 — 필요 최소한만 부여.',
  },
  {
    label: '권한 변경 — 임시 권한과 자동 회수',
    body: '부서이동 = 역할 재배정, 프로젝트 = 추가역할(만료일), 장애대응 = 긴급특권(24h).\n핵심: Auto-revocation — 사람이 아닌 시스템이 만료 시 자동 회수.',
  },
  {
    label: '공용 계정 관리',
    body: '공용 계정은 행위 추적이 불가능 — "누가 했는가" 특정 불가.\n사용대장 기록, IP 제한(점프서버), 세션 녹화, 점진적 감축 계획 수립.',
  },
  {
    label: '퇴직 처리 — 즉시 차단',
    body: '퇴직 당일 비활성화(삭제X), VPN 인증서 폐기, 공유 PW 변경, 접근이력 6개월 보관.\nVASP: 멀티시그 서명자에서 즉시 제외 + 임계값 재조정.',
  },
  {
    label: '분기별 점검 — 권한 누적 방지',
    body: '미사용 계정 정리(90일 기준), 권한 적정성 검토, 관리자 계정 CISO 보고, 서비스 계정 점검.\n정책서만 있고 증적이 없으면 부적합 판정.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#al-arrow)" />
  );
}

/* ── 세로 화살표 유틸 ── */
function ArrowDown({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#al-arrow)" />
  );
}

export default function AccountLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="al-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 신규 발급 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 승인 파이프라인 (상단) */}
              <DataBox x={5} y={12} w={80} h={32} label="신청서" sub="사유 명시" color={C.proc} />
              <Arrow x1={85} y1={28} x2={105} y2={28} color={C.proc} />

              <ActionBox x={108} y={9} w={85} h={38} label="부서장 승인" sub="1차 검토" color={C.warn} />
              <Arrow x1={193} y1={28} x2={213} y2={28} color={C.proc} />

              <ActionBox x={216} y={9} w={95} h={38} label="정보보호팀 승인" sub="2차 검토" color={C.warn} />
              <Arrow x1={311} y1={28} x2={331} y2={28} color={C.proc} />

              <ModuleBox x={334} y={6} w={135} h={44} label="RBAC 역할 매핑" sub="개별 권한 직접 부여 X" color={C.done} />

              {/* 발급 흐름 (하단) */}
              <ArrowDown x1={400} y1={50} x2={400} y2={70} color={C.done} />

              <ActionBox x={295} y={72} w={110} h={38} label="임시 PW 발급" sub="별도 채널 전달" color={C.proc} />
              <Arrow x1={295} y1={91} x2={268} y2={91} color={C.proc} />

              <StatusBox x={138} y={66} w={128} h={50} label="첫 로그인 변경 강제" sub="MFA 등록 + 서약서 동의" color={C.done} progress={1} />

              {/* 핵심 원칙 (하단) */}
              <rect x={15} y={135} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={153} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">최소 권한 원칙 (Least Privilege)</text>

              <AlertBox x={25} y={160} w={130} h={44} label="과다 권한 금지" sub="넓게 주고 줄이기 = 사고" color={C.deny} />
              <DataBox x={175} y={165} w={130} h={32} label="Dev / Prod 계정 분리" color={C.warn} />
              <DataBox x={325} y={165} w={135} h={32} label="CISO 승인 (관리자급)" color={C.proc} />
            </motion.g>
          )}

          {/* ── Step 1: 권한 변경 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3가지 상황 */}
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">권한 변경 시나리오</text>

              {/* 부서이동 */}
              <DataBox x={8} y={28} w={70} h={30} label="부서이동" color={C.proc} />
              <Arrow x1={78} y1={43} x2={108} y2={43} color={C.proc} />
              <ActionBox x={110} y={26} w={95} h={34} label="역할 재배정" sub="이전 역할 즉시 해제" color={C.proc} />
              <Arrow x1={205} y1={43} x2={235} y2={43} color={C.done} />
              <StatusBox x={238} y={22} w={105} h={44} label="인사 연동" sub="자동 처리" color={C.done} progress={1} />

              {/* 프로젝트 */}
              <DataBox x={8} y={78} w={70} h={30} label="프로젝트" color={C.warn} />
              <Arrow x1={78} y1={93} x2={108} y2={93} color={C.warn} />
              <ActionBox x={110} y={76} w={95} h={34} label="추가 역할" sub="만료일 설정" color={C.warn} />
              <Arrow x1={205} y1={93} x2={235} y2={93} color={C.warn} />
              <AlertBox x={238} y={72} w={105} h={44} label="만료 시 자동 회수" sub="시스템 타이머" color={C.warn} />

              {/* 장애대응 */}
              <DataBox x={8} y={128} w={70} h={30} label="장애대응" color={C.deny} />
              <Arrow x1={78} y1={143} x2={108} y2={143} color={C.deny} />
              <ActionBox x={110} y={126} w={95} h={34} label="긴급 특권" sub="최대 24시간" color={C.deny} />
              <Arrow x1={205} y1={143} x2={235} y2={143} color={C.deny} />
              <AlertBox x={238} y={122} w={105} h={44} label="타이머 회수" sub="+ 사후 검토 보고" color={C.deny} />

              {/* Auto-revocation 강조 */}
              <rect x={360} y={30} width={110} height={130} rx={10} fill="none" stroke={C.done} strokeWidth={1.5} strokeDasharray="6 3" />
              <text x={415} y={85} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.done}>Auto</text>
              <text x={415} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.done}>Revocation</text>
              <text x={415} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사람 위임 = 잊혀짐</text>
              <text x={415} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">시스템 강제 = 확실</text>

              {/* 하단 요약 */}
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">임시 권한의 핵심: 만료일 없는 권한 부여 = 영구 권한 = 위험</text>
            </motion.g>
          )}

          {/* ── Step 2: 공용 계정 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 문제 */}
              <AlertBox x={155} y={8} w={170} h={42} label="공용 계정 (admin, root)" sub="행위 추적 불가 — 누가 했는가?" color={C.deny} />

              {/* 4가지 통제 */}
              <ArrowDown x1={180} y1={50} x2={180} y2={68} color={C.proc} />
              <ArrowDown x1={300} y1={50} x2={300} y2={68} color={C.proc} />

              <rect x={15} y={60} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">통제 수단</text>

              <ActionBox x={15} y={88} w={105} h={42} label="사용대장 기록" sub="사용자·일시·사유" color={C.proc} />
              <Arrow x1={120} y1={109} x2={135} y2={109} color={C.proc} />

              <ModuleBox x={138} y={86} w={100} h={48} label="IP 제한" sub="점프서버만 허용" color={C.warn} />
              <Arrow x1={238} y1={109} x2={253} y2={109} color={C.warn} />

              <ModuleBox x={256} y={86} w={100} h={48} label="세션 녹화" sub="전체 기록 보관" color={C.done} />
              <Arrow x1={356} y1={109} x2={371} y2={109} color={C.done} />

              <StatusBox x={374} y={84} w={95} h={50} label="감축 계획" sub="현재 → 목표 수량" color={C.done} progress={0.4} />

              {/* 흐름도: 접속 과정 */}
              <rect x={15} y={148} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">공용 계정 접속 흐름</text>

              <DataBox x={15} y={175} w={80} h={28} label="사용 신청" color={C.proc} />
              <Arrow x1={95} y1={189} x2={115} y2={189} color={C.proc} />
              <DataBox x={118} y={175} w={80} h={28} label="대장 기록" color={C.proc} />
              <Arrow x1={198} y1={189} x2={218} y2={189} color={C.warn} />
              <DataBox x={221} y={175} w={80} h={28} label="점프서버" color={C.warn} />
              <Arrow x1={301} y1={189} x2={321} y2={189} color={C.done} />
              <DataBox x={324} y={175} w={80} h={28} label="세션 녹화" color={C.done} />
              <Arrow x1={404} y1={189} x2={424} y2={189} color={C.done} />
              <DataBox x={427} y={175} w={45} h={28} label="접속" color={C.done} />
            </motion.g>
          )}

          {/* ── Step 3: 퇴직 처리 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 트리거 */}
              <ModuleBox x={5} y={10} w={90} h={44} label="인사팀" sub="퇴직 처리 통보" color={C.deny} />
              <Arrow x1={95} y1={32} x2={118} y2={32} color={C.deny} />

              <text x={145} y={22} fontSize={8} fontWeight={600} fill={C.deny}>당일</text>
              <ActionBox x={120} y={24} w={80} h={32} label="즉시 비활성화" color={C.deny} />
              <text x={160} y={70} fontSize={8} fill="var(--muted-foreground)">삭제 X (감사추적)</text>

              {/* 병렬 처리 4가지 */}
              <Arrow x1={200} y1={32} x2={230} y2={15} color={C.deny} />
              <Arrow x1={200} y1={38} x2={230} y2={50} color={C.deny} />
              <Arrow x1={200} y1={44} x2={230} y2={85} color={C.deny} />
              <Arrow x1={200} y1={50} x2={230} y2={120} color={C.deny} />

              <ActionBox x={233} y={0} w={105} h={32} label="VPN 인증서 폐기" color={C.deny} />
              <ActionBox x={233} y={38} w={105} h={32} label="공유 PW 변경" sub="공용 계정 즉시" color={C.warn} />
              <ActionBox x={233} y={74} w={105} h={32} label="접근이력 보관" sub="최소 6개월" color={C.proc} />
              <ActionBox x={233} y={110} w={105} h={32} label="연관 자원 회수" sub="토큰·폴더·메일" color={C.proc} />

              {/* VASP 특수사항 */}
              <rect x={355} y={0} width={120} height={148} rx={8} fill="none" stroke={C.warn} strokeWidth={1} strokeDasharray="5 3" />
              <text x={415} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.warn}>VASP 특수</text>

              <rect x={365} y={28} width={100} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={415} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">멀티시그 제외</text>
              <text x={415} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">서명자 즉시 해제</text>
              <text x={415} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3-of-5 → 3-of-4</text>

              <rect x={365} y={86} width={100} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={415} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">임계값 재조정</text>
              <text x={415} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">신규 서명자 추가</text>
              <text x={415} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">또는 N-of-(M-1)</text>

              {/* 타임라인 강조 */}
              <rect x={15} y={155} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.deny}>시간이 생명 — 지연 = 정보 유출 위험 증가</text>

              <DataBox x={30} y={180} w={120} h={28} label="당일: 계정 비활성화" color={C.deny} />
              <DataBox x={170} y={180} w={140} h={28} label="1주 내: 자원 회수 완료" color={C.warn} />
              <DataBox x={330} y={180} w={130} h={28} label="6개월: 이력 보관 유지" color={C.proc} />
            </motion.g>
          )}

          {/* ── Step 4: 분기별 점검 ── */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">분기별 계정 리뷰 — Privilege Creep 방지</text>

              {/* 4가지 점검 항목 (2x2 그리드) */}
              <ModuleBox x={15} y={28} w={215} h={48} label="미사용 계정 정리" sub="90일 미로그인 → 부서 확인 → 비활성화" color={C.proc} />
              <ModuleBox x={250} y={28} w={215} h={48} label="권한 적정성 검토" sub="현재 권한 vs 현재 직무 → 잔존 권한 회수" color={C.warn} />

              <ModuleBox x={15} y={88} w={215} h={48} label="관리자 계정 재확인" sub="관리자급 목록 → CISO 보고 → 불필요 회수" color={C.deny} />
              <ModuleBox x={250} y={88} w={215} h={48} label="서비스 계정 점검" sub="폐기 시스템의 연동 계정 → 식별 후 삭제" color={C.done} />

              {/* 중앙 흐름 화살표 */}
              <ArrowDown x1={240} y1={76} x2={240} y2={88} color="var(--muted-foreground)" />

              {/* 결과 처리 */}
              <rect x={15} y={150} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={160} w={115} h={38} label="이상 사항 즉시 조치" sub="발견 → 당일 처리" color={C.deny} />
              <Arrow x1={145} y1={179} x2={168} y2={179} color={C.proc} />

              <ActionBox x={170} y={160} w={110} h={38} label="조치 이력 증적" sub="보고서 자동 생성" color={C.proc} />
              <Arrow x1={280} y1={179} x2={303} y2={179} color={C.done} />

              <StatusBox x={305} y={154} w={160} h={50} label="ISMS 심사 증적 제출" sub="정책서 + 실행 증적 = 통과" color={C.done} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

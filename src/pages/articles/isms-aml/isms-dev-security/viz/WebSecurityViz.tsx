import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  amber: '#f59e0b',
};

const STEPS = [
  {
    label: '서버 정보 노출 방지 + UUID',
    body: 'Server 헤더에 버전 노출 시 공격자가 CVE를 검색하여 타겟 공격 가능. server_tokens off + 커스텀 에러 페이지로 차단.\n순차 ID(/users/1,2,3)는 열거 공격(IDOR)에 취약. UUID v4(122비트 랜덤)로 전환하면 예측 불가.',
  },
  {
    label: 'XSS 3계층 방어',
    body: '공격자가 악성 스크립트를 삽입하면 세션 쿠키 탈취가 가능.\n3단계 방어: 입력 이스케이프 + CSP 헤더(script-src \'self\') + HttpOnly 쿠키.',
  },
  {
    label: 'CSRF + SQL Injection',
    body: 'CSRF: 인증 상태에서 악성 사이트 방문 시 의도하지 않은 요청 전송. CSRF 토큰 + SameSite 쿠키로 방어.\nSQL Injection: 입력값에 SQL 삽입으로 DB 조작. Prepared Statement로 구조와 데이터를 분리.',
  },
  {
    label: '세션 관리 + CORS',
    body: '세션: HttpOnly+Secure 플래그, 로그인 시 세션 ID 재생성(fixation 방지), 금융 10~15분 타임아웃.\nCORS: 화이트리스트 도메인만 허용, 와일드카드(*) 금지, Credentials:true 시 Origin 명시 필수.',
  },
];

/* ---- 화살표 유틸 ---- */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#ws-arrow)" />
  );
}

export default function WebSecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ws-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 서버 정보 노출 + UUID ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 상단: 서버 정보 노출 */}
              <text x={120} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>BEFORE</text>
              <ModuleBox x={20} y={22} w={80} h={40} label="nginx" sub="v1.24.0" color={C.blue} />
              <Arrow x1={100} y1={42} x2={128} y2={42} color={C.red} />
              <AlertBox x={132} y={20} w={140} h={44} label="Server: nginx/1.24.0" sub="버전 노출 → CVE 검색" color={C.red} />

              {/* 공격자 */}
              <Arrow x1={272} y1={42} x2={300} y2={42} color={C.red} />
              <AlertBox x={304} y={22} w={100} h={40} label="공격자" sub="알려진 취약점 활용" color={C.red} />

              {/* 방어 */}
              <text x={120} y={84} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>AFTER</text>
              <ActionBox x={20} y={92} w={105} h={36} label="server_tokens off" sub="버전 제거" color={C.green} />
              <Arrow x1={125} y1={110} x2={150} y2={110} color={C.green} />
              <StatusBox x={153} y={90} w={120} h={42} label="커스텀 에러 페이지" sub="정보 차단" color={C.green} progress={1} />

              {/* 하단: UUID */}
              <rect x={10} y={142} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={60} y={160} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.red}>순차 ID</text>
              <DataBox x={95} y={148} w={70} h={26} label="/users/1" color={C.red} />
              <DataBox x={170} y={148} w={70} h={26} label="/users/2" color={C.red} />
              <text x={252} y={163} fontSize={10} fill={C.red}>...</text>
              <AlertBox x={268} y={147} w={75} h={28} label="열거 공격" color={C.red} />

              <text x={60} y={192} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.green}>UUID v4</text>
              <DataBox x={95} y={182} w={170} h={28} label="/users/550e8400-e29b..." color={C.green} />
              <Arrow x1={265} y1={196} x2={290} y2={196} color={C.green} />
              <StatusBox x={294} y={180} w={110} h={34} label="예측 불가" sub="122비트 랜덤" color={C.green} progress={1} />
            </motion.g>
          )}

          {/* ── Step 1: XSS 3계층 방어 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 공격 흐름 */}
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>XSS 공격 흐름</text>
              <AlertBox x={10} y={22} w={120} h={38} label="<script>악성코드" sub="사용자 입력에 삽입" color={C.red} />
              <Arrow x1={130} y1={41} x2={158} y2={41} color={C.red} />
              <ModuleBox x={162} y={20} w={100} h={42} label="웹 페이지" sub="스크립트 실행" color={C.amber} />
              <Arrow x1={262} y1={41} x2={290} y2={41} color={C.red} />
              <AlertBox x={294} y={22} w={120} h={38} label="세션 쿠키 탈취" sub="document.cookie" color={C.red} />

              {/* 3계층 방어 */}
              <text x={240} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>3계층 방어</text>

              {/* 1계층: 이스케이프 */}
              <rect x={15} y={92} width={14} height={14} rx={7} fill={C.green} />
              <text x={22} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">1</text>
              <ActionBox x={35} y={88} w={120} h={36} label="입력 이스케이프" sub="<script> → &lt;script&gt;" color={C.green} />

              {/* 2계층: CSP */}
              <rect x={175} y={92} width={14} height={14} rx={7} fill={C.blue} />
              <text x={182} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">2</text>
              <ActionBox x={195} y={88} w={120} h={36} label="CSP 헤더" sub="script-src 'self'" color={C.blue} />

              {/* 3계층: HttpOnly */}
              <rect x={335} y={92} width={14} height={14} rx={7} fill={C.amber} />
              <text x={342} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">3</text>
              <ActionBox x={355} y={88} w={110} h={36} label="HttpOnly 쿠키" sub="JS 쿠키접근 차단" color={C.amber} />

              {/* 방어 효과 표시 */}
              <rect x={15} y={140} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={95} y={160} textAnchor="middle" fontSize={9} fill={C.green}>삽입 자체 차단</text>
              <Arrow x1={95} y1={124} x2={95} y2={148} color={C.green} />

              <text x={255} y={160} textAnchor="middle" fontSize={9} fill={C.blue}>실행 차단</text>
              <Arrow x1={255} y1={124} x2={255} y2={148} color={C.blue} />

              <text x={410} y={160} textAnchor="middle" fontSize={9} fill={C.amber}>탈취 차단</text>
              <Arrow x1={410} y1={124} x2={410} y2={148} color={C.amber} />

              {/* 종합 */}
              <StatusBox x={130} y={170} w={220} h={40} label="3계층 모두 통과해야 공격 성공" sub="한 계층만 막아도 XSS 실패" color={C.green} progress={1} />
            </motion.g>
          )}

          {/* ── Step 2: CSRF + SQL Injection ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* CSRF 상단 */}
              <text x={120} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>CSRF 공격</text>

              <DataBox x={10} y={22} w={85} h={30} label="사용자" sub="은행 로그인 상태" color={C.blue} />
              <Arrow x1={95} y1={37} x2={118} y2={37} color={C.red} />
              <AlertBox x={122} y={20} w={100} h={34} label="악성 사이트 방문" color={C.red} />
              <Arrow x1={222} y1={37} x2={245} y2={37} color={C.red} />
              <AlertBox x={249} y={20} w={110} h={34} label="위조 송금 요청" sub="쿠키 자동 전송" color={C.red} />

              {/* CSRF 방어 */}
              <text x={120} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>CSRF 방어</text>
              <ActionBox x={10} y={80} w={100} h={32} label="CSRF 토큰" sub="폼마다 랜덤 발급" color={C.green} />
              <text x={120} y={100} fontSize={10} fill="var(--muted-foreground)">+</text>
              <ActionBox x={132} y={80} w={110} h={32} label="SameSite 쿠키" sub="Strict / Lax" color={C.green} />
              <Arrow x1={242} y1={96} x2={270} y2={96} color={C.green} />
              <StatusBox x={274} y={78} w={120} h={36} label="위조 요청 차단" color={C.green} progress={1} />

              {/* 구분선 */}
              <rect x={10} y={122} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* SQL Injection */}
              <text x={120} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>SQL Injection</text>

              <DataBox x={10} y={148} w={110} h={30} label="입력: ' OR '1'='1" color={C.red} />
              <Arrow x1={120} y1={163} x2={145} y2={163} color={C.red} />
              <AlertBox x={149} y={146} w={140} h={34} label="WHERE pw='' OR '1'='1'" sub="쿼리 구조 변형!" color={C.red} />
              <Arrow x1={289} y1={163} x2={310} y2={163} color={C.red} />
              <AlertBox x={314} y={148} w={80} h={30} label="전체 유출" color={C.red} />

              {/* SQL Injection 방어 */}
              <text x={120} y={198} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>방어</text>
              <ActionBox x={155} y={188} w={150} h={30} label="Prepared Statement" sub="구조와 데이터 분리" color={C.green} />
              <Arrow x1={305} y1={203} x2={330} y2={203} color={C.green} />
              <StatusBox x={334} y={188} w={130} h={30} label="SQL 삽입 불가" color={C.green} progress={1} />
            </motion.g>
          )}

          {/* ── Step 3: 세션 관리 + CORS ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 세션 관리 */}
              <text x={120} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>세션 보안</text>

              <ModuleBox x={10} y={22} w={80} h={40} label="로그인" sub="인증 성공" color={C.blue} />
              <Arrow x1={90} y1={42} x2={110} y2={42} color={C.green} />
              <ActionBox x={114} y={24} w={100} h={36} label="세션 ID 재생성" sub="fixation 방지" color={C.green} />
              <Arrow x1={214} y1={42} x2={232} y2={42} color={C.green} />

              {/* 쿠키 플래그 */}
              <DataBox x={236} y={20} w={80} h={26} label="HttpOnly" color={C.amber} />
              <DataBox x={322} y={20} w={70} h={26} label="Secure" color={C.amber} />
              <DataBox x={236} y={50} w={156} h={26} label="금융: 10~15분 타임아웃" color={C.blue} />

              {/* 구분선 */}
              <rect x={10} y={86} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* CORS */}
              <text x={120} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>CORS 설정</text>

              {/* 안전 설정 */}
              <ModuleBox x={10} y={112} w={110} h={42} label="API 서버" sub="Access-Control" color={C.blue} />
              <Arrow x1={120} y1={133} x2={140} y2={133} color={C.green} />

              <ActionBox x={144} y={114} w={130} h={38} label="화이트리스트 Origin" sub="허용 도메인만 명시" color={C.green} />
              <Arrow x1={274} y1={133} x2={295} y2={133} color={C.green} />
              <StatusBox x={299} y={112} w={110} h={42} label="안전한 교차 요청" sub="명시 도메인만 허용" color={C.green} progress={1} />

              {/* 위험 설정 */}
              <AlertBox x={10} y={168} w={140} h={38} label="Allow-Origin: *" sub="와일드카드 금지!" color={C.red} />
              <Arrow x1={150} y1={187} x2={175} y2={187} color={C.red} />

              <AlertBox x={179} y={168} w={170} h={38} label="Credentials:true + *" sub="브라우저가 차단 (정책 위반)" color={C.red} />

              {/* 올바른 조합 */}
              <Arrow x1={349} y1={187} x2={370} y2={187} color={C.green} />
              <StatusBox x={374} y={168} w={96} h={38} label="Origin 명시" sub="필수 조합" color={C.green} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

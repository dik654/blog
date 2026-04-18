import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#6366f1', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '3중 망분리: 개발 · 서비스 · 관리', body: '각 망 사이 방화벽+ACL로 허용 트래픽만 통과. 개발망 침해 → 서비스망 DB 접근 불가. 클라우드에서는 VPC 분리+Security Group으로 구현.' },
  { label: 'DB 접근제어: 세션 · 쿼리 · IP', body: 'DB 접근제어 소프트웨어(PETRA/Chakra) 경유 필수. 세션 시작/종료 기록, 위험 SQL 차단(DROP/TRUNCATE), 관리망 IP만 접속 허용.' },
  { label: 'DB 계정 분리 체계', body: '서비스(readWrite만) / 관리자(기간 한정) / 백업(SELECT만) / 슈퍼관리자(비상 전용). 만능 계정 금지, 역할별 최소 권한 부여.' },
  { label: '비밀번호 정책과 관리자 페이지 보안', body: '8자+대소문자+숫자+특수문자, 90일 주기 변경, 5세대 재사용 금지, 6개월 미접속 자동 잠금. Admin Panel은 2차 인증 필수, 중복 로그인 차단.' },
  { label: 'UUID + Secrets Manager', body: '순차 ID 노출 → 열거공격. UUID v4(122비트 랜덤)로 대체. 시크릿은 AWS Secrets Manager에서 메모리 주입, 디스크 기록 금지, 자동 교체(rotation).' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ac-arrow)" />;
}

export default function AccessControlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ac-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three network zones */}
              <rect x={15} y={15} width={140} height={90} rx={8} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={85} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.green}>개발망</text>
              <text x={85} y={52} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">소스코드 작성</text>
              <text x={85} y={66} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">테스트 환경</text>
              <text x={85} y={80} textAnchor="middle" fontSize={8} fill={C.red}>서비스 DB 접근 X</text>

              {/* Firewall 1 */}
              <rect x={162} y={35} width={10} height={50} rx={2} fill={C.red} opacity={0.5} />
              <text x={167} y={100} textAnchor="middle" fontSize={7} fill={C.red}>방화벽</text>

              <rect x={180} y={15} width={140} height={90} rx={8} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={250} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>서비스망</text>
              <text x={250} y={52} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">프로덕션 환경</text>
              <text x={250} y={66} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이용자 요청 처리</text>

              {/* Firewall 2 */}
              <rect x={327} y={35} width={10} height={50} rx={2} fill={C.red} opacity={0.5} />
              <text x={332} y={100} textAnchor="middle" fontSize={7} fill={C.red}>방화벽</text>

              <rect x={345} y={15} width={125} height={90} rx={8} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={407} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>관리망</text>
              <text x={407} y={52} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">내부 관리 도구</text>
              <text x={407} y={66} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">DB 접근 허용</text>

              {/* ACL note */}
              <rect x={60} y={120} width={360} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={138} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">ACL(접근제어목록) — 허용된 트래픽만 통과</text>
              <text x={240} y={153} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">클라우드: VPC 분리 + Security Group 설정으로 동일 효과</text>

              {/* Attack path blocked */}
              <AlertBox x={100} y={175} w={280} h={34} label="개발환경 침해 → 프로덕션 데이터 도달 경로 차단" sub="" color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* DB access control software */}
              <ModuleBox x={160} y={10} w={160} h={42} label="DB 접근제어 S/W" sub="PETRA · Chakra" color={C.blue} />
              {/* Three dimensions */}
              <rect x={20} y={70} width={140} height={65} rx={6} fill={`${C.green}08`} stroke={C.green} strokeWidth={0.6} />
              <text x={90} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>세션 통제</text>
              <text x={90} y={103} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">직접 접속 차단</text>
              <text x={90} y={117} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시작/종료 시각 기록</text>
              <text x={90} y={131} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">접속자 정보 자동 기록</text>

              <rect x={170} y={70} width={140} height={65} rx={6} fill={`${C.amber}08`} stroke={C.amber} strokeWidth={0.6} />
              <text x={240} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>쿼리 통제</text>
              <text x={240} y={103} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">계정별 SQL 제한</text>
              <text x={240} y={117} textAnchor="middle" fontSize={9} fill={C.red}>DROP/TRUNCATE 차단</text>
              <text x={240} y={131} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">대량 SELECT 탐지</text>

              <rect x={320} y={70} width={140} height={65} rx={6} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.6} />
              <text x={390} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>IP 통제</text>
              <text x={390} y={103} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">관리망 IP만 허용</text>
              <text x={390} y={117} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">VPN 경유 필수</text>
              <text x={390} y={131} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">비허용 IP → 즉시 거부</text>

              {/* Arrows from control SW */}
              <Arrow x1={180} y1={52} x2={90} y2={68} color={C.green} />
              <Arrow x1={240} y1={52} x2={240} y2={68} color={C.amber} />
              <Arrow x1={300} y1={52} x2={390} y2={68} color={C.red} />

              {/* Monthly review */}
              <DataBox x={100} y={155} w={280} h={30} label="월간 DB 로그 검토 → 비인가 접근 · 비정상 대량 조회 점검" color={C.blue} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이상 징후 → 계정 즉시 잠금 → 보안팀 원인 조사 → CISO 보고</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 4 account types */}
              <rect x={15} y={15} width={110} height={70} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={70} y={35} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>서비스 계정</text>
              <text x={70} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">readWrite만</text>
              <text x={70} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">DDL 권한 없음</text>
              <text x={70} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">앱서버 전용</text>

              <rect x={135} y={15} width={110} height={70} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={190} y={35} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>관리자 계정</text>
              <text x={190} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기간 한정 발급</text>
              <text x={190} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">신청서+팀장 승인</text>
              <text x={190} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">완료 후 즉시 삭제</text>

              <rect x={255} y={15} width={110} height={70} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={310} y={35} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.blue}>백업 계정</text>
              <text x={310} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">SELECT만 보유</text>
              <text x={310} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">변경 불가</text>
              <text x={310} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">침해 시 위변조 X</text>

              <rect x={375} y={15} width={95} height={70} rx={6} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={422} y={35} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>슈퍼관리자</text>
              <text x={422} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">비상 전용</text>
              <text x={422} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">팀장급 이상</text>
              <text x={422} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CISO 사전 통보</text>

              {/* Principle */}
              <AlertBox x={80} y={100} w={320} h={34} label="만능 계정 = 가장 위험한 구조" sub="역할별 분리 → 최소 권한 원칙" color={C.red} />

              {/* Arrows showing hierarchy */}
              <rect x={30} y={150} width={420} height={50} rx={6} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.5} />
              <text x={40} y={168} fontSize={9} fontWeight={600} fill={C.blue}>권한 범위 (좁음 → 넓음)</text>
              <rect x={40} y={178} width={400} height={6} rx={3} fill="var(--border)" opacity={0.3} />
              <rect x={40} y={178} width={80} height={6} rx={3} fill={C.blue} />
              <text x={80} y={195} textAnchor="middle" fontSize={8} fill={C.blue}>백업</text>
              <rect x={130} y={178} width={100} height={6} rx={3} fill={C.green} />
              <text x={180} y={195} textAnchor="middle" fontSize={8} fill={C.green}>서비스</text>
              <rect x={240} y={178} width={100} height={6} rx={3} fill={C.amber} />
              <text x={290} y={195} textAnchor="middle" fontSize={8} fill={C.amber}>관리자</text>
              <rect x={350} y={178} width={90} height={6} rx={3} fill={C.red} />
              <text x={395} y={195} textAnchor="middle" fontSize={8} fill={C.red}>슈퍼관리자</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Password policy */}
              <rect x={15} y={15} width={220} height={95} rx={8} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={125} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>비밀번호 정책</text>
              <text x={25} y={54} fontSize={9} fill="var(--muted-foreground)">최소 8자 (대소문자+숫자+특수문자)</text>
              <text x={25} y={70} fontSize={9} fill="var(--muted-foreground)">90일 주기 강제 변경</text>
              <text x={25} y={86} fontSize={9} fill="var(--muted-foreground)">최근 5세대 재사용 금지</text>
              <text x={25} y={102} fontSize={9} fill={C.red}>6개월 미접속 → 자동 잠금</text>

              {/* Admin page security */}
              <rect x={250} y={15} width={220} height={95} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={360} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.green}>Admin Panel 보안</text>
              <text x={260} y={54} fontSize={9} fill="var(--muted-foreground)">2차 인증 필수 (OTP/인증서)</text>
              <text x={260} y={70} fontSize={9} fill="var(--muted-foreground)">비밀번호만으로는 진입 불가</text>
              <text x={260} y={86} fontSize={9} fill="var(--muted-foreground)">중복 로그인 차단</text>
              <text x={260} y={102} fontSize={9} fill={C.red}>세션 하이재킹 방지</text>

              {/* nginx */}
              <rect x={15} y={125} width={455} height={40} rx={6} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.5} />
              <text x={25} y={143} fontSize={10} fontWeight={600} fill={C.amber}>nginx 보안</text>
              <text x={110} y={143} fontSize={9} fill="var(--muted-foreground)">server_tokens off (버전 숨김) · 커스텀 에러 페이지 · 토큰은 Authorization 헤더로만 전달</text>
              <text x={25} y={158} fontSize={9} fill="var(--muted-foreground)">기본 에러 페이지에 서버 정보 포함 → CVE 공격 시도 가능</text>

              {/* Flow: access attempt */}
              <ActionBox x={40} y={178} w={90} h={32} label="접근 시도" color={C.blue} />
              <Arrow x1={130} y1={194} x2={148} y2={194} color={C.blue} />
              <ActionBox x={150} y={178} w={80} h={32} label="VPN 접속" color={C.green} />
              <Arrow x1={230} y1={194} x2={248} y2={194} color={C.green} />
              <ActionBox x={250} y={178} w={80} h={32} label="MFA 인증" color={C.amber} />
              <Arrow x1={330} y1={194} x2={348} y2={194} color={C.amber} />
              <ActionBox x={350} y={178} w={90} h={32} label="시스템 진입" color={C.green} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* UUID vs Sequential ID */}
              <rect x={15} y={15} width={200} height={85} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={115} y={35} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>순차 ID 노출 위험</text>
              <text x={25} y={54} fontSize={9} fill="var(--muted-foreground)">공격자: /user/1, /user/2, /user/3...</text>
              <text x={25} y={70} fontSize={9} fill="var(--muted-foreground)">→ 전체 레코드 수집 (열거공격)</text>
              <text x={25} y={86} fontSize={9} fill={C.red}>이용자 수/거래/지갑 목록 유출</text>

              <Arrow x1={215} y1={57} x2={233} y2={57} color={C.green} />

              <rect x={235} y={15} width={230} height={85} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={350} y={35} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>UUID v4 적용</text>
              <text x={245} y={54} fontSize={9} fill="var(--muted-foreground)">122비트 랜덤 → 추측 사실상 불가</text>
              <text x={245} y={70} fontSize={9} fill="var(--muted-foreground)">내부: 순차 ID (인덱싱 성능 유지)</text>
              <text x={245} y={86} fontSize={9} fill={C.green}>API 응답: UUID만 반환 (이중 구조)</text>

              {/* Secrets Manager */}
              <rect x={15} y={118} width={450} height={85} rx={8} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.6} />
              <text x={25} y={138} fontSize={11} fontWeight={700} fill={C.blue}>AWS Secrets Manager</text>
              {/* Flow inside */}
              <ActionBox x={25} y={148} w={95} h={30} label="앱 시작" sub="" color={C.blue} />
              <Arrow x1={120} y1={163} x2={138} y2={163} color={C.blue} />
              <ActionBox x={140} y={148} w={95} h={30} label="API 호출" sub="" color={C.green} />
              <Arrow x1={235} y1={163} x2={253} y2={163} color={C.green} />
              <ActionBox x={255} y={148} w={95} h={30} label="메모리 로드" sub="" color={C.amber} />
              <Arrow x1={350} y1={163} x2={368} y2={163} color={C.amber} />
              <DataBox x={370} y={152} w={80} h={24} label="디스크 X" color={C.red} />
              <text x={25} y={195} fontSize={9} fill="var(--muted-foreground)">자동 교체(rotation) · 접근 감사 로그 자동 기록 · 비인가 접근 실시간 탐지</text>

              <AlertBox x={100} y={208} w={280} h={7} label="" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

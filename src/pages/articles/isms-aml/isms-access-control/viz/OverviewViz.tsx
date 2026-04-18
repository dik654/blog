import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  net: '#3b82f6',    // 블루 — 네트워크/계층
  rule: '#f59e0b',   // 앰버 — 정책/규칙
  safe: '#10b981',   // 에메랄드 — 허용/안전
  danger: '#ef4444', // 레드 — 차단/위험
};

const STEPS = [
  {
    label: '최소 권한 원칙 — 기본 거부·Need-to-Know·시간 제한',
    body: '접근통제 핵심: "업무에 필요한 최소한의 자원에만 접근 가능." 이 원칙이 깨지면 단일 계정 탈취로 전체 시스템 위험.\n기본 거부(Default Deny) → 명시적 허용만 통과. Need-to-Know → 알 필요 없는 정보는 차단.',
  },
  {
    label: '직무 분리 — 한 사람이 단독 수행 불가',
    body: '출금: 요청자/승인자/실행자 분리. 코드 배포: 개발자/리뷰어/배포 담당 분리. DB 변경: 요청자/DBA 분리.\nVASP 핵심: 멀티시그(기술적 분리) + 상장 심사위원회(제도적 분리). 선행매수 방지.',
  },
  {
    label: '심층 방어 — 4계층 독립 통제',
    body: '네트워크(방화벽·IPS) → 서버(SSH·IP 제한) → 애플리케이션(WAF·세션) → 데이터베이스(접근제어·쿼리 필터).\n"방화벽이 있으니 DB 접근제어 불필요"는 심층 방어의 정반대. 각 계층은 독립적으로 작동.',
  },
  {
    label: 'ISMS 2.6 세부 항목 + 제로 트러스트',
    body: '7개 세부 항목: 네트워크·정보시스템·응용프로그램·DB·무선·원격·인터넷 접근 통제.\n제로 트러스트: "내부망은 안전하다" 전제 폐기. 위치 무관 모든 접근 검증 → 심층 방어 철저 적용의 결과.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#acao-arrow)" />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="acao-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 최소 권한 원칙 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={175} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.net}>최소 권한 원칙 (Least Privilege)</text>

              {/* 접근 요청 → 정책 게이트 */}
              <DataBox x={10} y={34} w={80} h={30} label="접근 요청" color={C.net} />
              <Arrow x1={90} y1={49} x2={118} y2={49} color={C.rule} />

              <ActionBox x={120} y={31} w={110} h={36} label="정책 게이트" sub="3가지 원칙 검증" color={C.rule} />

              {/* 허용 경로 */}
              <Arrow x1={230} y1={40} x2={260} y2={34} color={C.safe} />
              <StatusBox x={262} y={24} w={100} h={38} label="접근 허용" sub="최소 범위" color={C.safe} progress={1} />

              {/* 차단 경로 */}
              <Arrow x1={230} y1={58} x2={260} y2={70} color={C.danger} />
              <AlertBox x={262} y={68} w={100} h={38} label="접근 거부" sub="기본 정책" color={C.danger} />

              {/* 구분선 */}
              <rect x={10} y={118} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 3가지 원칙 */}
              <ActionBox x={10} y={130} w={140} h={50} label="기본 거부" sub="Default Deny" color={C.danger} />
              <text x={80} y={194} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">명시적 허용 없으면</text>
              <text x={80} y={206} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 접근 차단</text>

              <ActionBox x={170} y={130} w={140} h={50} label="Need-to-Know" sub="알 필요 기반" color={C.rule} />
              <text x={240} y={194} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">업무에 직접 필요한</text>
              <text x={240} y={206} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정보만 접근 가능</text>

              <ActionBox x={330} y={130} w={140} h={50} label="시간 제한" sub="Time-bound" color={C.net} />
              <text x={400} y={194} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">업무 시간 외</text>
              <text x={400} y={206} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">관리자 페이지 차단</text>

              {/* 경고 - 원칙 위반 시 */}
              <AlertBox x={370} y={24} w={100} h={38} label="원칙 위반 시" sub="1계정→전체 위험" color={C.danger} />

              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">방화벽, 서버, DB 모두 동일한 기본 거부 원칙 적용</text>
            </motion.g>
          )}

          {/* ── Step 1: 직무 분리 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.rule}>직무 분리 (Separation of Duties)</text>

              {/* 출금 프로세스 — 3단계 */}
              <text x={240} y={35} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>출금 프로세스</text>
              <DataBox x={10} y={42} w={85} h={28} label="요청자" color={C.net} />
              <Arrow x1={95} y1={56} x2={118} y2={56} color={C.rule} />
              <ActionBox x={120} y={40} w={85} h={32} label="승인자" sub="MFA 인증" color={C.rule} />
              <Arrow x1={205} y1={56} x2={228} y2={56} color={C.rule} />
              <ActionBox x={230} y={40} w={85} h={32} label="실행자" sub="MFA 인증" color={C.rule} />
              <Arrow x1={315} y1={56} x2={338} y2={56} color={C.safe} />
              <StatusBox x={340} y={40} w={80} h={32} label="출금 완료" sub="" color={C.safe} progress={1} />

              {/* 멀티시그 표시 */}
              <rect x={425} y={40} width={48} height={32} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={449} y={54} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>멀티</text>
              <text x={449} y={65} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>시그</text>

              {/* 구분선 */}
              <rect x={10} y={82} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 코드 배포 */}
              <text x={120} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>코드 배포</text>
              <DataBox x={10} y={104} w={75} h={26} label="개발자" color={C.net} />
              <Arrow x1={85} y1={117} x2={100} y2={117} color={C.rule} />
              <DataBox x={102} y={104} w={75} h={26} label="리뷰어" color={C.rule} />
              <Arrow x1={177} y1={117} x2={192} y2={117} color={C.safe} />
              <DataBox x={194} y={104} w={75} h={26} label="배포 담당" color={C.safe} />

              {/* DB 변경 */}
              <text x={370} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>DB 변경</text>
              <DataBox x={305} y={104} w={75} h={26} label="요청자" color={C.net} />
              <Arrow x1={380} y1={117} x2={400} y2={117} color={C.rule} />
              <DataBox x={402} y={104} w={68} h={26} label="DBA" color={C.rule} />

              {/* 감사 로그 */}
              <text x={120} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>감사 로그</text>
              <DataBox x={10} y={154} w={90} h={26} label="운영자" color={C.net} />
              <Arrow x1={100} y1={167} x2={120} y2={167} color={C.rule} />
              <DataBox x={122} y={154} w={90} h={26} label="로그 관리자" color={C.rule} />

              {/* 상장 심사 (VASP) */}
              <rect x={250} y={140} width={220} height={72} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={360} y={156} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>VASP 핵심: 상장 심사</text>
              <text x={360} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사위원회 합의제 운영</text>
              <text x={360} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">상장 결정 + 선행매수 불가 구조</text>
              <text x={360} y={200} textAnchor="middle" fontSize={7.5} fill={C.danger}>한 사람이 결정 + 매수 → 제도적 차단</text>
            </motion.g>
          )}

          {/* ── Step 2: 심층 방어 4계층 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.net}>심층 방어 (Defense in Depth)</text>

              {/* 공격자 */}
              <AlertBox x={5} y={65} w={55} h={70} label="공격자" sub="" color={C.danger} />

              {/* 4계층 — 왼쪽에서 오른쪽으로 */}
              {/* 네트워크 */}
              <rect x={72} y={28} width={90} height={145} rx={6} fill={`${C.danger}08`} stroke={C.danger} strokeWidth={0.6} />
              <text x={117} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>네트워크</text>
              <DataBox x={78} y={50} w={78} h={22} label="방화벽" color={C.danger} />
              <DataBox x={78} y={76} w={78} h={22} label="IPS" color={C.danger} />
              <DataBox x={78} y={102} w={78} h={22} label="망분리" color={C.danger} />

              <Arrow x1={60} y1={100} x2={72} y2={100} color={C.danger} />

              {/* 서버 */}
              <rect x={172} y={28} width={90} height={145} rx={6} fill={`${C.rule}08`} stroke={C.rule} strokeWidth={0.6} />
              <text x={217} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.rule}>서버</text>
              <DataBox x={178} y={50} w={78} h={22} label="SSH 키 인증" color={C.rule} />
              <DataBox x={178} y={76} w={78} h={22} label="접근 IP 제한" color={C.rule} />
              <DataBox x={178} y={102} w={78} h={22} label="호스트 FW" color={C.rule} />

              <Arrow x1={162} y1={100} x2={172} y2={100} color={C.danger} />

              {/* 애플리케이션 */}
              <rect x={272} y={28} width={90} height={145} rx={6} fill={`${C.net}08`} stroke={C.net} strokeWidth={0.6} />
              <text x={317} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>애플리케이션</text>
              <DataBox x={278} y={50} w={78} h={22} label="WAF" color={C.net} />
              <DataBox x={278} y={76} w={78} h={22} label="세션 관리" color={C.net} />
              <DataBox x={278} y={102} w={78} h={22} label="API 인증" color={C.net} />

              <Arrow x1={262} y1={100} x2={272} y2={100} color={C.rule} />

              {/* 데이터베이스 */}
              <rect x={372} y={28} width={100} height={145} rx={6} fill={`${C.safe}08`} stroke={C.safe} strokeWidth={0.6} />
              <text x={422} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>데이터베이스</text>
              <DataBox x={378} y={50} w={88} h={22} label="접근제어 SW" color={C.safe} />
              <DataBox x={378} y={76} w={88} h={22} label="쿼리 필터링" color={C.safe} />
              <DataBox x={378} y={102} w={88} h={22} label="암호화" color={C.safe} />

              <Arrow x1={362} y1={100} x2={372} y2={100} color={C.net} />

              {/* 차단 레이블 */}
              <text x={82} y={138} fontSize={7} fill={C.danger}>포트 스캔 차단</text>
              <text x={182} y={138} fontSize={7} fill={C.rule}>측면 이동 차단</text>
              <text x={278} y={138} fontSize={7} fill={C.net}>SQL/XSS 차단</text>
              <text x={388} y={138} fontSize={7} fill={C.safe}>대량 유출 차단</text>

              {/* 핵심 원칙 */}
              <rect x={72} y={178} width={400} height={36} rx={6} fill="var(--card)" stroke={C.net} strokeWidth={0.5} />
              <text x={272} y={194} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>핵심: 각 계층은 독립적으로 작동</text>
              <text x={272} y={207} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">VPN 돌파(네트워크) → 서버 인증 + DB 접근제어가 독립 차단</text>
            </motion.g>
          )}

          {/* ── Step 3: ISMS 2.6 항목 + 제로 트러스트 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.net}>ISMS 2.6 접근통제 세부 항목</text>

              {/* 7개 항목 그리드 */}
              <ModuleBox x={10} y={26} w={105} h={34} label="2.6.1 네트워크" sub="망분리·방화벽·DMZ" color={C.danger} />
              <ModuleBox x={125} y={26} w={105} h={34} label="2.6.2 정보시스템" sub="서버 접근·SSH" color={C.rule} />
              <ModuleBox x={240} y={26} w={105} h={34} label="2.6.3 응용프로그램" sub="관리자 페이지·API" color={C.net} />
              <ModuleBox x={355} y={26} w={115} h={34} label="2.6.4 데이터베이스" sub="접근제어·쿼리 감사" color={C.safe} />

              <ModuleBox x={10} y={68} w={105} h={34} label="2.6.5 무선" sub="Wi-Fi·비인가 AP" color={C.rule} />
              <ModuleBox x={125} y={68} w={105} h={34} label="2.6.6 원격" sub="VPN·원격 근무" color={C.rule} />
              <ModuleBox x={240} y={68} w={105} h={34} label="2.6.7 인터넷" sub="유해 사이트 차단" color={C.rule} />

              {/* 이 아티클 범위 표시 */}
              <rect x={8} y={24} width={109} height={38} rx={8} fill="none" stroke={C.danger} strokeWidth={1.5} strokeDasharray="4 2" />
              <rect x={353} y={24} width={119} height={38} rx={8} fill="none" stroke={C.safe} strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={355} y={72} fontSize={7.5} fontWeight={600} fill={C.danger}>이 아티클 범위</text>

              {/* 구분선 */}
              <rect x={10} y={114} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 경계 보안 vs 제로 트러스트 */}
              <text x={240} y={132} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>패러다임 전환</text>

              {/* 경계 보안 */}
              <rect x={10} y={140} width={215} height={72} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={117} y={156} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>경계 보안 (전통)</text>
              <text x={117} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"내부망은 안전하다" 전제</text>
              <text x={117} y={184} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">경계만 통과하면 자유 이동</text>
              <text x={117} y={198} textAnchor="middle" fontSize={7.5} fill={C.danger}>VPN 돌파 시 전체 노출</text>

              <Arrow x1={225} y1={176} x2={255} y2={176} color={C.net} />
              <text x={240} y={170} fontSize={8} fontWeight={600} fill={C.net}>전환</text>

              {/* 제로 트러스트 */}
              <rect x={257} y={140} width={215} height={72} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={364} y={156} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>제로 트러스트</text>
              <text x={364} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">안전 전제 폐기</text>
              <text x={364} y={184} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">위치 무관 모든 접근 검증</text>
              <text x={364} y={198} textAnchor="middle" fontSize={7.5} fill={C.safe}>= 심층 방어 철저 적용의 결과</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

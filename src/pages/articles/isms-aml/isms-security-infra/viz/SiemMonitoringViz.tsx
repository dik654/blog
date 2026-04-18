import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  siem: '#8b5cf6',   // SIEM — 보라
  log: '#3b82f6',    // 로그 수집 — 파랑
  atk: '#ef4444',    // 위협/경고 — 빨강
  ok: '#22c55e',     // 정상/자동화 — 초록
};

const STEPS = [
  {
    label: 'SIEM — 보안 관제의 두뇌',
    body: '모든 보안 장비와 시스템의 로그를 중앙 수집 → 상관분석으로 공격 체인을 탐지.\n개별 장비 로그만으로는 공격의 전체 그림(Kill Chain)을 파악할 수 없다.',
  },
  {
    label: '수집 대상과 방식',
    body: '방화벽, IDS/IPS, WAF, 서버 OS, DB, 애플리케이션, 인증 시스템 등 전 계층.\nSyslog(네트워크 장비), Agent(서버), API(클라우드)로 수집. 정규화(Normalization)가 핵심 전처리.',
  },
  {
    label: '상관분석 — 공격 체인 재구성',
    body: '서로 다른 소스의 이벤트를 시간순으로 연결하여 단일 공격 시나리오로 재구성.\n포트 스캔(방화벽) + 브루트포스(인증) + SQLi(IPS) → 동일 IP의 복합 공격으로 판단.',
  },
  {
    label: 'SOAR — 자동 대응',
    body: 'SIEM이 "탐지"라면 SOAR는 "자동 대응". 플레이북 기반으로 IP 차단, 계정 잠금, 격리 등 실행.\n서비스 영향이 큰 조치는 관리자 승인 후 실행. MTTR(평균 대응 시간) 단축이 목표.',
  },
  {
    label: '로그 보관 정책',
    body: '접속 기록 6개월+, 개인정보 접속 1~2년, VASP 거래 기록 5년+ 보관.\n로그 무결성: WORM 스토리지, 해시값 기록, 별도 로그 서버 분리 필수.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#sm-arrow)" />
  );
}

export default function SiemMonitoringViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sm-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: SIEM 개요 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.siem}>SIEM — 보안 관제의 두뇌</text>

              {/* 좌측: 개별 장비 로그 */}
              <ModuleBox x={10} y={30} w={80} h={30} label="방화벽 로그" sub="포트 스캔" color={C.log} />
              <ModuleBox x={10} y={68} w={80} h={30} label="인증 로그" sub="로그인 실패" color={C.log} />
              <ModuleBox x={10} y={106} w={80} h={30} label="IPS 로그" sub="SQLi 차단" color={C.log} />
              <ModuleBox x={10} y={144} w={80} h={30} label="WAF 로그" sub="XSS 탐지" color={C.log} />

              {/* 개별로 보면 */}
              <text x={50} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개별로 보면:</text>
              <text x={50} y={205} textAnchor="middle" fontSize={7.5} fill={C.atk}>경미한 이벤트</text>

              {/* 수집 화살표 */}
              <Arrow x1={90} y1={45} x2={160} y2={80} color={C.log} />
              <Arrow x1={90} y1={83} x2={160} y2={90} color={C.log} />
              <Arrow x1={90} y1={121} x2={160} y2={100} color={C.log} />
              <Arrow x1={90} y1={159} x2={160} y2={110} color={C.log} />

              {/* 중앙: SIEM */}
              <rect x={162} y={55} width={156} height={90} rx={10} fill={`${C.siem}10`} stroke={C.siem} strokeWidth={1} />
              <text x={240} y={75} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.siem}>SIEM</text>
              <text x={240} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">중앙 수집</text>
              <text x={240} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정규화</text>
              <text x={240} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">상관분석</text>
              <text x={240} y={132} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실시간 알림</text>

              {/* 우측: 상관분석 결과 */}
              <Arrow x1={318} y1={100} x2={340} y2={100} color={C.siem} />
              <rect x={342} y={50} width={130} height={100} rx={8} fill="var(--card)" stroke={C.atk} strokeWidth={0.8} />
              <text x={407} y={68} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.atk}>공격 체인 탐지</text>
              <text x={352} y={84} fontSize={7.5} fill="var(--muted-foreground)">1. 포트 스캔 (경미)</text>
              <text x={352} y={98} fontSize={7.5} fill="var(--muted-foreground)">2. 브루트포스 (중간)</text>
              <text x={352} y={112} fontSize={7.5} fill="var(--muted-foreground)">3. SQLi 시도 (중간)</text>
              <text x={352} y={130} fontSize={8} fontWeight={700} fill={C.atk}>= 동일 IP 복합 공격</text>
              <text x={352} y={143} fontSize={7.5} fill={C.atk}>→ 즉각 대응 필요</text>

              {/* 하단: Kill Chain */}
              <AlertBox x={162} y={160} w={156} h={30} label="Kill Chain 전체 그림 파악" sub="단일 장비로는 불가능" color={C.siem} />
            </motion.g>
          )}

          {/* Step 1: 수집 대상과 방식 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 수집 대상 (상단) */}
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.log}>수집 대상 — 전 계층</text>

              <DataBox x={10} y={28} w={62} h={24} label="방화벽" color={C.log} />
              <DataBox x={78} y={28} w={62} h={24} label="IDS/IPS" color={C.log} />
              <DataBox x={146} y={28} w={52} h={24} label="WAF" color={C.log} />
              <DataBox x={204} y={28} w={60} h={24} label="서버 OS" color={C.log} />
              <DataBox x={270} y={28} w={45} h={24} label="DB" color={C.log} />
              <DataBox x={321} y={28} w={58} h={24} label="앱 로그" color={C.log} />
              <DataBox x={385} y={28} w={80} h={24} label="인증 시스템" color={C.log} />

              {/* 수집 화살표 */}
              <Arrow x1={240} y1={52} x2={240} y2={66} color={C.log} />

              {/* 수집 방식 (하단) */}
              <rect x={10} y={68} width={460} height={140} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={84} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.siem}>수집 방식 4가지</text>

              <ActionBox x={20} y={94} w={100} h={44} label="Syslog" sub="UDP/TCP 514" color={C.log} />
              <text x={70} y={152} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">네트워크 장비</text>
              <text x={70} y={164} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">자동 전송</text>

              <ActionBox x={135} y={94} w={100} h={44} label="SNMP" sub="상태 폴링" color={C.log} />
              <text x={185} y={152} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">장비 CPU/메모리</text>
              <text x={185} y={164} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">주기적 수집</text>

              <ActionBox x={250} y={94} w={100} h={44} label="Agent" sub="서버 설치" color={C.log} />
              <text x={300} y={152} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">서버 OS/앱 로그</text>
              <text x={300} y={164} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">소프트웨어 전송</text>

              <ActionBox x={365} y={94} w={95} h={44} label="API 연동" sub="클라우드" color={C.log} />
              <text x={412} y={152} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">AWS CloudTrail</text>
              <text x={412} y={164} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Azure AD 등</text>

              {/* 정규화 핵심 */}
              <rect x={20} y={180} width={440} height={22} rx={4} fill={`${C.siem}10`} stroke={C.siem} strokeWidth={0.5} />
              <text x={240} y={194} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.siem}>정규화(Normalization): src_ip / source_address / remote_addr → 공통 필드 s_ip로 매핑</text>
            </motion.g>
          )}

          {/* Step 2: 상관분석 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.siem}>상관분석 — 공격 체인 재구성</text>

              {/* 시간축 */}
              <line x1={30} y1={35} x2={450} y2={35} stroke="var(--border)" strokeWidth={0.5} />
              <text x={30} y={30} fontSize={7} fill="var(--muted-foreground)">시간</text>
              <text x={450} y={30} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">t</text>

              {/* 이벤트 1: 포트 스캔 (방화벽) */}
              <rect x={40} y={42} width={120} height={40} rx={6} fill="var(--card)" stroke={C.log} strokeWidth={0.5} />
              <text x={100} y={56} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.log}>방화벽</text>
              <text x={100} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">203.0.113.5 포트 스캔</text>
              <DataBox x={165} y={48} w={50} h={24} label="경미" color="var(--muted-foreground)" />

              {/* 이벤트 2: 브루트포스 (인증) */}
              <rect x={40} y={88} width={120} height={40} rx={6} fill="var(--card)" stroke={C.log} strokeWidth={0.5} />
              <text x={100} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.log}>인증 시스템</text>
              <text x={100} y={116} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">같은 IP → SSH 실패 30회</text>
              <DataBox x={165} y={94} w={50} h={24} label="중간" color={C.log} />

              {/* 이벤트 3: SQLi (IPS) */}
              <rect x={40} y={134} width={120} height={40} rx={6} fill="var(--card)" stroke={C.log} strokeWidth={0.5} />
              <text x={100} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.log}>IPS</text>
              <text x={100} y={162} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">같은 IP → SQL Injection</text>
              <DataBox x={165} y={140} w={50} h={24} label="중간" color={C.log} />

              {/* 상관분석 연결선 */}
              <line x1={215} y1={62} x2={260} y2={100} stroke={C.siem} strokeWidth={1} strokeDasharray="3 2" />
              <line x1={215} y1={106} x2={260} y2={100} stroke={C.siem} strokeWidth={1} strokeDasharray="3 2" />
              <line x1={215} y1={154} x2={260} y2={100} stroke={C.siem} strokeWidth={1} strokeDasharray="3 2" />

              {/* SIEM 상관분석 결과 */}
              <rect x={262} y={55} width={205} height={100} rx={8} fill={`${C.atk}08`} stroke={C.atk} strokeWidth={0.8} />
              <text x={364} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.atk}>SIEM 상관분석 결과</text>

              <text x={272} y={90} fontSize={8} fill="var(--muted-foreground)">출발지: 203.0.113.5 (동일)</text>
              <text x={272} y={106} fontSize={8} fill="var(--muted-foreground)">패턴: 정찰 → 인증시도 → 공격</text>
              <text x={272} y={122} fontSize={8} fontWeight={700} fill={C.atk}>위험도: Critical</text>
              <text x={272} y={138} fontSize={8} fontWeight={700} fill={C.atk}>→ 즉각 대응 (IP 차단 + 조사)</text>

              {/* 대응 */}
              <Arrow x1={364} y1={155} x2={364} y2={170} color={C.atk} />
              <ActionBox x={270} y={172} w={190} h={30} label="SOC 알림 + 방화벽 IP 차단 + 티켓 생성" sub="MTTR 최소화" color={C.atk} />
            </motion.g>
          )}

          {/* Step 3: SOAR */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ok}>SOAR — 자동 대응 플랫폼</text>

              {/* SIEM 탐지 → SOAR */}
              <ModuleBox x={15} y={30} w={100} h={36} label="SIEM" sub="이벤트 탐지" color={C.siem} />
              <Arrow x1={115} y1={48} x2={140} y2={48} color={C.siem} />

              {/* SOAR 플레이북 */}
              <rect x={142} y={24} width={200} height={80} rx={8} fill={`${C.ok}08`} stroke={C.ok} strokeWidth={0.6} />
              <text x={242} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>SOAR 플레이북</text>

              {/* 자동화 단계 */}
              <ActionBox x={152} y={48} w={85} h={24} label="IP 차단" sub="방화벽 자동" color={C.ok} />
              <ActionBox x={247} y={48} w={85} h={24} label="계정 잠금" sub="인증 시스템" color={C.ok} />
              <ActionBox x={152} y={76} w={85} h={24} label="격리 VLAN" sub="단말 이동" color={C.ok} />
              <ActionBox x={247} y={76} w={85} h={24} label="티켓 생성" sub="알림 전송" color={C.ok} />

              {/* 인간 승인 분기 */}
              <Arrow x1={342} y1={64} x2={370} y2={64} color={C.ok} />
              <rect x={372} y={30} width={100} height={70} rx={6} fill="var(--card)" stroke={C.atk} strokeWidth={0.5} />
              <text x={422} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.atk}>영향 큰 조치</text>
              <text x={382} y={64} fontSize={7} fill="var(--muted-foreground)">서버 격리</text>
              <text x={382} y={76} fontSize={7} fill="var(--muted-foreground)">대역 차단</text>
              <text x={382} y={88} fontSize={7} fill={C.atk}>→ 관리자 승인 필요</text>

              {/* MTTR 비교 */}
              <rect x={15} y={115} width={220} height={44} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={125} y={130} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.atk}>수동 대응</text>
              <StatusBox x={25} y={138} w={200} h={16} label="" sub="" color={C.atk} progress={0.9} />
              <text x={135} y={130} textAnchor="end" fontSize={7} fill={C.atk}>MTTR: 수시간~수일</text>

              <rect x={250} y={115} width={220} height={44} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={360} y={130} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ok}>SOAR 자동 대응</text>
              <StatusBox x={260} y={138} w={200} h={16} label="" sub="" color={C.ok} progress={0.15} />
              <text x={370} y={130} textAnchor="end" fontSize={7} fill={C.ok}>MTTR: 분~시간</text>

              {/* 플레이북 예시 */}
              <rect x={15} y={170} width={450} height={40} rx={6} fill="var(--card)" stroke={C.ok} strokeWidth={0.5} />
              <text x={240} y={186} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ok}>플레이북 예시: 브루트포스 탐지</text>
              <text x={25} y={202} fontSize={7.5} fill="var(--muted-foreground)">탐지 → 해당 IP 방화벽 자동 차단 → 담당자 Slack 알림 → Jira 티켓 자동 생성 → 후속 조사 할당</text>
            </motion.g>
          )}

          {/* Step 4: 로그 보관 정책 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.siem}>로그 보관 정책</text>

              {/* 보관 기간 타임라인 */}
              <rect x={15} y={28} width={450} height={110} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

              {/* 접속 기록 */}
              <text x={25} y={48} fontSize={8} fontWeight={600} fill={C.log}>접속 기록</text>
              <rect x={120} y={38} width={80} height={14} rx={4} fill={C.log} opacity={0.3} />
              <text x={160} y={49} textAnchor="middle" fontSize={7} fill={C.log}>6개월+</text>
              <text x={220} y={49} fontSize={7} fill="var(--muted-foreground)">ISMS 2.9.4</text>

              {/* 개인정보 접속 */}
              <text x={25} y={70} fontSize={8} fontWeight={600} fill={C.siem}>개인정보 접속</text>
              <rect x={120} y={60} width={160} height={14} rx={4} fill={C.siem} opacity={0.3} />
              <text x={200} y={71} textAnchor="middle" fontSize={7} fill={C.siem}>1~2년</text>
              <text x={295} y={71} fontSize={7} fill="var(--muted-foreground)">개인정보보호법</text>

              {/* VASP 거래 기록 */}
              <text x={25} y={92} fontSize={8} fontWeight={600} fill={C.atk}>거래 기록 (VASP)</text>
              <rect x={120} y={82} width={320} height={14} rx={4} fill={C.atk} opacity={0.3} />
              <text x={280} y={93} textAnchor="middle" fontSize={7} fill={C.atk}>5년+</text>
              <text x={450} y={93} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">특정금융정보법</text>

              {/* 보안 이벤트 */}
              <text x={25} y={114} fontSize={8} fontWeight={600} fill={C.ok}>보안 이벤트</text>
              <rect x={120} y={104} width={240} height={14} rx={4} fill={C.ok} opacity={0.3} />
              <text x={240} y={115} textAnchor="middle" fontSize={7} fill={C.ok}>1년+ (권장 3년)</text>
              <text x={375} y={115} fontSize={7} fill="var(--muted-foreground)">포렌식 목적</text>

              {/* 무결성 보장 */}
              <rect x={15} y={148} width={450} height={62} rx={8} fill={`${C.atk}06`} stroke={C.atk} strokeWidth={0.6} />
              <text x={240} y={165} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.atk}>로그 무결성 보장 — 위변조 시 법적 증거 가치 상실</text>

              <ActionBox x={25} y={174} w={130} h={28} label="WORM 스토리지" sub="Write Once Read Many" color={C.atk} />
              <ActionBox x={170} y={174} w={130} h={28} label="해시값 기록" sub="변조 감지" color={C.siem} />
              <ActionBox x={315} y={174} w={140} h={28} label="별도 로그 서버" sub="공격자 삭제 방지" color={C.log} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

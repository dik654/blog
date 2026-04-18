import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  waf: '#8b5cf6',    // WAF — 보라
  vpn: '#3b82f6',    // VPN — 파랑
  atk: '#ef4444',    // 공격 — 빨강
  ok: '#22c55e',     // 안전 — 초록
};

const STEPS = [
  {
    label: 'WAF — L7 웹 공격 차단',
    body: 'WAF는 HTTP 요청의 헤더, 쿠키, 본문, URL 파라미터 등 애플리케이션 데이터(L7)를 검사.\n방화벽이 IP/포트(L3-4) 필터라면, WAF는 "포트 443이 열린 상태에서" 안의 공격을 차단.',
  },
  {
    label: 'WAF 탐지 대상 5가지',
    body: 'SQL Injection: SQL 구문 삽입으로 DB 조작. XSS: 악성 스크립트 삽입.\nCSRF: 요청 위조. 파일 업로드 공격: 웹셸 업로드. 봇 차단: Rate Limiting, CAPTCHA.',
  },
  {
    label: 'WAF 리버스 프록시 배치',
    body: '클라이언트→WAF→웹서버 순서. 클라이언트는 WAF IP에 접속, WAF가 검사 통과 요청만 전달.\nSSL 종료를 WAF에서 처리하여 HTTPS 트래픽도 검사 가능. 웹서버 실제 IP 은닉.',
  },
  {
    label: 'VPN — IPSec vs SSL',
    body: 'IPSec VPN: 사이트 간 연결(본사↔지사). L3에서 IP 패킷 전체 암호화. 전용 클라이언트 필요.\nSSL VPN: 원격 접속(개인 PC↔사내). 브라우저만으로 접속. 특정 앱만 세밀 접근 제어.',
  },
  {
    label: 'WAF + VPN + NAC 조합',
    body: 'WAF는 "어떤 요청인가"(L7 검사). VPN은 "어디서 접속하는가"(암호화 터널).\nNAC는 "이 기기는 안전한가"(단말 상태 검증). 세 조합으로 다계층 접근 통제를 완성.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#wv-arrow)" />
  );
}

export default function WafVpnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wv-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: WAF L7 검사 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.waf}>WAF — L7 웹 애플리케이션 방화벽</text>

              {/* OSI 계층 비교 */}
              <rect x={15} y={28} width={200} height={90} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={115} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">네트워크 방화벽 (L3-4)</text>

              <DataBox x={25} y={52} w={80} h={22} label="IP 주소" color="var(--muted-foreground)" />
              <DataBox x={115} y={52} w={80} h={22} label="포트 번호" color="var(--muted-foreground)" />
              <text x={115} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">포트 80/443 열면</text>
              <text x={115} y={104} textAnchor="middle" fontSize={8} fill={C.atk}>그 안의 공격 차단 불가</text>

              {/* WAF 영역 */}
              <rect x={235} y={28} width={235} height={90} rx={8} fill={`${C.waf}08`} stroke={C.waf} strokeWidth={0.6} />
              <text x={352} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.waf}>WAF (L7)</text>

              <DataBox x={245} y={52} w={65} h={22} label="HTTP 헤더" color={C.waf} />
              <DataBox x={318} y={52} w={60} h={22} label="쿠키" color={C.waf} />
              <DataBox x={386} y={52} w={74} h={22} label="요청 본문" color={C.waf} />
              <text x={352} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">포트가 열린 상태에서도</text>
              <text x={352} y={104} textAnchor="middle" fontSize={8} fill={C.ok}>SQLi, XSS 등 웹 공격 차단</text>

              {/* 상호보완 관계 화살표 */}
              <Arrow x1={115} y1={118} x2={115} y2={138} color="var(--muted-foreground)" />
              <Arrow x1={352} y1={118} x2={352} y2={138} color="var(--muted-foreground)" />
              <rect x={30} y={140} width={420} height={30} rx={6} fill="var(--card)" stroke={C.waf} strokeWidth={0.5} />
              <text x={240} y={158} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.waf}>상호보완: 네트워크 방화벽(1차 IP/포트 필터) → WAF(2차 L7 검사)</text>

              {/* 하단 공격 흐름 */}
              <DataBox x={30} y={180} w={85} h={26} label="공격 요청" color={C.atk} />
              <Arrow x1={115} y1={193} x2={145} y2={193} color={C.atk} />
              <ActionBox x={147} y={182} w={80} h={28} label="방화벽 통과" sub=":443 허용" color="var(--muted-foreground)" />
              <Arrow x1={227} y1={193} x2={255} y2={193} color={C.atk} />
              <ActionBox x={257} y={182} w={75} h={28} label="WAF 검사" sub="SQLi 탐지" color={C.waf} />
              <Arrow x1={332} y1={193} x2={360} y2={193} color={C.atk} />
              <AlertBox x={362} y={182} w={75} h={28} label="차단" sub="403 응답" color={C.atk} />
            </motion.g>
          )}

          {/* Step 1: WAF 탐지 대상 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.waf}>WAF 주요 탐지 대상</text>

              {/* 5개 공격 유형 */}
              <ModuleBox x={15} y={30} w={140} h={40} label="SQL Injection" sub="SQL 구문 삽입 → DB 조작" color={C.atk} />
              <ModuleBox x={170} y={30} w={140} h={40} label="XSS" sub="악성 스크립트 삽입 실행" color={C.atk} />
              <ModuleBox x={325} y={30} w={140} h={40} label="CSRF" sub="요청 위조 — 행동 강제" color={C.atk} />

              <ModuleBox x={15} y={82} w={140} h={40} label="파일 업로드 공격" sub="웹셸 업로드 → 원격 제어" color={C.atk} />
              <ModuleBox x={170} y={82} w={140} h={40} label="봇(Bot) 차단" sub="무차별 대입, 스크래핑" color={C.atk} />

              {/* WAF 탐지 방식 */}
              <Arrow x1={85} y1={70} x2={85} y2={138} color={C.waf} />
              <Arrow x1={240} y1={70} x2={240} y2={138} color={C.waf} />
              <Arrow x1={395} y1={70} x2={395} y2={138} color={C.waf} />
              <Arrow x1={85} y1={122} x2={85} y2={138} color={C.waf} />
              <Arrow x1={240} y1={122} x2={240} y2={138} color={C.waf} />

              <rect x={15} y={140} width={450} height={68} rx={8} fill={`${C.waf}08`} stroke={C.waf} strokeWidth={0.6} />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.waf}>WAF 탐지 방식</text>

              <ActionBox x={25} y={162} w={125} h={28} label="패턴 매칭" sub="SQL 예약어, 스크립트 태그" color={C.waf} />
              <ActionBox x={165} y={162} w={125} h={28} label="Referer/토큰 검증" sub="CSRF, 세션 검증" color={C.waf} />
              <ActionBox x={305} y={162} w={150} h={28} label="Rate Limiting" sub="요청 빈도 제한 + CAPTCHA" color={C.waf} />
            </motion.g>
          )}

          {/* Step 2: WAF 리버스 프록시 배치 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.waf}>WAF 리버스 프록시 배치</text>

              {/* 클라이언트 */}
              <DataBox x={15} y={50} w={70} h={30} label="클라이언트" color="var(--muted-foreground)" />
              <text x={50} y={95} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">WAF IP로 접속</text>
              <text x={50} y={107} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">서버 IP 모름</text>

              {/* HTTPS 화살표 */}
              <Arrow x1={85} y1={65} x2={120} y2={65} color={C.waf} />
              <text x={103} y={58} textAnchor="middle" fontSize={7} fill={C.waf}>HTTPS</text>

              {/* WAF */}
              <rect x={122} y={32} width={130} height={80} rx={8} fill={`${C.waf}08`} stroke={C.waf} strokeWidth={0.8} />
              <text x={187} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.waf}>WAF (리버스 프록시)</text>

              <ActionBox x={132} y={56} w={110} h={22} label="SSL 종료" sub="" color={C.waf} />
              <ActionBox x={132} y={82} w={110} h={22} label="요청 검사" sub="" color={C.waf} />

              {/* 정상 요청 → 웹서버 */}
              <Arrow x1={252} y1={55} x2={290} y2={55} color={C.ok} />
              <text x={271} y={48} textAnchor="middle" fontSize={7} fill={C.ok}>정상</text>
              <ModuleBox x={292} y={38} w={80} h={34} label="웹서버" sub="실제 IP 은닉" color={C.ok} />

              {/* 공격 → 차단 */}
              <Arrow x1={252} y1={88} x2={290} y2={88} color={C.atk} />
              <text x={271} y={82} textAnchor="middle" fontSize={7} fill={C.atk}>공격</text>
              <AlertBox x={292} y={78} w={80} h={28} label="403 차단" sub="SQLi/XSS" color={C.atk} />

              {/* 이중화 필수 */}
              <AlertBox x={15} y={122} width={220} h={30} label="WAF 장애 → 서비스 중단 위험" sub="이중화(HA) 필수 구성" color={C.atk} />

              {/* 클라우드 vs 온프레미스 */}
              <rect x={15} y={164} width={215} height={46} rx={6} fill="var(--card)" stroke={C.vpn} strokeWidth={0.5} />
              <text x={122} y={180} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.vpn}>클라우드 WAF</text>
              <text x={122} y={198} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">AWS WAF, Cloudflare WAF</text>

              <rect x={250} y={164} width={220} height={46} rx={6} fill="var(--card)" stroke={C.waf} strokeWidth={0.5} />
              <text x={360} y={180} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.waf}>온프레미스 WAF</text>
              <text x={360} y={198} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">전용 어플라이언스 — DMZ 앞단</text>

              {/* 웹서버 → WAS */}
              <Arrow x1={372} y1={55} x2={400} y2={55} color={C.ok} />
              <ModuleBox x={402} y={38} w={68} h={34} label="WAS" sub="비즈니스" color={C.ok} />
            </motion.g>
          )}

          {/* Step 3: VPN 유형 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* IPSec VPN */}
              <rect x={5} y={8} width={230} height={200} rx={8} fill={`${C.vpn}06`} stroke={C.vpn} strokeWidth={0.6} />
              <text x={120} y={24} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.vpn}>IPSec VPN (Site-to-Site)</text>

              <ModuleBox x={15} y={34} w={80} h={34} label="본사" sub="VPN GW" color={C.vpn} />
              <ModuleBox x={140} y={34} w={80} h={34} label="지사" sub="VPN GW" color={C.vpn} />

              {/* 암호화 터널 */}
              <rect x={60} y={76} width={120} height={22} rx={11} fill={`${C.vpn}15`} stroke={C.vpn} strokeWidth={0.8} />
              <text x={120} y={90} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.vpn}>IPSec 터널 (L3)</text>
              <Arrow x1={95} y1={68} x2={95} y2={74} color={C.vpn} />
              <Arrow x1={180} y1={68} x2={180} y2={74} color={C.vpn} />

              <text x={120} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">IP 패킷 전체 암호화</text>
              <text x={120} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">전용 클라이언트 필요</text>
              <text x={120} y={141} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">네트워크 전체 접근 (Full Tunnel)</text>
              <DataBox x={45} y={150} w={150} h={24} label="양쪽 장비 설정 필요" color={C.vpn} />

              {/* SSL VPN */}
              <rect x={245} y={8} width={230} height={200} rx={8} fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.6} />
              <text x={360} y={24} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>SSL VPN (Remote Access)</text>

              <ModuleBox x={260} y={34} w={80} h={34} label="개인 PC" sub="브라우저" color={C.ok} />
              <ModuleBox x={385} y={34} w={80} h={34} label="사내망" sub="VPN GW" color={C.ok} />

              {/* 암호화 터널 */}
              <rect x={300} y={76} width={120} height={22} rx={11} fill={`${C.ok}15`} stroke={C.ok} strokeWidth={0.8} />
              <text x={360} y={90} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ok}>TLS/SSL 터널 (L4-7)</text>
              <Arrow x1={340} y1={68} x2={340} y2={74} color={C.ok} />
              <Arrow x1={420} y1={68} x2={420} y2={74} color={C.ok} />

              <text x={360} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">TCP 세션 암호화</text>
              <text x={360} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">웹 브라우저만으로 접속</text>
              <text x={360} y={141} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">특정 앱/서비스만 접근 제어</text>
              <DataBox x={285} y={150} w={150} h={24} label="원격 근무에 적합" color={C.ok} />

              {/* 하단 MFA 요구 */}
              <AlertBox x={80} y={185} w={330} h={24} label="ISMS 2.6.6: VPN + MFA(OTP, 인증서, 생체) 필수 적용" color={C.atk} />
            </motion.g>
          )}

          {/* Step 4: WAF + VPN + NAC 조합 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.waf}>다계층 접근 통제: WAF + VPN + NAC</text>

              {/* 3개 검증 단계 */}
              <ModuleBox x={15} y={32} w={140} h={48} label="NAC" sub="이 기기는 안전한가?" color={C.ok} />
              <text x={85} y={95} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">AV 설치, OS 패치,</text>
              <text x={85} y={107} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">화면 잠금 검증</text>

              <ModuleBox x={170} y={32} w={140} h={48} label="VPN" sub="어디서 접속하는가?" color={C.vpn} />
              <text x={240} y={95} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">암호화 터널,</text>
              <text x={240} y={107} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">MFA 인증</text>

              <ModuleBox x={325} y={32} w={140} h={48} label="WAF" sub="어떤 요청인가?" color={C.waf} />
              <text x={395} y={95} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">HTTP 요청 검사,</text>
              <text x={395} y={107} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">SQLi/XSS 차단</text>

              {/* 화살표 연결: 통과 흐름 */}
              <Arrow x1={155} y1={56} x2={168} y2={56} color={C.ok} />
              <Arrow x1={310} y1={56} x2={323} y2={56} color={C.vpn} />

              {/* 통합 결과 */}
              <rect x={60} y={122} width={360} height={40} rx={8} fill={`${C.ok}10`} stroke={C.ok} strokeWidth={0.8} />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>검증된 기기에서, 안전한 터널을 통해, 정상 요청만 허용</text>
              <text x={240} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">세 가지 관점의 조합으로 다계층 접근 통제 완성</text>

              {/* NAC 미충족 시 */}
              <rect x={15} y={175} width={145} height={36} rx={6} fill="var(--card)" stroke={C.atk} strokeWidth={0.5} />
              <text x={87} y={190} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.atk}>NAC 미충족</text>
              <text x={87} y={203} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">격리 VLAN 이동</text>

              <rect x={175} y={175} width={130} height={36} rx={6} fill="var(--card)" stroke={C.atk} strokeWidth={0.5} />
              <text x={240} y={190} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.atk}>VPN 미인증</text>
              <text x={240} y={203} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">접속 거부</text>

              <rect x={320} y={175} width={145} height={36} rx={6} fill="var(--card)" stroke={C.atk} strokeWidth={0.5} />
              <text x={392} y={190} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.atk}>WAF 탐지</text>
              <text x={392} y={203} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">403 차단 + 로그</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

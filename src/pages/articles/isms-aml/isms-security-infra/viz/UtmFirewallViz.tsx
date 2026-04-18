import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  deny: '#ef4444',   // 차단 — 빨강
  allow: '#22c55e',  // 허용 — 초록
  utm: '#3b82f6',    // UTM/방화벽 — 파랑
  dmz: '#f59e0b',    // DMZ — 노랑
};

const STEPS = [
  {
    label: 'Stateless vs Stateful 방화벽',
    body: 'Stateless: 개별 패킷 독립 검사, 이전 패킷과의 관계를 모름. 응답 규칙을 별도로 만들어야 한다.\nStateful: 세션(연결) 단위로 추적. 정상 세션의 응답은 자동 허용. 위조 응답 패킷을 구분할 수 있다.',
  },
  {
    label: 'UTM — 통합위협관리',
    body: '방화벽 + IPS + VPN + 안티바이러스 + URL 필터 + 안티스팸을 하나의 장비에 통합.\n중소규모 조직이 개별 보안 장비를 따로 구매하기 어려울 때 UTM으로 경계 보안을 구성한다.',
  },
  {
    label: '인바운드 규칙: Default Deny',
    body: '기본 원칙: 모든 인바운드를 차단(Deny All) → 필요한 것만 명시적 허용(Allow).\n규칙은 위에서 아래로 순서대로 매칭 — 첫 매칭된 규칙이 적용되고 나머지는 무시한다.',
  },
  {
    label: 'DMZ ↔ 내부망 규칙',
    body: 'DMZ→내부: 특정 DB 포트만 허용. 내부→DMZ: 관리 SSH만 허용.\nDMZ 서버가 장악되더라도 내부망으로의 2차 침투를 내부 방화벽이 차단한다.',
  },
  {
    label: '규칙 관리 원칙',
    body: '최소 권한: 사유 문서화 불가 시 삭제. 분기별 리뷰: 히트 수 0인 규칙 비활성화.\n변경 로그: 승인자·사유·일시 기록. 테스트 환경: 운영 적용 전 검증 필수.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#utf-arrow)" />
  );
}

export default function UtmFirewallViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="utf-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Stateless vs Stateful */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Stateless 영역 */}
              <rect x={5} y={10} width={230} height={200} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={120} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.deny}>Stateless 방화벽</text>

              {/* 패킷 3개 독립 검사 */}
              <DataBox x={20} y={42} w={70} h={24} label="PKT #1" color={C.deny} />
              <DataBox x={20} y={74} w={70} h={24} label="PKT #2" color={C.deny} />
              <DataBox x={20} y={106} w={70} h={24} label="PKT #3" color={C.deny} />

              <ActionBox x={110} y={42} w={110} h={24} label="개별 검사" sub="" color={C.deny} />
              <ActionBox x={110} y={74} w={110} h={24} label="개별 검사" sub="" color={C.deny} />
              <ActionBox x={110} y={106} w={110} h={24} label="개별 검사" sub="" color={C.deny} />

              <Arrow x1={90} y1={54} x2={108} y2={54} color={C.deny} />
              <Arrow x1={90} y1={86} x2={108} y2={86} color={C.deny} />
              <Arrow x1={90} y1={118} x2={108} y2={118} color={C.deny} />

              <text x={120} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">각 패킷 독립 — 연결 관계 모름</text>
              <text x={120} y={162} textAnchor="middle" fontSize={8} fill={C.deny}>응답 규칙 별도 필요</text>

              {/* Stateful 영역 */}
              <rect x={245} y={10} width={230} height={200} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={360} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.allow}>Stateful 방화벽</text>

              {/* 세션 테이블 */}
              <ModuleBox x={260} y={42} w={200} h={38} label="세션 테이블" sub="TCP 핸드셰이크 ~ 종료 추적" color={C.allow} />

              {/* SYN → SYN-ACK → ACK 흐름 */}
              <DataBox x={260} y={92} w={58} h={24} label="SYN" color={C.utm} />
              <DataBox x={330} y={92} w={65} h={24} label="SYN-ACK" color={C.utm} />
              <DataBox x={407} y={92} w={50} h={24} label="ACK" color={C.utm} />

              <Arrow x1={318} y1={104} x2={328} y2={104} color={C.utm} />
              <Arrow x1={395} y1={104} x2={405} y2={104} color={C.utm} />

              <text x={360} y={132} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">세션 추적 — 정상 응답 자동 허용</text>
              <text x={360} y={146} textAnchor="middle" fontSize={8} fill={C.allow}>위조 패킷 차단 가능</text>

              {/* 하단 비교 */}
              <AlertBox x={260} y={158} w={200} h={40} label="현재 대부분 Stateful 채택" sub="Stateless는 클라우드 ACL 등 제한적 용도" color={C.utm} />
            </motion.g>
          )}

          {/* Step 1: UTM 통합위협관리 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.utm}>UTM — Unified Threat Management</text>

              {/* 중앙 UTM 장비 */}
              <rect x={160} y={30} width={160} height={170} rx={10} fill={`${C.utm}10`} stroke={C.utm} strokeWidth={1} />
              <text x={240} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.utm}>UTM 장비</text>

              {/* 내부 모듈들 */}
              <ActionBox x={172} y={56} w={65} h={28} label="방화벽" sub="IP/포트" color={C.utm} />
              <ActionBox x={243} y={56} w={65} h={28} label="IPS" sub="시그니처" color={C.utm} />
              <ActionBox x={172} y={92} w={65} h={28} label="VPN" sub="터널링" color={C.utm} />
              <ActionBox x={243} y={92} w={65} h={28} label="안티바이러스" sub="악성코드" color={C.utm} />
              <ActionBox x={172} y={128} w={65} h={28} label="URL 필터" sub="웹 제어" color={C.utm} />
              <ActionBox x={243} y={128} w={65} h={28} label="안티스팸" sub="메일 필터" color={C.utm} />

              {/* 좌측 개별 장비 (대체 대상) */}
              <DataBox x={15} y={56} w={80} h={24} label="전용 방화벽" color={C.deny} />
              <DataBox x={15} y={86} w={80} h={24} label="IPS 전용" color={C.deny} />
              <DataBox x={15} y={116} w={80} h={24} label="VPN 전용" color={C.deny} />
              <DataBox x={15} y={146} w={80} h={24} label="AV 게이트웨이" color={C.deny} />

              {/* 화살표: 개별 → UTM */}
              <Arrow x1={95} y1={68} x2={158} y2={68} color="var(--muted-foreground)" />
              <Arrow x1={95} y1={98} x2={158} y2={98} color="var(--muted-foreground)" />
              <Arrow x1={95} y1={128} x2={158} y2={128} color="var(--muted-foreground)" />
              <Arrow x1={95} y1={158} x2={158} y2={148} color="var(--muted-foreground)" />

              <text x={128} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개별 장비를</text>
              <text x={128} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">하나로 통합</text>

              {/* 우측 장점/단점 */}
              <rect x={340} y={56} width={130} height={70} rx={6} fill="var(--card)" stroke={C.allow} strokeWidth={0.5} />
              <text x={405} y={72} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.allow}>장점</text>
              <text x={350} y={86} fontSize={7} fill="var(--muted-foreground)">통합 관리 — 운영 편의</text>
              <text x={350} y={98} fontSize={7} fill="var(--muted-foreground)">비용 절감 — 올인원</text>
              <text x={350} y={110} fontSize={7} fill="var(--muted-foreground)">중소규모 조직에 적합</text>

              <rect x={340} y={134} width={130} height={60} rx={6} fill="var(--card)" stroke={C.deny} strokeWidth={0.5} />
              <text x={405} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.deny}>한계</text>
              <text x={350} y={164} fontSize={7} fill="var(--muted-foreground)">전기능 활성화 시 성능 저하</text>
              <text x={350} y={176} fontSize={7} fill="var(--muted-foreground)">단일 장애점(SPOF)</text>
            </motion.g>
          )}

          {/* Step 2: 인바운드 규칙 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.utm}>인바운드 규칙 — Default Deny</text>

              {/* 방화벽 중앙 */}
              <rect x={195} y={28} width={18} height={170} rx={3} fill="var(--card)" stroke={C.utm} strokeWidth={1} />
              <text x={204} y={210} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.utm}>FW</text>

              {/* 좌측: 외부 요청 */}
              <text x={95} y={38} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.deny}>외부 요청</text>

              {/* 규칙 1: 웹 서비스 → Allow */}
              <DataBox x={15} y={48} w={85} h={24} label="Any → :80/443" color={C.utm} />
              <Arrow x1={100} y1={60} x2={193} y2={60} color={C.allow} />
              <text x={148} y={55} textAnchor="middle" fontSize={7} fill={C.allow}>Allow</text>

              {/* 규칙 2: SSH 관리 → Allow */}
              <DataBox x={15} y={80} w={85} h={24} label="관리IP → :22" color={C.utm} />
              <Arrow x1={100} y1={92} x2={193} y2={92} color={C.allow} />
              <text x={148} y={87} textAnchor="middle" fontSize={7} fill={C.allow}>Allow</text>

              {/* 규칙 3: VPN → Allow */}
              <DataBox x={15} y={112} w={85} h={24} label="Any → VPN:443" color={C.utm} />
              <Arrow x1={100} y1={124} x2={193} y2={124} color={C.allow} />
              <text x={148} y={119} textAnchor="middle" fontSize={7} fill={C.allow}>Allow</text>

              {/* 규칙 999: Default Deny */}
              <DataBox x={15} y={148} w={85} h={24} label="Any → Any" color={C.deny} />
              <line x1={100} y1={160} x2={193} y2={160} stroke={C.deny} strokeWidth={1.5} />
              <text x={148} y={155} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.deny}>DENY ALL</text>
              <text x={148} y={180} textAnchor="middle" fontSize={7} fill={C.deny}>#999 기본 거부</text>

              {/* 우측: 허용된 트래픽 목적지 */}
              <text x={350} y={38} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.allow}>허용 트래픽</text>

              <ModuleBox x={280} y={48} w={90} h={30} label="DMZ 웹서버" sub="HTTP/HTTPS" color={C.allow} />
              <Arrow x1={215} y1={60} x2={278} y2={60} color={C.allow} />

              <ModuleBox x={280} y={84} w={90} h={30} label="DMZ 서버" sub="SSH (IP 제한)" color={C.allow} />
              <Arrow x1={215} y1={92} x2={278} y2={96} color={C.allow} />

              <ModuleBox x={280} y={120} w={90} h={30} label="VPN GW" sub="원격 접속" color={C.allow} />
              <Arrow x1={215} y1={124} x2={278} y2={132} color={C.allow} />

              {/* 순서 중요성 */}
              <AlertBox x={280} y={160} w={185} h={36} label="규칙 순서: 위 → 아래 매칭" sub="구체적 허용 먼저, Deny All 마지막" color={C.dmz} />
            </motion.g>
          )}

          {/* Step 3: DMZ ↔ 내부망 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* DMZ 영역 */}
              <rect x={5} y={10} width={180} height={200} rx={8} fill={`${C.dmz}08`} stroke={C.dmz} strokeWidth={0.6} />
              <text x={95} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dmz}>DMZ</text>

              <ModuleBox x={15} y={36} w={76} h={34} label="웹서버" sub="HTTPS" color={C.dmz} />
              <ModuleBox x={100} y={36} w={76} h={34} label="메일서버" sub="SMTP" color={C.dmz} />
              <ModuleBox x={15} y={80} w={76} h={34} label="VPN GW" sub="원격접속" color={C.dmz} />

              {/* 내부 방화벽 */}
              <rect x={200} y={30} width={18} height={160} rx={3} fill="var(--card)" stroke={C.utm} strokeWidth={1} />
              <text x={209} y={200} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.utm}>내부 FW</text>

              {/* 내부망 영역 */}
              <rect x={230} y={10} width={245} height={200} rx={8} fill={`${C.allow}06`} stroke={C.allow} strokeWidth={0.6} />
              <text x={352} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.allow}>내부망</text>

              <ModuleBox x={245} y={36} w={80} h={34} label="DB 서버" sub="MySQL/PG" color={C.allow} />
              <ModuleBox x={340} y={36} w={80} h={34} label="업무 시스템" sub="ERP" color={C.allow} />
              <ModuleBox x={245} y={80} w={80} h={34} label="월렛 서버" sub="자산 관리" color={C.allow} />
              <ModuleBox x={340} y={80} w={80} h={34} label="로그 서버" sub="감사" color={C.allow} />

              {/* DMZ → 내부 규칙 (허용) */}
              <Arrow x1={91} y1={53} x2={198} y2={53} color={C.allow} />
              <text x={150} y={48} textAnchor="middle" fontSize={7} fill={C.allow}>:3306만</text>

              {/* 나머지 차단 */}
              <line x1={91} y1={97} x2={198} y2={97} stroke={C.deny} strokeWidth={1} />
              <text x={150} y={93} textAnchor="middle" fontSize={7} fill={C.deny}>나머지 차단</text>

              {/* 규칙 설명 */}
              <rect x={235} y={125} width={230} height={78} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={350} y={140} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.utm}>DMZ ↔ 내부망 규칙</text>
              <text x={245} y={155} fontSize={7} fill={C.allow}>DMZ→내부: DB 포트(3306/5432)만 허용</text>
              <text x={245} y={168} fontSize={7} fill={C.allow}>내부→DMZ: 관리 SSH(22)만, IP 제한</text>
              <text x={245} y={181} fontSize={7} fill={C.dmz}>DMZ→인터넷: 업데이트, 외부 API만</text>
              <text x={245} y={194} fontSize={7} fill={C.deny}>DMZ 탈취 시 내부망 2차 침투 차단</text>
            </motion.g>
          )}

          {/* Step 4: 규칙 관리 원칙 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.utm}>방화벽 규칙 관리 4원칙</text>

              {/* 4개 원칙 박스 */}
              <ModuleBox x={15} y={35} w={105} h={50} label="최소 권한" sub="사유 문서화 불가 시 삭제" color={C.deny} />
              <ModuleBox x={135} y={35} w={105} h={50} label="분기별 리뷰" sub="히트 수 0 → 비활성화" color={C.dmz} />
              <ModuleBox x={255} y={35} w={105} h={50} label="변경 로그" sub="승인자·사유·일시 기록" color={C.utm} />
              <ModuleBox x={375} y={35} w={95} h={50} label="테스트 환경" sub="운영 전 검증 필수" color={C.allow} />

              {/* 화살표로 주기 연결 */}
              <Arrow x1={120} y1={60} x2={133} y2={60} color="var(--muted-foreground)" />
              <Arrow x1={240} y1={60} x2={253} y2={60} color="var(--muted-foreground)" />
              <Arrow x1={360} y1={60} x2={373} y2={60} color="var(--muted-foreground)" />

              {/* 하단: ISMS 심사 포인트 */}
              <rect x={15} y={100} width={455} height={110} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.utm}>ISMS 심사 체크포인트</text>

              <ActionBox x={25} y={128} w={130} h={32} label="규칙별 사유 문서화" sub="왜 이 규칙이 필요한가?" color={C.utm} />
              <ActionBox x={170} y={128} w={130} h={32} label="주기적 리뷰 증적" sub="최소 분기 1회 검토 기록" color={C.dmz} />
              <ActionBox x={315} y={128} w={145} h={32} label="변경 승인 프로세스" sub="누가·언제·왜 변경했는가" color={C.allow} />

              <text x={90} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">미비 시: 부적합 사항</text>
              <text x={235} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적 미보관: 부적합</text>
              <text x={387} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">무승인 변경: 중결함</text>

              <AlertBox x={25} y={190} w={440} h={24} label="잘못된 규칙 순서 → 정상 트래픽 차단 or 공격 허용 — 테스트 환경에서 반드시 사전 검증" color={C.deny} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

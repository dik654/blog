import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  ext: '#ef4444',   // 외부/인터넷 — 위험 빨강
  dmz: '#f59e0b',   // DMZ — 주의 노랑
  svc: '#3b82f6',   // 서비스망 — 신뢰 파랑
  int: '#22c55e',   // 내부망 — 안전 초록
};

const STEPS = [
  {
    label: '3-Zone 전체 구조',
    body: '외부(인터넷)→DMZ→서비스망→내부망. 각 구간은 방화벽으로 분리되며, 안쪽으로 갈수록 보안 수준이 높아진다.\nDMZ는 외부 노출 최소화, 서비스망은 비즈니스 로직, 내부망은 민감 데이터를 격리한다.',
  },
  {
    label: 'DMZ 상세 — 외부 노출 최소화 구간',
    body: '웹서버/리버스프록시가 HTTPS를 수신해 WAS로 전달. API Gateway가 인증 토큰 검증과 속도 제한을 수행.\nWAF가 SQL 인젝션·XSS를 필터링한다. DMZ 원칙: 민감 데이터 저장 금지.',
  },
  {
    label: '서비스망 + 내부망 상세',
    body: 'WAS/API 서버가 비즈니스 로직을 처리. 블록체인 노드는 P2P 포트만 외부 노출하고 RPC는 내부 전용.\n내부망 DB는 서비스망에서 DB 포트만 허용. 월렛 서버는 출금 API만 노출. 관리콘솔은 점프서버 경유.',
  },
  {
    label: 'VPN + 방화벽 규칙',
    body: 'VPN: 인증서+OTP 이중인증, 역할별 서브넷 제한, 세션 타임아웃.\n방화벽: 화이트리스트 기반(DENY ALL 기본), ANY 규칙 금지, 분기별 전수검토.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#ns-arrow)" />
  );
}

/* ── 방화벽 아이콘 (벽돌 형태) ── */
function Firewall({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={14} height={38} rx={2} fill="var(--card)" stroke={color} strokeWidth={1} />
      {/* 벽돌 패턴 */}
      <line x1={x} y1={y + 10} x2={x + 14} y2={y + 10} stroke={color} strokeWidth={0.5} />
      <line x1={x} y1={y + 19} x2={x + 14} y2={y + 19} stroke={color} strokeWidth={0.5} />
      <line x1={x} y1={y + 28} x2={x + 14} y2={y + 28} stroke={color} strokeWidth={0.5} />
      <line x1={x + 7} y1={y} x2={x + 7} y2={y + 10} stroke={color} strokeWidth={0.5} />
      <line x1={x + 4} y1={y + 10} x2={x + 4} y2={y + 19} stroke={color} strokeWidth={0.5} />
      <line x1={x + 10} y1={y + 19} x2={x + 10} y2={y + 28} stroke={color} strokeWidth={0.5} />
      <line x1={x + 7} y1={y + 28} x2={x + 7} y2={y + 38} stroke={color} strokeWidth={0.5} />
      <text x={x + 7} y={y + 50} textAnchor="middle" fontSize={7} fill={color}>FW</text>
    </g>
  );
}

export default function NetworkSegmentationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ns-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 3-Zone 전체 구조 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 보안 수준 그라데이션 배경 */}
              <rect x={10} y={10} width={85} height={195} rx={8} fill={`${C.ext}08`} stroke={C.ext} strokeWidth={0.8} />
              <rect x={115} y={10} width={100} height={195} rx={8} fill={`${C.dmz}08`} stroke={C.dmz} strokeWidth={0.8} />
              <rect x={235} y={10} width={115} height={195} rx={8} fill={`${C.svc}08`} stroke={C.svc} strokeWidth={0.8} />
              <rect x={370} y={10} width={100} height={195} rx={8} fill={`${C.int}08`} stroke={C.int} strokeWidth={0.8} />

              {/* 구간 레이블 */}
              <text x={52} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ext}>외부</text>
              <text x={165} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dmz}>DMZ</text>
              <text x={292} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.svc}>서비스망</text>
              <text x={420} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.int}>내부망</text>

              {/* 외부 영역 */}
              <DataBox x={18} y={40} w={70} h={28} label="인터넷" color={C.ext} />
              <DataBox x={18} y={78} w={70} h={28} label="사용자" color={C.ext} />
              <DataBox x={18} y={116} w={70} h={28} label="공격자" color={C.ext} />

              {/* 방화벽 1 */}
              <Firewall x={96} y={58} color={C.dmz} />

              {/* DMZ 구성 요소 */}
              <ModuleBox x={122} y={40} w={86} h={34} label="웹서버" sub="리버스프록시" color={C.dmz} />
              <ModuleBox x={122} y={82} w={86} h={34} label="API GW" sub="인증·속도제한" color={C.dmz} />
              <ModuleBox x={122} y={124} w={86} h={34} label="WAF" sub="SQL·XSS 필터" color={C.dmz} />

              {/* 방화벽 2 */}
              <Firewall x={218} y={58} color={C.svc} />

              {/* 서비스망 구성 요소 */}
              <ModuleBox x={242} y={40} w={100} h={34} label="WAS" sub="비즈니스 로직" color={C.svc} />
              <ModuleBox x={242} y={82} w={100} h={34} label="블록체인 노드" sub="P2P·RPC" color={C.svc} />
              <ModuleBox x={242} y={124} w={100} h={34} label="메시지 큐" sub="비동기 처리" color={C.svc} />

              {/* 방화벽 3 */}
              <Firewall x={353} y={58} color={C.int} />

              {/* 내부망 구성 요소 */}
              <ModuleBox x={377} y={40} w={86} h={34} label="DB 서버" sub="핵심 데이터" color={C.int} />
              <ModuleBox x={377} y={82} w={86} h={34} label="월렛 서버" sub="자산 관리" color={C.int} />
              <ModuleBox x={377} y={124} w={86} h={34} label="로그 서버" sub="감사 기록" color={C.int} />

              {/* 흐름 화살표 (최상단 한 줄로) */}
              <Arrow x1={88} y1={170} x2={115} y2={170} color={C.ext} />
              <Arrow x1={215} y1={170} x2={235} y2={170} color={C.dmz} />
              <Arrow x1={350} y1={170} x2={370} y2={170} color={C.svc} />

              {/* 보안 수준 바 */}
              <rect x={50} y={188} width={390} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <rect x={50} y={188} width={390} height={8} rx={4}
                fill="url(#ns-grad)" />
              <defs>
                <linearGradient id="ns-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.ext} stopOpacity={0.7} />
                  <stop offset="33%" stopColor={C.dmz} stopOpacity={0.7} />
                  <stop offset="66%" stopColor={C.svc} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={C.int} stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <text x={245} y={213} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                보안 수준: 낮음 ────────────────── 높음
              </text>
            </motion.g>
          )}

          {/* ── Step 1: DMZ 상세 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.dmz}>DMZ — 외부 노출 최소화 구간</text>

              {/* 외부 요청 */}
              <DataBox x={5} y={30} w={78} h={28} label="HTTPS 요청" color={C.ext} />

              {/* 웹서버/리버스프록시 */}
              <Arrow x1={83} y1={44} x2={100} y2={44} color={C.ext} />
              <ActionBox x={103} y={28} w={110} h={42} label="웹서버" sub="리버스프록시" color={C.dmz} />
              <text x={158} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">HTTPS 수신 → WAS 전달</text>

              {/* API Gateway */}
              <Arrow x1={213} y1={49} x2={240} y2={49} color={C.dmz} />
              <ActionBox x={243} y={28} w={110} h={42} label="API Gateway" sub="토큰 검증" color={C.dmz} />
              <text x={298} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인증 토큰 검증 + 속도 제한</text>

              {/* WAF */}
              <Arrow x1={353} y1={49} x2={370} y2={49} color={C.dmz} />
              <ActionBox x={373} y={28} w={98} h={42} label="WAF" sub="필터링" color={C.dmz} />

              {/* WAF 상세 — 필터 종류 */}
              <DataBox x={373} y={80} w={98} h={24} label="SQL 인젝션" color={C.ext} />
              <DataBox x={373} y={108} w={98} h={24} label="XSS 공격" color={C.ext} />
              <text x={422} y={143} textAnchor="middle" fontSize={8} fill={C.ext}>차단</text>

              {/* 통과 트래픽 → 서비스망 */}
              <Arrow x1={298} y1={70} x2={298} y2={100} color={C.svc} />
              <ModuleBox x={230} y={103} w={130} h={40} label="서비스망 전달" sub="검증 완료된 요청만" color={C.svc} />

              {/* DMZ 원칙 경고 */}
              <AlertBox x={30} y={160} w={420} h={40} label="DMZ 원칙: 민감 데이터 저장 금지" sub="DB·월렛·개인정보는 반드시 내부망에 격리. DMZ에는 캐시·세션만 허용" color={C.ext} />
            </motion.g>
          )}

          {/* ── Step 2: 서비스망 + 내부망 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 서비스망 영역 */}
              <rect x={5} y={5} width={160} height={210} rx={8} fill={`${C.svc}06`} stroke={C.svc} strokeWidth={0.6} />
              <text x={85} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.svc}>서비스망</text>

              {/* 내부망 영역 */}
              <rect x={210} y={5} width={265} height={210} rx={8} fill={`${C.int}06`} stroke={C.int} strokeWidth={0.6} />
              <text x={342} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.int}>내부망</text>

              {/* ── 서비스망 구성 (세로 배치) ── */}
              <ModuleBox x={15} y={28} w={140} h={36} label="WAS / API 서버" sub="비즈니스 로직 처리" color={C.svc} />

              <ModuleBox x={15} y={72} w={140} h={36} label="블록체인 노드" sub="체인 동기화" color={C.svc} />
              {/* 포트 설명 — 노드 박스 아래에 인라인 */}
              <DataBox x={15} y={114} w={65} h={22} label="P2P 포트" color={C.dmz} />
              <text x={47} y={146} textAnchor="middle" fontSize={7} fill={C.dmz}>외부 노출</text>
              <DataBox x={90} y={114} w={65} h={22} label="RPC 포트" color={C.svc} />
              <text x={122} y={146} textAnchor="middle" fontSize={7} fill={C.svc}>내부 전용</text>

              <ModuleBox x={15} y={156} w={140} h={36} label="메시지 큐" sub="서비스 간 비동기 통신" color={C.svc} />

              {/* ── 방화벽 (세로 구분) ── */}
              <Firewall x={173} y={50} color={C.int} />

              {/* ── 내부망 구성 (2x2 그리드) ── */}
              <ModuleBox x={220} y={28} w={120} h={38} label="DB 서버" sub="서비스망→3306만 허용" color={C.int} />
              <ModuleBox x={350} y={28} w={120} h={38} label="월렛 서버" sub="출금 API만 노출" color={C.int} />
              <ModuleBox x={220} y={76} w={120} h={38} label="관리 콘솔" sub="VPN→점프서버 경유" color={C.int} />
              <ModuleBox x={350} y={76} w={120} h={38} label="로그 서버" sub="Append-only 보관" color={C.int} />

              {/* ── 접근 규칙 요약 (내부망 하단) ── */}
              <rect x={220} y={124} width={250} height={86} rx={6} fill="var(--card)" stroke={C.int} strokeWidth={0.5} />
              <text x={345} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.int}>접근 규칙 상세</text>
              <text x={230} y={156} fontSize={8} fill="var(--muted-foreground)">DB: WAS IP에서 DB 포트(3306)만 허용</text>
              <text x={230} y={170} fontSize={8} fill="var(--muted-foreground)">월렛: 출금 서비스 → 서명 API 엔드포인트만</text>
              <text x={230} y={184} fontSize={8} fill="var(--muted-foreground)">관리: 점프서버 SSH 경유, MFA 필수</text>
              <text x={230} y={198} fontSize={8} fill="var(--muted-foreground)">로그: syslog 단방향 전송, 삭제 권한 없음</text>

              {/* ── 화살표: WAS → FW (박스 아래로 우회) ── */}
              <line x1={155} y1={46} x2={173} y2={46} stroke={C.svc} strokeWidth={1} strokeDasharray="3 2" />
              <line x1={187} y1={46} x2={220} y2={46} stroke={C.int} strokeWidth={1} markerEnd="url(#ns-arrow)" />
            </motion.g>
          )}

          {/* ── Step 3: VPN + 방화벽 규칙 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* VPN 영역 (좌측) */}
              <rect x={5} y={5} width={230} height={210} rx={8} fill={`${C.svc}06`} stroke={C.svc} strokeWidth={0.6} />
              <text x={120} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.svc}>VPN 접속 정책</text>

              <ActionBox x={15} y={30} w={105} h={34} label="인증서 + OTP" sub="이중인증 필수" color={C.svc} />
              <ActionBox x={125} y={30} w={105} h={34} label="역할별 서브넷" sub="접근 범위 제한" color={C.svc} />
              <ActionBox x={15} y={72} w={105} h={34} label="세션 타임아웃" sub="유휴 30분 차단" color={C.svc} />
              <ActionBox x={125} y={72} w={105} h={34} label="접속 로그" sub="전수 기록" color={C.svc} />

              {/* VPN 접속 경로 시각화 */}
              <DataBox x={30} y={115} w={75} h={24} label="개발자" color={C.dmz} />
              <Arrow x1={105} y1={127} x2={128} y2={127} color={C.svc} />
              <StatusBox x={130} y={110} w={95} h={38} label="VPN 터널" sub="인증 완료" color={C.svc} progress={1} />

              {/* 방화벽 영역 (우측) */}
              <rect x={250} y={5} width={225} height={210} rx={8} fill={`${C.int}06`} stroke={C.int} strokeWidth={0.6} />
              <text x={362} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.int}>방화벽 규칙</text>

              <ActionBox x={260} y={30} w={100} h={34} label="DENY ALL" sub="기본 정책" color={C.ext} />
              <ActionBox x={365} y={30} w={100} h={34} label="화이트리스트" sub="허용만 등록" color={C.int} />

              <AlertBox x={260} y={72} w={100} h={34} label="ANY 규칙 금지" sub="출발지·목적지 명시" color={C.ext} />
              <StatusBox x={365} y={72} w={100} h={34} label="분기별 검토" sub="전수 점검" color={C.int} progress={0.75} />

              {/* 방화벽 규칙 예시 */}
              <rect x={260} y={115} width={205} height={90} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={362} y={132} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.int}>규칙 예시</text>
              <text x={270} y={148} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">WAS→DB  :3306  ALLOW</text>
              <text x={270} y={162} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">Node→P2P:30303 ALLOW</text>
              <text x={270} y={176} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">*→RPC   :8545  DENY</text>
              <text x={270} y={190} fontSize={8} fontFamily="monospace" fill={C.ext}>ANY→ANY :*     DENY</text>

              {/* VPN → 내부망 화살표 */}
              <Arrow x1={225} y1={129} x2={250} y2={129} color={C.svc} />
              <text x={238} y={142} textAnchor="middle" fontSize={7} fill={C.svc}>FW</text>

              {/* 하단 원칙 */}
              <text x={120} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">미사용 계정/규칙 → 즉시 폐기</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

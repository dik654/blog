import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  ext: '#ef4444',   // 외부/위험 — 빨강
  dmz: '#f59e0b',   // DMZ/경계 — 노랑
  svc: '#3b82f6',   // 서비스/내부 — 파랑
  int: '#22c55e',   // 안전/모니터링 — 초록
};

const STEPS = [
  {
    label: 'Defense in Depth — 다계층 방어',
    body: '보안 인프라는 단일 장비가 아니라 여러 계층으로 구성. 한 계층이 뚫려도 다음 계층이 방어한다.\n외부에서 내부로 향하는 트래픽이 각 단계에서 서로 다른 종류의 위협을 걸러낸다.',
  },
  {
    label: '5단계 보안 장비 배치 흐름',
    body: '인터넷→경계(외부 방화벽/UTM)→DMZ(IPS, WAF)→DMZ 서버(웹서버, VPN GW)→내부 방화벽→내부망(NAC, EDR).\n각 구간에 배치된 장비가 서로 다른 공격 벡터를 차단한다.',
  },
  {
    label: '각 계층의 역할',
    body: '경계 방어(방화벽, UTM) — 1차 필터링. 세그멘테이션(내부 방화벽, VLAN) — 침해 확산 방지.\n엔드포인트(EDR, AV) — 단말 보호. 모니터링(SIEM, SOC) — 전 계층 로그 수집·분석.',
  },
  {
    label: 'VASP 보안 인프라 특수성',
    body: 'VASP는 블록체인 노드, 핫월렛, 서명 서버 등 암호화폐 특화 인프라를 운영.\nWallet Zone을 별도 격리하고, 점프 서버 + MFA를 통해서만 접근하는 것이 표준 구성.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#sio-arrow)" />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sio-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 다계층 방어 개념 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 동심원 형태의 방어 계층 */}
              <rect x={40} y={15} width={400} height={190} rx={12} fill={`${C.ext}08`} stroke={C.ext} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={30} textAnchor="middle" fontSize={8} fill={C.ext}>Layer 1: 경계 방어</text>

              <rect x={80} y={40} width={320} height={150} rx={10} fill={`${C.dmz}08`} stroke={C.dmz} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={54} textAnchor="middle" fontSize={8} fill={C.dmz}>Layer 2: DMZ / 세그멘테이션</text>

              <rect x={120} y={62} width={240} height={110} rx={8} fill={`${C.svc}08`} stroke={C.svc} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={76} textAnchor="middle" fontSize={8} fill={C.svc}>Layer 3: 엔드포인트 보호</text>

              <rect x={165} y={85} width={150} height={68} rx={6} fill={`${C.int}10`} stroke={C.int} strokeWidth={1} />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.int}>핵심 자산</text>
              <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">DB, 월렛, 개인정보</text>
              <text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">업무 시스템</text>

              {/* 공격자 화살표가 계층에 막히는 표현 */}
              <DataBox x={5} y={90} w={55} h={28} label="공격자" color={C.ext} />
              <Arrow x1={60} y1={104} x2={78} y2={104} color={C.ext} />
              <text x={44} y={135} textAnchor="middle" fontSize={7} fill={C.ext}>Layer 1 차단</text>

              {/* 모니터링 레이어 */}
              <ModuleBox x={380} y={82} w={80} h={40} label="SIEM" sub="전계층 감시" color={C.int} />
              <line x1={370} y1={102} x2={360} y2={102} stroke={C.int} strokeWidth={0.6} strokeDasharray="2 2" />
              <line x1={370} y1={92} x2={318} y2={72} stroke={C.int} strokeWidth={0.6} strokeDasharray="2 2" />
              <line x1={370} y1={112} x2={318} y2={162} stroke={C.int} strokeWidth={0.6} strokeDasharray="2 2" />
            </motion.g>
          )}

          {/* Step 1: 5단계 장비 배치 흐름 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 5개 구간 */}
              <rect x={5} y={20} width={80} height={170} rx={6} fill={`${C.ext}08`} stroke={C.ext} strokeWidth={0.6} />
              <text x={45} y={35} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.ext}>1. 인터넷</text>

              <rect x={100} y={20} width={80} height={170} rx={6} fill={`${C.dmz}08`} stroke={C.dmz} strokeWidth={0.6} />
              <text x={140} y={35} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.dmz}>2. 경계</text>

              <rect x={195} y={20} width={80} height={170} rx={6} fill={`${C.dmz}08`} stroke={C.dmz} strokeWidth={0.6} />
              <text x={235} y={35} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.dmz}>3. DMZ</text>

              <rect x={290} y={20} width={80} height={170} rx={6} fill={`${C.svc}08`} stroke={C.svc} strokeWidth={0.6} />
              <text x={330} y={35} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.svc}>4. DMZ→내부</text>

              <rect x={385} y={20} width={88} height={170} rx={6} fill={`${C.int}08`} stroke={C.int} strokeWidth={0.6} />
              <text x={429} y={35} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.int}>5. 내부망</text>

              {/* 각 구간 장비 */}
              <DataBox x={12} y={48} w={66} h={26} label="외부 트래픽" color={C.ext} />
              <ModuleBox x={105} y={48} w={70} h={34} label="방화벽" sub="UTM" color={C.dmz} />
              <ModuleBox x={200} y={48} w={70} h={34} label="IPS" sub="시그니처" color={C.dmz} />
              <ModuleBox x={200} y={92} w={70} h={34} label="WAF" sub="L7 검사" color={C.dmz} />
              <ModuleBox x={295} y={48} w={70} h={34} label="내부 FW" sub="격리" color={C.svc} />
              <ModuleBox x={392} y={48} w={74} h={34} label="NAC" sub="단말 검증" color={C.int} />
              <ModuleBox x={392} y={92} w={74} h={34} label="EDR" sub="호스트 보호" color={C.int} />

              {/* 화살표 흐름 */}
              <Arrow x1={78} y1={62} x2={103} y2={62} color={C.ext} />
              <Arrow x1={175} y1={62} x2={198} y2={62} color={C.dmz} />
              <Arrow x1={270} y1={62} x2={293} y2={62} color={C.dmz} />
              <Arrow x1={365} y1={62} x2={390} y2={62} color={C.svc} />

              {/* 차단 대상 */}
              <text x={45} y={94} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">비인가 포트</text>
              <text x={45} y={105} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">DDoS 1차</text>
              <text x={140} y={100} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">IP 기반</text>
              <text x={140} y={111} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">포트 차단</text>
              <text x={235} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">SQLi, XSS</text>
              <text x={330} y={100} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">2차 침투</text>
              <text x={330} y={111} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">차단</text>
              <text x={429} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">측면 이동</text>
              <text x={429} y={151} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">방지</text>
            </motion.g>
          )}

          {/* Step 2: 각 계층의 역할 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 4개 계층 박스 */}
              <ModuleBox x={15} y={20} w={105} h={44} label="경계 방어" sub="방화벽, UTM, ACL" color={C.ext} />
              <ModuleBox x={135} y={20} w={105} h={44} label="세그멘테이션" sub="내부 FW, VLAN" color={C.dmz} />
              <ModuleBox x={255} y={20} w={105} h={44} label="엔드포인트" sub="EDR, AV, NAC" color={C.svc} />
              <ModuleBox x={375} y={20} w={95} h={44} label="모니터링" sub="SIEM, SOC, IDS" color={C.int} />

              {/* 역할 설명 박스 */}
              <ActionBox x={15} y={78} w={105} h={34} label="1차 필터링" sub="IP/포트 기반" color={C.ext} />
              <ActionBox x={135} y={78} w={105} h={34} label="침해 확산 방지" sub="구간 분리" color={C.dmz} />
              <ActionBox x={255} y={78} w={105} h={34} label="단말 보호" sub="악성코드 차단" color={C.svc} />
              <ActionBox x={375} y={78} w={95} h={34} label="전계층 분석" sub="로그 상관분석" color={C.int} />

              {/* 화살표 연결 */}
              <Arrow x1={67} y1={64} x2={67} y2={76} color={C.ext} />
              <Arrow x1={187} y1={64} x2={187} y2={76} color={C.dmz} />
              <Arrow x1={307} y1={64} x2={307} y2={76} color={C.svc} />
              <Arrow x1={422} y1={64} x2={422} y2={76} color={C.int} />

              {/* ISMS 연계 */}
              <rect x={15} y={125} width={455} height={80} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">ISMS 보호대책 연계</text>
              <text x={30} y={160} fontSize={8} fill={C.ext}>2.6 접근통제</text>
              <text x={130} y={160} fontSize={8} fill="var(--muted-foreground)">방화벽 규칙, 네트워크 세그멘테이션, VPN 접근 정책</text>
              <text x={30} y={176} fontSize={8} fill={C.dmz}>2.10 시스템 개발 보안</text>
              <text x={170} y={176} fontSize={8} fill="var(--muted-foreground)">WAF 배치, 시큐어 코딩과 연계한 웹 보호</text>
              <text x={30} y={192} fontSize={8} fill={C.svc}>2.11 침해사고 관리</text>
              <text x={160} y={192} fontSize={8} fill="var(--muted-foreground)">IDS/IPS 탐지 → SIEM 상관분석 → CSIRT 대응</text>
            </motion.g>
          )}

          {/* Step 3: VASP 특수성 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 일반 내부망 */}
              <rect x={5} y={10} width={200} height={200} rx={8} fill={`${C.svc}06`} stroke={C.svc} strokeWidth={0.6} />
              <text x={105} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.svc}>일반 업무망</text>

              <ModuleBox x={15} y={36} w={85} h={36} label="업무 PC" sub="임직원" color={C.svc} />
              <ModuleBox x={110} y={36} w={85} h={36} label="업무 서버" sub="ERP, 메일" color={C.svc} />
              <ModuleBox x={15} y={82} w={85} h={36} label="개발 서버" sub="CI/CD" color={C.svc} />

              {/* Wallet Zone 격리 */}
              <rect x={230} y={10} width={240} height={200} rx={8} fill={`${C.int}06`} stroke={C.int} strokeWidth={1} />
              <text x={350} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.int}>Wallet Zone (격리)</text>

              <ModuleBox x={245} y={36} w={100} h={36} label="핫월렛 서버" sub="소액 자산" color={C.int} />
              <ModuleBox x={360} y={36} w={100} h={36} label="서명 서버" sub="프라이빗 키" color={C.int} />
              <ModuleBox x={245} y={82} w={100} h={36} label="블록체인 노드" sub="트랜잭션" color={C.int} />
              <ModuleBox x={360} y={82} w={100} h={36} label="콜드월렛" sub="오프라인" color={C.int} />

              {/* 직접 접근 차단 X */}
              <line x1={200} y1={55} x2={230} y2={55} stroke={C.ext} strokeWidth={1.5} />
              <text x={215} y={50} textAnchor="middle" fontSize={12} fill={C.ext} fontWeight={700}>X</text>
              <text x={215} y={72} textAnchor="middle" fontSize={7} fill={C.ext}>직접 접근 차단</text>

              {/* 점프 서버 경유 경로 */}
              <ActionBox x={110} y={130} w={95} h={34} label="점프 서버" sub="경유 전용" color={C.dmz} />
              <ActionBox x={245} y={130} w={95} h={34} label="MFA 인증" sub="OTP + 인증서" color={C.int} />

              <Arrow x1={100} y1={100} x2={140} y2={128} color={C.dmz} />
              <Arrow x1={205} y1={147} x2={243} y2={147} color={C.dmz} />
              <Arrow x1={340} y1={147} x2={370} y2={120} color={C.int} />

              {/* 하단 경고 */}
              <AlertBox x={110} y={175} w={250} h={30} label="업무망 → Wallet Zone 직접 접근 전면 차단" color={C.ext} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

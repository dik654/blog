import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  dmz: '#f59e0b',
  svc: '#6366f1',
  internal: '#ef4444',
  safe: '#10b981',
};

const STEPS = [
  {
    label: 'DMZ → 서비스망 → 내부망 흐름',
    body: '외부 요청은 DMZ(웹서버, WAF)를 거쳐 서비스망(WAS)에 전달.\n서비스망만 내부망(DB)에 특정 포트로 접근 가능. 외부 → 내부 직접 접근 차단.',
  },
  {
    label: 'VPN + 점프서버: 관리 접근 경로',
    body: '원격 관리: VPN(인증서+OTP) → 점프서버 경유 → 내부 서버/DB.\n접속 범위를 역할별 서브넷으로 제한. 세션 타임아웃 8시간, 접속 지역 감시.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tz-viz-arr)" />;
}

export default function ThreeZoneViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tz-viz-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.svc}>3-Zone 트래픽 흐름</text>

              {/* 인터넷 */}
              <DataBox x={10} y={30} w={70} h={28} label="인터넷" color={C.dmz} />
              <Arrow x1={80} y1={44} x2={98} y2={44} color={C.dmz} />
              <text x={88} y={38} fontSize={7} fill={C.dmz}>HTTPS</text>

              {/* DMZ */}
              <rect x={100} y={24} width={110} height={90} rx={8} fill={`${C.dmz}08`} stroke={C.dmz} strokeWidth={0.7} />
              <text x={155} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dmz}>DMZ</text>
              <ModuleBox x={108} y={44} w={95} h={28} label="웹서버/WAF" sub="SSL 종단" color={C.dmz} />
              <ModuleBox x={108} y={78} w={95} h={28} label="API Gateway" sub="인증/속도 제한" color={C.dmz} />

              <Arrow x1={210} y1={60} x2={228} y2={60} color={C.svc} />
              <text x={218} y={54} fontSize={7} fill={C.svc}>특정 포트</text>

              {/* 서비스망 */}
              <rect x={230} y={24} width={110} height={90} rx={8} fill={`${C.svc}08`} stroke={C.svc} strokeWidth={0.7} />
              <text x={285} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.svc}>서비스망</text>
              <ModuleBox x={238} y={44} w={95} h={28} label="WAS/API" sub="비즈니스 로직" color={C.svc} />
              <ModuleBox x={238} y={78} w={95} h={28} label="블록체인 노드" sub="P2P:30303" color={C.svc} />

              <Arrow x1={340} y1={60} x2={358} y2={60} color={C.internal} />
              <text x={348} y={54} fontSize={7} fill={C.internal}>DB 포트</text>

              {/* 내부망 */}
              <rect x={360} y={24} width={110} height={90} rx={8} fill={`${C.internal}08`} stroke={C.internal} strokeWidth={0.7} />
              <text x={415} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.internal}>내부망</text>
              <ModuleBox x={368} y={44} w={95} h={28} label="DB 서버" sub="고객 데이터" color={C.internal} />
              <ModuleBox x={368} y={78} w={95} h={28} label="월렛 서버" sub="개인키 서명" color={C.internal} />

              {/* 방화벽 표시 */}
              <rect x={95} y={120} width={4} height={20} rx={2} fill={C.dmz} />
              <rect x={225} y={120} width={4} height={20} rx={2} fill={C.svc} />
              <rect x={355} y={120} width={4} height={20} rx={2} fill={C.internal} />
              <text x={155} y={136} textAnchor="middle" fontSize={7.5} fill={C.dmz}>방화벽 1</text>
              <text x={285} y={136} textAnchor="middle" fontSize={7.5} fill={C.svc}>방화벽 2</text>
              <text x={415} y={136} textAnchor="middle" fontSize={7.5} fill={C.internal}>방화벽 3</text>

              {/* 원칙 */}
              <rect x={30} y={148} width={420} height={50} rx={6} fill="var(--card)" stroke={C.svc} strokeWidth={0.5} />
              <text x={240} y={166} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.svc}>핵심 원칙</text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">외부 → 내부 직접 접근 불가. 반드시 DMZ → 서비스망 → 내부망 순서.</text>
              <text x={240} y={192} textAnchor="middle" fontSize={7.5} fill={C.internal}>DMZ에는 민감 데이터 저장 금지. 로그만 임시 보관 후 내부망으로 전송.</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>VPN + 점프서버: 관리 접근 경로</text>

              {/* 관리 흐름 */}
              <DataBox x={10} y={35} w={70} h={28} label="관리자" color={C.svc} />
              <Arrow x1={80} y1={49} x2={98} y2={49} color={C.svc} />

              <ActionBox x={100} y={33} w={85} h={32} label="VPN 접속" sub="인증서+OTP" color={C.svc} />
              <Arrow x1={185} y1={49} x2={203} y2={49} color={C.safe} />

              <ActionBox x={205} y={33} w={85} h={32} label="점프서버" sub="중계 서버" color={C.safe} />
              <Arrow x1={290} y1={49} x2={308} y2={49} color={C.internal} />

              <ModuleBox x={310} y={31} w={75} h={36} label="내부 서버" sub="SSH 접속" color={C.internal} />

              <Arrow x1={290} y1={65} x2={308} y2={80} color={C.internal} />
              <ModuleBox x={310} y={74} w={75} h={36} label="DB" sub="DAC 경유" color={C.internal} />

              {/* 제한 조건 */}
              <rect x={400} y={31} width={75} height={80} rx={6} fill="var(--card)" stroke={C.dmz} strokeWidth={0.5} />
              <text x={437} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dmz}>접속 제한</text>
              <text x={437} y={62} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">역할별</text>
              <text x={437} y={74} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">서브넷 분리</text>
              <text x={437} y={88} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">8시간 타임아웃</text>
              <text x={437} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">지역 감시</text>

              <rect x={10} y={125} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* VPN 없이 접근 시 */}
              <AlertBox x={30} y={135} w={190} h={42} label="VPN 미사용 시" sub="내부 자원 인터넷 직접 노출 → ISMS 부적합" color={C.internal} />
              <rect x={250} y={135} width={200} height={42} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={350} y={152} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>VPN 접속 이력 필수 기록</text>
              <text x={350} y={166} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">시간, IP, 지역 → 비정상 시 즉시 알림</text>

              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">점프서버는 1~2대로 제한, 점프서버 자체에도 MFA + 세션 녹화 적용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

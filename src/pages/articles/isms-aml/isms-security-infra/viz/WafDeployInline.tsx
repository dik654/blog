import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'WAF 리버스 프록시 배치: 클라이언트 → WAF → 웹서버',
    body: '클라이언트는 WAF IP에 접속, 검사 통과한 요청만 전달. 웹서버 IP를 숨겨 직접 공격 방지. SSL Termination으로 HTTPS도 검사 가능.',
  },
  {
    label: 'VPN + MFA: ISMS 원격 접근 통제 필수',
    body: 'IPSec(사이트간 상시 연결)과 SSL VPN(원격 접속 브라우저). VPN에 OTP·인증서·생체 등 MFA 필수. 접속 로그는 SIEM으로 전송.',
  },
  {
    label: 'NAC: 단말 보안 상태 검증 후 접근 허용',
    body: 'AV 설치·OS 패치·비인가 SW 확인. 미충족 시 격리 VLAN으로 전환(업데이트 서버만 접근). 802.1X로 물리 포트 수준 인증.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-wd-arrow)" />;
}

export default function WafDeployInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-wd-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={10} y={30} w={80} h={30} label="클라이언트" sub="요청" color={C.blue} />
              <Arrow x1={92} y1={45} x2={128} y2={45} color={C.blue} />
              <ModuleBox x={130} y={30} w={100} h={30} label="WAF" sub="리버스 프록시" color={C.red} />
              <Arrow x1={232} y1={45} x2={268} y2={45} color={C.green} />
              <text x={250} y={38} textAnchor="middle" fontSize={8} fill={C.green}>통과</text>
              <ModuleBox x={270} y={30} w={80} h={30} label="웹서버" sub="실제 IP 숨김" color={C.green} />

              {/* blocked path */}
              <Arrow x1={180} y1={62} x2={180} y2={82} color={C.red} />
              <AlertBox x={120} y={84} w={120} h={28} label="차단된 요청" sub="SQLi / XSS / CSRF" color={C.red} />

              {/* SSL termination note */}
              <rect x={280} y={72} width={180} height={34} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={370} y={86} textAnchor="middle" fontSize={9} fill="var(--foreground)">SSL Termination</text>
              <text x={370} y={99} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">WAF에서 HTTPS 복호화 → 검사</text>

              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">WAF 장애 = 서비스 중단 → 이중화 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={10} w={180} h={32} label="IPSec VPN" sub="사이트간 (본사↔지사)" color={C.blue} />
              <ModuleBox x={280} y={10} w={180} h={32} label="SSL VPN" sub="원격 접속 (브라우저)" color={C.green} />

              <Arrow x1={110} y1={44} x2={110} y2={60} color={C.blue} />
              <Arrow x1={370} y1={44} x2={370} y2={60} color={C.green} />

              <rect x={20} y={62} width={180} height={26} rx={4} fill="var(--card)" stroke={C.blue} strokeWidth={0.5} />
              <text x={110} y={79} textAnchor="middle" fontSize={8} fill="var(--foreground)">L3 전체 터널 / 전용 클라이언트</text>
              <rect x={280} y={62} width={180} height={26} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={370} y={79} textAnchor="middle" fontSize={8} fill="var(--foreground)">L4-7 / 클라이언트 불필요</text>

              <Arrow x1={110} y1={90} x2={240} y2={108} color={C.blue} />
              <Arrow x1={370} y1={90} x2={240} y2={108} color={C.green} />
              <ActionBox x={140} y={108} w={200} h={30} label="MFA 필수 (ISMS 2.6.6)" sub="OTP / 인증서 / 생체" color={C.red} />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">접속 로그(시간·IP·사용자) → SIEM으로 전송</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={10} y={15} w={80} h={30} label="단말기" sub="접속 시도" color={C.blue} />
              <Arrow x1={92} y1={30} x2={118} y2={30} color={C.blue} />
              <ModuleBox x={120} y={15} w={100} h={30} label="NAC 검증" sub="보안 상태 확인" color={C.amber} />

              <Arrow x1={222} y1={22} x2={278} y2={22} color={C.green} />
              <text x={250} y={15} textAnchor="middle" fontSize={8} fill={C.green}>통과</text>
              <DataBox x={280} y={15} w={80} h={30} label="업무 네트워크" sub="접근 허용" color={C.green} />

              <Arrow x1={170} y1={47} x2={170} y2={70} color={C.red} />
              <text x={190} y={62} textAnchor="middle" fontSize={8} fill={C.red}>미충족</text>
              <AlertBox x={100} y={72} w={140} h={30} label="격리 VLAN 전환" sub="업데이트 서버만 접근" color={C.red} />

              {/* check items */}
              <rect x={300} y={60} width={170} height={50} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={385} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">검증 항목</text>
              <text x={385} y={87} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AV 설치 / OS 패치 최신</text>
              <text x={385} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비인가 SW / 화면 잠금</text>

              <text x={240} y={128} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">802.1X: 인증 안 된 단말은 물리 포트에 연결해도 통신 불가</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

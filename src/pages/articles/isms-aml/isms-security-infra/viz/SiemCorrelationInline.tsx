import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: '상관분석: 정규화 → 시간순 연결 → 공격 체인 재구성',
    body: '각 장비의 다른 필드명을 공통 형식으로 정규화(src_ip → s_ip). 동일 IP의 이벤트를 시간순 연결하면 포트스캔 → 브루트포스 → SQLi 공격 체인 도출.',
  },
  {
    label: 'SOAR: 탐지 → 자동 대응 + 대시보드',
    body: '플레이북으로 반복 대응 자동화(IP 차단·계정 잠금·격리). 서비스 영향 큰 조치는 관리자 승인 후 실행. 대시보드로 실시간 위협 현황·Top 공격 IP 파악.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-sc-arrow)" />;
}

export default function SiemCorrelationInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-sc-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Log sources */}
              <DataBox x={10} y={8} w={80} h={26} label="방화벽" sub="src_ip" color={C.amber} />
              <DataBox x={100} y={8} w={80} h={26} label="IPS" sub="source_addr" color={C.green} />
              <DataBox x={190} y={8} w={80} h={26} label="서버" sub="remote_addr" color={C.blue} />

              <Arrow x1={50} y1={36} x2={140} y2={52} color={C.amber} />
              <Arrow x1={140} y1={36} x2={140} y2={52} color={C.green} />
              <Arrow x1={230} y1={36} x2={140} y2={52} color={C.blue} />

              <ActionBox x={80} y={53} w={120} h={26} label="정규화" sub="s_ip 공통 필드" color={C.purple} />

              {/* Attack chain */}
              <Arrow x1={140} y1={81} x2={140} y2={96} color={C.purple} />
              <rect x={30} y={98} width={420} height={50} rx={5} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.red}>공격 체인 재구성 (동일 IP)</text>

              <rect x={40} y={120} width={90} height={20} rx={3} fill={C.amber} opacity={0.15} stroke={C.amber} strokeWidth={0.5} />
              <text x={85} y={134} textAnchor="middle" fontSize={8} fill={C.amber}>포트 스캔</text>
              <Arrow x1={132} y1={130} x2={148} y2={130} color={C.red} />
              <rect x={150} y={120} width={90} height={20} rx={3} fill={C.blue} opacity={0.15} stroke={C.blue} strokeWidth={0.5} />
              <text x={195} y={134} textAnchor="middle" fontSize={8} fill={C.blue}>SSH 브루트포스</text>
              <Arrow x1={242} y1={130} x2={258} y2={130} color={C.red} />
              <rect x={260} y={120} width={90} height={20} rx={3} fill={C.green} opacity={0.15} stroke={C.green} strokeWidth={0.5} />
              <text x={305} y={134} textAnchor="middle" fontSize={8} fill={C.green}>SQL Injection</text>
              <Arrow x1={352} y1={130} x2={368} y2={130} color={C.red} />
              <AlertBox x={370} y={118} w={70} h={24} label="높은 위험" sub="즉각 대응" color={C.red} />

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">개별로는 경미하지만 연결하면 공격 시나리오 도출</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={100} h={30} label="SIEM 탐지" sub="이벤트 발생" color={C.blue} />
              <Arrow x1={112} y1={25} x2={138} y2={25} color={C.blue} />
              <ModuleBox x={140} y={10} w={120} h={30} label="SOAR" sub="자동 대응 실행" color={C.green} />
              <Arrow x1={262} y1={25} x2={288} y2={25} color={C.green} />
              <ActionBox x={290} y={10} w={170} h={30} label="플레이북 실행" sub="IP 차단·계정 잠금·격리" color={C.amber} />

              <Arrow x1={200} y1={42} x2={200} y2={60} color={C.green} />
              <rect x={120} y={62} width={160} height={30} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
              <text x={200} y={77} textAnchor="middle" fontSize={9} fill="var(--foreground)">서비스 영향 큰 조치</text>
              <text x={200} y={88} textAnchor="middle" fontSize={8} fill={C.red}>관리자 승인 후 실행</text>

              {/* Dashboard */}
              <rect x={300} y={55} width={170} height={50} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={385} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">대시보드</text>
              <text x={385} y={84} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실시간 위협 / Top 공격 IP</text>
              <text x={385} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">미처리 알림 / 트렌드</text>

              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">반복 대응 자동화로 MTTR(대응 시간) 단축</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

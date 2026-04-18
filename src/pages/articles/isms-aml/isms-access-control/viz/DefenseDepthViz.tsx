import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  net: '#6366f1',
  srv: '#f59e0b',
  app: '#10b981',
  db: '#ef4444',
};

const STEPS = [
  {
    label: '심층 방어 — 4개 독립 계층',
    body: '네트워크 → 서버 → 애플리케이션 → DB: 각 계층이 독립적으로 작동.\n한 계층이 뚫려도 다음 계층에서 차단 — "방화벽 있으니 DB 보안 안 해도 된다"는 금지.',
  },
  {
    label: '공격자 침투 시나리오',
    body: 'VPN으로 내부망 진입(네트워크 돌파) → 서버 인증이 독립 동작하여 2차 차단.\n서버까지 뚫려도 DB 접근제어가 3차 방어 → 단일 계층 의존의 위험을 보여주는 흐름.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#dd-viz-arr)" />;
}

export default function DefenseDepthViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dd-viz-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.net}>심층 방어: 4계층 독립 통제</text>

              {/* 동심원 느낌의 네스팅 */}
              <rect x={10} y={28} width={460} height={160} rx={10} fill={`${C.net}08`} stroke={C.net} strokeWidth={0.8} />
              <text x={35} y={44} fontSize={8} fontWeight={600} fill={C.net}>네트워크 계층</text>
              <text x={35} y={56} fontSize={7.5} fill="var(--muted-foreground)">방화벽, IPS, 망분리</text>

              <rect x={50} y={62} width={380} height={118} rx={8} fill={`${C.srv}08`} stroke={C.srv} strokeWidth={0.7} />
              <text x={75} y={76} fontSize={8} fontWeight={600} fill={C.srv}>서버 계층</text>
              <text x={75} y={88} fontSize={7.5} fill="var(--muted-foreground)">SSH 키, IP 제한, 호스트 FW</text>

              <rect x={90} y={94} width={300} height={78} rx={6} fill={`${C.app}08`} stroke={C.app} strokeWidth={0.6} />
              <text x={115} y={108} fontSize={8} fontWeight={600} fill={C.app}>애플리케이션 계층</text>
              <text x={115} y={120} fontSize={7.5} fill="var(--muted-foreground)">WAF, 세션, API 인증</text>

              <rect x={130} y={126} width={220} height={38} rx={4} fill="var(--card)" stroke={C.db} strokeWidth={0.8} />
              <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.db}>DB 계층: 핵심 데이터</text>
              <text x={240} y={156} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">접근제어 SW, 쿼리 필터링, 암호화</text>

              {/* 화살표: 외부 → 내부 */}
              <Arrow x1={440} y1={50} x2={440} y2={78} color={C.net} />
              <Arrow x1={410} y1={84} x2={410} y2={106} color={C.srv} />
              <Arrow x1={370} y1={116} x2={370} y2={134} color={C.app} />

              <text x={455} y={66} fontSize={7} fill={C.net}>차단 1</text>
              <text x={425} y={98} fontSize={7} fill={C.srv}>차단 2</text>
              <text x={385} y={128} fontSize={7} fill={C.app}>차단 3</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.db}>침투 시나리오: VPN 내부 진입</text>

              {/* 공격 흐름 */}
              <AlertBox x={10} y={30} w={75} h={35} label="공격자" sub="VPN 접속" color={C.db} />
              <Arrow x1={85} y1={47} x2={103} y2={47} color={C.db} />

              <ModuleBox x={105} y={26} w={85} h={42} label="네트워크" sub="VPN 통과 (돌파)" color={C.net} />
              <text x={147} y={78} textAnchor="middle" fontSize={7.5} fill={C.db}>1차 돌파</text>

              <Arrow x1={190} y1={47} x2={208} y2={47} color={C.db} />

              <ActionBox x={210} y={26} w={85} h={42} label="서버 인증" sub="SSH 키 필요" color={C.srv} />
              <text x={252} y={78} textAnchor="middle" fontSize={7.5} fill={C.srv}>2차 차단!</text>

              {/* 차단 시나리오 */}
              <Arrow x1={252} y1={68} x2={252} y2={95} color={C.srv} />
              <rect x={195} y={95} width={120} height={24} rx={4} fill="var(--card)" stroke={C.srv} strokeWidth={0.8} />
              <text x={255} y={111} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.srv}>SSH 키 없음 → 거부</text>

              {/* 만약 2차도 돌파 시 */}
              <Arrow x1={295} y1={47} x2={313} y2={47} color={C.db} />
              <ActionBox x={315} y={26} w={75} h={42} label="WAF" sub="쿼리 필터" color={C.app} />
              <Arrow x1={390} y1={47} x2={408} y2={47} color={C.db} />
              <ActionBox x={410} y={26} w={65} h={42} label="DB 접근" sub="IP+OTP" color={C.db} />
              <text x={357} y={78} textAnchor="middle" fontSize={7.5} fill={C.app}>3차 차단</text>
              <text x={442} y={78} textAnchor="middle" fontSize={7.5} fill={C.db}>4차 차단</text>

              <rect x={10} y={130} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <rect x={40} y={142} width={400} height={48} rx={6} fill="var(--card)" stroke={C.net} strokeWidth={0.5} />
              <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>제로 트러스트(Zero Trust) 관점</text>
              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"내부망은 안전하다" 전제를 폐기 → 네트워크 위치와 무관하게 모든 접근 검증</text>
              <text x={240} y={184} textAnchor="middle" fontSize={7.5} fill={C.app}>심층 방어를 철저히 적용하면 자연스럽게 제로 트러스트에 수렴</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

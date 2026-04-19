import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.16, duration: 0.5 };
const C = {
  client: '#0ea5e9',
  server: '#10b981',
  challenge: '#a855f7',
  resp: '#f59e0b',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '새 경로 진입 — Client IP_2 에서 첫 패킷',
    body: '네트워크 전환으로 src IP 가 변경. 서버 입장에서 같은 CID 가 모르는 IP 로부터 도착.',
  },
  {
    label: 'PATH_CHALLENGE — 8 바이트 nonce 송신',
    body: '서버는 새 경로의 reachability 검증을 위해 무작위 nonce 를 challenge 로 보냄.',
  },
  {
    label: 'PATH_RESPONSE — 동일 nonce echo',
    body: '클라이언트가 같은 nonce 로 응답. 새 경로에서 양방향 통신이 됨을 증명.',
  },
  {
    label: 'Anti-amplification — 검증 전 3x 제한',
    body: '검증 전까지 서버는 받은 바이트의 3배까지만 송신. spoofed 마이그레이션 통한 DDoS 방어.',
  },
  {
    label: '경로 전환 — 트래픽 이동, 무중단',
    body: '검증 통과 시 active path 갱신. 구 경로는 잠시 keep-alive 후 폐기.',
  },
];

function ClientServer({ leftIp, leftColor }: { leftIp: string; leftColor: string }) {
  return (
    <>
      <ModuleBox x={20} y={75} w={100} h={48} label="Client" sub={leftIp} color={leftColor} />
      <ModuleBox x={360} y={75} w={100} h={48} label="Server" sub="고정" color={C.server} />
    </>
  );
}

export default function PathValidationViz() {
  const leftIp = ['IP_2 (new)', 'IP_2 (new)', 'IP_2 (new)', 'IP_2 (new)', 'IP_2 (active)'][/* step */ 0];

  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const ip = ['IP_2 (new)', 'IP_2 (new)', 'IP_2 (new)', 'IP_2 (new)', 'IP_2 (active)'][step] || leftIp;
        const color = step >= 4 ? C.server : C.client;
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <ClientServer leftIp={ip} leftColor={color} />

            {/* base path line */}
            <line x1={120} y1={99} x2={360} y2={99} stroke="#9ca3af" strokeWidth={0.6}
              strokeDasharray="2 2" />

            {step === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <motion.circle cx={120} cy={99} r={4} fill={C.client}
                  animate={{ cx: [120, 360] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
                <text x={240} y={88} textAnchor="middle" fontSize={9} fill={C.client} fontWeight={600}>
                  packet (CID 동일, IP 다름)
                </text>
                <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  서버: 같은 연결로 인식하지만 경로 검증 필요
                </text>
              </motion.g>
            )}

            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <motion.path d="M 360 99 L 120 99"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                  stroke={C.challenge} strokeWidth={1.5} fill="none" markerEnd="url(#pcla)" />
                <defs>
                  <marker id="pcla" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill={C.challenge} />
                  </marker>
                </defs>
                <DataBox x={170} y={28} w={140} h={32}
                  label="PATH_CHALLENGE" sub="data: random 8B nonce" color={C.challenge} outlined />
                <line x1={240} y1={60} x2={240} y2={92} stroke={C.challenge} strokeWidth={0.6}
                  strokeDasharray="2 2" />
              </motion.g>
            )}

            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <motion.path d="M 120 99 L 360 99"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                  stroke={C.resp} strokeWidth={1.5} fill="none" markerEnd="url(#pra)" />
                <defs>
                  <marker id="pra" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill={C.resp} />
                  </marker>
                </defs>
                <DataBox x={170} y={28} w={140} h={32}
                  label="PATH_RESPONSE" sub="echo same nonce" color={C.resp} outlined />
                <line x1={240} y1={60} x2={240} y2={92} stroke={C.resp} strokeWidth={0.6}
                  strokeDasharray="2 2" />
                <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  reflection 공격 방어 — 진짜로 받을 수 있는 호스트만 응답 가능
                </text>
              </motion.g>
            )}

            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={240} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                  Anti-amplification budget
                </text>
                <rect x={140} y={36} width={200} height={20} rx={4}
                  fill={`${C.client}20`} stroke={C.client} strokeWidth={0.8} />
                <text x={240} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.client}>
                  received: N bytes
                </text>
                <rect x={140} y={62} width={200} height={20} rx={4}
                  fill={`${C.warn}10`} stroke={C.warn} strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={240} y={76} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>
                  send budget: ≤ 3 × N
                </text>
                <AlertBox x={170} y={140} w={140} h={36}
                  label="DDoS 방어" sub="spoofed migration 봉쇄" color={C.warn} />
              </motion.g>
            )}

            {step === 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <line x1={120} y1={99} x2={360} y2={99} stroke={C.server} strokeWidth={1.6} />
                <motion.circle r={4} fill={C.server}
                  animate={{ cx: [120, 360], opacity: [1, 1, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  cy={99} />
                <text x={240} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.server}>
                  active path = new
                </text>
                <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  구 경로는 짧게 keep-alive 후 폐기, 애플리케이션 무중단
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}

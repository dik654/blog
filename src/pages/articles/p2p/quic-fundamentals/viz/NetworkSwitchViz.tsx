import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.5 };
const C = {
  client: '#6366f1',
  server: '#10b981',
  cid: '#a855f7',
  wifi: '#0ea5e9',
  cell: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  {
    label: 'TCP 는 4-tuple 로 결속',
    body: '연결 식별자 = (src_ip, src_port, dst_ip, dst_port). 어느 하나라도 바뀌면 OS 가 다른 연결로 본다.',
  },
  {
    label: 'WiFi → 4G 전환 시 IP 변경',
    body: '모바일 환경에서 가장 흔한 시나리오. NAT rebinding, VPN 회전, LB IP 변경도 동일.',
  },
  {
    label: 'TCP: 연결 재설정',
    body: '4-tuple 이 깨지므로 커널이 RST. 애플리케이션은 처음부터 재연결 (TCP+TLS 핸드셰이크 다시).',
  },
  {
    label: 'QUIC: Connection ID 로 식별',
    body: '서버가 발급한 64~128bit CID 가 IP 와 분리된 stable 식별자. IP 가 바뀌어도 같은 연결.',
  },
  {
    label: 'PATH_CHALLENGE 로 검증 후 마이그레이션',
    body: '새 경로에서 도착한 패킷에 대해 path validation. 검증 통과 시 무중단으로 트래픽 이동.',
  },
];

export default function NetworkSwitchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Client */}
          <ModuleBox x={20} y={70} w={90} h={48} label="Client"
            sub={step >= 1 ? (step <= 2 ? '4G IP_2' : '4G IP_2') : 'WiFi IP_1'}
            color={step >= 1 ? C.cell : C.wifi} />

          {/* Server */}
          <ModuleBox x={370} y={70} w={90} h={48} label="Server" sub="고정 endpoint" color={C.server} />

          {/* TCP 4-tuple visual (step 0) */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={110} y1={94} x2={370} y2={94} stroke={C.client} strokeWidth={1.5} />
              <DataBox x={180} y={28} w={120} h={26}
                label="(src_ip, src_port," sub="dst_ip, dst_port)" color={C.client} outlined />
              <line x1={240} y1={54} x2={240} y2={88} stroke={C.client} strokeWidth={0.6}
                strokeDasharray="2 2" />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="#9ca3af">
                TCP 연결 = 이 4-tuple 에 묶임
              </text>
            </motion.g>
          )}

          {/* Network swap (step 1) */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={140} y={20} w={80} h={26} label="WiFi IP_1" color={C.wifi} outlined />
              <DataBox x={260} y={20} w={80} h={26} label="4G IP_2" color={C.cell} outlined />
              <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
                d="M 220 33 L 260 33" stroke={C.cell} strokeWidth={1.5}
                fill="none" markerEnd="url(#arrow-cell)" />
              <defs>
                <marker id="arrow-cell" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={C.cell} />
                </marker>
              </defs>
              <line x1={110} y1={94} x2={370} y2={94} stroke="#9ca3af" strokeWidth={1}
                strokeDasharray="3 3" opacity={0.5} />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="#9ca3af">
                src_ip 변경 → 4-tuple 깨짐
              </text>
            </motion.g>
          )}

          {/* TCP failure (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={110} y1={94} x2={370} y2={94} stroke={C.fail} strokeWidth={1.5}
                strokeDasharray="4 3" />
              <motion.line x1={230} y1={80} x2={250} y2={108}
                stroke={C.fail} strokeWidth={2.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={250} y1={80} x2={230} y2={108}
                stroke={C.fail} strokeWidth={2.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <AlertBox x={180} y={140} w={120} h={36}
                label="RST → 재연결" sub="TCP+TLS 처음부터" color={C.fail} />
            </motion.g>
          )}

          {/* QUIC CID (step 3, 4) */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={110} y1={94} x2={370} y2={94} stroke={C.cid} strokeWidth={1.5} />
              <DataBox x={190} y={20} w={100} h={26}
                label="CID = 0xa3...f7" color={C.cid} outlined />
              <line x1={240} y1={46} x2={240} y2={88} stroke={C.cid} strokeWidth={0.6}
                strokeDasharray="2 2" />
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill={C.cid} fontWeight={600}>
                IP 가 아닌 CID 로 매칭
              </text>

              {step === 4 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <motion.circle cx={150} cy={94} r={4} fill={C.cid}
                    animate={{ cx: [150, 370] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
                  <text x={240} y={148} textAnchor="middle" fontSize={9} fill={C.server}>
                    PATH_CHALLENGE → PATH_RESPONSE
                  </text>
                  <text x={240} y={162} textAnchor="middle" fontSize={8.5} fill="#9ca3af">
                    검증 후 트래픽 이동, 무중단
                  </text>
                </motion.g>
              )}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

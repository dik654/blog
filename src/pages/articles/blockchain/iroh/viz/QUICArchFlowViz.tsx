import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { app: '#ef4444', ep: '#6366f1', quic: '#6b7280', magic: '#10b981', disco: '#8b5cf6', udp: '#06b6d4', relay: '#ec4899' };

const LAYERS = [
  { y: 10, label: 'Application', items: ['iroh-blobs', 'iroh-gossip'], color: C.app },
  { y: 60, label: 'Endpoint', items: ['연결 관리', 'Ed25519 TLS 1.3'], color: C.ep },
  { y: 110, label: 'QUIC (Quinn)', items: ['스트림 멀티플렉싱', '0-RTT'], color: C.quic },
  { y: 160, label: 'MagicSock', items: ['NodeMap', 'DISCO Ping/Pong'], color: C.magic },
];

const TRANSPORTS = [
  { x: 40, y: 220, label: 'UDP 직접', color: C.udp, desc: 'NAT 관통 성공' },
  { x: 200, y: 220, label: 'Relay (WS)', color: C.relay, desc: '폴백 경로' },
];

const STEPS = [
  { label: '전체 연결 아키텍처', body: 'iroh는 NodeId 기반 주소 체계로 IP 변경에 투명한 QUIC 연결을 제공합니다.' },
  { label: 'Endpoint & QUIC', body: 'Endpoint가 QUIC 세션을 관리하며, Ed25519 자체 서명 인증서로 TLS 1.3 인증합니다.' },
  { label: 'MagicSock 라우팅', body: 'QUIC에 가상 UDP 소켓을 제공하고, NodeMap으로 실제 주소를 결정합니다.' },
  { label: '듀얼 경로 전송', body: 'UDP 직접 연결과 Relay를 동시에 시도하며, 최적 경로를 자동 선택합니다.' },
];

const layerOn = (step: number, i: number) => {
  if (step === 0) return true;
  if (step === 1) return i <= 2;
  if (step === 2) return i >= 2;
  return i >= 3;
};

export default function QUICArchFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="qarr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0,5 2,0 4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>

          {/* Layer stack */}
          {LAYERS.map((l, i) => {
            const on = layerOn(step, i);
            return (
              <motion.g key={l.label} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={20} y={l.y} width={300} height={40} rx={6}
                  fill={l.color + '12'} stroke={l.color} strokeWidth={on ? 1.8 : 0.8} />
                <text x={30} y={l.y + 16} fontSize={10} fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={30} y={l.y + 30} fontSize={9} fill={l.color} opacity={0.7}>{l.items.join(' · ')}</text>
                {i < LAYERS.length - 1 && (
                  <line x1={170} y1={l.y + 40} x2={170} y2={l.y + 60}
                    stroke={l.color} strokeWidth={1} markerEnd="url(#qarr)" opacity={on ? 0.4 : 0.1} />
                )}
              </motion.g>
            );
          })}

          {/* Transport boxes */}
          {TRANSPORTS.map((t) => (
            <motion.g key={t.label} initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
              <rect x={t.x} y={t.y} width={100} height={30} rx={5}
                fill={t.color + '18'} stroke={t.color} strokeWidth={step >= 3 ? 2 : 0.8} />
              <text x={t.x + 50} y={t.y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={t.color}>{t.label}</text>
              <text x={t.x + 50} y={t.y + 24} textAnchor="middle" fontSize={9} fill={t.color} opacity={0.7}>{t.desc}</text>
            </motion.g>
          ))}

          {/* Fork arrows from MagicSock to transports */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.15 }}>
              <line x1={120} y1={200} x2={90} y2={220} stroke={C.udp} strokeWidth={1.2} markerEnd="url(#qarr)" />
              <line x1={220} y1={200} x2={250} y2={220} stroke={C.relay} strokeWidth={1.2} markerEnd="url(#qarr)" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

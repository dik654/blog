import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '5가지 Transport 옵션' },
  { label: 'TCP — 가장 기본' },
  { label: 'QUIC — 0-RTT 가능' },
  { label: 'WebSocket — 브라우저 호환' },
  { label: 'WebTransport / WebRTC — 최신' },
  { label: 'Connection Upgrade RTT 비교' },
  { label: '실무 선택 가이드' },
];

const TRANSPORTS = [
  { name: 'TCP', addr: '/ip4/.../tcp/4001', color: '#ef4444', sec: 'Noise/TLS', mux: 'Yamux' },
  { name: 'QUIC', addr: '/ip4/.../udp/4001/quic-v1', color: '#06b6d4', sec: 'TLS 1.3 내장', mux: '내장' },
  { name: 'WebSocket', addr: '/ip4/.../tcp/443/wss', color: '#10b981', sec: 'TLS', mux: 'Yamux' },
  { name: 'WebTransport', addr: '/ip4/.../udp/4001/webtransport', color: '#6366f1', sec: 'TLS 1.3', mux: '내장' },
  { name: 'WebRTC', addr: '브라우저 P2P', color: '#ec4899', sec: 'DTLS', mux: 'SCTP' },
];

const FOCUS: Record<string, { rows: { label: string; value: string }[] }> = {
  TCP: { rows: [
    { label: 'Multiaddr', value: '/ip4/1.2.3.4/tcp/4001' },
    { label: '특징', value: '가장 기본, 방화벽 친화적' },
    { label: 'Security', value: 'Noise or TLS (별도 upgrade)' },
    { label: 'Mux', value: 'Yamux or Mplex (별도 upgrade)' },
    { label: 'Latency', value: '~50-200ms (handshake 포함)' },
  ]},
  QUIC: { rows: [
    { label: 'Multiaddr', value: '/ip4/1.2.3.4/udp/4001/quic-v1' },
    { label: '기반', value: 'UDP 위 TLS 1.3 + 멀티플렉싱' },
    { label: 'Mobile', value: 'connection migration 지원' },
    { label: 'Resume', value: '0-RTT resumption 가능' },
    { label: 'Latency', value: '~0-1 RTT' },
  ]},
  WebSocket: { rows: [
    { label: 'Multiaddr', value: '/ip4/1.2.3.4/tcp/443/wss' },
    { label: '환경', value: '브라우저 호환 (HTTP upgrade)' },
    { label: 'Port', value: '443 → 방화벽 쉽게 통과' },
    { label: 'Security', value: 'TLS + WSS' },
    { label: '용처', value: '브라우저 ↔ 서버 P2P' },
  ]},
  Modern: { rows: [
    { label: 'WebTransport', value: '/ip4/.../udp/4001/webtransport · QUIC 기반' },
    { label: 'WebTransport', value: 'Uni/Bi-directional streams · 2023+ 표준' },
    { label: 'WebRTC', value: 'NAT traversal 내장 (ICE)' },
    { label: 'WebRTC', value: 'SCTP over DTLS · 복잡한 setup' },
    { label: '용처', value: '브라우저 P2P, 모바일' },
  ]},
};

export default function TransportOptionsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: all 5 */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Transport Options
              </text>
              {TRANSPORTS.map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={42 + i * 36} width={440} height={30} rx={5}
                    fill={t.color + '0a'} stroke={t.color + '50'} strokeWidth={0.7} />
                  <text x={40} y={61 + i * 36} fontSize={10} fontWeight={700} fill={t.color}>{t.name}</text>
                  <text x={130} y={61 + i * 36} fontSize={8.5} fill="var(--muted-foreground)"
                    style={{ fontFamily: 'monospace' }}>{t.addr}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Steps 1-4: focus on one */}
          {step >= 1 && step <= 4 && (() => {
            const key = step === 1 ? 'TCP' : step === 2 ? 'QUIC' : step === 3 ? 'WebSocket' : 'Modern';
            const t = step <= 3 ? TRANSPORTS[step - 1] : { name: 'WebTransport / WebRTC', color: '#6366f1' };
            const data = FOCUS[key];
            return (
              <g>
                <ModuleBox x={130} y={20} w={220} h={42} label={t.name} color={t.color} />
                {data.rows.map((r, i) => (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <rect x={30} y={80 + i * 30} width={420} height={24} rx={4}
                      fill={t.color + '0a'} stroke={t.color + '40'} strokeWidth={0.6} />
                    <text x={50} y={96 + i * 30} fontSize={9.5} fontWeight={700}
                      fill={t.color}>{r.label}</text>
                    <text x={170} y={96 + i * 30} fontSize={9}
                      fill="var(--foreground)">{r.value}</text>
                  </motion.g>
                ))}
              </g>
            );
          })()}

          {/* Step 5: RTT */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Connection Upgrade RTT
              </text>
              {[
                { name: 'TCP+Noise+Yamux', count: 3, color: '#ef4444' },
                { name: 'TCP+TLS+Yamux', count: 3, color: '#f59e0b' },
                { name: 'QUIC (1-RTT)', count: 1, color: '#06b6d4' },
                { name: 'QUIC (0-RTT)', count: 0, color: '#10b981' },
              ].map((r, i) => (
                <motion.g key={r.name} initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.15, duration: 0.5 }}
                  style={{ transformOrigin: 'left center' }}>
                  <text x={40} y={60 + i * 44} fontSize={10} fontWeight={600} fill={r.color}>{r.name}</text>
                  <rect x={40} y={66 + i * 44} width={360} height={12} rx={3}
                    fill="var(--border)" opacity={0.3} />
                  <rect x={40} y={66 + i * 44} width={r.count === 0 ? 4 : r.count * 110} height={12} rx={3}
                    fill={r.color} opacity={0.85} />
                  <text x={410} y={76 + i * 44} fontSize={10} fontWeight={700} fill={r.color}>
                    {r.count === 0 ? '0' : `${r.count}+ RTT`}
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 6: practical */}
          {step === 6 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                실무 선택
              </text>
              {[
                { case: '일반 서버', choice: 'TCP + Noise + Yamux', why: 'proven, 광범위 호환', color: '#ef4444' },
                { case: '고성능', choice: 'QUIC', why: '0-RTT, connection migration', color: '#06b6d4' },
                { case: '브라우저', choice: 'WebSocket / WebTransport', why: 'WSS or WebTransport', color: '#10b981' },
                { case: 'Mobile', choice: 'QUIC', why: '이동 시 connection 유지', color: '#6366f1' },
              ].map((c, i) => (
                <motion.g key={c.case} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={45 + i * 44} width={420} height={36} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={62 + i * 44} fontSize={10} fontWeight={700} fill={c.color}>{c.case}</text>
                  <text x={130} y={62 + i * 44} fontSize={9.5} fill="var(--foreground)">{c.choice}</text>
                  <text x={130} y={75 + i * 44} fontSize={8.5} fill="var(--muted-foreground)">{c.why}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

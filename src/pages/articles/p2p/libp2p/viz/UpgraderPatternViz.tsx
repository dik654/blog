import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Connection Stack 4계층' },
  { label: 'TCP + Noise + Yamux: 5단계 업그레이드' },
  { label: 'Raw → Secure → Muxed 변환' },
  { label: 'QUIC: Security+Mux 내장, 1단계' },
  { label: 'RTT 비용 비교' },
];

const LAYERS = [
  { y: 30, name: 'Application', sub: 'NetworkBehaviour', color: '#ef4444' },
  { y: 74, name: 'Multiplexer', sub: 'Yamux / Mplex', color: '#f59e0b' },
  { y: 118, name: 'Security', sub: 'Noise / TLS', color: '#ec4899' },
  { y: 162, name: 'Transport', sub: 'TCP / QUIC / WS', color: '#8b5cf6' },
];

const TCP_STEPS = [
  { label: '1) TCP connection', sub: 'raw bytes', color: '#8b5cf6' },
  { label: '2) ms-select /noise/0.1.0', sub: '협상', color: '#94a3b8' },
  { label: '3) Noise XX handshake', sub: 'AEAD 암호화 스트림', color: '#ec4899' },
  { label: '4) ms-select /yamux/1.0.0', sub: '협상', color: '#94a3b8' },
  { label: '5) Yamux substreams', sub: '멀티플렉싱 시작', color: '#f59e0b' },
];

export default function UpgraderPatternViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 4-layer stack */}
          {step === 0 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                libp2p Connection Stack
              </text>
              {LAYERS.map((l, i) => (
                <motion.g key={l.name} initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <ModuleBox x={100} y={l.y} w={280} h={36} label={l.name} sub={l.sub} color={l.color} />
                </motion.g>
              ))}
              <text x={240} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Upgrader 가 아래에서 위로 한 층씩 쌓음
              </text>
            </g>
          )}

          {/* Steps 1-2: TCP 5-step */}
          {(step === 1 || step === 2) && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                TCP + Noise + Yamux 업그레이드
              </text>
              {TCP_STEPS.map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={40} y={50 + i * 35} width={400} height={28} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '60'} strokeWidth={0.7} />
                  <text x={58} y={68 + i * 35} fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={230} y={68 + i * 35} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
                </motion.g>
              ))}
              {step === 2 && (
                <motion.text x={240} y={228} textAnchor="middle" fontSize={9}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  fill="#10b981">
                  결과: Raw bytes → AEAD encrypted → Multiplexed substreams
                </motion.text>
              )}
            </g>
          )}

          {/* Step 3: QUIC */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                QUIC — Security + Mux 내장
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={50} y={60} width={380} height={90} rx={10}
                  fill="#06b6d40a" stroke="#06b6d4" strokeWidth={1} />
                <text x={240} y={85} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">
                  QUIC Transport
                </text>
                <text x={240} y={110} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  TLS 1.3 핸드셰이크 + 스트림 다중화 통합
                </text>
                <text x={240} y={128} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  QUIC streams == libp2p sub-streams
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={150} y={170} width={180} height={32} rx={6}
                  fill="#10b98115" stroke="#10b981" strokeWidth={0.8} />
                <text x={240} y={190} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  1단계 완료 — upgrade 불필요
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 4: RTT comparison */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                핸드셰이크 RTT 비용
              </text>
              {[
                { name: 'TCP + Noise + Yamux', rtt: 3, color: '#ef4444' },
                { name: 'TCP + TLS + Yamux', rtt: 2.5, color: '#f59e0b' },
                { name: 'QUIC (new)', rtt: 1, color: '#10b981' },
                { name: 'QUIC (0-RTT resume)', rtt: 0, color: '#06b6d4' },
              ].map((r, i) => (
                <motion.g key={r.name} initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.15, duration: 0.5 }}
                  style={{ transformOrigin: 'left center' }}>
                  <text x={40} y={62 + i * 42} fontSize={10} fontWeight={600} fill={r.color}>{r.name}</text>
                  <rect x={40} y={68 + i * 42} width={360} height={12} rx={3}
                    fill="var(--border)" opacity={0.3} />
                  <rect x={40} y={68 + i * 42} width={r.rtt === 0 ? 4 : r.rtt * 120} height={12} rx={3}
                    fill={r.color} opacity={0.8} />
                  <text x={410} y={78 + i * 42} fontSize={10} fontWeight={700} fill={r.color}>
                    {r.rtt === 0 ? '0-RTT' : `~${r.rtt} RTT`}
                  </text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Stream Multiplexing 문제와 해결' },
  { label: 'Yamux 12-byte 헤더 구조' },
  { label: 'Frame Type & Flags' },
  { label: 'Flow Control — sliding window' },
  { label: 'mplex vs Yamux vs HTTP/2' },
  { label: 'QUIC: 멀티플렉싱이 transport 자체' },
];

const FLAGS = [
  { name: 'SYN', val: '1', desc: '새 stream 요청', color: '#10b981' },
  { name: 'ACK', val: '2', desc: '승인', color: '#6366f1' },
  { name: 'FIN', val: '4', desc: 'graceful close', color: '#f59e0b' },
  { name: 'RST', val: '8', desc: '강제 close', color: '#ef4444' },
];

const COMPARE = [
  { name: 'mplex', flow: 'No', priority: 'No', overhead: 'Low', status: 'deprecated', color: '#94a3b8' },
  { name: 'Yamux', flow: 'Yes', priority: 'No', overhead: 'Med', status: 'mainstream', color: '#10b981' },
  { name: 'HTTP/2', flow: 'Yes', priority: 'Yes', overhead: 'High', status: 'web only', color: '#6366f1' },
];

export default function MuxerCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: problem & solution */}
          {step === 0 && (
            <g>
              <text x={120} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">문제</text>
              <text x={360} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">해결</text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={20} y={40} width={200} height={170} rx={8}
                  fill="#ef44440a" stroke="#ef4444" strokeWidth={0.7} strokeDasharray="3 2" />
                <text x={120} y={70} textAnchor="middle" fontSize={9} fill="var(--foreground)">TCP 1개 = 프로토콜 1개</text>
                <text x={120} y={90} textAnchor="middle" fontSize={9} fill="var(--foreground)">N 프로토콜 → N 연결</text>
                <text x={120} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">handshake N회</text>
                <text x={120} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">소켓 자원 N배</text>
                <text x={120} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메모리 폭증</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={260} y={40} width={200} height={170} rx={8}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.7} />
                <text x={360} y={70} textAnchor="middle" fontSize={9} fill="var(--foreground)">단일 연결 위 multi stream</text>
                <text x={360} y={90} textAnchor="middle" fontSize={9} fill="var(--foreground)">stream = 독립 프로토콜</text>
                <text x={360} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">handshake 1회 공유</text>
                <text x={360} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">flow control per stream</text>
                <text x={360} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">lightweight create/close</text>
              </motion.g>
            </g>
          )}

          {/* Step 1: Yamux frame */}
          {step === 1 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Yamux Frame — 12 byte header
              </text>
              {[
                { x: 30, w: 50, label: 'Version', sub: '1 B' },
                { x: 85, w: 50, label: 'Type', sub: '1 B' },
                { x: 140, w: 80, label: 'Flags', sub: '2 B' },
                { x: 225, w: 100, label: 'StreamID', sub: '4 B' },
                { x: 330, w: 100, label: 'Length', sub: '4 B' },
              ].map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={f.x} y={70} width={f.w} height={50} rx={4}
                    fill="#6366f10a" stroke="#6366f1" strokeWidth={0.7} />
                  <text x={f.x + f.w / 2} y={92} textAnchor="middle" fontSize={9.5}
                    fontWeight={700} fill="#6366f1">{f.label}</text>
                  <text x={f.x + f.w / 2} y={108} textAnchor="middle" fontSize={8.5}
                    fill="var(--muted-foreground)">{f.sub}</text>
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <line x1={30} y1={140} x2={430} y2={140} stroke="#94a3b8" strokeWidth={0.5} />
                <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  HashiCorp 2016 — HTTP/2 inspired but simpler
                </text>
                <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  No HPACK, no priority, binary frames only
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 2: Type & Flags */}
          {step === 2 && (
            <g>
              <text x={120} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">Type</text>
              <text x={350} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">Flags</text>
              {[
                { val: '0', label: 'Data', color: '#10b981' },
                { val: '1', label: 'WindowUpdate', color: '#6366f1' },
                { val: '2', label: 'Ping', color: '#f59e0b' },
                { val: '3', label: 'GoAway', color: '#ef4444' },
              ].map((t, i) => (
                <motion.g key={t.val} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={40 + i * 42} width={200} height={32} rx={4}
                    fill={t.color + '0a'} stroke={t.color + '60'} strokeWidth={0.7} />
                  <text x={36} y={60 + i * 42} fontSize={9} fontWeight={700} fill={t.color}>{t.val}</text>
                  <text x={70} y={60 + i * 42} fontSize={10} fontWeight={600} fill={t.color}>{t.label}</text>
                </motion.g>
              ))}
              {FLAGS.map((f, i) => (
                <motion.g key={f.name} initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={250} y={40 + i * 42} width={210} height={32} rx={4}
                    fill={f.color + '0a'} stroke={f.color + '60'} strokeWidth={0.7} />
                  <text x={266} y={60 + i * 42} fontSize={9} fontWeight={700} fill={f.color}>{f.name}({f.val})</text>
                  <text x={325} y={60 + i * 42} fontSize={9} fill="var(--muted-foreground)">{f.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: flow control */}
          {step === 3 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Sliding Window Flow Control
              </text>
              <DataBox x={30} y={50} w={100} h={36} label="Sender" color="#10b981" />
              <DataBox x={350} y={50} w={100} h={36} label="Receiver" sub="window: 256 KB" color="#6366f1" outlined />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={130} y1={68} x2={350} y2={68} stroke="#10b981" strokeWidth={1.4} markerEnd="url(#mar)" />
                <text x={240} y={62} textAnchor="middle" fontSize={9} fill="#10b981">Data (윈도우 내)</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <line x1={350} y1={100} x2={130} y2={100} stroke="#6366f1" strokeWidth={1.4} markerEnd="url(#mar2)" />
                <text x={240} y={94} textAnchor="middle" fontSize={9} fill="#6366f1">WindowUpdate (윈도우 확장)</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <rect x={50} y={130} width={380} height={28} rx={5}
                  fill="#ef44440a" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={240} y={148} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#ef4444">
                  Zero window → 송신 측 backpressure (대기)
                </text>
              </motion.g>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                초기 256 KB / stream — Receiver 가 처리 속도 따라 윈도우 조정
              </text>
              <text x={240} y={203} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                과부하 받지 않으면서 throughput 최대화
              </text>
              <defs>
                <marker id="mar" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#10b981" />
                </marker>
                <marker id="mar2" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#6366f1" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: comparison */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Muxer 비교
              </text>
              <text x={75} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Muxer</text>
              <text x={170} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Flow ctl</text>
              <text x={245} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Priority</text>
              <text x={320} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Overhead</text>
              <text x={400} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Status</text>
              {COMPARE.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={62 + i * 48} width={420} height={40} rx={5}
                    fill={c.color + '08'} stroke={c.color + '40'} strokeWidth={0.7} />
                  <text x={75} y={86 + i * 48} fontSize={11} fontWeight={700} fill={c.color}>{c.name}</text>
                  <text x={170} y={86 + i * 48} fontSize={9} fill="var(--foreground)">{c.flow}</text>
                  <text x={245} y={86 + i * 48} fontSize={9} fill="var(--foreground)">{c.priority}</text>
                  <text x={320} y={86 + i * 48} fontSize={9} fill="var(--foreground)">{c.overhead}</text>
                  <text x={400} y={86 + i * 48} fontSize={9} fill="var(--foreground)">{c.status}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 5: QUIC */}
          {step === 5 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                QUIC — 멀티플렉싱이 Transport 자체
              </text>
              <ModuleBox x={130} y={50} w={220} h={50} label="QUIC Transport" sub="streams 내장" color="#06b6d4" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {[0, 1, 2, 3].map(i => (
                  <g key={i}>
                    <rect x={70 + i * 90} y={130} width={70} height={32} rx={4}
                      fill="#06b6d40a" stroke="#06b6d4" strokeWidth={0.7} />
                    <text x={105 + i * 90} y={150} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill="#06b6d4">stream {i}</text>
                  </g>
                ))}
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={9.5} fill="#10b981">
                ✓ Yamux 불필요 — libp2p-quic 단독 사용
              </text>
              <text x={240} y={213} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                connection migration 도 transport 레벨에서 지원
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

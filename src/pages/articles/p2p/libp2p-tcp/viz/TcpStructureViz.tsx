import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  ip: '#64748b',
  tcp: '#ef4444',
  noise: '#8b5cf6',
  yamux: '#10b981',
  swarm: '#f59e0b',
  quic: '#06b6d4',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Multiaddr 형식',
    body: '프로토콜 스택을 슬래시로 직렬화 — /ip4/1.2.3.4/tcp/9000/p2p/QmID',
  },
  {
    label: 'TcpConfig 핵심 필드',
    body: 'nodelay · port_reuse · backlog 세 가지 옵션이 행동을 결정한다.',
  },
  {
    label: 'Provider 추상화 — 런타임 비종속',
    body: 'GenTcpTransport<T: TcpProvider>로 Tokio · async-std · smol 어디서나 동작한다.',
  },
  {
    label: 'Pipeline — raw bytes에서 Swarm 진입까지',
    body: 'TCP → Noise → Yamux → (PeerId, StreamMuxerBox) → ConnectionPool',
  },
  {
    label: 'TCP vs QUIC 연결 시간',
    body: 'TCP는 3~4 RTT(200~400ms), QUIC는 1 RTT(50~100ms). QUIC가 3~4배 빠르다.',
  },
];

function MultiaddrView() {
  const segs = [
    { t: '/ip4', v: '1.2.3.4', c: C.ip },
    { t: '/tcp', v: '9000', c: C.tcp },
    { t: '/p2p', v: 'QmID', c: C.swarm },
  ];
  return (
    <g>
      <text x={240} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        프로토콜 스택을 직렬화
      </text>
      {segs.map((s, i) => {
        const x = 60 + i * 130;
        return (
          <motion.g key={s.t}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={50} width={110} height={48} rx={6}
              fill={s.c + '10'} stroke={s.c + '60'} strokeWidth={0.8} />
            <text x={x + 55} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.c}>
              {s.t}
            </text>
            <text x={x + 55} y={88} textAnchor="middle" fontSize={9} fill={C.text}>
              {s.v}
            </text>
            {i < segs.length - 1 && (
              <text x={x + 117} y={78} fontSize={11} fill={C.muted}>/</text>
            )}
          </motion.g>
        );
      })}
      <text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.muted}>
        DNS · WebSocket(/ws,/wss) · TLS 도 같은 방식으로 추가
      </text>
    </g>
  );
}

function TcpConfigView() {
  const fields = [
    { k: 'nodelay', v: 'bool', desc: 'TCP_NODELAY 즉시 전송', c: C.tcp },
    { k: 'port_reuse', v: 'PortUse', desc: 'New | Reuse', c: C.noise },
    { k: 'backlog', v: 'u32', desc: 'listen queue 크기', c: C.yamux },
  ];
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.text}>
        TcpConfig
      </text>
      {fields.map((f, i) => (
        <motion.g key={f.k}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={50} y={36 + i * 32} width={380} height={26} rx={5}
            fill={f.c + '08'} stroke={f.c + '40'} strokeWidth={0.6} />
          <text x={62} y={53 + i * 32} fontSize={10} fontWeight={700} fill={f.c}>
            {f.k}
          </text>
          <text x={170} y={53 + i * 32} fontSize={9} fill={C.muted}>
            {f.v}
          </text>
          <text x={250} y={53 + i * 32} fontSize={9} fill={C.text}>
            {f.desc}
          </text>
        </motion.g>
      ))}
      <text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}>
        PortUse::Reuse — listener port 재사용 (NAT hole punching)
      </text>
    </g>
  );
}

function ProviderView() {
  const providers = [
    { name: 'Tokio', sub: '가장 보편', c: C.swarm },
    { name: 'async-std', sub: '경량', c: C.noise },
    { name: 'smol', sub: '최소형', c: C.yamux },
  ];
  return (
    <g>
      <ModuleBox x={180} y={20} w={120} h={42}
        label="GenTcpTransport<T>" sub="T: TcpProvider" color={C.tcp} />
      {providers.map((p, i) => (
        <motion.g key={p.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}>
          <line x1={240} y1={62} x2={90 + i * 150} y2={108}
            stroke={p.c} strokeWidth={0.6} opacity={0.5} />
        </motion.g>
      ))}
      {providers.map((p, i) => (
        <motion.g key={p.name + '-box'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}>
          <DataBox x={45 + i * 150} y={108} w={90} h={34}
            label={p.name} sub={p.sub} color={p.c} outlined />
        </motion.g>
      ))}
      <text x={240} y={166} textAnchor="middle" fontSize={8} fill={C.muted}>
        Provider 트레이트로 런타임 추상화 — 코드 변경 없이 교체
      </text>
    </g>
  );
}

function PipelineView() {
  const layers = [
    { l: 'raw TCP stream', sub: 'OS socket', c: C.ip },
    { l: 'Noise XX', sub: 'cipher keys', c: C.noise },
    { l: 'Yamux', sub: 'substreams', c: C.yamux },
    { l: '(PeerId, StreamMuxerBox)', sub: 'Output', c: C.swarm },
    { l: 'ConnectionPool', sub: 'Swarm', c: C.tcp },
  ];
  return (
    <g>
      {layers.map((L, i) => (
        <motion.g key={L.l}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <ActionBox x={130} y={10 + i * 34} w={220} h={28}
            label={L.l} sub={L.sub} color={L.c} />
          {i < layers.length - 1 && (
            <text x={240} y={44 + i * 34} textAnchor="middle" fontSize={10} fill={C.muted}>
              ↓
            </text>
          )}
        </motion.g>
      ))}
    </g>
  );
}

function CompareTimeView() {
  const rows = [
    { label: 'TCP 3-way', rtt: 1, t: '~50-100ms', c: C.ip },
    { label: '+ Noise XX', rtt: 2, t: '~100-200ms', c: C.noise },
    { label: '+ Yamux', rtt: 1, t: '~50-100ms', c: C.yamux },
    { label: 'TCP total', rtt: 4, t: '~200-400ms', c: C.tcp, total: true },
    { label: 'QUIC total', rtt: 1, t: '~50-100ms', c: C.quic, total: true },
  ];
  const maxRtt = 4;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        연결 비용 (RTT)
      </text>
      {rows.map((r, i) => {
        const w = 200 * (r.rtt / maxRtt);
        return (
          <motion.g key={r.label + i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <text x={120} y={36 + i * 26} textAnchor="end" fontSize={9}
              fontWeight={r.total ? 700 : 500}
              fill={r.total ? r.c : C.text}>
              {r.label}
            </text>
            <rect x={130} y={28 + i * 26} width={w} height={14} rx={3}
              fill={r.c + '60'} />
            <text x={130 + w + 8} y={38 + i * 26} fontSize={8} fill={C.muted}>
              {r.rtt} RTT · {r.t}
            </text>
          </motion.g>
        );
      })}
      <text x={240} y={172} textAnchor="middle" fontSize={8} fill={C.muted}>
        QUIC가 3~4배 빠르지만 TCP는 방화벽 친화
      </text>
    </g>
  );
}

const VIEWS = [MultiaddrView, TcpConfigView, ProviderView, PipelineView, CompareTimeView];

export default function TcpStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const View = VIEWS[step];
        return (
          <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <View />
          </svg>
        );
      }}
    </StepViz>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  a: '#06b6d4',
  b: '#8b5cf6',
  ok: '#10b981',
  err: '#ef4444',
  warn: '#f59e0b',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'multistream-select 합의 — 한쪽 거절 시 폴백',
    body: 'A가 /noise 제안 → B가 거절 → A가 /tls로 폴백 → 양측 동의.',
  },
  {
    label: 'Length-prefixed 메시지 형식',
    body: '[varint length][protocol string][\\n] — 예: "\\x07/noise\\n" = 8바이트.',
  },
  {
    label: 'Upgrade 종류 — Security · Mux · Custom',
    body: 'Security: Noise/TLS · Mux: Yamux/Mplex · Custom: Kad·GossipSub·Identify·Ping.',
  },
  {
    label: 'SwarmBuilder 타입 상태 패턴',
    body: '단계마다 타입이 추가 — 잘못된 순서는 컴파일 에러.',
  },
  {
    label: 'Security 먼저 vs Mux 먼저 — 노출 차이',
    body: 'Mux 먼저면 스트림 헤더 평문 노출. Security 먼저면 protocol ID까지 암호화.',
  },
];

function NegotiateView() {
  return (
    <g>
      <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.a}>A</text>
      <text x={360} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.b}>B</text>
      <line x1={120} y1={20} x2={120} y2={170} stroke={C.a} strokeWidth={0.6} opacity={0.4} />
      <line x1={360} y1={20} x2={360} y2={170} stroke={C.b} strokeWidth={0.6} opacity={0.4} />

      {[
        { y: 36, text: '/multistream/1.0.0', dir: 1, c: C.a },
        { y: 56, text: '/multistream/1.0.0', dir: -1, c: C.b },
        { y: 76, text: '/noise (try)', dir: 1, c: C.a },
        { y: 96, text: 'na (not available)', dir: -1, c: C.err },
        { y: 116, text: '/tls (fallback)', dir: 1, c: C.warn },
        { y: 136, text: '/tls (accept)', dir: -1, c: C.ok },
      ].map((m, i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
          <line x1={m.dir > 0 ? 130 : 350} y1={m.y} x2={m.dir > 0 ? 350 : 130} y2={m.y}
            stroke={m.c} strokeWidth={0.8}
            markerEnd={m.dir > 0 ? 'url(#arrR)' : 'url(#arrL)'} />
          <text x={240} y={m.y - 3} textAnchor="middle" fontSize={8} fill={m.c} fontWeight={600}>
            {m.text}
          </text>
        </motion.g>
      ))}
      <defs>
        <marker id="arrR" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.text} />
        </marker>
        <marker id="arrL" viewBox="0 0 6 6" refX={1} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M6,0 L0,3 L6,6 z" fill={C.text} />
        </marker>
      </defs>
      <text x={240} y={166} textAnchor="middle" fontSize={8} fill={C.ok}>
        → use TLS
      </text>
    </g>
  );
}

function FrameView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Length-prefixed message
      </text>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
        <rect x={60} y={40} width={60} height={36} rx={4}
          fill={C.warn + '20'} stroke={C.warn} strokeWidth={0.7} />
        <text x={90} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.warn}>varint</text>
        <text x={90} y={70} textAnchor="middle" fontSize={8} fill={C.text}>length</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={130} y={40} width={210} height={36} rx={4}
          fill={C.a + '20'} stroke={C.a} strokeWidth={0.7} />
        <text x={235} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.a}>
          protocol string
        </text>
        <text x={235} y={70} textAnchor="middle" fontSize={8} fill={C.text}>"/noise"</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <rect x={350} y={40} width={50} height={36} rx={4}
          fill={C.ok + '20'} stroke={C.ok} strokeWidth={0.7} />
        <text x={375} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>{'\\n'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={240} y={106} textAnchor="middle" fontSize={9} fill={C.text}>
          예: "\x07/noise\n" = 8 bytes
        </text>
        <text x={240} y={130} textAnchor="middle" fontSize={9} fill={C.muted}>
          ls 명령으로 상대 protocol 목록 조회 가능
        </text>
      </motion.g>
    </g>
  );
}

function UpgradeTypesView() {
  const cats = [
    { name: 'Security', items: 'Noise XX · TLS 1.3', from: 'raw TCP', to: 'encrypted', c: C.b },
    { name: 'Mux', items: 'Yamux · Mplex', from: 'encrypted', to: 'substreams', c: C.ok },
    { name: 'Custom', items: 'Kad · GossipSub · Identify · Ping', from: 'each substream', to: 'protocol', c: C.warn },
  ];
  return (
    <g>
      {cats.map((c, i) => (
        <motion.g key={c.name}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20} y={20 + i * 50} width={440} height={42} rx={5}
            fill={c.c + '08'} stroke={c.c + '50'} strokeWidth={0.7} />
          <text x={36} y={40 + i * 50} fontSize={10} fontWeight={700} fill={c.c}>
            {c.name}
          </text>
          <text x={36} y={54 + i * 50} fontSize={8} fill={C.text}>
            {c.items}
          </text>
          <text x={448} y={40 + i * 50} textAnchor="end" fontSize={8} fill={C.muted}>
            {c.from}
          </text>
          <text x={448} y={52 + i * 50} textAnchor="end" fontSize={8} fontWeight={700} fill={c.c}>
            → {c.to}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function TypeStateView() {
  const states = [
    { call: 'SwarmBuilder::new(keypair)', state: 'WithIdentity', c: C.a },
    { call: '.with_tcp()', state: 'WithIdentity, WithTcp', c: C.warn },
    { call: '.with_noise()', state: '+ WithSecurity', c: C.b },
    { call: '.with_yamux()', state: '+ WithMuxer', c: C.ok },
    { call: '.with_behaviour()', state: '+ WithBehaviour', c: C.warn },
    { call: '.build()', state: 'Swarm 인스턴스', c: C.ok },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        타입 상태로 순서 강제 — 잘못된 호출은 컴파일 에러
      </text>
      {states.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={24 + i * 24} width={210} height={20} rx={3}
            fill={s.c + '10'} stroke={s.c + '50'} strokeWidth={0.5} />
          <text x={32} y={38 + i * 24} fontSize={9} fontWeight={700} fill={s.c}>
            {s.call}
          </text>
          <text x={250} y={38 + i * 24} fontSize={8} fill={C.text}>
            → {s.state}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function OrderView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Mux 먼저 vs Security 먼저
      </text>
      <text x={120} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.err}>
        Mux 먼저
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AlertBox x={20} y={48} w={200} h={36}
          label="stream headers" sub="평문 노출" color={C.err} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <AlertBox x={20} y={92} w={200} h={36}
          label="protocol negotiation" sub="공격자 관찰 가능" color={C.err} />
      </motion.g>

      <text x={360} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>
        Security 먼저
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <ActionBox x={260} y={48} w={200} h={36}
          label="Mux frames" sub="암호화" color={C.ok} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <ActionBox x={260} y={92} w={200} h={36}
          label="protocol IDs" sub="hidden" color={C.ok} />
      </motion.g>

      <text x={240} y={154} textAnchor="middle" fontSize={8} fill={C.muted}>
        Security 먼저면 IP · port · 패킷 크기만 노출
      </text>
    </g>
  );
}

const VIEWS = [NegotiateView, FrameView, UpgradeTypesView, TypeStateView, OrderView];

export default function MultistreamSelectViz() {
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

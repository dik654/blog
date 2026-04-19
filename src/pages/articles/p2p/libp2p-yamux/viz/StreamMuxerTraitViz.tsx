import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  sub: '#06b6d4',
  in: '#10b981',
  out: '#8b5cf6',
  ev: '#f59e0b',
  cl: '#ef4444',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'StreamMuxer Trait — 4개 poll 메서드',
    body: 'poll_inbound · poll_outbound · poll · poll_close.',
  },
  {
    label: 'Substream associated type — AsyncRead + AsyncWrite',
    body: '각 substream은 독립적인 read/write 인터페이스를 노출.',
  },
  {
    label: 'Stream Lifecycle — Create → Use → Close',
    body: 'outbound는 poll_outbound로, inbound는 peer 요청을 poll_inbound로 받음. drop이나 명시적 close.',
  },
  {
    label: 'Async Design — Pin · Context · Waker',
    body: 'Self-referential 안정화를 위한 Pin · Context는 Waker를 전달 · Backpressure 자연 전파.',
  },
  {
    label: 'StreamMuxerEvent — Address change · Max streams · Errors',
    body: 'poll() 결과로 session-level 이벤트 보고.',
  },
];

function TraitView() {
  const methods = [
    { name: 'poll_inbound', desc: 'inbound substream', c: C.in },
    { name: 'poll_outbound', desc: 'outbound substream', c: C.out },
    { name: 'poll', desc: 'session-level event', c: C.ev },
    { name: 'poll_close', desc: 'graceful close', c: C.cl },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        trait StreamMuxer
      </text>
      <ModuleBox x={170} y={22} w={140} h={32}
        label="StreamMuxer" sub="Pin<&mut Self>" color="#06b6d4" />
      {methods.map((m, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <motion.g key={m.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}>
            <ActionBox x={30 + col * 230} y={70 + row * 44} w={210} h={36}
              label={m.name} sub={m.desc} color={m.c} />
          </motion.g>
        );
      })}
      <text x={240} y={170} textAnchor="middle" fontSize={8} fill={C.muted}>
        모두 Poll&lt;Result&lt;_, Self::Error&gt;&gt; 반환
      </text>
    </g>
  );
}

function SubstreamView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        type Substream: AsyncRead + AsyncWrite
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ModuleBox x={170} y={28} w={140} h={36}
          label="Substream" sub="associated type" color={C.sub} />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <DataBox x={50} y={86} w={150} h={36}
          label="AsyncRead" sub="poll_read" color={C.in} outlined />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <DataBox x={290} y={86} w={150} h={36}
          label="AsyncWrite" sub="poll_write · poll_flush" color={C.out} outlined />
      </motion.g>
      <line x1={240} y1={64} x2={125} y2={86} stroke={C.muted} strokeWidth={0.5} opacity={0.5} />
      <line x1={240} y1={64} x2={365} y2={86} stroke={C.muted} strokeWidth={0.5} opacity={0.5} />
      <text x={240} y={156} textAnchor="middle" fontSize={8} fill={C.muted}>
        프로토콜 코드는 Substream 위에서 동작
      </text>
    </g>
  );
}

function LifecycleView() {
  const phases = [
    { p: 'Create', actions: 'poll_outbound (out) · poll_inbound (in)', c: C.in },
    { p: 'Use', actions: 'AsyncRead / AsyncWrite', c: C.out },
    { p: 'Close', actions: 'drop · close · half-close (FIN)', c: C.cl },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Stream 일생 — 3단계
      </text>
      {phases.map((p, i) => (
        <motion.g key={p.p}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={30} y={32 + i * 42} width={420} height={36} rx={5}
            fill={p.c + '08'} stroke={p.c + '50'} strokeWidth={0.6} />
          <rect x={30} y={32 + i * 42} width={4} height={36}
            fill={p.c} />
          <text x={50} y={52 + i * 42} fontSize={11} fontWeight={700} fill={p.c}>
            {p.p}
          </text>
          <text x={50} y={64 + i * 42} fontSize={8} fill={C.text}>
            {p.actions}
          </text>
          {i < phases.length - 1 && (
            <text x={240} y={78 + i * 42} textAnchor="middle" fontSize={10} fill={C.muted}>
              ↓
            </text>
          )}
        </motion.g>
      ))}
    </g>
  );
}

function AsyncDesignView() {
  const items = [
    { name: 'Pin<&mut Self>', desc: 'self-referential 안정화', c: C.sub },
    { name: 'Context<\'_>', desc: 'Waker 전달', c: C.in },
    { name: 'Poll::Pending', desc: '아직 준비 안됨', c: C.ev },
    { name: 'Poll::Ready(Ok)', desc: '값 준비 완료', c: C.out },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Rust async 핵심 — Pin · Context · Poll
      </text>
      {items.map((it, i) => (
        <motion.g key={it.name}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={30} y={28 + i * 28} width={420} height={22} rx={4}
            fill={it.c + '08'} stroke={it.c + '50'} strokeWidth={0.5} />
          <text x={42} y={43 + i * 28} fontSize={9} fontWeight={700} fill={it.c}>
            {it.name}
          </text>
          <text x={200} y={43 + i * 28} fontSize={9} fill={C.text}>
            {it.desc}
          </text>
        </motion.g>
      ))}
      <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.text}>
        Backpressure는 Pending 반환으로 자연 전파
      </text>
    </g>
  );
}

function EventsView() {
  const events = [
    { e: 'AddressChange', d: 'NAT 매핑 변경 감지', c: C.ev },
    { e: 'MaxStreams', d: '8192 도달', c: C.cl },
    { e: 'ProtocolError', d: 'spec 위반 frame', c: C.cl },
    { e: 'Closed', d: 'GoAway · 연결 종료', c: C.muted },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        StreamMuxerEvent — poll() 결과
      </text>
      {events.map((ev, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <motion.g key={ev.e}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <AlertBox x={30 + col * 220} y={36 + row * 56} w={210} h={48}
              label={ev.e} sub={ev.d} color={ev.c === C.muted ? '#64748b' : ev.c} />
          </motion.g>
        );
      })}
    </g>
  );
}

const VIEWS = [TraitView, SubstreamView, LifecycleView, AsyncDesignView, EventsView];

export default function StreamMuxerTraitViz() {
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

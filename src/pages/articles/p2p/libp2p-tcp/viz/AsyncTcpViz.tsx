import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  syn: '#06b6d4',
  ok: '#10b981',
  err: '#ef4444',
  warn: '#f59e0b',
  ifw: '#8b5cf6',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Non-blocking connect — 3분기',
    body: 'result==0 즉시성공 / EINPROGRESS 폴 등록 / 그 외 진짜 에러.',
  },
  {
    label: 'Tokio TcpSocket::connect 내부',
    body: 'socket2로 connect 시작 → poll 등록 → writable 대기 → SO_ERROR로 결과 확인.',
  },
  {
    label: 'Listen 흐름 — 5단계',
    body: 'socket → setsockopt → bind → listen → accept loop (non-blocking).',
  },
  {
    label: 'IfWatcher — OS별 인터페이스 감시',
    body: 'Linux netlink · macOS kqueue · Windows WNet — IP 변동을 Swarm에 즉시 통보.',
  },
  {
    label: 'Connection lifecycle — 8단계',
    body: 'dial → security → muxer → pool 등록 → behaviour 알림 → stream 사용 → close → pool 제거.',
  },
];

function NonBlockConnectView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        connect() 결과 분기
      </text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <ModuleBox x={180} y={26} w={120} h={40}
          label="connect()" sub="non-blocking" color={C.syn} />
      </motion.g>
      <motion.line x1={240} y1={66} x2={80} y2={104}
        stroke={C.ok} strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <motion.line x1={240} y1={66} x2={240} y2={104}
        stroke={C.warn} strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <motion.line x1={240} y1={66} x2={400} y2={104}
        stroke={C.err} strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <ActionBox x={20} y={104} w={120} h={36}
          label="result == 0" sub="즉시 성공" color={C.ok} />
        <ActionBox x={180} y={104} w={120} h={36}
          label="EINPROGRESS" sub="poll 등록 (정상)" color={C.warn} />
        <AlertBox x={340} y={104} w={120} h={36}
          label="errno != EINPROGRESS" sub="진짜 에러" color={C.err} />
      </motion.g>
      <text x={240} y={166} textAnchor="middle" fontSize={8} fill={C.muted}>
        EINPROGRESS는 SYN을 보내고 응답 대기 중이라는 뜻
      </text>
    </g>
  );
}

function TokioConnectView() {
  const steps = [
    { l: 'socket2 connect 시작', c: C.syn },
    { l: 'EINPROGRESS → poll 등록', c: C.warn },
    { l: 'writable 이벤트 대기', c: C.ifw },
    { l: 'getsockopt(SO_ERROR) 확인', c: C.ok },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Tokio 내부 동작
      </text>
      {steps.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={50} y={28 + i * 30} width={26} height={26} rx={13}
            fill={s.c + '20'} stroke={s.c} strokeWidth={0.7} />
          <text x={63} y={45 + i * 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.c}>
            {i + 1}
          </text>
          <rect x={86} y={28 + i * 30} width={344} height={26} rx={4}
            fill={s.c + '08'} stroke={s.c + '40'} strokeWidth={0.5} />
          <text x={102} y={45 + i * 30} fontSize={9} fill={C.text}>
            {s.l}
          </text>
        </motion.g>
      ))}
      <text x={240} y={172} textAnchor="middle" fontSize={8} fill={C.muted}>
        TcpStream::from_std(socket) 으로 마무리
      </text>
    </g>
  );
}

function ListenFlowView() {
  const steps = [
    { l: 'socket()', c: C.syn },
    { l: 'setsockopt(REUSEADDR, REUSEPORT)', c: C.warn },
    { l: 'bind(addr)', c: C.ifw },
    { l: 'listen(backlog)', c: C.ok },
    { l: 'accept() loop (non-blocking)', c: C.err },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        리스너 셋업 → accept 루프
      </text>
      {steps.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <ActionBox x={70} y={28 + i * 28} w={340} h={22}
            label={s.l} color={s.c} />
        </motion.g>
      ))}
    </g>
  );
}

function IfWatcherView() {
  const oses = [
    { os: 'Linux', api: 'netlink (NETLINK_ROUTE)', c: C.warn },
    { os: 'macOS', api: 'kqueue (PF_ROUTE)', c: C.ok },
    { os: 'Windows', api: 'WNetGetConnection', c: C.syn },
  ];
  const events = ['Interface up/down', 'IP change', 'Default gw change'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        OS별 인터페이스 감시 API
      </text>
      {oses.map((o, i) => (
        <motion.g key={o.os}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={28 + i * 28} width={220} height={22} rx={4}
            fill={o.c + '10'} stroke={o.c + '50'} strokeWidth={0.6} />
          <text x={32} y={43 + i * 28} fontSize={9} fontWeight={700} fill={o.c}>
            {o.os}
          </text>
          <text x={88} y={43 + i * 28} fontSize={8} fill={C.text}>
            {o.api}
          </text>
        </motion.g>
      ))}
      {events.map((e, i) => (
        <motion.g key={e}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.08 }}>
          <DataBox x={260} y={28 + i * 28} w={210} h={22}
            label={e} color={C.ifw} outlined />
        </motion.g>
      ))}
      <text x={240} y={130} textAnchor="middle" fontSize={9} fill={C.text} fontWeight={700}>
        WiFi ↔ Mobile 전환 · VPN · Dual-stack
      </text>
      <text x={240} y={154} textAnchor="middle" fontSize={8} fill={C.muted}>
        Swarm이 AutoNAT · Identify에 즉시 전파
      </text>
    </g>
  );
}

function LifecycleView() {
  const steps = [
    'dial_socket → TcpStream',
    'security upgrade → NoiseStream',
    'muxer upgrade → YamuxMuxer',
    'ConnectionPool 등록',
    'Behaviours 알림',
    'Streams 생성 / 사용',
    'Close (FIN or RST)',
    'Pool에서 제거',
  ];
  const colors = [C.syn, C.ifw, C.ok, C.warn, C.syn, C.ok, C.err, C.muted];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Connection lifecycle 8단계
      </text>
      {steps.map((s, i) => {
        const col = i < 4 ? 0 : 1;
        const row = i % 4;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <rect x={20 + col * 230} y={28 + row * 32} width={220} height={26} rx={4}
              fill={colors[i] + '10'} stroke={colors[i] + '50'} strokeWidth={0.6} />
            <text x={36 + col * 230} y={45 + row * 32} fontSize={9} fontWeight={700}
              fill={colors[i] === C.muted ? C.text : colors[i]}>
              {i + 1}.
            </text>
            <text x={56 + col * 230} y={45 + row * 32} fontSize={8.5} fill={C.text}>
              {s}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

const VIEWS = [NonBlockConnectView, TokioConnectView, ListenFlowView, IfWatcherView, LifecycleView];

export default function AsyncTcpViz() {
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

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  nodelay: '#10b981',
  reuseaddr: '#f59e0b',
  reuseport: '#8b5cf6',
  fastopen: '#06b6d4',
  err: '#ef4444',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'TCP_NODELAY — Nagle 끄기',
    body: '기본 Nagle은 작은 패킷을 200ms 버퍼링한다. P2P gossip은 작고 빈번해 누적 지연이 치명적.',
  },
  {
    label: 'SO_REUSEADDR — TIME_WAIT 무시',
    body: '재시작 시 이전 소켓의 2MSL(~2분) 대기를 건너뛰고 같은 포트에 즉시 bind한다.',
  },
  {
    label: 'SO_REUSEPORT — NAT 매핑 공유',
    body: 'Listen 포트와 같은 포트로 dial해 NAT 매핑을 재사용. Unix 전용 · Linux 3.9+ 옵트인.',
  },
  {
    label: 'set_nonblocking — async runtime 호환',
    body: 'epoll/kqueue 기반 polling — 블로킹 시 스레드 점유.',
  },
  {
    label: '미지원/미사용 옵션',
    body: 'TCP_FASTOPEN(0-RTT)은 미지원. SO_KEEPALIVE는 dead 감지에 한정.',
  },
];

function NodelayView() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Nagle 알고리즘 비교
      </text>
      {/* default */}
      <text x={20} y={42} fontSize={9} fontWeight={700} fill={C.err}>default (on)</text>
      {[0, 1, 2, 3].map((i) => (
        <motion.rect key={'d' + i}
          x={120 + i * 50} y={32} width={40} height={18} rx={3}
          fill={C.err + '30'} stroke={C.err} strokeWidth={0.6}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.08 }} />
      ))}
      <motion.text x={335} y={66} fontSize={8} fill={C.err}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        ⏱ 200ms 버퍼링 → 누적 지연
      </motion.text>

      {/* nodelay on */}
      <text x={20} y={108} fontSize={9} fontWeight={700} fill={C.nodelay}>NODELAY=true</text>
      {[0, 1, 2, 3].map((i) => (
        <motion.rect key={'n' + i}
          x={120 + i * 50} y={98} width={40} height={18} rx={3}
          fill={C.nodelay + '30'} stroke={C.nodelay} strokeWidth={0.6}
          initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.05 }} />
      ))}
      <motion.text x={335} y={132} fontSize={8} fill={C.nodelay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        ⚡ 즉시 전송 — gossip 친화
      </motion.text>

      <text x={240} y={168} textAnchor="middle" fontSize={8} fill={C.muted}>
        latency &gt; throughput
      </text>
    </g>
  );
}

function ReuseAddrView() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        TIME_WAIT 회피
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <AlertBox x={50} y={36} w={170} h={40}
          label="default" sub="TIME_WAIT ~2분 대기" color={C.err} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <ActionBox x={260} y={36} w={170} h={40}
          label="SO_REUSEADDR" sub="즉시 bind 가능" color={C.reuseaddr} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <StatusBox x={120} y={100} w={240} h={50}
          label="노드 재시작 시간" sub="2분 → 즉시"
          color={C.reuseaddr} progress={1} />
      </motion.g>
    </g>
  );
}

function ReusePortView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        NAT 홀펀칭 — 같은 포트 공유
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <ActionBox x={20} y={32} w={130} h={36}
          label="Listen" sub="0.0.0.0:30303" color={C.reuseport} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <ActionBox x={170} y={32} w={140} h={36}
          label="Dial outbound" sub="0.0.0.0:30303" color={C.reuseport} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <ActionBox x={330} y={32} w={130} h={36}
          label="NAT 매핑 재사용" sub="external port 노출" color={C.nodelay} />
      </motion.g>
      <motion.text x={240} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.text}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        SO_REUSEPORT
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={108} width={170} height={26} rx={4}
          fill={C.nodelay + '10'} stroke={C.nodelay + '50'} strokeWidth={0.6} />
        <text x={145} y={125} textAnchor="middle" fontSize={9} fill={C.nodelay}>
          Linux · macOS · BSD
        </text>
        <rect x={250} y={108} width={170} height={26} rx={4}
          fill={C.err + '10'} stroke={C.err + '50'} strokeWidth={0.6} strokeDasharray="3 3" />
        <text x={335} y={125} textAnchor="middle" fontSize={9} fill={C.err}>
          Windows 미지원
        </text>
      </motion.g>
      <text x={240} y={158} textAnchor="middle" fontSize={8} fill={C.muted}>
        opt-in (PortUse::Reuse) — 보안상 기본 OFF
      </text>
    </g>
  );
}

function NonBlockingView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        async runtime이 polling으로 구동
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <AlertBox x={20} y={36} w={180} h={48}
          label="blocking" sub="thread 한 개 점유" color={C.err} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <ActionBox x={280} y={36} w={180} h={48}
          label="set_nonblocking(true)" sub="poll/epoll/kqueue" color={C.nodelay} />
      </motion.g>
      <motion.text x={240} y={64} textAnchor="middle" fontSize={11} fill={C.text}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        →
      </motion.text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <ActionBox x={50} y={108} w={120} h={32} label="tokio" color={C.fastopen} />
        <ActionBox x={180} y={108} w={120} h={32} label="async-std" color={C.reuseport} />
        <ActionBox x={310} y={108} w={120} h={32} label="smol" color={C.nodelay} />
      </motion.g>
      <text x={240} y={158} textAnchor="middle" fontSize={8} fill={C.muted}>
        세 런타임 모두 호환
      </text>
    </g>
  );
}

function MissingView() {
  const rows = [
    { k: 'TCP_FASTOPEN', d: '0-RTT cookie 핸드셰이크', s: '미지원 (향후 고려)', c: C.err, dashed: true },
    { k: 'IP_BIND_ADDRESS_NO_PORT', d: 'Linux bind+connect 최적화', s: '미사용', c: C.muted, dashed: true },
    { k: 'SO_KEEPALIVE', d: 'dead connection 감지', s: '활용', c: C.nodelay, dashed: false },
    { k: 'connect_timeout', d: '기본 60초', s: '활용', c: C.nodelay, dashed: false },
  ];
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        그 외 옵션 — 활용 vs 미지원
      </text>
      {rows.map((r, i) => (
        <motion.g key={r.k}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={32 + i * 32} width={440} height={26} rx={4}
            fill={r.c + '08'} stroke={r.c + '50'} strokeWidth={0.6}
            strokeDasharray={r.dashed ? '4 3' : undefined} />
          <text x={32} y={49 + i * 32} fontSize={9} fontWeight={700} fill={r.c}>
            {r.k}
          </text>
          <text x={210} y={49 + i * 32} fontSize={8} fill={C.text}>
            {r.d}
          </text>
          <text x={448} y={49 + i * 32} textAnchor="end" fontSize={8} fontWeight={700} fill={r.c}>
            {r.s}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

const VIEWS = [NodelayView, ReuseAddrView, ReusePortView, NonBlockingView, MissingView];

export default function SocketOptionsViz() {
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

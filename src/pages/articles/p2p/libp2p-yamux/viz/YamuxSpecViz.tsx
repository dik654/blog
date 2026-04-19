import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  ver: '#64748b',
  type: '#06b6d4',
  flag: '#8b5cf6',
  sid: '#10b981',
  len: '#f59e0b',
  err: '#ef4444',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: '12-byte 프레임 헤더 — 5필드',
    body: 'Version(1) · Type(1) · Flags(2) · StreamID(4) · Length(4)',
  },
  {
    label: '4가지 Type — Data · WindowUpdate · Ping · GoAway',
    body: '0=Data · 1=WindowUpdate · 2=Ping · 3=GoAway',
  },
  {
    label: '4가지 Flag — SYN · ACK · FIN · RST',
    body: '0x01 SYN · 0x02 ACK · 0x04 FIN · 0x08 RST',
  },
  {
    label: 'Stream ID 규칙 — 홀짝으로 충돌 회피',
    body: '홀수=client, 짝수=server, 0=session-level. 양측이 동시에 ID 할당해도 충돌 없음.',
  },
  {
    label: 'Flow Control — 256KB 초기 윈도우',
    body: 'Sender가 보내면 window 감소, Receiver가 WindowUpdate 발행. Zero window면 sender 대기.',
  },
];

function HeaderView() {
  const fields = [
    { name: 'Version', size: 1, c: C.ver, val: '0' },
    { name: 'Type', size: 1, c: C.type, val: '0-3' },
    { name: 'Flags', size: 2, c: C.flag, val: 'bitmap' },
    { name: 'StreamID', size: 4, c: C.sid, val: 'u32' },
    { name: 'Length', size: 4, c: C.len, val: 'body bytes' },
  ];
  let x = 30;
  const total = 12;
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Yamux Frame Header — 12 bytes
      </text>
      {fields.map((f, i) => {
        const w = (420 / total) * f.size;
        const cx = x + w / 2;
        const localX = x;
        x += w;
        return (
          <motion.g key={f.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={localX} y={36} width={w - 2} height={50} rx={4}
              fill={f.c + '20'} stroke={f.c} strokeWidth={0.7} />
            <text x={cx} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={f.c}>
              {f.name}
            </text>
            <text x={cx} y={70} textAnchor="middle" fontSize={8} fill={C.text}>
              {f.size}B
            </text>
            <text x={cx} y={82} textAnchor="middle" fontSize={7} fill={C.muted}>
              {f.val}
            </text>
          </motion.g>
        );
      })}
      <text x={240} y={120} textAnchor="middle" fontSize={9} fill={C.text} fontWeight={700}>
        고정 12바이트 — body는 Length만큼 따라옴
      </text>
      <text x={240} y={144} textAnchor="middle" fontSize={8} fill={C.muted}>
        Frame max size: 16MB
      </text>
    </g>
  );
}

function TypeView() {
  const types = [
    { id: 0, name: 'Data', desc: '스트림 데이터 전송', c: C.type },
    { id: 1, name: 'Window Update', desc: 'flow control', c: C.sid },
    { id: 2, name: 'Ping', desc: 'keep-alive', c: C.flag },
    { id: 3, name: 'Go Away', desc: '세션 종료', c: C.err },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Frame Type — 4종
      </text>
      {types.map((t, i) => (
        <motion.g key={t.id}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20} y={28 + i * 32} width={36} height={28} rx={4}
            fill={t.c + '20'} stroke={t.c} strokeWidth={0.7} />
          <text x={38} y={47 + i * 32} textAnchor="middle" fontSize={11} fontWeight={700} fill={t.c}>
            {t.id}
          </text>
          <rect x={64} y={28 + i * 32} width={396} height={28} rx={4}
            fill={t.c + '08'} stroke={t.c + '40'} strokeWidth={0.5} />
          <text x={80} y={45 + i * 32} fontSize={10} fontWeight={700} fill={t.c}>
            {t.name}
          </text>
          <text x={220} y={45 + i * 32} fontSize={9} fill={C.text}>
            {t.desc}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function FlagsView() {
  const flags = [
    { hex: '0x01', name: 'SYN', desc: 'new stream 시작', c: C.type },
    { hex: '0x02', name: 'ACK', desc: 'stream 수락', c: C.sid },
    { hex: '0x04', name: 'FIN', desc: 'half-close', c: C.flag },
    { hex: '0x08', name: 'RST', desc: '강제 종료', c: C.err },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Flags — bitmap 조합 가능
      </text>
      {flags.map((f, i) => (
        <motion.g key={f.name}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20 + i * 115} y={36} width={105} height={86} rx={6}
            fill={f.c + '10'} stroke={f.c + '60'} strokeWidth={0.8} />
          <text x={72 + i * 115} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={f.c}>
            {f.name}
          </text>
          <text x={72 + i * 115} y={76} textAnchor="middle" fontSize={9} fill={C.text}>
            {f.hex}
          </text>
          <text x={72 + i * 115} y={104} textAnchor="middle" fontSize={8} fill={C.muted}>
            {f.desc}
          </text>
        </motion.g>
      ))}
      <text x={240} y={150} textAnchor="middle" fontSize={8} fill={C.muted}>
        SYN+ACK 등 동시 사용 가능 (TCP와 유사)
      </text>
    </g>
  );
}

function StreamIdView() {
  const rules = [
    { who: 'Client', ids: '1, 3, 5, 7, ...', kind: '홀수', c: C.type },
    { who: 'Server', ids: '2, 4, 6, 8, ...', kind: '짝수', c: C.flag },
    { who: 'Session', ids: '0', kind: '예약', c: C.muted },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        ID 충돌 회피 — 양측 동시 할당 OK
      </text>
      {rules.map((r, i) => (
        <motion.g key={r.who}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={30} y={32 + i * 36} width={420} height={30} rx={5}
            fill={(r.c === C.muted ? C.text : r.c) + '08'}
            stroke={(r.c === C.muted ? C.text : r.c) + '50'} strokeWidth={0.6} />
          <text x={50} y={51 + i * 36} fontSize={10} fontWeight={700}
            fill={r.c === C.muted ? C.text : r.c}>
            {r.who}
          </text>
          <text x={150} y={51 + i * 36} fontSize={9} fill={C.text}>
            {r.ids}
          </text>
          <text x={440} y={51 + i * 36} textAnchor="end" fontSize={9} fontWeight={700}
            fill={r.c === C.muted ? C.text : r.c}>
            {r.kind}
          </text>
        </motion.g>
      ))}
      <text x={240} y={158} textAnchor="middle" fontSize={8} fill={C.muted}>
        StreamID 0 은 session-level (Ping · GoAway)
      </text>
    </g>
  );
}

function FlowControlView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Window 256KB → 0 → Window Update → 256KB
      </text>
      {/* sender */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ActionBox x={20} y={32} w={120} h={36} label="Sender" sub="bytes 전송" color={C.type} />
      </motion.g>
      {/* window bar */}
      <text x={240} y={48} textAnchor="middle" fontSize={8} fill={C.muted}>window</text>
      <rect x={160} y={50} width={160} height={14} rx={3}
        fill={C.muted + '30'} />
      <motion.rect x={160} y={50} width={160} height={14} rx={3}
        fill={C.sid}
        initial={{ width: 160 }} animate={{ width: 0 }}
        transition={{ duration: 1.6, ease: 'linear' }} />
      <motion.text x={240} y={84} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.err}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.3 }}>
        Zero window — sender 대기
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>
        <ActionBox x={340} y={32} w={120} h={36} label="Receiver" sub="처리 후 update" color={C.flag} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
        <DataBox x={150} y={104} w={180} h={26}
          label="Window Update" color={C.sid} outlined />
      </motion.g>
      <text x={240} y={156} textAnchor="middle" fontSize={8} fill={C.muted}>
        slow consumer 보호 · memory bloat 방지 · fair sharing
      </text>
    </g>
  );
}

const VIEWS = [HeaderView, TypeView, FlagsView, StreamIdView, FlowControlView];

export default function YamuxSpecViz() {
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

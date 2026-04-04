import { motion } from 'framer-motion';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ApplyBlockData';

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d },
});

export function StepCommit() {
  const items = [
    { label: 'updateState', sub: 'Validators 갱신', color: C.update },
    { label: 'app.Commit', sub: '앱 상태 저장', color: C.commit },
    { label: 'store.Save', sub: 'CometBFT 저장', color: C.save },
  ];
  return (<g>
    {items.map((item, i) => (
      <motion.g key={i} {...fade(i * 0.2)}>
        <ActionBox x={16 + i * 150} y={18} w={130} h={38}
          label={item.label} sub={item.sub} color={item.color} />
        {i < 2 && (
          <motion.text x={150 + i * 150} y={41} fontSize={12}
            fill="var(--muted-foreground)" {...fade(i * 0.2 + 0.1)}>
            {'→'}
          </motion.text>
        )}
      </motion.g>
    ))}
    <motion.g {...fade(0.7)}>
      <AlertBox x={155} y={62} w={170} h={28}
        label="순서: app 먼저 → CometBFT 나중"
        color="#ef4444" />
    </motion.g>
  </g>);
}

export function StepEvents() {
  const events = ['NewBlock', 'NewBlockHeader', 'Tx'];
  return (<g>
    <ActionBox x={16} y={15} w={100} h={40}
      label="fireEvents" sub="EventBus" color={C.events} />
    {events.map((e, i) => (
      <motion.g key={i} {...fade(0.2 + i * 0.15)}>
        <motion.line x1={120} y1={35} x2={145 + i * 110} y2={35}
          stroke={C.events} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.15 }} />
        <DataBox x={140 + i * 110} y={18} w={100} h={34}
          label={e} sub="이벤트" color={C.events} />
      </motion.g>
    ))}
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      인덱서·WebSocket 구독자에게 블록/TX 이벤트 전파
    </text>
  </g>);
}

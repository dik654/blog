import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ACTORS = [
  { label: 'Client', color: '#6366f1', x: 15 },
  { label: 'Protocol', color: '#10b981', x: 125 },
  { label: 'Kafka', color: '#f59e0b', x: 235 },
  { label: 'Indexer', color: '#ec4899', x: 345 },
];

const MSGS = [
  { from: 0, to: 1, label: '주문 제출', y: 50 },
  { from: 1, to: 2, label: '체결 이벤트', y: 72 },
  { from: 2, to: 3, label: '이벤트 수신', y: 94 },
  { from: 3, to: 0, label: '실시간 전달', y: 116 },
];

const STEPS = [
  { label: '주문 제출', body: '클라이언트가 gRPC/HTTP로 주문을 Protocol에 제출' },
  { label: '체결 이벤트', body: 'Protocol에서 매칭 완료 후 체결 이벤트를 Kafka로 발행' },
  { label: 'Indexer 수신', body: 'Ender가 Kafka 이벤트를 소비하여 PostgreSQL에 저장합니다.' },
  { label: '실시간 전달', body: 'Socks WebSocket으로 클라이언트에 실시간 업데이트를 전송합니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

export default function DataFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="df-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="#f59e0b" />
            </marker>
          </defs>
          {/* Actor boxes */}
          {ACTORS.map((a) => (
            <g key={a.label}>
              <rect x={a.x} y={8} width={80} height={26} rx={5}
                fill={a.color + '18'} stroke={a.color} strokeWidth={1} />
              <text x={a.x + 40} y={25} textAnchor="middle" fontSize={11}
                fontWeight={600} fill={a.color}>{a.label}</text>
              <line x1={a.x + 40} y1={34} x2={a.x + 40} y2={130}
                stroke={a.color} strokeWidth={0.5} strokeDasharray="2 2" opacity={0.3} />
            </g>
          ))}
          {/* Messages */}
          {MSGS.map((m, i) => {
            const vis = step === 0 || step === i;
            const x1 = ACTORS[m.from].x + 40;
            const x2 = ACTORS[m.to].x + 40;
            const mx = (x1 + x2) / 2;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.12 }} transition={sp}>
                <line x1={x1} y1={m.y} x2={x2} y2={m.y}
                  stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#df-a)" />
                <rect x={mx - 30} y={m.y - 10} width={60} height={14} rx={3} fill="var(--card)" />
                <text x={mx} y={m.y - 1} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{m.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}

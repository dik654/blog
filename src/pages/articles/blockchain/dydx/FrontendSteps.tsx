import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'client.SubmitOrder(orderId, side, quantums, subticks)', color: '#6366f1', desc: '클라이언트 → Protocol 주문 제출' },
  { code: 'kafka.Produce(topic, matchEvent)  // 체결 이벤트 발행', color: '#8b5cf6', desc: 'Protocol → Kafka 이벤트 스트리밍' },
  { code: 'ws.Broadcast(channel, updateMsg)  // WebSocket 실시간', color: '#ec4899', desc: 'Indexer → 클라이언트 실시간 업데이트' },
  { code: 'resp := indexer.Query("/v4/orders", params)  // REST API', color: '#f59e0b', desc: '클라이언트 → Indexer 조회 (Comlink)' },
];

export default function FrontendSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        프론트엔드 데이터 흐름 — 주문 → 체결 → 업데이트
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 32;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={28} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 12} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}: {l.code}
            </text>
            <text x={25} y={y + 24} fontSize={10} fill="var(--muted-foreground)">
              {l.desc}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

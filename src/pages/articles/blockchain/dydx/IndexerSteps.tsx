import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'consumer := kafka.NewConsumer(brokers, topics)  // 이벤트 수신', color: '#6366f1', desc: 'Kafka: 온체인 이벤트 스트리밍 허브' },
  { code: 'ender.ProcessBlock(blockEvents)  // 온체인 상태 → DB', color: '#10b981', desc: 'Ender: 블록 이벤트 → PostgreSQL 저장' },
  { code: 'vulcan.ProcessOrder(orderUpdate)  // 오프체인 오더북', color: '#10b981', desc: 'Vulcan: 오프체인 주문 변경 처리' },
  { code: 'db.Exec("INSERT INTO fills ...", fillData)', color: '#f59e0b', desc: 'PostgreSQL: 체결/잔고/포지션 중앙 DB' },
  { code: 'comlink.HandleREST(r); socks.HandleWS(conn)', color: '#8b5cf6', desc: 'Comlink(REST) + Socks(WebSocket) API 서비스' },
];

export default function IndexerSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        Indexer 파이프라인 — Kafka → Ender/Vulcan → DB → API
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1 || (step === 4 && i >= 3);
        const glow = step === i + 1;
        const y = 20 + i * 26;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={22} rx={4}
              fill={glow ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={glow ? 1.5 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}: {l.code.slice(0, 52)}{l.code.length > 52 ? '...' : ''}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

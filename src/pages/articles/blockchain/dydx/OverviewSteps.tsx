import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'priceDaemon.Start(ctx)  // 거래소 가격 피드 수집 (5ms 간격)', color: '#6366f1' },
  { code: 'app.InitModules(clobKeeper, perpKeeper, subKeeper, ...)', color: '#10b981' },
  { code: 'indexer := streaming.NewIndexerEventManager(kafkaProducer)', color: '#f59e0b' },
];

export default function OverviewSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        dYdX v4 아키텍처 — External / Protocol / Indexer
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 24 + i * 28;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={24} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 15} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}:
            </text>
            <text x={80} y={y + 15} fontSize={10} fill="var(--foreground)" fontFamily="monospace">
              {l.code}
            </text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={15} y={120} fontSize={10} fill="var(--muted-foreground)">
          Kafka 이벤트 스트리밍으로 Protocol → Indexer 실시간 연동
        </text>
        <text x={15} y={136} fontSize={10} fill="var(--muted-foreground)">
          CometBFT 합의 + Cosmos SDK 모듈 + 오프체인 데몬 구조
        </text>
      </motion.g>
    </svg>
  );
}

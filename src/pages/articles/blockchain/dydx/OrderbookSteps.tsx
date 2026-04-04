import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'type Orderbook struct { Bids *rbtree.Tree; Asks *rbtree.Tree }', color: '#6366f1', desc: 'Bids(매수)/Asks(매도) 레드-블랙 트리' },
  { code: 'type Level struct { Orders []Order } // 동일 가격 FIFO 큐', color: '#10b981', desc: '같은 가격의 주문들을 시간순 정렬' },
  { code: 'type Order struct { Id OrderId; Side; Quantums; Subticks }', color: '#f59e0b', desc: 'Short-Term(인메모리) / Long-Term(상태 저장) / Conditional' },
];

export default function OrderbookSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        오더북 구조 — Orderbook → Level → Order
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 40;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={34} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}: {l.code.slice(0, 56)}...
            </text>
            <text x={25} y={y + 28} fontSize={10} fill="var(--muted-foreground)">
              {l.desc}
            </text>
          </motion.g>
        );
      })}
      <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
        Short-Term 주문은 인메모리 — 블록마다 만료, Long-Term은 KVStore에 저장
      </text>
    </svg>
  );
}

import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const BIDS = [
  { price: '$31,250', qty: '2.5 BTC', pct: 80 },
  { price: '$31,200', qty: '1.8 BTC', pct: 60 },
  { price: '$31,150', qty: '3.2 BTC', pct: 95 },
];
const ASKS = [
  { price: '$31,300', qty: '1.2 BTC', pct: 40 },
  { price: '$31,350', qty: '2.0 BTC', pct: 65 },
  { price: '$31,400', qty: '0.8 BTC', pct: 28 },
];

const STEPS = [
  { label: '오더북 구조', body: '매수(Bids)와 매도(Asks) 양방향 가격 레벨별 정렬입니다.' },
  { label: 'Best Bid/Ask', body: 'BestBid과 BestAsk 사이 스프레드가 시장 유동성을 나타냅니다.' },
  { label: '가격-시간 우선순위', body: '동일 가격에서 먼저 들어온 주문이 우선 매칭됩니다 (FIFO).' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

export default function OrderbookViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={95} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">Bids (매수)</text>
          <text x={280} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">Asks (매도)</text>
          <line x1={188} y1={20} x2={188} y2={130} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 3" />
          {BIDS.map((b, i) => {
            const y = 26 + i * 32;
            const barW = b.pct * 1.6;
            const active = step === 1 && i === 0;
            return (
              <motion.g key={`b-${i}`} animate={{ opacity: 1 }} transition={sp}>
                <motion.rect x={185 - barW} y={y} width={barW} height={24} rx={4}
                  animate={{ fill: active ? '#10b98144' : '#10b98118' }}
                  stroke="#10b981" strokeWidth={active ? 1.5 : 0.5} transition={sp} />
                <text x={185 - barW + 6} y={y + 10} fontSize={10} fontWeight={600} fill="#10b981">{b.price}</text>
                <text x={185 - barW + 6} y={y + 21} fontSize={10} fill="var(--muted-foreground)">{b.qty}</text>
              </motion.g>
            );
          })}
          {ASKS.map((a, i) => {
            const y = 26 + i * 32;
            const barW = a.pct * 1.6;
            const active = step === 1 && i === 0;
            return (
              <motion.g key={`a-${i}`} animate={{ opacity: 1 }} transition={sp}>
                <motion.rect x={191} y={y} width={barW} height={24} rx={4}
                  animate={{ fill: active ? '#ef444444' : '#ef444418' }}
                  stroke="#ef4444" strokeWidth={active ? 1.5 : 0.5} transition={sp} />
                <text x={195} y={y + 10} fontSize={10} fontWeight={600} fill="#ef4444">{a.price}</text>
                <text x={195} y={y + 21} fontSize={10} fill="var(--muted-foreground)">{a.qty}</text>
              </motion.g>
            );
          })}
          {step >= 1 && (
            <motion.text x={188} y={128} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Spread: $50
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
